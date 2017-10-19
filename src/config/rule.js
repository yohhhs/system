export default {
    rule: [{
        name: '系统菜单',
        lookAuth: true,
        children: [{
          name: '权限管理',
          lookAuth: true,
          route: '/main/authallot'
        }]
    }]
}
