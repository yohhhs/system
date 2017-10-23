<template>
    <div class="admin">
        <transition :name="loginClass">
            <div v-if="currentPage === 0" class="login-wrapper">
                <login @isLeft='isLeft' @isRight='isRight' @login='login' @loginToRegister='loginToRegister' @loginToForget='loginToForget'></login>
            </div>
        </transition>
        <transition name="register">
            <div v-if="currentPage===1" class="register-wrapper">
                <register @registerToLogin='registerToLogin'></register>
            </div>
        </transition>
        <transition name='forget'>
            <div v-if="currentPage===2" class="forget-wrapper">
                <forget-pwd @forgetToLogin='forgetToLogin'></forget-pwd>
            </div>
        </transition>
        <vue-particles></vue-particles>
        <p class="copyright">成都厚德宥马网络科技有限公司版权所属</p>
    </div>
</template>
<script>
import Login from 'cps/login/login'
import Register from 'cps/register/register'
import ForgetPwd from 'cps/forgetpwd/forgetpwd'

export default {
    data() {
        return {
            loginClass: '',
            currentPage: 0
        }
    },
    methods: {
        login() {
            let path = this.userInfo.authList[0].children[0].route
            this.$router.push({
                path: path
            })
        },
        isLeft() {
            this.loginClass = 'login-right'
        },
        isRight() {
            this.loginClass = 'login-left'
        },
        loginToRegister() {
            this.currentPage = 1
        },
        loginToForget() {
            this.currentPage = 2
        },
        registerToLogin() {
            this.currentPage = 0
        },
        forgetToLogin() {
            this.currentPage = 0
        }
    },
    components: {
        Login,
        Register,
        ForgetPwd
    }
}
</script>
<style lang="stylus" scoped>
.admin {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #2d8cf0;

    .login-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -60%, 0);

        &.login-left-enter-active, &.login-left-leave-active, &.login-right-enter-active, &.login-right-leave-active {
            transition: all .4s ease-out;
        }

        &.login-left-enter, &.login-left-leave-to {
            margin-left: -400px;
            opacity: 0;
        }

        &.login-right-enter, &.login-right-leave-to {
            margin-left: 400px;
            opacity: 0;
        }
    }

    .register-wrapper {
        position: absolute;
        top: 50%;
        right: 200px;
        transform: translateY(-60%);

        &.register-enter-active, &.register-leave-active {
            transition: all 0.4s ease-out;
        }

        &.register-enter, &.register-leave-to {
            opacity: 0;
            right: -200px;
        }
    }

    .forget-wrapper {
        position: absolute;
        top: 50%;
        left: 200px;
        transform: translateY(-60%);

        &.forget-enter-active, &.forget-leave-active {
            transition: all 0.4s ease-out;
        }

        &.forget-enter, &.forget-leave-to {
            opacity: 0;
            left: -200px;
        }
    }

    .copyright {
        position: absolute;
        bottom: 15px;
        width: 100%;
        text-align: center;
        color: #ffffff;
        font-size: 14px;
    }
}
</style>
