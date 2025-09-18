import test from 'ava';
import * as sass from 'sass';

const render = data => {
	const result = sass.compileString(`@use './index' as *;\n${data}`, {
		style: 'expanded',
		loadPaths: ['.'],
	});
	return result.css;
};

const snapshot = (t, data) => {
	t.snapshot(render(data));
};

const snapshotProperty = (t, data) => {
	snapshot(t, `a { ${data} }`);
};

const snapshotFunction = (t, data) => {
	snapshotProperty(t, `top: ${data}`);
};

const functionResultsAreEqual = (t, a, b) => {
	const css = render(`a { top: ${a} }`);
	const match = css.match(/top:\s*([^;]+);/);
	t.is(match ? match[1] : '', b);
};

test('strip-unit()', t => {
	snapshotFunction(t, 'strip-unit(1px)');
	snapshotFunction(t, 'strip-unit(1%)');
	snapshotFunction(t, 'strip-unit(1)');
});

test('number-invert()', t => {
	snapshotFunction(t, 'number-invert(1)');
	snapshotFunction(t, 'number-invert(-1)');
});

test('string-contains()', t => {
	snapshotFunction(t, 'string-contains(\'foo bar baz\', $substring: \'bar\')');
	snapshotFunction(t, 'string-contains(\'foo bar baz\', $substring: \'non-existent\')');
});

test('string-starts-with()', t => {
	snapshotFunction(t, 'string-starts-with(\'foo bar\', $substring: \'foo\')');
	snapshotFunction(t, 'string-starts-with(\'foo bar\', $substring: \'non-existent\')');
});

test('string-ends-with()', t => {
	snapshotFunction(t, 'string-ends-with(\'foo bar\', $substring: \'bar\')');
	snapshotFunction(t, 'string-ends-with(\'foo bar\', $substring: \'non-existent\')');
});

test('string-replace()', t => {
	snapshotFunction(t, 'string-replace(\'foo bar baz\', $search: \'bar\', $replacement: \'unicorn\')');
	snapshotFunction(t, 'string-replace(\'foo bar baz\', $search: \'non-existent\', $replacement: \'unicorn\')');
});

test('list-first()', t => {
	functionResultsAreEqual(t, 'list-first((1, 2, 3))', '1');
	functionResultsAreEqual(t, 'list-first((3))', '3');
});

test('list-last()', t => {
	functionResultsAreEqual(t, 'list-last((1, 2, 3))', '3');
	functionResultsAreEqual(t, 'list-last((1))', '1');
});

test('seed-random-integer()', t => {
	functionResultsAreEqual(t, 'seed-random-integer(5)', '84035');
	functionResultsAreEqual(t, 'seed-random-integer(100)', '1680700');
});

test('seed-random-float()', t => {
	functionResultsAreEqual(t, 'seed-random-float(5)', '0.0000391314');
	functionResultsAreEqual(t, 'seed-random-float(100)', '0.0007826365');
});

test('seed-random-boolean()', t => {
	functionResultsAreEqual(t, 'seed-random-boolean(5)', 'false');
	functionResultsAreEqual(t, 'seed-random-boolean(100)', 'true');
});

test('random-color()', t => {
	t.regex(render('a { width: random-color() }'), /a\s*{\s*width:\s*(#[a-f\d]+|hsl\([^)]+\));?\s*}/i);
	t.regex(render('a { width: random-color($saturation: 0.8, $lightness: 0.3) }'), /a\s*{\s*width:\s*(#[a-f\d]+|hsl\([^)]+\));?\s*}/i);

	// Test seeded random color - should produce consistent results
	const seeded1 = render('a { width: random-color($seed: 42) }');
	const seeded2 = render('a { width: random-color($seed: 42) }');
	t.is(seeded1, seeded2);
	t.regex(seeded1, /a\s*{\s*width:\s*(#[a-f\d]+|hsl\([^)]+\));?\s*}/i);

	// Different seeds should produce different colors
	const seeded3 = render('a { width: random-color($seed: 123) }');
	t.not(seeded1, seeded3);
});

test('url-encode()', t => {
	snapshotFunction(t, 'url-encode(\'#foo@bar\')');
});

test('tint()', t => {
	snapshotFunction(t, 'tint(pink, 10%)');
});

test('shade()', t => {
	snapshotFunction(t, 'shade(pink, 10%)');
});

test('black()', t => {
	snapshotFunction(t, 'black(10%)');
});

test('white()', t => {
	snapshotFunction(t, 'white(10%)');
});

test('svg-url()', t => {
	snapshotFunction(t, 'svg-url(\'<svg width="8" height="13"><defs><path d="M6.828 5.368c-"/></defs></svg>\')');
});

test('background-svg()', t => {
	snapshotProperty(t, '@include background-svg(\'<svg width="8" height="13"><defs><path d="M6.828 5.368c-"/></defs></svg>\')');
});

test('context()', t => {
	snapshotProperty(t, `
		.foo {
			.unicorn {
				@include context($changed: '.foo', $to: '.bar') {
					color: blue;
				}
			}
		}
	`);
});
