var types = [
  'dependencies', 
  'devDependencies', 
  'optionalDependencies'
]

// Given a package.json and list of deps,
// will filter down to those that haven't yet
// been installed
module.exports = function (package, opt) {
  opt = opt || {}

  return types.reduce(function (dict, type) {
    var actualDeps = package[type] || {}
    var actualNames = Object.keys(actualDeps)
    var desired = [].concat(opt[type]).filter(Boolean)

    // only installs packages that aren't in package.json
    var needed = desired.filter(function (pkgName) {
      // split scoped package names
      var parts = pkgName.split(/(.+)@/).filter(Boolean)
      var name = parts[0]
      var exists = actualNames.indexOf(name) >= 0
      return !exists
    })

    if (needed.length)
      dict[type] = needed
    return dict
  }, {})
}
