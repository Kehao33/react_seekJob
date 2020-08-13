import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { loadData } from '../../redux/user.redux';
import { connect } from 'react-redux';

@withRouter //@withRouter的作用是是普通的组件都拥有history属性
@connect(
  // @connect要放在@withRouter里边
  null,
  { loadData }
)
class AuthRoute extends Component {
  async componentDidMount() {
    const publicList = ['/login', '/register'];
    const pathname = this.props.location.pathname;
    // 如果是登录，或者注册页面了，就返回null
    if (publicList.indexOf(pathname) > -1) {
      return null;
    }
    // 获取用户信息
    const res = await axios.get('/user/info');
    if (res.status === 200) {
      if (res.data.code === 0) {
        // 有登录信息,加载用户的数据
        this.props.loadData(res.data.data);
      } else {
        this.props.history.push('/login');
      }
    }

    // 是否登录，现在的url地址，login是不需要跳转的
    // 用户的type 身份是boss还是牛人
    // 用户是否完善信息（选择头像，个人简介）
  }

  render() {
    return null;
  }
}

export default AuthRoute;
