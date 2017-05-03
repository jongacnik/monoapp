# byo

[![API stability](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![NPM version](https://img.shields.io/npm/v/byo.svg?style=flat-square)](https://npmjs.org/package/byo)
[![Standard](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
![Size](https://img.shields.io/badge/size-2.89kB-yellow.svg?style=flat-square)

`byo` or `bring your own` is like [choo](https://github.com/yoshuawuyts/choo) without a renderer.

## Example

Clone of the [choo example](https://github.com/yoshuawuyts/choo#example), but we bring [bel](https://github.com/shama/bel), [nanomount](https://github.com/yoshuawuyts/nanomount), and [nanomorph](https://github.com/yoshuawuyts/nanomorph) ourselves.

```js
var byo = require('byo')
var html = require('bel')
var nanomount = require('nanomount')
var nanomorph = require('nanomorph')

var app = byo({
  mount: handleMount,
  render: handleRender
})

app.use(logger)
app.use(countStore)
app.route('/', mainView)
app.mount('body')

function handleMount (tree, root) {
  nanomount(root, tree)
  return root
}

function handleRender (tree, newTree, root) {
  return nanomorph(tree, newTree)
}

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

function logger (state, emitter) {
  emitter.on('*', function (messageName, data) {
    console.log('event', messageName, data)
  })
}

function countStore (state, emitter) {
  state.count = 0
  emitter.on('increment', function (count) {
    state.count += count
    emitter.emit('render')
  })
}
```

## API

Under the hood, `byo` is essentially a fork of `choo`. At the moment, we'll keep `byo` in API parity with `choo`. **Please refer to the [choo documentation](https://github.com/yoshuawuyts/choo#api) for details on routing, events, and the architecture in general.** The only thing we need to document here is...

### Additional Options

A couple additional options are provided for defining render methods, alongside all the supported `choo` [options](https://github.com/yoshuawuyts/choo#app--chooopts). While we refer to them as options, **`mount`** and **`render`** are **required since byo has no render methods by default.**

### `opts.mount`

**required** | Mount the tree onto the root. Typically you will return the `tree` or `root`. Example:

```js
function handleMount (tree, root) {
  nanomount(root, tree)
  return root
}
```

### `opts.render`

**required** | Render the new tree. `tree`, `newTree`, and `root` are available for morphing. Example:

```js
function handleRender (tree, newTree, root) {
  return nanomorph(tree, newTree)
}
```

### `opts.toString`

Convert html (or vdom) to string. You'll usually define this method for server rendering. Example:

```js
function handleToString (html) {
  return html.toString()
}
```

## Why does this exist?

If you like `choo` use `choo`, it's rad.

But sometimes `bel`, `nanomount`, or `nanomorph` might not fit the needs of a project. Maybe you like virtual dom but you _still_ want to build your apps `choo`-style. `byo` is the back-pocket tool for those scenarios. I'm maintaining this project because I currently have a need for nested components which we can't quite yet pull off with [nanocomponent](https://github.com/yoshuawuyts/nanocomponent), so I opt for [preact](https://github.com/developit/preact) + [hyperx](https://github.com/substack/hyperx).

## Renderers

Here are some examples of renderers with tagged template string implementations you can `byo`:

[virtual-dom](https://github.com/Matt-Esch/virtual-dom)

```js
var vdom = require('virtual-dom')
var hyperx = require('hyperx')
var html = hyperx(vdom.h)
var rootNode

function handleMount (tree, root) {
  rootNode = vdom.create(tree)
  root.appendChild(rootNode)
  return tree
})

function handleRender (tree, newTree, root) {
  var patches = vdom.diff(tree, newTree)
  rootNode = vdom.patch(rootNode, patches)
  return newTree
})
```

[Inferno](https://github.com/infernojs/inferno/)

```js
var Inferno = require('inferno')
var hyperx = require('hyperx')
var html = hyperx(require('inferno-create-element'))

function handleMount (tree, root) {
  return Inferno.render(tree, root)
})

function handleRender (tree, newTree, root) {
  return Inferno.render(newTree, root)
})
```

[Preact](https://github.com/developit/preact)

```js
var preact = require('preact')
var hyperx = require('hyperx')
var html = hyperx(preact.h)

function handleMount (tree, root) {
  return preact.render(tree, root)
})

function handleRender (tree, newTree, root) {
  return preact.render(newTree, root, tree)
})
```

[React](https://github.com/facebook/react)

```js
var React = require('react')
var ReactDOM = require('react-dom')
var hyperx = require('hyperx')
var html = hyperx(React.createElement)

function handleMount (tree, root) {
  return ReactDOM.render(tree, root)
})

function handleRender (tree, newTree, root) {
  return ReactDOM.render(newTree, root)
})
```

[Snabby](https://github.com/jamen/snabby)

```js
var html = require('snabby')

function handleMount (tree, root) {
  html.update(root, tree)
  return tree
})

function handleRender (tree, newTree, root) {
  html.update(tree, newTree)
  return newTree
})
```

## Todo 

- [ ] Tests
- [ ] Greenkeeper
- [ ] Travis CI

## Fine Print

Thanks [Yoshua Wuyts](https://github.com/yoshuawuyts) and the rest of the choo team (s/o [dat](https://datproject.org/)) for the continual awsm work 🙏
