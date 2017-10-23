<template>
  <div class="auth-allot">
    <div class="wrapper">
      <tree :authList="authList" ref="tree"></tree>
      <div class="btn-wrapper">
        <Button @click="changeRule" style="width:180px;" type="primary" :loading="queryLoading">
          <span v-if="!queryLoading">确定</span> <span v-else>Loading...</span>
        </Button>
      </div>
    </div>
  </div>
</template>
<script>
  import { ruleTree } from 'common/js/util'
  import Tree from 'base/tree/tree'

  export default {
    data () {
      return {
        queryLoading: false,
        authList: ruleTree()
      }
    },
    mounted () {
    },
    components: {
      Tree
    },
    methods: {
      changeRule () {
        let authList = this.getAuthList()
        this.queryLoading = true
        this.$http.post('/permission/updatePermission', {
          permissionTrees: JSON.stringify(this.authList)
        }).then(res => {
          if (res.data.returnCode == 200) {
            this.userInfo.authList = JSON.parse(JSON.stringify(this.authList))
            this.$Message.success('修改权限成功')
          }
          this.queryLoading = false
        }).catch(res => {
          this.queryLoading = false
        })
      },
      getAuthList() {
        return this.$refs.tree.returnTree()
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .auth-allot {
    position: relative
    padding: 20px
    .wrapper {
      position: absolute
      top: 80px
      left: 50%
      transform: translateX(-50%)
      .btn-wrapper {
        margin-top: 40px
        text-align: center
      }
    }
  }
</style>
