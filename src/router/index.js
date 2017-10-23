import Vue from 'vue'
import Router from 'vue-router'
import { checkRule } from 'common/js/util'

Vue.use(Router)

const Admin = ((resolve) => {
  import ('cps/admin/admin').then((admin) => {
    resolve(admin)
  })
})
const Login = ((resolve) => {
  import ('cps/login/login').then((login) => {
    resolve(login)
  })
})
const Register = ((resolve) => {
  import ('cps/register/register').then((register) => {
    resolve(register)
  })
})
const Layout = ((resolve) => {
  import ('cps/layout/layout').then((layout) => {
    resolve(layout)
  })
})
const Myinfo = ((resolve) => {
  import ('cps/myinfo/myinfo').then((myinfo) => {
    resolve(myinfo)
  })
})
const Notice = ((resolve) => {
  import ('cps/notice/notice').then((notice) => {
    resolve(notice)
  })
})
const VideoManager = ((resolve) => {
  import ('cps/videomanager/videomanager').then((videomanager) => {
    resolve(videomanager)
  })
})
const AuthManager = ((resolve) => {
  import ('cps/authmanager/authmanager').then((authmanager) => {
    resolve(authmanager)
  })
})
const SchoolSetting = ((resolve) => {
  import ('cps/schoolsetting/schoolsetting').then((schoolsetting) => {
    resolve(schoolsetting)
  })
})
const SchoolMember = ((resolve) => {
  import ('cps/schoolmember/schoolmember').then((schoolmember) => {
    resolve(schoolmember)
  })
})
const ExpertMember = ((resolve) => {
  import ('cps/expertmember/expertmember').then((expertmember) => {
    resolve(expertmember)
  })
})
const AuthAllot = ((resolve) => {
  import ('cps/authallot/authallot').then((authallot) => {
    resolve(authallot)
  })
})

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/admin'
  },
    {
      path: '*',
      redirect: '/admin'
    },
    {
      path: '/admin',
      component: Admin
    },
    {
      path: '/main',
      component: Layout,
      children: [{
        path: 'myinfo',
        component: Myinfo,
        meta: {auth: true}
      }, {
        path: 'videomanager',
        component: VideoManager,
        meta: {auth: true}
      }, {
        path: 'schoolsetting',
        component: SchoolSetting,
        meta: {auth: true}
      }, {
        path: 'notice',
        component: Notice,
        meta: {auth: true}
      }, {
        path: 'authmanager',
        component: AuthManager,
        meta: {auth: true}
      }, {
        path: 'schoolmember',
        component: SchoolMember,
        meta: {auth: true}
      }, {
        path: 'expertmember',
        component: ExpertMember,
        meta: {auth: true}
      }, {
        path: 'authallot',
        component: AuthAllot,
        meta: {auth: true}
      }]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/admin' || to.path === '/' || to.path === '*') {
    next()
  } else if (to.path === '/main') {
    next({path: '/admin'})
  } else {
    if (from.path === '/') {
      next({path: '/admin'})
    } else if (to.meta && to.meta.auth) {
      if (checkRule(to.path)) {
        next()
      } else {
        next({path: '/admin'})
      }
    }
  }
})

export default router
