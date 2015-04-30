var closest = require('closest-package')
var read = require('read-json')

module.exports = function(cwd, cb) {
  if (typeof cwd === 'function') {
    cb = cwd
    cwd = process.cwd()
  }

  closest(cwd, function(err, file) {
    if (err || !file) {
      return cb(new Error('Could not find a root package.json from:\n'+cwd))
    }
    read(file, cb)
  })
}