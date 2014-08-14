var fs = require('fs'),
    through = require('through'),
    ngHtml2Js = require('ng-html2js');

function isHtml (file) {
  return /\.html$/.test(file);
}

module.exports = function(opts) {
  opts = opts || {};
  opts.module = opts.module || null

  return function (file) {
    if (!isHtml(file)) return through();

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
