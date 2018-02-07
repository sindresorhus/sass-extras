import util from 'util';
import test from 'ava';
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

test('@url-encode()', t => {
	snapshotFn(t, 'url-encode(\'#foo@bar\')');
});
