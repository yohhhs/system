<template>
  <div class="tree">
    <ul class="node-tree">
      <li class="item" v-for="(rule, parentIndex) in authList" :key="rule.code">
        <Checkbox @on-change="parentBox(parentIndex)" v-model="rule.lookAuth">{{rule.codeValue}}</Checkbox>
        <ul class="child-node">
          <li class="child-item" v-for="(child, childIndex) in rule.children"  :key="child.code">
                <span>
                    <Checkbox @on-change="childBox(parentIndex, childIndex)"
                      v-model="child.lookAuth">{{child.codeValue}}</Checkbox>
                </span> <span>
                    <Checkbox v-for="handle in child.handles" :key='handle.name' :disabled="!child.lookAuth" v-model="handle.turn">{{handle.name}}</Checkbox>
                </span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    authList: {
      type: Array,
      default: null
    }
  },
  methods: {
    parentBox (index) {
      if (this.authList[index].lookAuth === false) {
        this.authList[index].children.forEach(function (item) {
          item.lookAuth = false
        })
      } else {
        this.authList[index].children.forEach(function (item) {
          item.lookAuth = true
        })
      }
    },
    childBox (pindex, cindex) {
      if (this.authList[pindex].children[cindex].lookAuth === true) {
        this.authList[pindex].lookAuth = true
      } else {
        let activeNum = 0
        this.authList[pindex].children.forEach(function (item) {
          if (item.lookAuth === true) {
            activeNum++
          }
        })
        if (activeNum === 0) {
          this.authList[pindex].lookAuth = false
        }
      }
    },
    returnTree() {
      return this.authList
    }
  }
}
</script>

<style lang="stylus" scoped>
.tree {
  .node-tree {
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
</style>
