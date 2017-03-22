var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var mdfootnotes = require('markdown-it-footnote');
var slug = require('slug-component');
var cheerio = require('cheerio');
var md = require('markdown-it')({
  html: true,
  typographer: true
}).use(mdfootnotes)

// Expose `plugin`.
module.exports = plugin;


function plugin(options){

  return function (files, metalsmith, done){

    Object.keys(files).forEach(function(file){

      if(file.match(/\.json$/)){

        var configFilePath = path.resolve(metalsmith.source(), file);
        var configFile = require(configFilePath);

        if(!configFile.external_md){
          return;
        }

        var source_filepath = path.resolve(metalsmith.directory(), configFile.external_md);
        var external_md = fs.readFileSync(source_filepath, 'utf-8')
        var result = md.render(external_md);
        var $ = cheerio.load(result)
        $('iframe').addClass('news-desk embed-responsive-item')
        var notes = $('.footnotes').html();
        $('.footnotes-sep').remove()
        $('.footnotes').remove()
        var desktop = $.html()
        var mobile;
        $ = cheerio.load(result.replace(/<\/sup>/g,'</sup></p><p>'))
        $('iframe').addClass('news-desk embed-responsive-item')
        if($('.footnotes').html()){
          $('.footnotes-sep').remove()
          var list = $('.footnote-item')
          list.each(function(i, elem) {
            var id = $(this).attr('id');
            var title = $(this).find('h4').clone()
            var collapser = $('<div class="show-note-button" data-toggle="collapse" data-target="#' + id +'" aria-expanded="false" aria-controls="' + id +'"></div>')
            title.wrap(collapser)
            $(this).find('h4').remove()
            var collapsed = $('<div class="collapse show-note-content" id="' + id +'">' + $(this).html() +'</div>')
            $('.footnote-ref a[href=#' + id +']').parent().parent().after(collapser)
            collapser.after(collapsed)
          });
          $('.footnotes').remove()
          mobile = $.html()
        }else {
          mobile = desktop;
        }

        var defaults = {
          contents: new Buffer(desktop)
        };
        var metadata = {
          mobile: mobile,
          footnotes: notes
        }
        var meta     = configFile.meta;
        var data     = _.extend(defaults, meta, metadata);
        var filename = configFile.external_md.split('/')[configFile.external_md.split('/').length-1]
        files[filename] = data;
        delete files[file];
      }

    });
    done()
  };
}
