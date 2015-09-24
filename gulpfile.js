'use strict';

var gulp = require('gulp');

var builder = require('birchpress-builder')(gulp);

/*
 Files will not be included. Some files will be processed independently, such
 as `birchpress`, `assets`, `modules` and `lib`. The variable
 `coreMainSrcExclusion` is used to list those file to be excluded. We'd like you
 to list them all for each product, even some of them, such as `package.json`
 are common in different products.
 */
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
  '!framework{,/**}',

  // independent filter rules
  '!modules{,/**}',
  '!lib{,/**}',

  // publish to wordpress
  '!screenshots{,/**}',
  '!readme.txt'
];

/*
 For wordpress plugins, `screenshots` and `readme.txt` are required to get
 published. However, they will not be included in `free` version.
 */
builder.taskConfig.corePublishSrc = ['screenshots/**/*', 'readme.txt'];

/*
 You can override the task in builder.
 */

// gulp.task('default', function() {
//   console.log('brithon crm');
// });


/*
 You can also create new tasks.
 */

// gulp.task('hello', function() {
//   console.log('world!');
// });
