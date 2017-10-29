<template>
  <div class="auth-manager">
    <div class="btns-wrapper">
      <Button type="primary" v-for="(item, index) in handles" :key='item.name' v-if="item.turn" style="margin-right:15px;" @click="btn(item.name)">{{item.name}}</Button>
      <Button type="primary" @click='changeRule'>编辑权限</Button>
    </div>
    <div class="content">
      <div class="item" style="width: 40%">
        <Table @on-row-click="rowClick"  :highlight-row='highlight' border :columns="columns" :data="listData"></Table>
      </div>
      <div class="item" style="width: 60%">
        <div v-if="authList" class="tree-wrapper">
          <tree ref="tree" :authList="authList"></tree>
          <Button type="primary" v-if="isChange" style="margin-top: 20px;width:180px;" size="large" :loading="changeRoleLoading" @click="queryChangeRole">确定</Button>
        </div>
      </div>
    </div>
    <Modal v-model="addConfirm" width="360" @on-cancel='addConfirmClose'>
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>添加角色</span>
      </p>
      <div style="text-align:center">
        <Input v-model="addRoleName" placeholder="请输入角色名称" style="margin-top: 15px"></Input>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="addLoading" @click="addRole">确定</Button>
      </div>
    </Modal>
    <Modal v-model="writeConfirm" width="360" @on-cancel='writeConfirmClose'>
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>编辑角色</span>
      </p>
      <div style="text-align:center">
        <Input v-model="writeRoleName" placeholder="请输入角色名称" style="margin-top: 15px"></Input>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="writeLoading" @click="writeRole">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Tree from 'base/tree/tree'
import {common} from 'common/js/mixin'
import {contactRule} from 'common/js/util'

