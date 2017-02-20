var path = require('path');
var _ = require('lodash');
var slug = require('slug-component');

// Expose `plugin`.
module.exports = plugin;


function plugin(options){

  return function (files, metalsmith, done){

    Object.keys(files).forEach(function(file){

      if(file.match(/\.json$/)){

        var configFilePath = path.resolve(metalsmith.source(), file);
        var configFile = require(configFilePath);

        if(!configFile.fromjsontocollection || !configFile.fromjsontocollection.length){
          return;
        }

        configFile.fromjsontocollection.forEach(function(collection){

          var source_filepath = path.resolve(metalsmith.directory(), collection.source_file + '.json');
          var json = require(source_filepath);

          json.forEach(function(d,i){
              var defaults = {
                contents: new Buffer(d[collection.defaults.contents]),
                title: d[collection.defaults.title],
                date: new Date(d[collection.defaults.date])
              };
              var metadata = {
                link: d.link,
                categories: d.categories,
                media: d.media,
                cover: d.cover,
                author: d.author
              }
              var meta     = collection.meta;
              var data     = _.extend(defaults, meta, metadata);
              var filename = collection.meta.collection + '/' + slug(d[collection.defaults.title]) + ( collection.meta.locale ?('_' + collection.meta.locale):'') + '.md';
              delete data.collection
              files[filename] = data;
          })

        })

        delete files[file];
      }

    });
    done()
  };
}
