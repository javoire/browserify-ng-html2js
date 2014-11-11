var fs = require('fs'),
    through = require('through'),
    ngHtml2Js = require('ng-html2js'),
    burrito = require('burrito');

function isExtension (file, extension) {
  return new RegExp('\\.' + extension + '$').test(file);
}

module.exports = function(opts) {
  opts = opts || {};
  opts.module = opts.module || null;
  opts.extension = opts.extension || 'html';

  return function (file) {
    if (!isExtension(file, opts.extension)) return through();

    var data = '';
    return through(write, end);

    function write (buf) { data += buf }
    function end () {
      var content, src, fileName;
      try {
        fileName = file.match(/^.*\/(.*)$/)[1];
        content = fs.readFileSync(file, 'utf-8');
        src = ngHtml2Js(fileName, content, opts.module);
      } catch (error) {
        this.emit('error', error);
      }
      this.queue(src);
      this.queue(null);
    }
  };
}
