var React = require('react')
var ReactDOM = require('react-dom')
var monoapp = require('../../index')
var devtools = require('choo-devtools')

var app = monoapp()

app.use(withReact)
app.use(devtools())
app.use(countStore)
app.route('/', mainView)
app.mount('#app')

function withReact (state, emitter, app) {
  app._mount = (tree, newTree) => ReactDOM.render(newTree, tree)
  app._render = (tree, newTree) => ReactDOM.render(newTree, tree)
}

function mainView (state, emit) {
  return (
    <main>
      <h1>count is {state.count}</h1>
      <button onClick={onclick}>Increment</button>
    </main>
  )

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
