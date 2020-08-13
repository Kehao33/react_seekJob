export function getRedirectPath({ type, avatar }) {
  //  根据用户信息，返回跳转地址
  // user.type /boss /genius 根据type来跳转页面
  // user.avatar /bossinfo /geniusinfo  根据头像来判断跳转到那个信息段
  let url = type === 'boss' ? '/boss' : '/genius'
  if (!avatar) {
    url += 'info'
  }
  return url
}

export function getChatId(userId, targetId) {
  return [userId, targetId].sort().join('_')
}
