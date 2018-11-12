var Inferno = require('inferno')
var hyperx = require('hyperx')
var html = hyperx(require('inferno-create-element').createElement)
var monoapp = require('../../index')
var devtools = require('choo-devtools')

var app = monoapp()

app.use(withInferno)
app.use(devtools())
app.use(countStore)
app.route('/', mainView)
app.mount('#app')

function withInferno (state, emitter, app) {
  app._mount = (tree, newTree, root) => Inferno.render(newTree, tree)
  app._render = (tree, newTree, root) => Inferno.render(newTree, tree)
}

function mainView (state, emit) {
  return html`
    <main>
      <h1>count is ${state.count}</h1>
      <button onClick=${onclick}>Increment</button>
    </main>
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
