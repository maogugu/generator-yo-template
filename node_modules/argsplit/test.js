'use strict'

var test = require('tap').test
  , argsplit = require('./')

test('basic args', function(t) {
  t.plan(6)
  var input = 'git clone http://github.com/evanlucas/node-launchctl.git'
  var out = argsplit(input)
  t.ok(out, 'out exists')
  t.type(out, Array, 'out is an Array')
  t.equal(out.length, 3, 'out should have 3 items')
  t.equal(out[0], 'git', 'out[0] === \'git\'')
  t.equal(out[1], 'clone', 'out[1] === \'clone\'')
  t.equal(out[2], 'http://github.com/evanlucas/node-launchctl.git',
    'out[2] === \'http://github.com/evanlucas/node-launchctl.git\'')
})

test('args with double quotes', function(t) {
  t.plan(9)
  var input = 'npm config set init.author.name "Evan Lucas" --verbose'
  var out = argsplit(input)
  t.ok(out, 'out exists')
  t.type(out, Array, 'out is an Array')
  t.equal(out.length, 6, 'out should have 6 items')
  t.equal(out[0], 'npm', 'out[0] === \'npm\'')
  t.equal(out[1], 'config', 'out[1] === \'config\'')
  t.equal(out[2], 'set', 'out[2] === \'set\'')
  t.equal(out[3], 'init.author.name', 'out[3] === \'init.author.name\'')
  t.equal(out[4], '"Evan Lucas"', 'out[4] === \'"Evan Lucas"\'')
  t.equal(out[5], '--verbose', 'out[5] === \'--verbose\'')
})

test('args with single quotes', function(t) {
  t.plan(9)
  var input = "npm config set init.author.name 'Evan Lucas' --verbose"
  var out = argsplit(input)
  t.ok(out, 'out exists')
  t.type(out, Array, 'out is an Array')
  t.equal(out.length, 6, 'out should have 6 items')
  t.equal(out[0], 'npm', 'out[0] === \'npm\'')
  t.equal(out[1], 'config', 'out[1] === \'config\'')
  t.equal(out[2], 'set', 'out[2] === \'set\'')
  t.equal(out[3], 'init.author.name', 'out[3] === \'init.author.name\'')
  t.equal(out[4], "'Evan Lucas'", "out[4] === \"'Evan Lucas'\"")
  t.equal(out[5], '--verbose', 'out[5] === \'--verbose\'')
})

test('args with nested quotes', function(t) {
  t.plan(9)
  var input = "npm config set init.author.name 'Evan \"Hereford\" Lucas' --verbose"
  var out = argsplit(input)
  t.ok(out, 'out exists')
  t.type(out, Array, 'out is an Array')
  t.equal(out.length, 6, 'out should have 6 items')
  t.equal(out[0], 'npm', 'out[0] === \'npm\'')
  t.equal(out[1], 'config', 'out[1] === \'config\'')
  t.equal(out[2], 'set', 'out[2] === \'set\'')
  t.equal(out[3], 'init.author.name', 'out[3] === \'init.author.name\'')
  t.equal(out[4], "'Evan \"Hereford\" Lucas'", "out[4] === \"'Evan \"Hereford\" Lucas'\"")
  t.equal(out[5], '--verbose', 'out[5] === \'--verbose\'')
})

test('args with nested single quotes', function(t) {
  t.plan(9)
  var input = "npm config set init.author.name \"Evan 'Hereford' Lucas\" --verbose"
  var out = argsplit(input)
  t.ok(out, 'out exists')
  t.type(out, Array, 'out is an Array')
  t.equal(out.length, 6, 'out should have 6 items')
  t.equal(out[0], 'npm', 'out[0] === \'npm\'')
  t.equal(out[1], 'config', 'out[1] === \'config\'')
  t.equal(out[2], 'set', 'out[2] === \'set\'')
  t.equal(out[3], 'init.author.name', 'out[3] === \'init.author.name\'')
  t.equal(out[4], '"Evan \'Hereford\' Lucas"', 'out[4] === \'"Evan \'Hereford\' Lucas"\'')
  t.equal(out[5], '--verbose', 'out[5] === \'--verbose\'')
})

test('blank string', function(t) {
  t.plan(3)
  var input = ''
  var out = argsplit(input)
  t.ok(out, 'out exists')
  t.type(out, Array, 'out should be an Array')
  t.equal(out.length, 0, 'out should have 0 items')
})
