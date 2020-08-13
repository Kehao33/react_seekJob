import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'

@connect(state => state)
class Msg extends Component {
  getLast(arr) {
    return arr[arr.length - 1]
  }
  render() {
    const Item = List.Item
    const Brief = Item.Brief
    
    const userid = this.props.user._id
    const userinfo = this.props.chat.users
    const msgGroup = {}
    this.props.chat.chatmsg.forEach(v => {
      msgGroup[v.chatid] = msgGroup[v.chatid] || []
      msgGroup[v.chatid].push(v)
    })
    const chatList = Object.values(msgGroup).sort((a,b) => {
      const a_last = this.getLast(a).create_time
      const b_last = this.getLast(b).create_time
      return b_last - a_last;
    })
    // eslint代码校验工具
    // react16特有的错误处理机制
    // react性能优化机制

    return (
      <div>
        {chatList.map(v => {
          const lastItem = this.getLast(v)
          const targetId = v[0].from === userid ? v[0].to : v[0].from
          const unreadNum = v.filter(v => !v.read && v.to===userid).length
          if (!userinfo[targetId]) {
            return null
          }
          // const name = userinfo[targetId] ? userinfo[targetId].name : ''
          // const avatar = userinfo[targetId] ? userinfo[targetId].avatar : ''
          return (
            <List  key={lastItem._id}>
              <Item
                style = {{zIndex: 88}}
                extra = {<Badge text={unreadNum}></Badge>}
                thumb={require(`../img/${userinfo[targetId].avatar}.png`)}
                arrow='horizontal'
                onClick = { () => {
                  this.props.history.push(`/chat/${targetId}`)
                }}
              >
                {lastItem.content}
                <Brief>{userinfo[targetId].name}</Brief>
              </Item>
            </List>
          )
        })}
      </div>
    )
  }
}

export default Msg
