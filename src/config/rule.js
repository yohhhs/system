import {getUid} from 'common/js/util'

export default {
  locaRule: [{
    code: getUid(),
    codeValue: '系统菜单',
    lookAuth: true,
    children: [{
      code: getUid(),
      codeValue: '权限管理',
      lookAuth: true,
      route: '/main/authallot'
    }]
  }],
  initRule: [{
    code: getUid(),
    codeValue: '系统菜单',
    lookAuth: true,
    children: [{
      code: getUid(),
      codeValue: '权限管理',
      lookAuth: true,
      route: '/main/authallot'
    }, {
      code: getUid(),
      codeValue: '字典管理',
      lookAuth: false,
      route: '/main/dictionary'
    }, {
      code: getUid(),
      codeValue: '账户管理',
      lookAuth: false,
      route: '/main/accountmanager',
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
        name: '启用',
        turn: true
      }, {
        name: '禁用',
        turn: true
      }]
    }, {
      code: getUid(),
      codeValue: '角色管理',
      lookAuth: false,
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
    code: getUid(),
    codeValue: '视频管理',
    lookAuth: false,
    children: [{
      code: getUid(),
      codeValue: '视频管理',
      lookAuth: false,
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
        name: '下载',
        turn: true
      }]
    }]
  }, {
    code: getUid(),
    codeValue: '我的信息',
    lookAuth: false,
    children: [{
      code: getUid(),
      codeValue: '个人信息',
      lookAuth: false,
      route: '/main/myinfo'
    }]
  }, {
    code: getUid(),
    codeValue: '通知公告',
    lookAuth: false,
    children: [{
      code: getUid(),
      codeValue: '通知公告',
      lookAuth: false,
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
        name: '启用',
        turn: true
      }, {
        name: '禁用',
        turn: true
      }]
    }]
  }, {
    code: getUid(),
    codeValue: '基础设置',
    lookAuth: false,
    children: [{
      code: getUid(),
      codeValue: '学校设置',
      lookAuth: false,
      route: '/main/schoolsetting',
      handles: [{
        name: '添加',
        turn: true
      }, {
        name: '编辑',
        turn: true
      }]
    }]
  }, {
    code: getUid(),
    codeValue: '会员管理',
    lookAuth: false,
    children: [{
      code: getUid(),
      codeValue: '学校会员',
      lookAuth: false,
      route: '/main/schoolmember',
      handles: [{
        name: '编辑',
        turn: true
      }, {
        name: '启用',
        turn: true
      }, {
        name: '禁用',
        turn: true
      }, {
        name: '审核',
        turn: true
      }, {
        name: '未审核',
        turn: true
      }]
    }, {
      code: getUid(),
      codeValue: '专家会员',
      lookAuth: false,
      route: '/main/expertmember',
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
  }]
}
