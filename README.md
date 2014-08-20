# browserify-ng-html2js

[![Build Status](https://travis-ci.org/javoire/browserify-ng-html2js.svg?branch=master)](https://travis-ci.org/javoire/browserify-ng-html2js)
[![Dependency Status](https://david-dm.org/javoire/browserify-ng-html2js.svg)](https://david-dm.org/javoire/browserify-ng-html2js)

Browserify transform to compile angular templates into angular modules. Based on [ng-html2js](https://github.com/yaru22/ng-html2js)

```
$ npm install browserify-ng-html2js --save-dev
```

## Usage

Use in either package.json or with gulp:

### a) Package.json

Add the transform in package.json:
```JavaScript
{  
  // ...
  "browserify": {
    "transform": ["browserify-ng-html2js"]
  }
}
```

The templates will be available in their own modules based on their file name:

```JavaScript
angular.module('home.html', []).run(["$templateCache", function($templateCache) {
  $templateCache.put('home.html',
    '<h2>Home</h2>\n' +
    '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>\n' +
    '');
}]);
```

### b) With Gulp

Add it to the browserify object and optionally specify a module name. This will attach all templates to the same module.

```JavaScript
var gulp  = require('gulp'),
    browserify = require('browserify'),
    ngHtml2Js = require('browserify-ng-html2js'),
    source = require('vinyl-source-stream');

gulp.task('scripts', function() {
  return browserify('./src/app.js')
    .transform(ngHtml2Js({
      module: 'templates', // <---
      extension: 'ngt' // optionally specify what file types to look for
    }))
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'));
});
```
Output:
```JavaScript
try {
  module = angular.module('templates');
} catch (e) {
  module = angular.module('templates', []);
}
module.run(["$templateCache", function($templateCache) {
  $templateCache.put('home.html',
    '<h2>Home</h2>\n' +
    '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate commodi, dolor vero. Temporibus eaque aliquam repudiandae dolore nemo, voluptas voluptatibus quod at officiis, voluptates adipisci pariatur expedita, quos ducimus inventore.</p>\n' +
    '');
}]);
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
