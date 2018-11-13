# monoapp

[![API stability](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![NPM version](https://img.shields.io/npm/v/monoapp.svg?style=flat-square)](https://npmjs.org/package/monoapp)
[![Standard](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
![Size](https://img.shields.io/badge/size-3.88kB-yellow.svg?style=flat-square)

[choo](https://github.com/choojs/choo) architecture without a renderer. Bring-your-own view layer.

## Overview

`monoapp` is an opinionated fork of `choo`, a small frontend framework with a simple, functional architecture. Read-up on the [choo documentation](https://github.com/choojs/choo#api) for details on routing, events, and the architecture in general.

In `monoapp`, we have removed the modules used to render the dom ([nanohtml](https://github.com/choojs/nanohtml) and [nanomorph](https://github.com/choojs/nanomorph)), and made these pluggable instead. This allows us to build apps using `choo` architecture, but render views and components however we would like. See the [examples directory](https://github.com/jongacnik/monoapp/tree/master/examples/) for using with [react](https://github.com/jongacnik/monoapp/tree/master/examples/with-react), [lit-html](https://github.com/jongacnik/monoapp/tree/master/examples/with-lit-html), [vue](https://github.com/jongacnik/monoapp/tree/master/examples/with-vue-jsx), [nanomorph](https://github.com/jongacnik/monoapp/tree/master/examples/with-nanomorph), etc.

## Example

Clone of the [choo example](https://github.com/choojs/choo#example), but we bring [nanohtml](https://github.com/choojs/nanohtml) and [nanomorph](https://github.com/choojs/nanomorph) ourselves.

```js
var html = require('nanohtml')
var morph = require('nanomorph')
var monoapp = require('monoapp')
var devtools = require('choo-devtools')

var app = monoapp({
  mount: morph,
  render: morph
})

app.use(devtools())
app.use(countStore)
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <h1>count is ${state.count}</h1>
      <button onclick=${onclick}>Increment</button>
    </body>
  `

  function onclick () {
    emit('increment', 1)
  }
}

function countStore (state, emitter) {
  state.count = 0
  emitter.on('increment', function (count) {
    state.count += count
    emitter.emit('render')
  })
}
```

You could also choose to define `mount` and `render` using a simple plugin, rather than passing as options:

```js
app.use(withNanomorph)

function withNanomorph (state, emitter, app) {
  app._mount = morph
  app._render = morph
}
```

## API

The only items documented here are the methods to implement. These can be defined as options when creating a `monoapp` instance, or can be set with a plugin. Refer to the [choo documentation](https://github.com/choojs/choo#api) for anything related to app architecture (routing, state, and events).

### `app._mount(tree, newTree, root)`*

Mount tree onto the root:

```js
app._mount = (tree, newTree, root) => nanomorph(tree, newTree)
```

### `app._render(tree, newTree, root)`*

Render new tree:

```js
app._render = (tree, newTree, root) => nanomorph(tree, newTree)
```

### `app._toString(tree)`

Convert tree to string. This method is useful for ssr:

```js
app._toString = (tree) => tree.toString()
```

\*Required

## Plugins

Some plugins to use with `monoapp` which take care of common configs:

- [monoapp-react](https://github.com/jongacnik/monoapp-react)
- ~~monoapp-lit-html~~ soon
- ~~monoapp-nanomorph~~ soon

## More Examples

- [with-react](https://github.com/jongacnik/monoapp/tree/master/examples/with-react)
- [with-react-jsx](https://github.com/jongacnik/monoapp/tree/master/examples/with-react-jsx)
- [with-lit-html](https://github.com/jongacnik/monoapp/tree/master/examples/with-lit-html)
- [with-vue-jsx](https://github.com/jongacnik/monoapp/tree/master/examples/with-vue-jsx)
- [with-nanomorph](https://github.com/jongacnik/monoapp/tree/master/examples/with-nanomorph)
- [with-preact](https://github.com/jongacnik/monoapp/tree/master/examples/with-preact)
- [with-inferno](https://github.com/jongacnik/monoapp/tree/master/examples/with-inferno)

## Why does this exist?

`choo` is really calm and we like to build apps using it. That said, sometimes `nanohtml` and `nanomorph` aren't the best tools for the job. We wanted to be able to build apps using `choo` architecture but swap out the view layer and make use of other component ecosystems when a project calls for it.

## Notes

`monoapp` is currently feature-matched to choo 6.13.1