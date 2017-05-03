var byo = require('..')
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
