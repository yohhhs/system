export const common = {
  data() {
    return {
      selectNum: 0,
      selectArray: null,
      queryLoading: false,
      addLoading: false,
      writeLoading: false,
      addConfirm: false,
      writeConfirm: false,
      handles: null
    }
  },
  created() {
    this.userInfo.authList.forEach(item => {
      item.children.forEach(child => {
        if (child.route === this.$route.fullPath) {
          this.handles = child.handles
        }
      })
    })
  },
  methods: {
    select (selection) {
      this.selectNum = selection.length
      this.selectArray = selection
    },
    error (title) {
      this.$Notice.error({
        title: title,
        duration: 2
      })
    },
    warn (title, desc) {
      this.$Notice.warning({
        title: title,
        duration: 3,
        desc: desc
      })
    }
  }
}
