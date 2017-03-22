var metalsmith = require('metalsmith'),
    //markdown = require('metalsmith-markdown'),
    markdown = require('metalsmith-markdownit'),
    mdfootnotes = require('markdown-it-footnote'),
    layouts = require('metalsmith-layouts'),
    permalinks = require('metalsmith-permalinks'),
    collections = require('metalsmith-collections'),
    serve = require('metalsmith-serve'),
    watch = require('metalsmith-watch'),
    multilanguage = require('metalsmith-multi-language'),
    i18n = require('metalsmith-i18n'),
    dataloader = require('metalsmith-data-loader'),
    pagination = require('metalsmith-pagination'),
    assets = require('metalsmith-assets'),
    ignore = require('metalsmith-ignore'),
    uglify = require('metalsmith-uglify'),
    excerpts = require('metalsmith-excerpts'),
    fromjsontocollection = require('./fromjsontocollection.js'),
    parsefootnotes = require('./parsefootnotes.js'),
    bower = require('./bowerassets.js'),
    moment = require('moment'),
    nunjucks = require('nunjucks'),
    dateFilter = require('./datefilter');


var env = nunjucks.configure('layouts', {watch: false,  noCache: true})
env.addFilter('date',dateFilter);
env.addFilter('limitTo', function(input, limit) {
  if (typeof limit !== 'number') {
    return input;
  }
  if (typeof input === 'string') {
    if (limit >= 0) {
      return input.substring(0, limit);
    } else {
      return input.substr(limit);
    }
  }
  if (Array.isArray(input)) {
    limit = Math.min(limit, input.length);
    if (limit >= 0) {
      return input.splice(0, limit);
    } else {
      return input.splice(input.length + limit, input.length);
    }
  }
  return input;
});

env.addFilter('addMonthYear', function(input, prop, locale) {
  if (!prop || !input.length || !input) {
    return input;
  }

  input.forEach(function(d){
    moment.locale(locale?locale:'en');
    var date = moment(d[prop]);
    d.monthYear = date.format('MMMM YYYY');
  })

  return input;
});

env.addFilter('split', function(str, seperator) {
    return str.split(seperator);
});

metalsmith(__dirname)
  .metadata({
    site: {
      name: 'Forccast',
      url: 'https://www.forccast.fr',
      baseurl: '/',
      author: 'Forccast team',
      description: 'Formation par la cartographie des controverses à l\'analyse des sciences et des techniques'
    }
  })
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(fromjsontocollection())
  .use(parsefootnotes())
  .use(collections({
    news_en: {
      pattern: 'news/**/*_en.md',
      sortBy: 'date',
      reverse: true
    },
    news_fr: {
      pattern: 'news/**/*_fr.md',
      sortBy: 'date',
      reverse: true
    },
    pages: {
      pattern: 'pages/**/*.md',
      sortBy: 'sort'
    }
  }))
  .use(dataloader({
    directory: 'data/',
    dataProperty: 'external',
  }))
  .use(multilanguage({
    default: 'fr', locales: ['fr', 'en']
  }))
  .use(pagination({
    'collections.news_fr': {
      perPage: 10,
      layout: 'news-archive.html',
      first: 'fr/news/index.html',
      path: 'fr/news/:num/index.html',
      pageMetadata: {
        title: 'latest news',
        locale: 'fr'
      }
    },
    'collections.news_en': {
      perPage: 10,
      layout: 'news-archive.html',
      first: 'en/news/index.html',
      path: 'en/news/:num/index.html',
      pageMetadata: {
        title: 'latest news',
        locale: 'en'
      }
    }
  }))
  .use(i18n({
    default: 'fr',
    locales: ['fr', 'en'],
    directory: 'locales'
  }))
  //.use(markdown())
  .use(markdown('default', {typographer: true, html: true}).use(mdfootnotes))
  .use(permalinks({
    relative: false,
    linksets: [{
        match: { collection: 'news_fr' },
        pattern: ':locale/news/:title'
    },
    {
        match: { collection: 'news_en' },
        pattern: ':locale/news/:title'
    },
    {
        match: { collection: 'pages' },
        pattern: ':locale/:title'
    }]
  }))
  .use(excerpts())
  .use(layouts({
    engine: 'nunjucks',
    pattern: '**/*.html',
    directory: 'layouts'
  }))
  .use(serve({
    port: 8081,
    verbose: true
  }))
  .use(watch({
      paths: {
        "${source}/**/*": true,
        "layouts/**/*": "**/*"
      }
    }))
  .use(ignore('**/\.DS_Store'))
  .use(bower({path:'./assets'}))
  .build(function (err, files) {
    if (err) {
      console.log(err);
    }
    else {
      //console.log(files)
      console.log('Forccast built!');
    }
  });
