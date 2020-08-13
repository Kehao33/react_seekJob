import axios from 'axios'

import { getRedirectPath } from '../util'

const ERROR_MSG = 'ERROR_MSG'
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const LOAD_DATA = 'LOAD_DATA'
const LOGOUT = 'LOGOUT'

const initState = {
  redirectTo: '',
  msg: '',
  user: '',
  type: ''
}
//reducer
export function user(state = initState, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        msg: '',
        redirectTo: getRedirectPath(action.payload),
        ...action.payload
      }
    case LOAD_DATA:
      return { ...state, ...action.payload }
    case ERROR_MSG:
      return { ...state, isAuth: false, msg: action.msg }
    case LOGOUT:
      return { ...initState, redirectTo: '/login' }
    default:
      return state
  }
}

function authSuccess(obj) {
  const { pwd, ...data } = obj
  return { type: AUTH_SUCCESS, payload: data }
}

function errorMsg(msg) {
  return { msg, type: ERROR_MSG }
}

export function loadData(userinfo) {
  return { type: LOAD_DATA, payload: userinfo }
}

export function logoutSubmit() {
  return { type: LOGOUT }
}

export function userinfo() {
  // 获取用户信息

  axios.get('/user/info').then(res => {
    if (res.status === 200) {
      if (res.data.code === 0) {
        // 有登录信息
      } else {
        this.props.loadData(res.data.data)
        this.props.history.push('/login')
      }
    }
  })
  // 是否登录，现在的url地址，login是不需要跳转的
  // 用户的type 身份是boss还是牛人
  // 用户是否完善信息（选择头像，个人简介）
}

export function update(data) {
  return async dispatch => {
    const res = await axios.post('/user/update', data)
    if (res.status === 200 && res.data.code === 0) {
      dispatch(authSuccess(res.data.data))
    } else {
      dispatch(errorMsg(res.data.msg))
    }
  }
}

export function login({ user, pwd }) {
  if (!user || !pwd) {
    return errorMsg('用户名必须输入')
  }
  return async dispatch => {
    const res = await axios.post('/user/login', { user, pwd })
    if (res.status === 200 && res.data.code === 0) {
      dispatch(authSuccess(res.data.data))
    } else {
      dispatch(errorMsg(res.data.msg))
    }
  }
}
export function register({ user, pwd, repeatpwd, type }) {
  if (!user || !pwd || !type) {
    return errorMsg('用户名密码必须输入')
  }
  if (pwd !== repeatpwd) {
    return errorMsg('密码前后不一致')
  }

  return async dispatch => {
    const res = await axios.post('/user/register', { user, pwd, type })
    if (res.status === 200 && res.data.code === 0) {
      dispatch(authSuccess({ user, pwd, type }))
    } else {
      dispatch(errorMsg(res.data.msg))
    }
  }
}
