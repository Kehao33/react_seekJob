// const express = require('express')
const utils = require('utility')

const Router = express.Router()
const model = require('./model')
const User = model.getModel('user')
const Chat = model.getModel('chat')
const _filter = { pwd: 0, __v: 0 }

import express from 'express'

// Chat.deleteMany({}, function(e,d){
//   console.log('chat remove...')
// })

Router.get('/list', function(req, res) {
  const { type } = req.query
  // User.deleteMany({},function(e,d){})
  User.find({ type }, function(err, doc) {
    return res.json({ code: 0, data: doc })
  })
})

Router.get('/getmsglist', function(req, res) {
  const user = req.cookies.userid
  User.find({}, function(e, userdoc) {
    let users = {}
    userdoc.forEach(v => {
      users[v._id] = { name: v.user, avatar: v.avatar }
    })
    Chat.find({ $or: [{ from: user }, { to: user }] }, function(err, doc) {
      if (!err) {
        return res.json({ code: 0, msgs: doc, users: users })
      }
    })
  })
})

Router.post('/readmsg', function(req, res) {
  const userid = req.cookies.userid
  // 获取谁发送来的
  const { from } = req.body
  // 更新已读的消息，只更新对方给当前用户发送的信息
  Chat.update(
    { from, to: userid },
    { $set: { read: true } },
    { multi: true },
    function(err, doc) {
      if (!err) {
        return res.json({ code: 0, num: doc.nModified })
      }
      return res.json({ code: 1, msg: '修改失败' })
    }
  )
})

Router.post('/update', function(req, res) {
  const userid = req.cookies.userid
  const body = req.body
  if (!userid) {
    // json.dumps()用于将字典形式的数据转化为字符串
    // return json.dumps({code:1})
    return res.json({ code: 1 })
  }
  User.findOneAndUpdate({ _id: userid }, body, function(err, doc) {
    // Object.assign(target, source1, source2);
    // 用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。
    const data = Object.assign(
      {},
      body,
      {
        user: doc.user,
        type: doc.type
      }
    )
    return res.json({ code: 0, data })
  })
})

Router.post('/login', function(req, res) {
  const { user, pwd } = req.body
  User.findOne({ user, pwd: md5Pwd(pwd) }, _filter, function(err, doc) {
    if (!doc) {
      return res.json({ code: 1, msg: '用户名或者密码错误' })
    }
    res.cookie('userid', doc._id)
    return res.json({ code: 0, data: doc })
  })
})

Router.post('/register', function(req, res) {
  const { user, pwd, type } = req.body
  User.findOne({ user }, function(err, doc) {
    if (doc) {
      return res.json({ code: 1, msg: '用户名重复' })
    }
    const userMobel = new User({ user, type, pwd: md5Pwd(pwd) })
    userMobel.save(function(e, d) {
      if (e) {
        return res.json({ code: 1, msg: '后端出错了' })
      }
      const { user, type, _id } = d
      res.cookie('userid', _id)
      return res.json({ code: 0, data: { user, type, _id } })
    })
  })
})

Router.get('/info', function(req, res) {
  const { userid } = req.cookies
  if (!userid) {
    return res.json({ code: 1 })
  }
  User.findOne({ _id: userid }, _filter, function(err, doc) {
    if (err) {
      return res.json({ code: 1, msg: '后端出错了' })
    }
    if (doc) {
      return res.json({ code: 0, data: doc })
    }
  })
})

function md5Pwd(pwd) {
  const salt = 'react_jake@jake#***#'
  return utils.md5(utils.md5(pwd + salt))
}

module.exports = Router
