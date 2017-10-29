<template>
  <div class="login">
    <div class="login-wrapper">
      <h2 class="title">用户登录</h2>
      <div class="input-wrappper">
          <Input class="input" style="border: none;" v-model="tel" type="text" size="large" placeholder="请输入手机号"></Input> <Input class="input"
          @on-enter="userLogin" v-model="pwd" type="password" size="large" placeholder="请输入密码"></Input>
          <div class="vali">
            <Input class="vali-input" v-model="vali" type="text" size="large" placeholder="请输入验证码"></Input> <img
            class="vali-img" :src="picCode" @click="changeCode">
          </div>
          <Button style="height:36px" type="primary" :loading="loginLoading" :long="true" @click="userLogin">
            <span v-if="!loginLoading">登录</span> <span v-else>Loading...</span>
          </Button>
          <div class="footer">
            <span @click='loginToForget'>忘记密码</span> 
            <span class="right" @click='loginToRegister'>立即注册</span>
          </div>
      </div>
    </div>
    <admin></admin>
  </div>
</template>
<script>
  import md5 from 'js-md5'
  import Vue from 'vue'
  import rule from 'config/rule'
  import {contactRule} from 'common/js/util'
  import Admin from 'cps/admin/admin'

  export default {
    data () {
      return {
        tel: '13500000001',
        pwd: '123456',
        vali: '',
        loginLoading: false,
        errNum: 0,
        isLoginPage: true,
        picCode: ''
      }
    },
    components: {
      Admin
    },
    created () {
      this.getPicCode()
    },
    methods: {
      getPicCode () {
        this.$http.post('/code/getAuthcode').then(res => {
          if (res.data.returnCode == 200) {
            this.picCode = res.data.data
          }
        })
      },
      changeCode () {
        this.getPicCode()
      },
      userLogin () {
        let tel = this.tel.trim()
        let pwd = this.pwd.trim()
        let code = this.vali
        if (tel === '') {
          return this.error('手机号不能为空')
        }
        if (pwd === '') {
          return this.error('密码不能为空')
        }
        if (code === '') {
          return this.error('验证码不能为空')
        }
        if (!(/^1[34578]\d{9}$/.test(tel))) {
          return this.error('请输入正确的手机号')
        }
        if (!(/^[a-zA-Z0-9]{6,16}$/.test(pwd))) {
          return this.error('密码格式不正确')
        }
        this.loginLoading = true
        this.$http.post('/login/login', {
          phone: tel,
          password: md5(pwd),
          code: code
        }).then(res => {
          let returnData = res.data
          this.loginLoading = false
          if (returnData.returnCode == 200) {
            if (returnData.data.memberType === '639052bf032545f381231c38b6ecf39c' && !returnData.data.permissions) {
              Vue.prototype.userInfo = {
                authList: rule.initRule
              }
            } else {
              let permissions = contactRule(JSON.parse(returnData.data.permissions), returnData.data.dictionary)
              Vue.prototype.userInfo = {
                authList: permissions
              }
            }
            window.sessionStorage.setItem('tel', tel)
            let path = this.userInfo.authList[0].children[0].route
            this.$router.push({
                path: path
            })
          } else {
            this.error(returnData.message)
          }
        }).catch(res => {
          this.loginLoading = false
        })
      },
      error (info) {
        this.$Notice.error({
          title: info,
          duration: 1.5
        })
      },
      loginToRegister () {
        this.$router.push({
          path: '/register'
        })
      },
      loginToForget () {
        this.$router.push({
          path: '/resetpass'
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .login {
    .login-wrapper {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -60%);
      width: 400px;
      border-radius: 10px;
      background-color: rgba(54, 77, 236, .4);
      z-index: 99
    }
    .title {
      margin-bottom: 30px
      line-height: 55px;
      text-align: center;
      color: #fff;
      font-weight 100
      border-bottom: 3px solid #fff
    }
    .input-wrappper {
      padding: 0 30px 20px
    }
    .input, .vali {
      margin-bottom: 18px;
    }
    .ivu-input, .ivu-select-selection {
      border: none
    }
    .vali {
      display: flex;
      justify-content: space-between;

      .vali-input {
        width: 180px;
      }

      .vali-img {
        width: 100px;
        height: 36px;
        cursor: pointer;
      }
    }

    .footer {
      margin-top: 25px;
      color: #fff
      span {
        cursor: pointer;
      }

      .right {
        float: right;
      }
    }
  }
</style>
