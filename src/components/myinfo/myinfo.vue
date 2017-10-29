<template>
    <div class="myinfo">
        <ul class="info-list">
            <li class="item">
                <div class="item-left">手机号码：</div>
                <div class="item-right">
                    <Input v-model="tel" readonly></Input>
                </div>
            </li>
            <li class="item" v-if='type == "e8fedbc3b4c911e7aa39309c232d4bfb"'>
                <div class="item-left">学校名称</div>
                <div class="item-right">
                    <Input v-model="schoolName" readonly></Input>
                </div>
            </li>
            <li class="item">
                <div class="item-left">姓名：</div>
                <div class="item-right">
                    <Input v-model="name" type="text" placeholder="请输入姓名"></Input>
                </div>
            </li>
            <li class="item">
                <div class="item-left">职务：</div>
                <div class="item-right">
                    <Input v-model="post" type="text" placeholder="请输入职务"></Input>
                </div>
            </li>
            <li class="item">
                <div class="item-left">新密码：</div>
                <div class="item-right">
                    <Input v-model="pwd" type="password" placeholder="请输入新密码"></Input>
                </div>
            </li>
            <li class="item">
                <div class="item-left">确认密码：</div>
                <div class="item-right">
                    <Input v-model="rePwd" type="password" placeholder="请再次输入新密码"></Input>
                </div>
            </li>
            <!--<li class="item">-->
                <!--<div class="item-left">学校名称：</div>-->
                <!--<div class="item-right">-->
                    <!--<Select placeholder="请选择学校" :filterable='true'>-->
                        <!--<Option v-for="item in schoolName" :value="item" :key="item">{{ item }}</Option>-->
                    <!--</Select>-->
                <!--</div>-->
            <!--</li>-->
        </ul>
        <Button style="margin:30px auto;width:200px;height:36px" type="primary" :loading="changeLoading" @click="changeInfo">
            <span v-if="!changeLoading">修改</span>
            <span v-else>Loading...</span>
        </Button>
    </div>
</template>
<script>
import md5 from 'js-md5'
export default {
    data() {
        return {
            type: '',
            tel: '',
            name: '',
            post: '',
            pwd: '',
            rePwd: '',
            schoolName: '',
            changeLoading: false
        }
    },
    created() {
        this.getInfo()
    },
    methods: {
        getInfo() {
            this.$http.post('/login/findInfo').then(res => {
                if (res.data.returnCode == 200) {
                    this.tel = res.data.data.member.phone
                    this.name = res.data.data.member.name
                    this.post = res.data.data.member.duty
                    this.type = res.data.data.member.type
                    this.schoolName = res.data.data.schoolName
                }
            })
        },
        changeInfo() {
            let password = this.pwd.trim()
            let rePassword = this.rePwd.trim()
            let name = this.name
            let duty = this.post
            if (password != '') {
                password = md5(password)
            }
            if (rePassword != '') {
                rePassword = md5(rePassword)
            }
            this.changeLoading = true
            this.$http.post('/login/updatetInfo',{
                password,
                rePassword,
                name,
                duty
            }).then(res => {
                this.changeLoading = false
                if (res.data.returnCode == 200) {
                    this.$Message.success('修改成功')
                } else {
                    this.$Message.error(res.data.message)
                }
            }).catch(res => {
                this.changeLoading = false
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
.myinfo {
    text-align: center;
    .info-list {
        width: 360px;
        margin: 140px auto 0;
        .item {
            display: flex;
            margin-bottom: 20px;
            line-height: 32px;
            .item-left {
                width: 90px;
                text-align: right;
            }

            .item-right {
                padding-left: 25px;
                width: 240px;
            }
        }
    }
}
</style>
