<template>
    <div class="forgetpwd">
        <div class="forgetpwd-wrapper">
            <h2 class="title">忘记密码</h2>
            <div class="input-wrapper">
                <Input class="input" v-model="tel" type="text" size="large" placeholder="请输入手机号"></Input>
                <Input class="input" v-model="pwd" type="password" size="large" placeholder="请输入新密码"></Input>
                <Input class="input" v-model="repwd" type="password" size="large" placeholder="请再次输入新密码"></Input>
                <div class="vali">
                    <Input class="vali-input" v-model="vali" type="text" size="large" placeholder="请输入验证码"></Input>
                    <img class="vali-right" :src="picCode" @click='changePicCode'>
                </div>
                <div class="vali">
                    <Input class="vali-input" v-model="phoneCode" type="text" size="large" placeholder="短信验证码"></Input>
                    <Button  class="vali-right" type="primary" :loading="sendLoading" @click="getMobleCode">
                    <span v-if="!sendLoading">发送验证码</span>
                    <span v-else>Loading...</span>
                </Button>
                </div>
                <Button style="height:36px" type="primary" :loading="loginLoading" :long="true" @click="changePwd">
                    <span v-if="!loginLoading">重置密码</span>
                    <span v-else>Loading...</span>
                </Button>
                <div class="footer">
                    <span @click='forgetToLogin'>立即登录</span>
                </div>
            </div>
        </div>
        <admin></admin>
    </div>
</template>
<script>
import md5 from 'js-md5'
import Admin from 'cps/admin/admin'
export default {
    data() {
        return {
            tel: '',
            pwd: '',
            repwd: '',
            vali: '',
            phoneCode: '',
            loginLoading: false,
            sendLoading: false,
            errNum: 0,
            picCode: ''
        }
    },
    created() {
        this.getPicCode()
    },
    components: {
        Admin
    },
    methods: {
        changePwd() {
            let phone = this.tel.trim()
            let password = this.pwd.trim()
            let rePassword = this.repwd.trim()
            let picCode = this.vali.trim()
            let mobleCode = this.phoneCode.trim()
            if (phone === '') {
                return this.error('手机号不能为空')
            }
            if (password === '') {
                return this.error('密码不能为空')
            }
            if (!(/^1[34578]\d{9}$/.test(phone))) {
                return this.error('请输入正确的手机号')
            }
            if (!(/^[a-zA-Z0-9]{6,16}$/.test(password))) {
                return this.error('密码格式不正确')
            }
            if (picCode === '') {
                return this.error('图片验证码不能为空')
            }
            if (mobleCode === '') {
                return this.error('手机验证码不能为空')
            }
            if (password !== rePassword) {
                return this.error('两次密码不一致')
            }
            this.$http.post('/login/forgetPassWord',{
                phone,
                password: md5(password),
                rePassword: md5(rePassword),
                mobleCode,
                picCode
            }).then(res => {
                if (res.data.returnCode == 200) {
                    this.success('重置密码成功')
                } else {
                    this.error(res.data.message)
                }
            })
        },
        error(info) {
            this.$Notice.error({
                title: info,
                duration: 1.5
            });
        },
        success(info) {
            this.$Notice.success({
                title: info,
                duration: 1.5
            });
        },
        forgetToLogin() {
            this.$router.push({
                path: '/login'
            })
        },
        resetPwd() {},
        getMobleCode() {
            let phone = this.tel.trim()
            let picCode = this.vali
            if (phone === '') {
                return this.error('手机号不能为空')
            }
            if (picCode === '') {
                return this.error('图片验证码不能为空')
            }
            this.$http.post('/code/phoneCode',{
                picCode,
                phone
            }).then(res => {
                if (res.data.returnCode == 200) {
                    this.success('验证码发送成功，请注意查收')
                } else {
                    this.error(res.data.message)
                }
            })
        },
        changePicCode() {
            this.getPicCode()
        },
        getPicCode () {
            this.$http.post('/code/getAuthcode').then(res => {
                if (res.data.returnCode == 200) {
                    this.picCode = res.data.data
                }
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
    .forgetpwd {
        .forgetpwd-wrapper {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -60%);
            width: 400px;
            border-radius: 10px;
            background-color: rgba(54, 77, 236, .4);
            z-index: 99
        }
        .input-wrapper {
            padding: 0 30px 20px
        }
        .name {
            position: absolute
            top: 50%
            right: -120%
            width: 100%
            text-align: center
            color: #ffffff
            font-size: 32px
            transform: translateY(-50%)
        }
        .title {
            margin-bottom: 30px
            line-height: 55px;
            text-align: center;
            color: #fff;
            font-weight 100
            border-bottom: 3px solid #fff
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
            text-align: right;
            color: #fff
            span {
                cursor: pointer;
            }
        }
    }
</style>