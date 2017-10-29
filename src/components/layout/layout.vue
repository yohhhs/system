<template>
    <div class="layout">
        <header class="layout-header">
            <span class="welcome">欢迎你： {{tel}}</span>
            <Button type="error" @click="outLogin">退出登录</Button>
        </header>
        <div class="layout-left">
            <left-menu @changeRoute='changeRoute'></left-menu>
        </div>
        <div class="layout-right">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import leftMenu from 'cps/left-menu/left-menu'

export default {
    data() {
        return {
            tel: ''
        }
    },
    components: {
        leftMenu
    },
    mounted() {
        this.tel = window.sessionStorage.getItem('tel')
    },
    methods: {
        changeRoute(routePath) {
            this.$router.push({
                path: routePath
            })
        },
      outLogin() {
          this.$http.post('/login/outLogin').then(res => {
            if (res.data.returnCode == 200) {
              this.$router.push('/admin')
            }
          }).catch(res => {
            console.log(res)
          })
      }
    }
}
</script>
<style lang="stylus" scoped>
.layout {
    min-width: 1200px;
    background: #efefef;
    .layout-header {
        position: fixed;
        top: 0;
        left: 0;
        padding: 0 20px;
        width: 100%;
        height: 70px;
        line-height: 70px;
        text-align: right;
        border-bottom: 1px solid #363e4f;
        background: url('http://328ym.com/images/home/logo.png') no-repeat 20px center #fff;
        z-index: 99;
        .welcome {
            margin-right: 70px;
            font-size: 14px;
        }
    }
    .layout-right {
        padding: 70px 0 0 240px;
        background: #fff
    }
}
</style>
