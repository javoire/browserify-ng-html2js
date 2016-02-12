var browserify = require('browserify'),
  fs = require('fs'),
  ngHtml2Js = require('../lib'),
  source = require('vinyl-source-stream'),
  transformify = require('transformify'),
  expect = require('chai').expect,
  cwd = process.cwd(),
  path = require('path'),
  exec = require('child_process').exec;


describe('ngHtml2Js', function () {

  it('should compile html to a browserify module with parent directory included', function (done) {
    var output = fs.readFileSync(__dirname + '/fixtures/output-basedir.js', 'utf-8');
    browserify(__dirname + '/fixtures/app.js')
      .external('angular')
      .transform(ngHtml2Js({
        baseDir: '/test'
      }))
      .bundle(function (err, bundle) {

        if (err) {
          done(err);
        } else {
          expect(output).to.equal(bundle.toString());
          done();
        }
      });
  });

  it('should put path in unix-like format even for windows-users', function (done) {
    browserify(__dirname + '/fixtures/app.js')
      .external('angular')
      .transform(ngHtml2Js({
        baseDir: '/test'
      }))
      .bundle(function (err, bundle) {
        if (err) {
          done(err);
        } else {
          expect(/\/fixtures\/template\.html/.test(bundle.toString())).to.be.true();
          done();
        }
      });
  });


  it('should compile html to a browserify wrapped angular module', function (done) {
    var output = fs.readFileSync(__dirname + '/fixtures/output.js', 'utf-8');
    browserify(__dirname + '/fixtures/app.js')
      .external('angular')
      .transform(ngHtml2Js({
        module: 'templates'
      }))
      .bundle(function (err, bundle) {
        if (err) {
          done(err);
        } else {
          expect(output).to.equal(bundle.toString());
          done();
        }
      });
  });

  it('should honor earlier transforms', function (done) {
    var output = fs.readFileSync(__dirname + '/fixtures/output-uppercase.js', 'utf-8');
    browserify(__dirname + '/fixtures/app.js')
      .external('angular')
      .transform(function (file) {
        return transformify(function (s) {
          if (/\.html?/.test(file)) {
            return s.toUpperCase();
          }
          return s;
        })();
      })
      .transform(ngHtml2Js({
        module: 'templates'
      }))
      .bundle(function (err, bundle) {
        if (err) {
          done(err);
        } else {
          expect(output).to.equal(bundle.toString());
          done();
        }
      });
  });

  it('should compile html to a browserify wrapped angular module in CLI', function (done) {
    var output = fs.readFileSync(__dirname + '/fixtures/output.js', 'utf-8');
    exec('browserify -t [./lib/index.js --module templates] --external angular ./test/fixtures/app.js', function (error, stdout, stderr) {
      expect(output).to.equal(stdout);
      done();
    });
  });

  it('should compile html to a browserify wrapped angular module without a module', function (done) {
    var output = fs.readFileSync(__dirname + '/fixtures/output-simple.js', 'utf-8');
    browserify(__dirname + '/fixtures/app.js')
      .external('angular')
      .transform(ngHtml2Js())
      .bundle(function (err, bundle) {
        if (err) {
          done(err);
        } else {
          expect(output).to.equal(bundle.toString());
          done();
        }

      });
  });

  it('should add prefix to filename if one is provided', function (done) {
    var output = fs.readFileSync(__dirname + '/fixtures/output-prefix.js', 'utf-8');
    browserify(__dirname + '/fixtures/app.js')
      .external('angular')
      .transform(ngHtml2Js({
        prefix: '/app.templates/'
      }))
      .bundle(function (err, bundle) {
        if (err) {
          done(err);
        } else {
          expect(output).to.equal(bundle.toString());
          done();
        }
      });
  });

  it('should include a require angular statement inside module', function (done) {
    var output = fs.readFileSync(__dirname + '/fixtures/output-require-angular.js', 'utf-8');
    browserify(__dirname + '/fixtures/app.js')
      .external('angular')
      .transform(ngHtml2Js({
        requireAngular: true
      }))
      .bundle(function (err, bundle) {
        if (err) {
          done(err);
        } else {
          expect(output).to.equal(bundle.toString());
          done();
        }

      });
  });

  it('should strip the BOM from the beginning of the file if it exists', function (done) {

    browserify(__dirname + '/fixtures/bom-template.html')
      .transform(ngHtml2Js())
      .bundle(function (err, bundle) {
        if (err) {
          done(err);
        } else {
          expect(bundle.toString().match(/\ufeff/)).to.be.null;
          done();
        }

      });
  });

  it('should strip the path before the part provided if present', function (done) {
    var output = fs.readFileSync(__dirname + '/fixtures/output-strippathbefore.js', 'utf-8');
    browserify(__dirname + '/fixtures/app.js')
      .external('angular')
      .transform(ngHtml2Js({
        stripPathBefore: 'fixtures/'
      }))
      .bundle(function (err, bundle) {
        if (err) {
          done(err);
        } else {
          expect(output).to.equal(bundle.toString());
          done();
        }

      });
  });
});
