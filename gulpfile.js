'use strict';

const gulp = require('gulp');

const builder = require('birchpress-builder')(gulp);

const productConfig = {

  coreMainSrcExclusion: [
    // internal dev files
    '!package.json',
    '!gulpfile.js',
    '!README.md',
    '!phpunit.xml',
    '!node_modules{,/**}',
    '!test{,/**}',
    '!__tests__{,/**}',
    '!buildfiles{,/**}',
    '!dist{,/**}',

    // the framework
    '!birchpress{,/**}',

    // independent filter rules
    '!modules{,/**}',
    '!lib{,/**}',

    // publish to wordpress
    '!screenshots{,/**}',
    '!readme.txt'
  ],

  corePublishSrc: [
    'screenshots/**/*',
    'readme.txt'
  ],

  shouldBrowserify: true,

  coreBrowserifyDirs: [],

  coreBrowserifyRecursiveDirs: ['modules/**/assets/js/apps/']
};

builder.setProductConfig(productConfig);
