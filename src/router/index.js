import Vue from 'vue'
import Router from 'vue-router'
import { checkRule } from 'common/js/util'

Vue.use(Router)

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
const ForgetPwd = ((resolve) => {
  import ('cps/forgetpwd/forgetpwd').then((forgetpwd) => {
    resolve(forgetpwd)
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
const Dictionary = ((resolve) => {
  import ('cps/dictionary/dictionary').then((dictionary) => {
    resolve(dictionary)
  })
})
const Account = ((resolve) => {
  import ('cps/accountmanager/accountmanager').then((accountmanager) => {
    resolve(accountmanager)
  })
})

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  },
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/resetpass',
      component: ForgetPwd
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
      }, {
        path: 'dictionary',
        component: Dictionary,
        meta: {auth: true}
      }, {
        path: 'accountmanager',
        component: Account,
        meta: {auth: true}
      }]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/' || to.path === '*' || to.path === '/register' || to.path === '/resetpass') {
    next()
  } else if (to.path === '/main') {
    next({path: '/login'})
  } else {
    if (from.path === '/') {
      next({path: '/login'})
    } else if (to.meta && to.meta.auth) {
      if (checkRule(to.path)) {
        next()
      } else {
        next({path: '/login'})
      }
    }
  }
})

export default router
