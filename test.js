var install = require('./')
var test = require('tape')
var json = require('read-json')
var uninstall = require('spawn-npm-install').uninstall
var path = require('path')

test('installs the given modules if needed', function (t) {
  t.plan(3)

  install({
    devDependencies: ['tape'],
    optionalDependencies: ['through2', 'quote-stream']
  }, function (err) {
    if (err) t.fail(err)
    includes(t, 'devDependencies', 'tape', true)
    includes(t, 'optionalDependencies', 'through2', true)
    includes(t, 'optionalDependencies', 'quote-stream', true)

    uninstall(['through2', 'quote-stream'], { saveOptional: true }, function (err) {
      if (err) t.fail(err)
    })
  })
})

test('allows package data to be specified', function (t) {
  t.plan(1)

  install({
    package: {
      devDependencies: {
        'quote-stream': '*'
      }
    },
    devDependencies: ['quote-stream']
  }, function (err) {
    if (err) t.fail(err)
    includes(t, 'devDependencies', 'quote-stream', false)
  })
})

test('does not save deps when save: false', function (t) {
  t.plan(2)

  install({
    save: false,
    optionalDependencies: ['zalgo'],
    devDependencies: ['quote-stream']
  }, function (err) {
    if (err) t.fail(err)
    includes(t, 'devDependencies', 'quote-stream', false)
    includes(t, 'optionalDependencies', 'zalgo', false)
  })
})

function includes (t, key, name, exists) {
  json(path.join(__dirname, 'package.json'), function (err, data) {
    if (err) t.fail(err)

    var idx = Object.keys(data[key]).indexOf(name)
    if (exists) {
      t.notEqual(idx, -1, 'has dep')
    } else {
      t.equal(idx, -1, 'does not have dep')
    }
  })
}
