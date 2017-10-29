<template>
    <div class="rolling">
        <p class="title">通知公告：</p>
        <div class="content">
            <ul v-if='noticeList' class="scroll" :style="{ top, transition }">
                <li class="item" v-for="(item, index) in noticeList" :key='index'>{{item.noticeContent}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
  props: {
      noticeList: {
          type: Array,
          default: null
      }
  },
  data () {
    return {
        activeIndex: 0
    }
  },
  mounted() {
    this.noticeList.push(this.noticeList[0])
    this.nextTick(() => {
        setInterval(() => {
            if (this.activeIndex < this.noticeList.length - 1) {
                this.activeIndex += 1
            } else {
                this.activeIndex = 0
            }
        }, 3000)
    })
  },
  computed: {
      top() {
          return -this.activeIndex * 36 + 'px'
      },
      transition() {
          return this.activeIndex === 0 ? 'none' : 'top 1.5s'
      }
  }
}
</script>
<style lang="stylus" scoped>
    .rolling
        position: relative
        padding-bottom: 20px
        border-bottom: 1px solid #D4D6D8;
        .title
            height: 36px
            line-height: 36px
        .content
            position: absolute
            left: 80px
            top: 0
            height: 36px
            overflow: hidden
            .scroll
                position: relative;
                transition: top 0.5s;
                .item
                    height: 36px
                    line-height: 36px
</style>