var metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    layouts = require('metalsmith-layouts'),
    permalinks = require('metalsmith-permalinks'),
    collections = require('metalsmith-collections'),
    serve = require('metalsmith-serve'),
    watch = require('metalsmith-watch'),
    multilanguage = require('metalsmith-multi-language'),
    i18n = require('metalsmith-i18n'),
    dataloader = require('metalsmith-data-loader'),
    pagination = require('metalsmith-pagination'),
    fromjsontocollection = require('./fromjsontocollection.js'),
    nunjucks = require('nunjucks');

nunjucks.configure('layouts', {watch: false,  noCache: true})

metalsmith(__dirname)
  .metadata({
    site: {
      name: 'Forccast',
      baseurl: 'https://www.forccast.fr',
      author: 'Forccast team',
    }
  })
  .source('./src')
  .destination('./build')
  .use(fromjsontocollection())
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
      pattern: 'pages/**/*.md'
    }
  }))
  .use(dataloader({
    directory: 'data/',
    dataProperty: 'external',
  }))
  .use(pagination({
    'collections.news_fr': {
      perPage: 10,
      layout: 'news-archive.html',
      first: 'fr/news/index.html',
      path: 'fr/news/:num/index.html',
      pageMetadata: {
        title: 'Archive'
      }
    },
    'collections.news_en': {
      perPage: 10,
      layout: 'news-archive.html',
      first: 'en/news/index.html',
      path: 'en/news/:num/index.html',
      pageMetadata: {
        title: 'Archive'
      }
    }
  }))
  .use(multilanguage({
    default: 'fr', locales: ['fr', 'en']
  }))
  .use(i18n({
    default: 'fr',
    locales: ['fr', 'en'],
    directory: 'locales'
  }))
  .use(markdown())
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
  .build(function (err, files) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Forccast built!');
    }
  });
