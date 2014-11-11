var fs = require('fs'),
    through = require('through'),
    ngHtml2Js = require('ng-html2js'),
    burrito = require('burrito');

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
      var content, src, fileName, exportCall;
      try {
        fileName = file.match(/^.*\/(.*)$/)[1];
        content = fs.readFileSync(file, 'utf-8');

        // Function that will be prepended in order to export angular module in a wrapped function
        exportCall = 'function exportNgModule(ngModule){ module.exports = ngModule }\n\n';

        // Burrito will wrap the module.run call around a call of the above function in order to export the module
        src = exportCall + burrito(ngHtml2Js(fileName, content, opts.module), function (node) {
          if(node.name === 'call' && node.label() === 'run') {
            node.wrap('exportNgModule(%s)');
          }
        });

      } catch (error) {
        this.emit('error', error);
      }
      this.queue(src);
      this.queue(null);
    }
  };
}

module.exports = ngHtml2jsify.configure;
