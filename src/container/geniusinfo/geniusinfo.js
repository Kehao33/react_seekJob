import React, { Component } from 'react'
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import AvatarSelector from '../../component/avatar-selector/avatar-selector'
import { update } from '../../redux/user.redux'

@connect(state => state.user, { update })
class GeniusInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      desc: ''
    }
  }
  onChange(key, val) {
    this.setState({
      [key]: val
    })
  }
  render() {
    const path = this.props.location.pathname
    const redirect = this.props.redirectTo
    return (
      <div>
        {redirect && redirect !== path ? (
          <Redirect to={redirect}></Redirect>
        ) : null}
        <NavBar mode="dark">牛人完善信息页面</NavBar>
        <AvatarSelector
          selectAvatar={imgname => {
            this.setState({
              avatar: imgname
            })
          }}
        ></AvatarSelector>
        <InputItem onChange={v => this.onChange('title', v)}>
          求职岗位
        </InputItem>
        <TextareaItem
          title="个人简介"
          placeholder="如,熟悉react.js,vue.js等"
          autoHeight
          rows={3}
          onChange={v => this.onChange('desc', v)}
        />
        <Button
          type="primary"
          onClick={() => {
            this.props.update(this.state)
          }}
        >
          保存
        </Button>
      </div>
    )
  }
}

export default GeniusInfo
