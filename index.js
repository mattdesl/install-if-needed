var install = require('spawn-npm-install')
var each = require('run-series')
var assign = require('object-assign')
var filter = require('./lib/filter-package-deps')
var readPackage = require('read-closest-package')

var saveArg = {
  dependencies: 'save',
  devDependencies: 'saveDev',
  optionalDependencies: 'saveOptional'
}

module.exports = function (opt, cb) {
  if (typeof opt === 'string' || Array.isArray(opt))
    opt = { dependencies: opt }
  opt = opt || {}

  if (opt.package) {
    process.nextTick(function () {
      run(null, opt.package)
    })
  } else {
    readPackage({ cwd: opt.cwd || process.cwd() }, run)
  }

  function run (err, packageData) {
    if (err)
      return cb(err)

    // if we should --save / --save-dev / --save-optional
    var useSave = opt.save !== false

    // get needed dependencies
    var needed = filter(packageData, opt)

    // get install tasks
    var tasks = Object.keys(needed).map(function (key) {
      var installOpts = assign({}, opt)
      delete installOpts.save

      var save = saveArg[key]
      if (useSave && save)
        installOpts[save] = true

      return function (next) {
        var deps = needed[key]
        install(deps, installOpts, next)
      }
    })

    // run each task in series
    each(tasks, cb)
  }
}
