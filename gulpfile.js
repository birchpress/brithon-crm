'use strict';

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
