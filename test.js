import util from 'util';
import {serial as test} from 'ava';
import sass from 'node-sass';

const render = data => {
	const result = sass.renderSync({
		data: `@import './index';\n${data}`,
		indentType: 'tab',
		outputStyle: 'compact'
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
	snapshotProp(t, `width: ${data}`);
};

test('@strip-unit()', t => {
	snapshotFn(t, 'strip-unit(1px)');
	snapshotFn(t, 'strip-unit(1%)');
	snapshotFn(t, 'strip-unit(1)');
});

test('@clamp()', t => {
	snapshotFn(t, 'clamp(4, 5, 10)');
	snapshotFn(t, 'clamp(10px, 1px, 5px)');
});

test('@string-replace()', t => {
	snapshotFn(t, 'string-replace(\'foo bar baz\', $search: \'bar\', $replacement: \'unicorn\')');
	snapshotFn(t, 'string-replace(\'foo bar baz\', $search: \'non-existent\', $replacement: \'unicorn\')');
});

test('@url-encode()', t => {
	snapshotFn(t, 'url-encode(\'#foo@bar\')');
});

test('@random-color()', t => {
	t.regex(render('a { width: random-color() }'), /a { width: #[a-z\d]+; }/);
	t.regex(render('a { width: random-color($saturation: 0.8, $lightness: 0.3) }'), /a { width: #[a-z\d]+; }/);
});

test('@tint()', t => {
	snapshotFn(t, 'tint(pink, 10%)');
});

test('@shade()', t => {
	snapshotFn(t, 'shade(pink, 10%)');
});

test('@svg-url()', t => {
	snapshotFn(t, 'svg-url(\'<svg width="8" height="13"><defs><path d="M6.828 5.368c-"/></defs></svg>\')');
});

test('@background-svg()', t => {
	snapshotProp(t, '@include background-svg(\'<svg width="8" height="13"><defs><path d="M6.828 5.368c-"/></defs></svg>\')');
});
