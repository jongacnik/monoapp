var html = require('nanohtml')
var nanomorph = require('nanomorph')
var monoapp = require('../../index')
var devtools = require('choo-devtools')

var app = monoapp()

app.use(withNanomorph)
app.use(devtools())
app.use(countStore)
app.route('/', mainView)
app.mount('body')

function withNanomorph (state, emitter, app) {
  app._mount = nanomorph
  app._render = nanomorph
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

function countStore (state, emitter) {
  state.count = 0
  emitter.on('increment', function (count) {
    state.count += count
    emitter.emit('render')
  })
}
