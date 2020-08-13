import React from 'react'
import ReactDom from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from './app'
// react-redux：连接react和redux的包
import reducers from './reducer'
import './config'
import './index.css'

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)

// boss genius me msg 4个页面
// 在服务端使用了 renderToNodeStream后，这里需要将render改为hydrate实现注水
ReactDom.hydrate(
  // Provider里边只传store
  <Provider store={store}>
    <BrowserRouter>
      <App></App>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
