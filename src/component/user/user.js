import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Result, List, WhiteSpace, Modal } from 'antd-mobile'
import browserCookie from 'browser-cookies'
import { logoutSubmit } from '../../redux/user.redux'
import {Redirect} from 'react-router-dom'

@connect(state => state.user, { logoutSubmit })
class User extends Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
  }
  logout() {
    const alert = Modal.alert
    alert('退出', '确定退出吗???', [
      { text: '取消', onPress: () => console.log('cancel') },
      {
        text: '确认',
        onPress: () => {
          browserCookie.erase('userid')
          this.props.logoutSubmit()
        }
      }
    ])
  }
  render() {
    const props = this.props
    const Item = List.Item
    const Brief = Item.Brief
    return props.user ? (
      <Fragment>
        <Result
          img={<img src={require(`../img/${props.avatar}.png`)} alt="img" />}
          title={props.user}
          message={props.type === 'boss' ? props.company : null}
        />
        <List renderHeader={() => '简介'}>
          <Item multipleLine>
            {props.title}
            {this.props.desc.split('\n').map(v => (
              <Brief key={v}>{v}</Brief>
            ))}
            {props.money ? <Brief>薪资: {props.money}</Brief> : null}
          </Item>
        </List>
        <WhiteSpace />
        <List>
          <Item onClick={this.logout} style={{ zIndex: 9 }}>
            退出登录
          </Item>
        </List>
      </Fragment>
    ) : <Redirect to={props.redirectTo}/>
  }
}

export default User