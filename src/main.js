import Vue from 'vue';
import App from './App';
import router from './router';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import 'babel-polyfill';
import VueParticles from 'vue-particles'

import './common/less/theme.less';

Vue.config.productionTip = false

Vue.use(iView)
Vue.use(VueParticles)
Vue.prototype.userInfo = {
  authList: [{
    code: '111',
    codeValue: '视频管理',
    name: '视频管理',
    lookAuth: true,
    children: [{
      name: '视频管理',
      lookAuth: true,
      route: '/main/videomanager',
      handles: [{
        name: '添加',
        turn: true
      }, {
        name: '编辑',
        turn: true
      }, {
        name: '删除',
        turn: true
      }, {
        name: '查看',
        turn: true
      }, {
        name: '下载',
        turn: true
      }]
    }]
  }, {
    name: '我的信息',
    lookAuth: true,
    children: [{
      name: '个人信息',
      lookAuth: true,
      route: '/main/myinfo'
    }]
  }, {
    name: '通知公告',
    lookAuth: true,
    children: [{
      name: '通知公告',
      lookAuth: true,
      route: '/main/notice',
      handles: [{
        name: '添加',
        turn: true
      }, {
        name: '编辑',
        turn: true
      }, {
        name: '删除',
        turn: true
      }, {
        name: '启用/禁用',
        turn: true
      }]
    }]
  }, {
    name: '基础设置',
    lookAuth: true,
    children: [{
      name: '学校设置',
      lookAuth: true,
      route: '/main/schoolsetting',
      handles: [{
        name: '添加',
        turn: true
      }, {
        name: '编辑',
        turn: true
      }, {
        name: '删除',
        turn: true
      }]
    }]
  }, {
    name: '系统菜单',
    lookAuth: true,
    children: [{
      name: '角色管理',
      lookAuth: true,
      route: '/main/authmanager',
      handles: [{
        name: '添加',
        turn: true
      }, {
        name: '编辑',
        turn: true
      }, {
        name: '删除',
        turn: true
      }]
    }]
  }, {
    name: '会员管理',
    lookAuth: true,
    children: [{
      name: '学校信息',
      lookAuth: true,
      route: '/main/schoolmember'
    }, {
      name: '专家信息',
      lookAuth: true,
      route: '/main/expertmember'
    }]
  }]
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
