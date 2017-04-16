var byo = require('..')
var preact = require('preact')
var hyperx = require('hyperx')
var html = hyperx(preact.h)

var app = byo()
app.define('mount', handleMount)
app.define('render', handleRender)
app.use(logger)
app.use(countStore)
app.route('/', mainView)
app.mount('body')

function handleMount (tree, root) {
  return preact.render(tree, root)
}

function handleRender (tree, newTree, root) {
  return preact.render(newTree, root, tree)
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
