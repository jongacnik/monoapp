var Vue = require('vue')
var monoapp = require('../../index')
var devtools = require('choo-devtools')

var app = monoapp()

app.use(withVue)
app.use(devtools())
app.use(countStore)
app.route('/', mainView)
app.mount('#app')

function withVue (state, emitter, app) {
  app._mount = (tree, newTree, root) => {
    return new Vue({
      el: tree,
      data: {
        ViewComponent: newTree
      },
      render (h) { 
        return h(this.ViewComponent) 
      }
    })
  }
  app._render = (tree, newTree, root) => {
    root.ViewComponent = newTree
    return root
  }
}

function mainView (state, emit) {
  return {
    render () {
      return (
        <main>
          <h1>count is {state.count}</h1>
          <button onclick={onclick}>Increment</button>
        </main>
      )
    }
  }

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
