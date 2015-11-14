'use strict';

/**
 * Usage:
 * node bundle.js [file* | folder*]
 */

const fs = require('fs');
const path = require('path');
const globby = require('globby');
const shell = require('shelljs');

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

function browserify(file) {
  const bundleFile = replaceExtension(file, '.bundle.js');

  console.info(`[browserify] ${file} -> ${bundleFile}`);
  shell.exec(`browserify ${file} -o ${bundleFile}`);
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
    globby.sync(path.join(item, '**/index.js')).forEach(browserify);
  } else if (stat.isFile() && (path.extname(item) === '.js')) {
    browserify(item);
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
