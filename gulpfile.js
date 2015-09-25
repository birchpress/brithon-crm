'use strict';

var gulp = require('gulp');

var builder = require('birchpress-builder')(gulp);

builder.taskConfig.coreMainSrcExclusion = [
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
];

builder.taskConfig.corePublishSrc = ['screenshots/**/*', 'readme.txt'];

builder.taskConfig.shouldBrowserify = true;

builder.taskConfig.coreBrowserifyDirs = [];

builder.taskConfig.coreBrowserifyRecursiveDirs = ['modules/**/assets/js/apps/'];
