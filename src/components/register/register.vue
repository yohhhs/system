<template>
    <div class="register">
        <div class="register-wrapper">
            <h2 class="title">学校注册</h2>
            <div class="input-wrapper">
                <Input class="input" v-model="tel" type="text" size="large" placeholder="请输入手机号"></Input>
                <Input class="input" v-model="pwd" type="password" size="large" placeholder="请输入密码"></Input>
                <Input class="input" v-model="repwd" type="password" size="large" placeholder="请再次输入密码"></Input>
                <Input class="input" v-model="userName" type="text" size="large" placeholder="姓名"></Input>
                <Input class="input" v-model="userJob" type="text" size="large" placeholder="职务"></Input>
                <Select style="margin-bottom: 18px;height:36px" placeholder="请选择学校" @on-change="changeSchoolId" :clearable='clearable' :filterable='filterable'>
                <Option v-for="item in schoolList" :value="item.id" :key="item.id">{{ item.schoolName }}</Option>
                </Select>
                <div class="vali">
                    <Input class="vali-input" v-model="vali" type="text" size="large" placeholder="请输入验证码"></Input>
                    <img class="vali-right" :src="picCode" @click="changePicCode">
                </div>
                <div class="vali">
                    <Input class="vali-input" v-model="mobleVali" type="text" size="large" placeholder="短信验证码"></Input>
                    <Button  class="vali-right" type="primary" :loading="sendLoading" @click="getMobleCode">
                    <span v-if="!sendLoading">发送验证码</span>
                    <span v-else>Loading...</span>
                </Button>
                </div>
                <Button style="height:36px" type="primary" :loading="registerLoading" :long="true" @click="userRegister">
                    <span v-if="!registerLoading">注册</span>
                    <span v-else>Loading...</span>
                </Button>
                <div class="footer">
                    <span @click='registerToLogin'>立即登录</span>
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
            clearable: true,
            filterable: true,
            mobleVali: '',
            tel: '',
            pwd: '',
            repwd: '',
            userName: '',
            userJob: '',
            vali: '',
            registerLoading: false,
            sendLoading: false,
            errNum: 0,
            picCode: '',
            schoolList: [],
            schoolId: ''
        }
    },
    components: {
        Admin
    },
    created() {
        this.getPicCode()
        this.getSchoolList()
    },
    methods: {
        changeSchoolId(id) {
            this.schoolId = id
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
        },
        getSchoolList() {
            this.$http.post('school/getRegisterSchoolList').then(res => {
                if (res.data.returnCode == 200) {
                    this.schoolList = res.data.data
                }
            })
        },
        userRegister() {
            let phone = this.tel.trim()
            let password = this.pwd.trim()
            let rePassword = this.repwd.trim()
            let name = this.userName.trim()
            let duty = this.userJob.trim()
            let schoolId = this.schoolId
            let mobleCode = this.mobleVali
            let picCode = this.vali
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
            if (name === '') {
                return this.error('请填写姓名')
            }
            if (duty === '') {
                return this.error('请填写职位')
            }
            if (schoolId === '') {
                return this.error('请选择学校')
            }
            if (picCode === '') {
                return this.error('请输入图片验证码')
            }
            if (mobleCode === '') {
                return this.error('请输入手机验证码')
            }
            if (rePassword !== password) {
                return this.error('两次密码输入不一致')
            }
            this.$http.post('/Register/register',{
                phone,
                password: md5(password),
                rePassword: md5(rePassword),
                name,
                duty,
                schoolId,
                mobleCode,
                picCode
            }).then(res => {
                if (res.data.returnCode == 200) {
                    this.success('注册成功')
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
        registerToLogin() {
          this.$router.push('/login')
        },
        getMobleCode() {
            let tel = this.tel.trim()
            let vali = this.vali
            if (tel === '') {
                return this.error('手机号不能为空')
            }
            if (vali === '') {
                return this.error('图片验证码不能为空')
            }
            this.$http.post('/code/phoneCode',{
                picCode: vali,
                phone: tel
            }).then(res => {
                if (res.data.returnCode == 200) {
                    this.success('验证码发送成功，请注意查收')
                }
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
    .register {
        .register-wrapper {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -47%);
            width: 400px;
            border-radius: 10px;
            background-color: rgba(54, 77, 236, .4);
            z-index: 99
            .input-wrapper {
                padding: 0 30px 20px
            }
        }
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
            color: #fff
            span {
                cursor: pointer;
            }
        }
    }
</style>