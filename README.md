# browserify-ng-html2js

[![Build Status](https://travis-ci.org/javoire/browserify-ng-html2js.svg?branch=master)](https://travis-ci.org/javoire/browserify-ng-html2js)
[![Dependency Status](https://david-dm.org/javoire/browserify-ng-html2js.svg)](https://david-dm.org/javoire/browserify-ng-html2js)
[![npm](https://img.shields.io/npm/v/browserify-ng-html2js.svg)]()

Browserify transform to compile angular templates into angular modules. Based on [ng-html2js](https://github.com/yaru22/ng-html2js)

```
$ npm install browserify-ng-html2js --save-dev
```

## Usage

Use in either package.json or with gulp:

### a) Package.json

Add the transform in package.json:
```js
{  
  // ...
  "browserify": {
    "transform": ["browserify-ng-html2js"]
  }
}
```

The templates will be available in their own modules based on their file name:

```js
angular.module('home.html', []).run(["$templateCache", function($templateCache) {
  $templateCache.put('home.html',
    '<h2>Home</h2>\n' +
    '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>\n' +
    '');
}]);
```

### b) With Gulp

Add it to the browserify object and optionally specify a module name. This will attach all templates to the same module.

```js
var gulp  = require('gulp'),
    browserify = require('browserify'),
    ngHtml2Js = require('browserify-ng-html2js'),
    source = require('vinyl-source-stream');

gulp.task('scripts', function() {
  return browserify('./src/app.js')
    .transform(ngHtml2Js({
      module: 'templates', // optional module name
      extension: 'ngt' // optionally specify what file types to look for
      baseDir: "src/js" // optionally specify base directory for filename
      stripPathBefore: '/templates', // optionally specify the part of the path that should be the starting point as a string or RegExp
      prefix: '' // optionally specify a prefix to be added to the filename,
      requireAngular: false // (default: false) optionally include `var angular = require('angular');` 
                            // Supported in Angular 1.3.14 and above if you bundle angular with browserify
    }))
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'));
});
```
Output:
```js
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

## Example

To use the cached template in your browserified app. Simply `require` it and depend on it in your angular app.

The example below illustrates the simple case (with no options) where the generated angular module containing the template is named after the filename of the template. And the name of the template that is put in angulars `$templateCache` is also the filename of the template.

```js
var angular = require('angular');

require('ui-router');

angular.module('myApp', [
  'ui.router',
  require('./templates/home.html') // it exports the name of the generated angular module: 'home.html'
]).config(function($stateProvider){
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'home.html' // this is the template identifier that's put in angulars $templateCache
  });
});
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
