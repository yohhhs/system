import Vue from 'vue'

export function ruleTree (value) {
  let len = arguments.length
  let authListString = JSON.stringify(Vue.prototype.userInfo.authList)
  let authList = JSON.parse(authListString)
  if (len) {
    authList.forEach(item => {
      item.lookAuth = value
      item.children.forEach(child => {
        child.lookAuth = value
      })
    })
  }
  return authList
}

export function getUid () {
  const len = 9
  const radix = 16
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  let i
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

export function checkRule (path) {
  let authList = Vue.prototype.userInfo.authList
  if (authList) {
    var auth
    authList.forEach(function (item) {
      item.children.forEach(function (child) {
        if (child.route === path) {
          auth = child.lookAuth
        }
      })
    })
    return auth
  } else {
    return false
  }
}

export function contactRule (roleTree, dictionary, lookAuth) {
  let leng = arguments.length
  roleTree.forEach(item => {
    if (leng === 3) {
      item.lookAuth = lookAuth
    }
    dictionary.forEach(dic => {
      if (item.code === dic.code) {
        item.codeValue = dic.codeValue
      }
    })
    if (item.children) {
      item.children.forEach(child => {
        if (leng === 3) {
          child.lookAuth = lookAuth
        }
        dictionary.forEach(dic => {
          if (child.code === dic.code) {
            child.codeValue = dic.codeValue
          }
        })
      })
    }
  })
  return roleTree
}

export function getTime (UnixTime) {
  var a = UnixTime.replace('/Date(', '').replace(')/', '')
  var date = new Date(parseInt(a))
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  var h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  var minute = date.getMinutes()
  var second = date.getSeconds()
  minute = minute < 10 ? ('0' + minute) : minute
  second = second < 10 ? ('0' + second) : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}
