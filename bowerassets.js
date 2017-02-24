var basename = require('path').basename,
    readFileSync = require('fs').readFileSync,
    lib = require('bower-files')({
          overrides: {
            bootstrap: {
              main: [
                './dist/js/bootstrap.js',
                './dist/css/bootstrap.css',
                './dist/css/bootstrap.css.map',
                "./dist/fonts/glyphicons-halflings-regular.eot",
                "./dist/fonts/glyphicons-halflings-regular.svg",
                "./dist/fonts/glyphicons-halflings-regular.ttf",
                "./dist/fonts/glyphicons-halflings-regular.woff",
                "./dist/fonts/glyphicons-halflings-regular.woff2"
              ]

            },
          'mark.js':{
            main: [
              './dist/jquery.mark.js'
            ]
          }
          }
        });

module.exports = plugin;

function plugin(options){
  return function(files, metalsmith, done) {
    var include;
    include = function(root, included) {
      var contents, file, i, len, results;
      results = [];
      for (i = 0, len = included.length; i < len; i++) {
        file = included[i];
        contents = readFileSync(file);
        results.push(files[root + "/" + (basename(file))] = {
          contents: contents
        });
      }
      return results;
    };
    var path = options.path?options.path:'';
    include(path + '/css', lib.ext(['css', 'map']).files);
    include(path + '/js', lib.ext('js').files);
    include(path + '/fonts', lib.ext(['eot', 'otf', 'ttf', 'woff', 'woff2']).files);

    done();
  };
}
