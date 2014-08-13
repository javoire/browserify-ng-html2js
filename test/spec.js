var browserify = require('browserify'),
    fs = require('fs'),
    ngHtml2js = require('..');
    require('chai').should();

describe('ngHtml2js', function(){
  var app, templateHtml, templateJs;

  beforeEach(function() {
    templateJs = fs.readFileSync(__dirname + '/fixtures/template.js', 'utf-8');
  });


  it('should compile html to angular module', function(done) {
    var b = browserify(__dirname + '/fixtures/app.js');

    b.transform(ngHtml2Js({
      module: 'templates'
    }));

    b.bundle(function(error, bundle) {
      // TODO. compare fixtures here...
      done();
    })
  });
})
