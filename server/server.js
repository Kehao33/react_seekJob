import express from 'express'
import path from 'path'
import model from './model'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

// const express = require('express')
// const path = require('path')
// const model = require('./model')
// const cookieParser = require('cookie-parser')
// const bodyParser = require('body-parser')

import React from 'react'
// import { renderToString, renderToStaticMarkup } from 'react-dom/server'
// renderToString, renderTostaticMarkup 两个的作用是将react组件转化为html常规的标签，如div
// 一下的两个包是用来解析css和图片文件处理的
import csshook from 'css-modules-require-hook/preset'
import assethook from 'asset-require-hook'
assethook({
  extensions: ['png', 'jpg']
})

import { renderToString, renderToNodeStream } from 'react-dom/server'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
// StaticRouter是后端用的， BrowserRouter是前端用的

import reducers from '../src/reducer'
import App from '../src/app'
import staticPath from '../build/asset-manifest.json'
// console.log('staticPath', staticPath)

const Chat = model.getModel('chat')

const app = express()

const userRouter = require('./user')
app.use('/', express.static(path.resolve('build')))

// function App() {
//   return (
//     <div>
//       <h2>我爱你，我的祖国</h2>
//       <h2>我必将成功</h2>
//     </div>
//   )
// }

// console.log(renderToString(<App></App>))

app.use(function(req, res, next) {
  if (req.url.startsWith('/user/') || req.url.startsWith('/static/')) {
    return next()
  }
  const store = createStore(reducers, compose(applyMiddleware(thunk)))
  // let context = {}
  // const markup = renderToString(
  //   <Provider store={store}>
  //     <StaticRouter location={req.url} context={context}>
  //       <App></App>
  //     </StaticRouter>
  //   </Provider>
  // )

  let context = {}
  res.write(`
    <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"/>
          <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
          <script>
            if ('addEventListener' in document) {
              document.addEventListener('DOMContentLoaded', function () {
                FastClick.attach(document.body);
              }, false);
            }
            if (!window.Promise) {
              document.writeln('<script src="https://as.alipayobjects.com/g/component/es6-promise/3.2.2/es6-promise.min.js"' + '>' + '<' + '/' + 'script>');
            }
          </script>
          <link rel="stylesheet" href="/${staticPath['main.css']}"/>
          <meta name='keywords' content='找工作，jakeq'>
        </head>
        <body>
      <div id="root">
  `)
  const markupStream = renderToNodeStream(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <App></App>
      </StaticRouter>
    </Provider>
  )
  markupStream.pip(res, { end:false })
  markupStream.on('end', () => {
    res.write(`${markup}</div>
              </body>
              <script src="/${staticPath['main.js']}"></script>
            </html>`)
    res.end()
  })

  // const pageHtml = `<!DOCTYPE html>
                    // <html>
                    //   <head>
                    //     <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"/>
                    //     <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
                    //     <script>
                    //       if ('addEventListener' in document) {
                    //         document.addEventListener('DOMContentLoaded', function () {
                    //           FastClick.attach(document.body);
                    //         }, false);
                    //       }
                    //       if (!window.Promise) {
                    //         document.writeln('<script src="https://as.alipayobjects.com/g/component/es6-promise/3.2.2/es6-promise.min.js"' + '>' + '<' + '/' + 'script>');
                    //       }
                    //     </script>
                    //     <link rel="stylesheet" href="/${staticPath['main.css']}"/>
                    //     <meta name='keywords' content='找工作，jakeq'>
                    //   </head>
                    //   <body>
                    //     <div id="root">${markup}</div>
                    //   </body>
                    //   <script src="/${staticPath['main.js']}"></script>
                    // </html>`

  // res.send(pageHtml)
  // const htmlRes = (<App></App>)
  // res.send(htmlRes)
  // return res.sendFile(path.resolve('build/index.html'))
})

// work with express 让express和socket.io相结合
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// socket是本次的连接请求，而io是全局性的
io.on('connection', function(socket) {
  socket.on('sendmsg', function(data) {
    const { from, to, msg } = data
    const chatid = [from, to].sort().join('_')
    Chat.create({ chatid, from, to, content: msg }, function(err, doc) {
      // console.log('doc',doc)  // doc就等于doc._doc
      io.emit('recvmsg', Object.assign({}, doc._doc))
    })
    // io发送全局数据
    io.emit('recvmsg', data)
  })
})

app.use(cookieParser())
app.use(bodyParser.json())
// 开启路由中间件

app.use('/user', userRouter)

server.listen(9093, function() {
  console.log('node app start at port 9093...')
})
