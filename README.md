# forccast-website

## Installation
If you want to run your instance of forccast-website locally on your machine, be sure you have the following requirements installed.

### Requirements

- [git](http://git-scm.com/book/en/Getting-Started-Installing-Git)
- [Bower](http://bower.io/#installing-bower)
- [Node](https://nodejs.org/en/)

### Instructions

Clone forccast-website from the command line:

``` sh
$ git clone https://github.com/calibro/forccast-website.git
```

browse to forccast-website root folder:

``` sh
$ cd forccast-website
```

install dependencies:

``` sh
$ npm install
```

``` sh
$ bower install
```

add data folder:

``` sh
$ mkdir data
```

Before building the website add data files using [forccast-backoffice](https://github.com/calibro/forccast-backoffice)

You can now run forccast-website in ```dev``` mode from local web server.

``` sh
$ node build-dev.js
```

Once this is running, go to [http://localhost:8081/](http://localhost:8081/).

### Production

The push to prod script ```build-prod.js``` will execute the deployProd.bash script we need to specify depending on your production environnement. The sample provided show an example with rsync.
