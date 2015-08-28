#!/bin/bash

for m in $(ls -d modules/*/); do
    find ${m}assets/js/apps -type f -name "index.js" -print 2> /dev/null | while read indexjs; do
        echo "bundling $indexjs ..."
        target="$(dirname $indexjs)"
        browserify $indexjs -o $target/index.bundle.js
    done
done
