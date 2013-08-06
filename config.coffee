exports.config =
  plugins:
    uglify:
      mangle: false
      squeeze: false
      compress:
        global_defs:
          DEBUG: true
  paths:
    public: 'build'
    watched: ['src']
  files:
    javascripts:
      joinTo: 'beard.js'
  modules:
    nameCleaner: (path) ->
      path.replace /^src/, 'beard'
