var { html, render } = require('lit-html')
var monoapp = require('../../index')
var devtools = require('choo-devtools')

var app = monoapp()

app.use(withLit)
app.use(devtools())
app.use(countStore)
app.route('/', mainView)
app.mount('#app')

function withLit (state, emitter, app) {
  app._mount = (tree, newTree, root) => render(newTree, tree)
  app._render = (tree, newTree, root) => render(newTree, tree)
}

function mainView (state, emit) {
  return html`
    <main>
      <h1>count is ${state.count}</h1>
      <button @click=${onclick}>Increment</button>
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
