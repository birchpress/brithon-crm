'use strict';

const source = require('vinyl-source-stream');
const es = require('event-stream');
const globby = require('globby');
const browserify = require('browserify');
const logger = require('gulp-logger');
const rename = require('gulp-rename');
const gulp = require('gulp');

const builder = require('birchpress-builder')(gulp);

const productConfig = {

  coreMainSrc: [
   'brithon-crm.php',
   'index.php',
   'package.php',
   'loader.php',

   'languages/**/*'
  ]

};

builder.setProductConfig(productConfig);

const bundleFiles = ['modules/**/assets/js/apps/**/index.js'];

gulp.task('bundle', function() {
  const tasks = globby.sync(bundleFiles).map(indexjs => {
    return browserify(indexjs)
      .transform('babelify', {
        presets: ['react']
      })
      .transform('browserify-shim', {
        global: true
      })
      .transform('pkgify')
      .bundle()
      .pipe(source(indexjs))
      .pipe(logger({
        extname: '.bundle.js',
        showChange: true
      }))
      .pipe(rename({
        extname: '.bundle.js'
      }))
      .pipe(gulp.dest('./'));
  });

  return es.merge(...tasks);
});
