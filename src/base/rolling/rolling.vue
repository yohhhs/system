<template>
    <div class="rolling">
        <p class="title">通知公告：</p>
        <ul v-if="list.length">
            <li v-for="item in list" :key='item.txt'>{{item.txt}}</li>
        </ul>
        <p v-else>暂无相关公告</p>
    </div>
</template>
<script>
export default {
  data () {
    return {
        list: [
            {
                txt: '都是发斯蒂芬是'
            },{
                txt: 'sdfwwef'
            },{
                txt: '发放过发多少'
            }
        ]
    }
  }
}
</script>
<style lang="stylus" scoped>
    .rolling
        padding-bottom: 20px
        border-bottom: 1px solid #D4D6D8;
</style>