export default {
  data () {
    return {
      highlight: true,
      authList: null,
      addRoleName: '',
      writeRoleName: '',
      changeRoleLoading: false,
      selectItem: null,
      selectIndex: 0,
      isChange: false,
      columns: [
        {
          title: '角色名称',
          key: 'codeValue'
        }
      ],
      listData: []
    }
  },
  mixins: [common],
  created() {
    this.getRoleList()
  },
  components: {
    Tree
  },
  methods: {
    rowClick(obj, index) {
      this.selectItem = obj
      this.selectIndex = index
      this.getRole()
      this.isChange = false
    },
    getRole() {
      this.$http.post('/permission/getInitializePermissionsTree',{
        memberType: this.selectItem.code
      }).then(res => {
        let returnData = res.data
        if (returnData.returnCode == 200) {
          let permissions = []
          if (returnData.data.permissions) {
            permissions = contactRule(JSON.parse(returnData.data.permissions), returnData.data.dictionary)
          }
          this.authList = permissions
        }
      }).catch(res => {
        console.log(res)
      })
    },
    changeRule() {
      this.isChange = true
      this.initRole()
    },
    clearRowClick() {
      this.listData.forEach(item => {
        if (item._highlight) {
          delete item._highlight
        }
      })
    },
    getRoleList() {
      this.$http.post('/dictionary/getRoleDictionaryList').then(res => {
        if (res.data.returnCode == 200) {
          this.listData = res.data.data
          this.listData[0]._highlight = true
          this.selectItem = this.listData[0]
          this.selectIndex = 0
          this.getRole()
        }
      })
    },
    btn(name) {
      switch (name) {
        case '添加':
          this.add()
          break;
        case '编辑':
          this.write()
          break;
        case '删除':
          this.del()
          break;
      }
    },
    add () {
      this.addConfirm = true
    },
    write () {
      // if (this.selectNum !== 1) {
      //   return this.warn('编辑警告', '请在列表中选择一条角色信息，且不能多选')
      // }
      this.writeConfirm = true
      this.writeRoleName = this.selectItem.codeValue
    },
    del () {
      if (!this.selectItem) {
        return this.warn('删除警告', '请在列表中选择一条角色信息')
      }
      this.$http.post('dictionary/deleteRoleDictionaryBykey',{
        id: this.selectItem.id
      }).then(res => {
        if (res.data.returnCode == 200) {
          this.$Message.success('删除成功')
          this.getRoleList()
        } else {
          this.error(res.data.message)
        }
      })
    },
    initRole() {
      this.$http.post('/permission/getInitializePermissionsTree').then(res => {
        let returnData = res.data
        if (returnData.returnCode == 200) {
          // let permissions = contactRule(JSON.parse(returnData.data.permissions), returnData.data.dictionary, false)
          this.authList = contactRule(JSON.parse(returnData.data.permissions), returnData.data.dictionary)
        }
      }).catch(res => {
        console.log(res)
      })
    },
    addRole() {
      let roleName = this.addRoleName.trim()
      if (roleName == '') {
        return this.error('角色名不能为空')
      }
      this.addLoading = true
      this.$http.post('/permission/getInitializePermissionsTree').then(res => {
        let returnData = res.data
        if (returnData.returnCode == 200) {
          this.addLoading = false
          let permissions = contactRule(JSON.parse(returnData.data.permissions), returnData.data.dictionary, false)
          this.addRolePost(roleName, permissions)
        } else {
          this.addLoading = false
          this.error('添加角色失败')
        }
      }).catch(res => {
        this.addLoading = false
        this.error('添加角色失败')
        console.log(res)
      })
    },
    addConfirmClose() {
      this.addRoleName = ''
    },
    addRolePost(roleName, roleTree) {
      this.$http.post('/dictionary/addRoleDictionary', {
        roleName: roleName,
        permissionTrees: JSON.stringify(roleTree)
      }).then(res => {
        this.addLoading = false
        if (res.data.returnCode == 200) {
          this.clearRowClick()
          res.data.data._highlight = true
          this.selectItem = res.data.data
          this.selectIndex = this.listData.length
          this.listData.push(res.data.data)
          this.$Message.success('添加角色成功')
          this.addConfirm = false
          this.addRoleName = ''
          this.authList = roleTree
        } else {
          this.error('添加角色失败')
        }
      }).catch(res => {
        this.addLoading = false
        this.error('添加角色失败')
        console.log(res)
      })
    },
    writeRole() {
      let roleName = this.writeRoleName.trim()
      let code = this.selectItem.id
      if (roleName == '') {
        return this.error('角色名不能为空')
      }
      this.writeLoading = true
      this.$http.post('/dictionary/updateDictionary',{
        dictionaryId: code,
        codeValue: roleName
      }).then(res => {
        this.writeLoading = false
        if (res.data.returnCode == 200) {
          this.clearRowClick()
          this.listData[this.selectIndex].codeValue = roleName
          this.listData[this.selectIndex]._highlight = true
          this.selectItem = this.listData[this.selectIndex]
          this.writeConfirm = false
          this.writeRoleName = ''
          this.$Message.success('编辑角色成功')
        }
      }).catch(res => {
        this.writeLoading = false
        this.error('编辑角色失败')
        console.log(res)
      })
    },
    writeConfirmClose() {
      this.writeRoleName = ''
    },
    changeRole() {
      if (!this.selectItem) {
        return this.warn('修改权限警告', '请在列表中选择一条角色信息')
      }
      this.$http.post('/permission/getInitializePermissionsTree',{
        memberType: this.selectArray[0].code
      }).then(res => {
        let returnData = res.data
        if (returnData.returnCode == 200) {
          this.authList = contactRule(JSON.parse(returnData.data.permissions), returnData.data.dictionary)
        }
      })
    },
    queryChangeRole() {
      let authList = this.$refs.tree.returnTree()
      this.changeRoleLoading = true
      this.$http.post('/permission/updateMemberPermission', {
        permissionTrees: JSON.stringify(authList),
        memberType: this.selectItem.code
      }).then(res => {
        if (res.data.returnCode == 200) {
          this.$Message.success('修改权限成功')
        }
        this.changeRoleLoading = false
        this.isChange = false
      }).catch(res => {
        this.changeRoleLoading = false
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .auth-manager {
    padding: 0 20px;
    .btns-wrapper {
      margin: 25px 0;
    }
    .content {
      display: flex
      border-top: 1px solid #D4D6D8
      .item {
        padding: 30px
        .tree-wrapper {
          margin: 0 auto
        }
      }
    }
  }
</style>
