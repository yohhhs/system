<template>
  <div class="login">
    <h1 class="name">教育部数据采集系统</h1>
    <h2 class="title">用户登录</h2>
    <Input class="input" v-model="tel" type="text" size="large" placeholder="请输入手机号"></Input> <Input class="input"
    @on-enter="userLogin" v-model="pwd" type="password" size="large" placeholder="请输入密码"></Input>
    <div class="vali">
      <Input class="vali-input" v-model="vali" type="text" size="large" placeholder="请输入验证码"></Input> <img
      class="vali-img" :src="picCode" @click="changeCode">
    </div>
    <Button style="height:36px" type="primary" :loading="loginLoading" :long="true" @click="userLogin">
      <span v-if="!loginLoading">登录</span> <span v-else>Loading...</span>
    </Button>
    <div class="footer">
      <span @mouseover="isLeft" @click='loginToForget'>忘记密码</span> <span class="right" @mouseover="isRight"
      @click='loginToRegister'>立即注册</span>
    </div>
  </div>
</template>
<script>
  import md5 from 'js-md5'
  import Vue from 'vue'
  import rule from 'config/rule'

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
    components: {},
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
          this.loginLoading = true
          if (returnData.returnCode == 200) {
            if (returnData.data.memberType === '639052bf032545f381231c38b6ecf39c' && !returnData.data.permissions) {
              Vue.prototype.userInfo = {
                authList: rule.initRule
              }
            } else {
              let permissions = JSON.parse(returnData.data.permissions)
              let dictionary = returnData.data.dictionary
              permissions.forEach(item => {
                dictionary.forEach(dic => {
                  if (item.code === dic.code) {
                    return (item.codeValue = dic.codeValue)
                  }
                })
                if (item.children) {
                  item.children.forEach(child => {
                    dictionary.forEach(dic => {
                      if (child.code === dic.code) {
                        return (child.codeValue = dic.codeValue)
                      }
                    })
                  })
                }
              })
              Vue.prototype.userInfo = {
                authList: permissions
              }
            }
            this.$emit('login')
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
        this.$emit('loginToRegister')
      },
      loginToForget () {
        this.$emit('loginToForget')
      },
      isLeft () {
        this.$emit('isLeft')
      },
      isRight () {
        this.$emit('isRight')
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .login {
    position: relative;
    padding: 20px;
    width: 350px;
    border-radius: 3px;
    box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, 1);

    .name {
      position: absolute;
      top: -100px;
      left: 0;
      width: 100%;
      font-size: 32px;
      text-align: center;
      color: #ffffff;
    }

    .title {
      margin-bottom: 30px;
      text-align: center;
      color: #000000;
    }

    .input, .vali {
      margin-bottom: 18px;
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

      span {
        cursor: pointer;
      }

      .right {
        float: right;
      }
    }
  }
</style>
