'use strict';

/**
 * Usage:
 * node bundle.js [file* | folder*]
 */

const fs = require('fs');
const path = require('path');
const globby = require('globby');
const browserify = require('browserify');

function replaceExtension(file, ext) {
  if (typeof file !== 'string') {
    return file;
  }
  if (file.length === 0) {
    return file;
  }

  const newFileName = path.basename(file, path.extname(file)) + ext;

  return path.join(path.dirname(file), newFileName);
}

function browserifyFile(file) {
  const bundleFile = replaceExtension(file, '.bundle.js');

  console.info(`${file} -> ${bundleFile}`);

  // NOTE: it's safe to remove transforms if its args are the same as
  // packages.json. `browserify-shim` is different. It only accepts
  // `global` in the API, but not `package.json`. Interesting.
  browserify(file)
    .transform('babelify', {presets: ['react']})
    .transform('browserify-shim', {global: true})
    .transform('pkgify')
    .bundle()
    .pipe(fs.createWriteStream(bundleFile));
}

function bundle(item) {
  let stat = null;

  try {
    stat = fs.lstatSync(item);
  } catch (err) {
    console.error(err);
    return;
  }

  if (stat.isDirectory()) {
    globby.sync(path.join(item, '**/index.js')).forEach(browserifyFile);
  } else if (stat.isFile() && (path.extname(item) === '.js')) {
    browserifyFile(item);
  } else {
    console.error(`can not process: ${item}.`);
  }
}

function main(items) {
  if (items.length === 0) {
    globby.sync('modules/**/assets/js/apps').forEach(bundle);
  } else {
    items.forEach(bundle);
  }
}

main(process.argv.slice(2));
