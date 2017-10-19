<template>
    <div class="register">
        <h1 class="name">教育部数据采集系统</h1>
        <h2 class="title">学校注册</h2>
        <Input class="input" v-model="tel" type="text" size="large" placeholder="请输入手机号"></Input>
        <Input class="input" @on-enter="userLogin" v-model="pwd" type="password" size="large" placeholder="请输入密码"></Input>
        <Input class="input" @on-enter="userLogin" v-model="pwd" type="password" size="large" placeholder="请再次输入密码"></Input>
        <Input class="input" @on-enter="userLogin" v-model="pwd" type="text" size="large" placeholder="姓名"></Input>
        <Input class="input" @on-enter="userLogin" v-model="pwd" type="text" size="large" placeholder="职务"></Input>
        <div class="vali">
            <Input class="vali-input" v-model="vali" type="text" size="large" placeholder="短信验证码"></Input>
            <Button  class="vali-right" type="primary" :loading="sendLoading" @click="userLogin">
              <span v-if="!sendLoading">发送验证码</span>
              <span v-else>Loading...</span>
          </Button>
        </div>
        <div class="vali" v-if="errNum">
            <Input class="vali-input" v-model="vali" type="text" size="large" placeholder="请输入验证码"></Input>
            <img class="vali-right" src="//fakeimg.pl/80x36">
        </div>
        <Button style="height:36px" type="primary" :loading="loginLoading" :long="true" @click="userLogin">
            <span v-if="!loginLoading">注册</span>
            <span v-else>Loading...</span>
        </Button>
        <div class="footer">
            <span @click='registerToLogin'>立即登录</span>
        </div>
    </div>
</template>
<script>
import md5 from 'js-md5'
export default {
    data() {
        return {
            tel: '',
            pwd: '',
            vali: '',
            loginLoading: false,
            sendLoading: false,
            errNum: 0
        }
    },
    components: {

    },
    methods: {
        userLogin() {
            let tel = this.tel.trim()
            let pwd = this.pwd.trim()
            if (tel === '') {
                return this.error('手机号不能为空')
            }
            if (pwd === '') {
                return this.error('密码不能为空')
            }
            if (!(/^1[34578]\d{9}$/.test(tel))) {
                return this.error('请输入正确的手机号')
            }
            if (!(/^[a-zA-Z0-9]{6,16}$/.test(pwd))) {
                return this.error('密码格式不正确')
            }
            this.userInfo.name = 'zz'
            this.$emit('login')
        },
        error(info) {
            this.$Notice.error({
                title: info,
                duration: 1.5
            });
        },
        registerToLogin() {
          this.$emit('registerToLogin')
        }
    }
}
</script>
<style lang="stylus" scoped>
    .register {
        position: relative;
        padding: 20px;
        width: 350px;
        border-radius: 3px;
        box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.1);
        background-color: rgba(255, 255, 255, 0.8);
        .name {
            position: absolute
            top: 50%
            left: -120%
            width: 100%
            text-align: center
            color: #ffffff
            font-size: 32px
            transform: translateY(-50%)
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

            .vali-right {
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
        }
    }
</style>