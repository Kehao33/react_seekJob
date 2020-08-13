import React, { Component } from 'react'
import { List, InputItem, NavBar, Icon, Grid } from 'antd-mobile'
// import io from 'socket.io-client'
import { connect } from 'react-redux'
import { getMsgList, sendMsg, readMsg, recvMsg } from '../../redux/chat.redux'
import { getChatId } from '../../util'
import QueueAnim from 'rc-queue-anim'

// const socket = io('ws://localhost:9093')
@connect(state => state, { getMsgList, sendMsg, readMsg, recvMsg })
class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = { text: '', msg: [] }
  }
  componentDidMount() {
    if (!this.props.chat.chatmsg.length) {
      this.props.getMsgList()
      this.props.recvMsg()
    }
    // 发送已读的信息
  }
  componentWillUnmount() {
    const to = this.props.match.params.user
    // 当前用户已经读取了信息
    this.props.readMsg(to)
  }
  // 这个函数的作用是修复antd-mobile中的表情显示不正确的bug
  fixCarousel() {
    setTimeout(function() {
      window.dispatchEvent(new Event('resize'))
    })
  }
  handleSubmit() {
    // socket.emit('sendmsg', { text: this.state.text })
    // this.setState({ text: '' })
    const from = this.props.user._id
    // to 在url中
    const to = this.props.match.params.user
    const msg = this.state.text
    this.props.sendMsg({ from, to, msg })
    this.setState({ text: '', showEmoji: false })
  }
  render() {
    const emoji = '🤷 😃 🐻 🍔 ⚽ 😀 👨 🙋 😀 😁 😂 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 😗 😙 😚 ☺ 😇 😐 😑 😶 😏 😣 😥 😮 😯 😪 😫 😴 😌 😛 😜 😝 😒 😓 😔 😕 😲 😷 😖 😞 😟 😤 😢 😭 😦 😧 😨 😬 😰 😱 😳 😵 😡 😠 👦 👧 👨 👩 👴 👵 👶 👱 👮 👲 👳 👷 👸 💂 🎅 👰 👼 💆 💇 🙍 🙎 🙅 🙆 💁 🙋 🙇 🙌 🙏 👤 👥 🚶 🏃 👯 💃 👫 👬 👭 💏 💑 👪'
      .split(' ')
      .filter(v => v)
      .map(v => ({
        text: v
      }))
    const userid = this.props.match.params.user
    const Item = List.Item
    const users = this.props.chat.users
    const chatid = getChatId(userid, this.props.user._id)
    const chatmsgs = this.props.chat.chatmsg.filter(v => v.chatid === chatid)
    if (!users[userid]) {
      return null
    }
    return (
      <div id="chat-page">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.goBack()
          }}
        >
          {users[userid].name}
        </NavBar>
      <QueueAnim delay={100} type="scale">
        {chatmsgs.map(v => {
          const avatar = require(`../img/${users[v.from].avatar}.png`)
          return v.from === userid ? (
            <List key={v._id}>
              <Item thumb={avatar}>{v.content}</Item>
            </List>
          ) : (
            <List key={v._id}>
              <Item extra={<img src={avatar} alt="头像" />} className="chat-me">
                {v.content}
              </Item>
            </List>
          )
        })}
      </QueueAnim>
        <div className="stick-footer">
          <List>
            <InputItem
              placeholder="请输入你要发送的信息"
              value={this.state.text}
              onChange={v => {
                this.setState({ text: v })
              }}
              extra={
                <div>
                  <span
                    role="img"
                    aria-label=""
                    style={{ marginRight: 15 }}
                    onClick={() => {
                      this.setState({
                        showEmoji: !this.state.showEmoji
                      })
                      this.fixCarousel()
                    }}
                  >
                    ➕
                  </span>
                  <span onClick={() => this.handleSubmit()}>发送</span>
                </div>
              }
            ></InputItem>
          </List>
          {this.state.showEmoji ? (
            <Grid
              data={emoji}
              columnNum={9}
              carouselMaxRow={4}
              isCarousel={true}
              onClick={el => {
                this.setState({
                  text: this.state.text + el.text
                })
              }}
            />
          ) : null}
        </div>
      </div>
    )
  }
}

export default Chat
