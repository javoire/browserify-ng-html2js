var fs = require('fs'),
    through = require('through'),
    ngHtml2Js = require('ng-html2js');

function isExtension (file, extension) {
  return new RegExp('\\.' + extension + '$').test(file);
}

ngHtml2jsify.configure = function (filename, opts) {
  if(typeof opts === 'undefined') { // gulp
    return ngHtml2jsify(filename);
  }else{ // CLI
    return ngHtml2jsify(opts)(filename);
  }

};

function ngHtml2jsify(opts) {
  opts = opts|| {};
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
        src = ngHtml2Js(fileName, content, opts.module, 'ngModule') + '\nmodule.exports = ngModule;';
      } catch (error) {
        this.emit('error', error);
      }
      this.queue(src);
      this.queue(null);
    }
  };
}

module.exports = ngHtml2jsify.configure;
