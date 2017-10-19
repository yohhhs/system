<template>
    <div class="left-menu">
        <Menu :active-name='userInfo.authList[0].children[0].route' open-names=[userInfo.authList[0].name] @on-select="changeRoute" theme="dark" width="auto" :accordion="true">
            <Submenu v-if="menu.lookAuth" v-for="(menu, index) in userInfo.authList" :key="menu.name" :name="index">
                <template slot="title">
                    {{menu.name}}
                </template>
                <MenuItem v-for="(item, index) in menu.children" :key="item.name" :name="item.route"> {{item.name}}
                </MenuItem>
            </Submenu>
        </Menu>
    </div>
</template>
<script>
export default {
    data() {
        return {}
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