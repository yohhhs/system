<template>
    <div class="auth-allot">
        <div class="wrapper">
            <ul class="node-tree">
                <li class="item" v-for="(rule, parentIndex) in authList">
                    <Checkbox @on-change="parentBox(parentIndex)" v-model="rule.lookAuth">{{rule.codeValue}}</Checkbox>
                    <ul class="child-node">
                        <li class="child-item" v-for="(child, childIndex) in rule.children">
                            <span>
                                <Checkbox @on-change="childBox(parentIndex, childIndex)" v-model="child.lookAuth">{{child.codeValue}}</Checkbox>
                            </span>
                            <span>
                                <Checkbox v-for="handle in child.handles" :disabled="!child.lookAuth" v-model="handle.turn">{{handle.name}}</Checkbox>
                            </span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="btn-wrapper">
                <Button @click="changeRule" style="width:180px;" type="primary" :loading="queryLoading">
                    <span v-if="!queryLoading">确定</span>
                    <span v-else>Loading...</span>
                </Button>
            </div> 
        </div>
    </div>
</template>
<script>
import {ruleTree, getUid} from 'common/js/util'
export default {
  data () {
    return {
        queryLoading: false,
        authList: ruleTree()
    }
  },
  mounted() {
      console.log(getUid())
  },
  methods: {
      changeRule() {
          this.userInfo.authList = JSON.parse(JSON.stringify(this.authList))
          this.$Message.success('修改权限成功');
      },
      retVal(self, parent) {
          return (self && parent)
      },
      parentBox(index) {
          if (this.authList[index].lookAuth === false) {
              this.authList[index].children.forEach(function(item) {
                  item.lookAuth = false
              })
          } else {
              this.authList[index].children.forEach(function(item) {
                  item.lookAuth = true
              })
          }
      },
      childBox(pindex, cindex) {
          if (this.authList[pindex].children[cindex].lookAuth === true) {
              this.authList[pindex].lookAuth = true
          } else {
              let activeNum = 0
              this.authList[pindex].children.forEach(function(item) {
                  if (item.lookAuth === true) {
                      activeNum++
                  }
              })
              if (activeNum === 0) {
                  this.authList[pindex].lookAuth = false
              }
          }
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
                text-align: center
            }
            .node-tree {
                margin-bottom: 40px
                .item {
                    margin-bottom: 20px
                }
            }
            .child-node {
                padding-left: 25px
                .child-item {
                    display: flex;
                    margin-top: 8px
                    span {
                        margin-right: 50px
                    }
                }
            }
        }
    }
</style>