var documentReady = require('document-ready')
var nanohistory = require('nanohistory')
var nanorouter = require('nanorouter')
var nanohref = require('nanohref')
var nanoraf = require('nanoraf')
var nanobus = require('nanobus')
var assert = require('assert')

module.exports = Byo

function Byo (opts) {
  opts = opts || {}

  var routerOpts = {
    default: opts.defaultRoute || '/404',
    curry: true
  }

  var timingEnabled = opts.timing === undefined ? true : opts.timing
  var hasWindow = typeof window !== 'undefined'
  var hasPerformance = hasWindow && window.performance && window.performance.mark
  var router = nanorouter(routerOpts)
  var bus = nanobus()
  var rerender = null
  var root = null
  var tree = null
  var state = {}
  var handleMount = null
  var handleRender = null
  var handleToString = null

  return {
    toString: toString,
    use: register,
    define: define,
    mount: mount,
    route: route,
    start: start
  }

  function route (route, handler) {
    router.on(route, function (params) {
      return function () {
        state.params = params
        return handler(state, emit)
      }
    })
  }

  function register (cb) {
    cb(state, bus)
  }

  function define (action, cb) {
    if (action === 'mount') handleMount = cb
    if (action === 'render') handleRender = cb
    if (action === 'toString') handleToString = cb
  }

  function start () {
    tree = router(createLocation())
    rerender = nanoraf(function () {
      if (hasPerformance && timingEnabled) {
        window.performance.mark('byo:renderStart')
      }
      var newTree = router(createLocation())
      assert.ok(handleRender, 'byo.on(\'render\'): no render function defined')
      tree = handleRender(tree, newTree, root)
      if (hasPerformance && timingEnabled) {
        window.performance.mark('byo:renderEnd')
        window.performance.measure('byo:render', 'byo:renderStart', 'byo:renderEnd')
      }
    })

    bus.on('render', rerender)

    if (opts.history !== false) {
      nanohistory(function (href) {
        bus.emit('pushState')
      })

      bus.on('pushState', function (href) {
        if (href) window.history.pushState({}, null, href)
        bus.emit('render')
        setTimeout(function () {
          scrollIntoView()
        }, 0)
      })

      if (opts.href !== false) {
        nanohref(function (location) {
          var href = location.href
          var currHref = window.location.href
          if (href === currHref) return
          bus.emit('pushState', href)
        })
      }
    }

    documentReady(function () {
      bus.emit('DOMContentLoaded')
    })

    return tree
  }

  function emit (eventName, data) {
    bus.emit(eventName, data)
  }

  function mount (selector) {
    var newTree = start()
    documentReady(function () {
      root = document.querySelector(selector)
      assert.ok(root, 'byo.mount: could not query selector: ' + selector)
      assert.ok(handleMount, 'byo.on(\'mount\'): no mount function defined')
      tree = handleMount(newTree, root)
    })
  }

  function toString (location, _state) {
    state = _state || {}
    var html = router(location)
    assert.equal()
    assert.ok(handleToString, 'byo.on(\'toString\'): no toString function defined')
    return handleToString(html)
  }
}

function scrollIntoView () {
  var hash = window.location.hash
  if (hash) {
    try {
      var el = document.querySelector(hash)
      if (el) el.scrollIntoView(true)
    } catch (e) {}
  }
}

function createLocation () {
  var pathname = window.location.pathname.replace(/\/$/, '')
  var hash = window.location.hash.replace(/^#/, '/')
  return pathname + hash
}
