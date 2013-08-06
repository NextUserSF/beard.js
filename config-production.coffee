{config} = require './config'

config.paths.public = 'dist'
config.files.javascripts.joinTo = 'beard.min.js'
config.plugins.uglify.compress.global_defs.DEBUG = false
config.plugins.uglify.squeeze = true
config.sourceMaps = false

exports.config = config
