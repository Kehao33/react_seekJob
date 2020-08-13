import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavBar } from 'antd-mobile'
import { Switch, Route, Redirect } from 'react-router-dom'
// 使用export default 导出的组件不用{}括起来

import NavLinkBar from '../navlinkbar/navlinkbar'
import { getMsgList, recvMsg } from '../../redux/chat.redux'
import Boss from '../boss/boss'
import Genius from '../genius/genius'
import User from '../user/user'
import Msg from '../msg/msg'
import QueueAnim from 'rc-queue-anim'

@connect(state => state, { getMsgList, recvMsg })
class Dashboard extends Component {
  componentDidMount() {
    if (!this.props.chat.chatmsg.length) {
      this.props.getMsgList()
      this.props.recvMsg()
    }
  }
  render() {
    const { pathname } = this.props.location
    const user = this.props.user
    const navList = [
      {
        path: '/boss',
        text: '牛人',
        icon: 'boss',
        title: '牛人列表',
        component: Boss,
        hide: user.type === 'genius'
      },
      {
        path: '/genius',
        text: 'boss',
        icon: 'job',
        title: 'BOSS列表',
        component: Genius,
        hide: user.type === 'boss'
      },
      {
        path: '/msg',
        text: '消息',
        icon: 'msg',
        title: '消息列表',
        component: Msg
      },
      {
        path: '/me',
        text: '我',
        icon: 'user',
        title: '个人中心',
        component: User
      }
    ]
    const page = navList.find(v => v.path == pathname)
    // 让动画生效，只渲染一个route，根据当前的path决定组件动画
    return page ? (
      <div>
        <NavBar mode="dard" className="fixd-header">
          {page.title}
        </NavBar>
        <div style={{ marginTop: 45 }}>
          {/* <QueueAnim type="scaleX" duration={800}> */}
            <Route key={page.path} path={page.path} component={page.component}></Route>
          {/* </QueueAnim> */}
        </div>
        <NavLinkBar data={navList}></NavLinkBar>
      </div>
    ) : <Redirect to='/login'></Redirect>
  }
}

export default Dashboard
