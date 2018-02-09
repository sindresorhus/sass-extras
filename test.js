import util from 'util';
import {serial as test} from 'ava';
import sass from 'node-sass';

const render = data => {
	const result = sass.renderSync({
		data: `@import './index';\n${data}`,
		indentType: 'tab',
		outputStyle: 'compact',
		precision: 10
	});
	return result.css.toString();
};

const snapshot = (t, data) => {
	t.snapshot(render(data));
};

const snapshotProp = (t, data) => {
	snapshot(t, `a { ${data} }`);
};

const snapshotFn = (t, data) => {
	snapshotProp(t, `top: ${data}`);
};

const propResultEqual = (t, a, b) => {
	t.is(render(`a { ${a} }`).slice(4, -2), b);
};

const fnResultEqual = (t, a, b) => {
	t.is(render(`a { top: ${a} }`).slice(9, -4), b);
};

test('@strip-unit()', t => {
	snapshotFn(t, 'strip-unit(1px)');
	snapshotFn(t, 'strip-unit(1%)');
	snapshotFn(t, 'strip-unit(1)');
});

test('@number-clamp()', t => {
	snapshotFn(t, 'number-clamp(4, 5, 10)');
	snapshotFn(t, 'number-clamp(10px, 1px, 5px)');
});

test('@number-invert()', t => {
	snapshotFn(t, 'number-invert(1)');
	snapshotFn(t, 'number-invert(-1)');
});

test('@string-contains()', t => {
	snapshotFn(t, 'string-contains(\'foo bar baz\', $substring: \'bar\')');
	snapshotFn(t, 'string-contains(\'foo bar baz\', $substring: \'non-existent\')');
});

test('@string-starts-with()', t => {
	snapshotFn(t, 'string-starts-with(\'foo bar\', $substring: \'foo\')');
	snapshotFn(t, 'string-starts-with(\'foo bar\', $substring: \'non-existent\')');
});

test('@string-ends-with()', t => {
	snapshotFn(t, 'string-ends-with(\'foo bar\', $substring: \'bar\')');
	snapshotFn(t, 'string-ends-with(\'foo bar\', $substring: \'non-existent\')');
});

test('@string-replace()', t => {
	snapshotFn(t, 'string-replace(\'foo bar baz\', $search: \'bar\', $replacement: \'unicorn\')');
	snapshotFn(t, 'string-replace(\'foo bar baz\', $search: \'non-existent\', $replacement: \'unicorn\')');
});

test('@list-first()', t => {
	fnResultEqual(t, 'list-first((1, 2, 3))', '1');
	fnResultEqual(t, 'list-first((3))', '3');
});

test('@list-last()', t => {
	fnResultEqual(t, 'list-last((1, 2, 3))', '3');
	fnResultEqual(t, 'list-last((1))', '1');
});

test('@seed-random-integer()', t => {
	fnResultEqual(t, 'seed-random-integer(5)', '84035');
	fnResultEqual(t, 'seed-random-integer(100)', '1680700');
});

test('@seed-random-float()', t => {
	fnResultEqual(t, 'seed-random-float(5)', '0.0000391314');
	fnResultEqual(t, 'seed-random-float(100)', '0.0007826365');
});

test('@seed-random-boolean()', t => {
	fnResultEqual(t, 'seed-random-boolean(5)', 'false');
	fnResultEqual(t, 'seed-random-boolean(100)', 'true');
});

test('@random-color()', t => {
	t.regex(render('a { width: random-color() }'), /a { width: #[a-z\d]+; }/);
	t.regex(render('a { width: random-color($saturation: 0.8, $lightness: 0.3) }'), /a { width: #[a-z\d]+; }/);
});

test('@url-encode()', t => {
	snapshotFn(t, 'url-encode(\'#foo@bar\')');
});

test('@tint()', t => {
	snapshotFn(t, 'tint(pink, 10%)');
});

test('@shade()', t => {
	snapshotFn(t, 'shade(pink, 10%)');
});

test('@black()', t => {
	snapshotFn(t, 'black(10%)');
});

test('@white()', t => {
	snapshotFn(t, 'white(10%)');
});

test('@svg-url()', t => {
	snapshotFn(t, 'svg-url(\'<svg width="8" height="13"><defs><path d="M6.828 5.368c-"/></defs></svg>\')');
});

test('@background-svg()', t => {
	snapshotProp(t, '@include background-svg(\'<svg width="8" height="13"><defs><path d="M6.828 5.368c-"/></defs></svg>\')');
});
