<template>
    <div class="left-menu">
        <Menu v-if="currentUserInfo.authList.length" :active-name='currentUserInfo.authList[0].children[0].route' @on-select="changeRoute" theme="dark" width="auto" :accordion="true">
            <Submenu v-if="menu.lookAuth" v-for="(menu, index) in currentUserInfo.authList" :key="menu.code" :name="index">
                <template slot="title">
                    {{menu.codeValue}}
                </template>
                <MenuItem v-if="item.lookAuth" v-for="(item, index) in menu.children" :key="item.code" :name="item.route">
                    {{item.codeValue}}
                </MenuItem>
            </Submenu>
        </Menu>
    </div>
</template>
<script>
export default {
    data() {
        return {
            currentUserInfo: this.userInfo
        }
    },
    methods: {
        changeRoute(name) {
            this.$emit('changeRoute', name)
        }
    }
}
</script>
<style lang="stylus" scoped>
    .left-menu {
        position: fixed;
        top: 70px;
        left: 0;
        bottom: 0;
        width: 240px;
        background-color: #363e4f;
        z-index: 99;
    }
</style>
