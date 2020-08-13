import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import Login from './container/login/login'
import Register from './container/register/register'
import AuthRoute from './component/authroute/authroute'
import BossInfo from './container/bossinfo/bossinfo'
import Geniusinfo from './container/geniusinfo/geniusinfo'
import Dashboard from './component/dashboard/dashboard'
import Chat from './component/chat/chat'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false
    }
  }

  componentDidCatch(err, info) {
    // console.log('err: ', err, ' info ', info);
    this.setState({
      hasError: true
    })
  }

  render() {
    return this.state.hasError ? <img className='error-container' src={require('./error.png')} alt="页面出错了" />
    :(
      <div>
        <AuthRoute></AuthRoute>
        <Switch>
          <Route path="/bossinfo" component={BossInfo}></Route>
          <Route path="/geniusinfo" component={Geniusinfo}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/register" component={Register}></Route>
          <Route path="/chat/:user" component={Chat}></Route>
          {/* 没有path的时候，所有的路由都会匹配掉 */}
          {/* <Route exact path="/" render={() => <Redirect to="/login" push />} /> */}
          <Route component={Dashboard}></Route>
        </Switch>
      </div>
    )
  }
}

export default App
