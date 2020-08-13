import React, { Component } from 'react'
import Logo from '../../component/logo/logo'
import {
  List,
  InputItem,
  Radio,
  WhiteSpace,
  Button
} from 'antd-mobile'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import {register} from '../../redux/user.redux'
import decForm from '../../component/dec-form/dec-form'

@connect(
  state => state.user,
  {register}
)

@decForm
class Register extends Component {
  constructor(props) {
    super(props)
    this.handleRegister = this.handleRegister.bind(this)
  }
  componentDidMount() {
    this.props.handleChange('type','genius')
  }
  handleRegister() {
    this.props.register(this.props.state)
  }
  render() {
    const RadioItem = Radio.RadioItem
    return (
      <div>
      {this.props.redirectTo?<Redirect to={this.props.redirectTo}/>:null}
        <Logo></Logo>
        <List>
          {this.props.msg?<p className='error-msg'>{this.props.msg}</p>:null}
          <InputItem onChange={v=>this.props.handleChange('user', v)}>用户名</InputItem>
          <WhiteSpace />
          <InputItem onChange={v=>this.props.handleChange('pwd', v)} type="password">密码</InputItem>
          <WhiteSpace />
          <InputItem  onChange={v=>this.props.handleChange('repeatpwd', v)} type="password">确定密码</InputItem>
          <WhiteSpace />
          <RadioItem checked={this.props.state.type === 'genius'} onChange= {() => this.props.handleChange('type', 'genius')}>牛人</RadioItem>
          <WhiteSpace />
          <RadioItem checked={this.props.state.type === 'boss'} onChange={() => this.props.handleChange('type', 'boss')}>老板</RadioItem>
          <Button type="primary" onClick = {this.handleRegister}>注册</Button>
        </List>
      </div>
    )
  }
}

export default Register