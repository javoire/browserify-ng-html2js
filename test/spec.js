var browserify = require('browserify'),
    fs = require('fs'),
    bNgHtml2Js = require('..'),
    source = require('vinyl-source-stream'),
    expect = require('chai').expect;

describe('bNgHtml2Js', function(){
  var app, output;

  beforeEach(function() {
    output = fs.readFileSync(__dirname + '/fixtures/output.js', 'utf-8');
  });

  it('should compile html to a browserify wrapped angular module', function(done) {
    browserify(__dirname + '/fixtures/app.js')
      .transform(bNgHtml2Js({
        module: 'templates'
      }))
      .bundle(function(err, bundle) {
        expect(output).to.equal(bundle.toString());
        done();
      });
  });
})
