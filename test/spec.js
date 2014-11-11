var browserify = require('browserify'),
    fs = require('fs'),
    ngHtml2Js = require('../lib'),
    source = require('vinyl-source-stream'),
    expect = require('chai').expect;

describe('ngHtml2Js', function(){

  it('should compile html to a browserify wrapped angular module', function(done) {
    var output = fs.readFileSync(__dirname + '/fixtures/output.js', 'utf-8');
    browserify(__dirname + '/fixtures/app.js')
      .transform(ngHtml2Js({
        module: 'templates'
      }))
      .bundle(function(err, bundle) {
        if (err) {
          done(err)
        } else {
          expect(output).to.equal(bundle.toString());
          done();
        };
      });
  });

  it('should compile html to a browserify wrapped angular module without a module', function(done) {
    var output = fs.readFileSync(__dirname + '/fixtures/output-simple.js', 'utf-8');
    browserify(__dirname + '/fixtures/app.js')
      .transform(ngHtml2Js())
      .bundle(function(err, bundle) {
        if (err) {
          done(err)
        } else {
          expect(output).to.equal(bundle.toString());
          done();
        };
      });
  });
})
