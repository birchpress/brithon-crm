'use strict';

const browserify = require('browserify');
const logger = require('gulp-logger');
const lazypipe = require('lazypipe');
const through = require('through2');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
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

const browserifyEntries = ['modules/**/assets/js/apps/**/index.js'];

const browserifyTransform = [
  [
    'babelify',
    {
      'presets': [
        'react'
      ]
    }
  ],
  [
    'browserify-shim',
    {
      global: true
    }
  ],
  'pkgify'
];


const browserifyOpts = {
  transform: browserifyTransform
};

const debugBrowserifyOpts = {
  debug: true,
  transform: browserifyTransform
};

function bundler(debug) {
  const opts = debug ? debugBrowserifyOpts : browserifyOpts;

  return through.obj(function(file, enc, next) {
    return browserify(file.path, opts)
      .bundle(function(err, res) {
        file.contents = res;
        next(null, file);
      });
  });
}

function renamePipe(extName) {
  const extname = (typeof extName !== 'undefined') ? extName : '.bundle.js';
  const renameChannel = lazypipe()
    .pipe(logger, {
      extname,
      showChange: true
    })
    .pipe(rename, {
      extname
    });

  return renameChannel();
}

function sourceMapPipe(debug, dest) {
  const smChannel = lazypipe()
    .pipe(sourcemaps.init, {
      loadMaps: true
    })
    .pipe(logger, {
      before: 'extracting sourcemaps...',
      after: 'sourcemaps extracted.',
      extname: '.map',
      showChange: true
    })
    .pipe(sourcemaps.write, dest);

  const wrapperChannel = lazypipe()
    .pipe(() => builder.gPlugins.if(debug, smChannel()));

  return wrapperChannel();
}

const needSourceMap = builder.gPlugins.util.env.hasOwnProperty('sourcemap');

gulp.task('bundle', function() {
  return gulp.src(browserifyEntries, {
    cwdbase: true
  })
    .pipe(bundler(needSourceMap))
    .pipe(renamePipe())
    .pipe(sourceMapPipe(needSourceMap, './'))
    .pipe(gulp.dest('./'));
});
