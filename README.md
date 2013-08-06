beard.js
========

Logic less templating engine, for JavaScript

Dependencies
------------

Node.js & npm
For package distribution: [Bower](http://bower.io/)

Setup
-----

Clone kickbox repo and install node dependencies:

```sh
git clone git@github.com:NextUserSF/beard.js.git
cd beard.js
npm install
make
```

`make` targets
--------------

`make develop` or just `make`: builds development version of the library in `build/beard.js`.

`make production`: builds production version of the library in `dist/beard.min.js`.

`make lint`: checks files in `src` directory with `jslint` tool.

`make clean`: removes `build` directory.

`make install-hooks`: installs handy git hooks.
