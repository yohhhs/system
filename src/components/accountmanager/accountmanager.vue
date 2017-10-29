<template>
  <div class="account-manager">
    <div class="btns-wrapper">
      <Button type="primary" v-for="(item, index) in handles" :key='item.name' v-if="item.turn" style="margin-right:15px;"
        @click="btn(item.name)">{{item.name}}
      </Button>
    </div>
    <Table  @on-row-click='tableClick' highlight-row border :columns="columns" :data="accountList"></Table>
    <Modal @on-cancel='addConfirmClose' v-model="addConfirm" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>添加账户</span>
      </p>
      <div style="text-align:center">
        <Input
        v-model="addPhone" placeholder="请输入手机" style="margin-bottom: 20px"></Input>
        <Input
        v-model="addName" placeholder="请输入姓名" style="margin-bottom: 20px"></Input>
        <Input
        v-model="addJob" placeholder="请输入职务" style="margin-bottom: 20px"></Input>
        <Input
        v-model="addPwd" type="password" placeholder="请输入密码" style="margin-bottom: 20px"></Input>
        <Input
        v-model="addRePwd" type="password" placeholder="请再次输入密码" style="margin-bottom: 20px"></Input>
        <Select ref='addSelect' placeholder="请选择状态" v-model="sval"  style="margin-bottom: 20px">
          <Option v-for="item in addStatus" :value="item.value" :key="item.value">{{ item.lable }}</Option>
        </Select>
        <Select ref='addSelectRole' clearable placeholder="请选择角色"
         @on-change="addChangeRule">
          <Option v-for="item in addRuleList" :value="item.code" :key="item.code">{{ item.codeValue }}</Option>
        </Select>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="addLoading" @click="addAccount">确定</Button>
      </div>
    </Modal>
    <Modal v-model="writeConfirm" width="360" @on-cancel='writeConfirmClose'>
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>编辑账户</span>
      </p>
      <div style="text-align:center">
        <Input
        v-model="writePhone" placeholder="请输入手机" style="margin-bottom: 20px"></Input>
        <Input
        v-model="writeName" placeholder="请输入姓名" style="margin-bottom: 20px"></Input>
        <Input
        v-model="writeJob" placeholder="请输入职务" style="margin-bottom: 20px"></Input>
        <Input
        v-model="writePwd" type="password" placeholder="请输入密码" style="margin-bottom: 20px"></Input>
        <Input
        v-model="writeRePwd" type="password" placeholder="请再次输入密码" style="margin-bottom: 20px"></Input>
        <Select ref='writeSelectRole' placeholder="请选择角色" v-model="writeValue" clearable style="margin-bottom: 20px">
          <Option v-for="item in addRuleList" :value="item.code" :key="item.code">{{ item.codeValue }}</Option>
        </Select>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="writeLoading" @click="writeAccount">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {common} from 'common/js/mixin'
import md5 from 'js-md5'
export default {
  data () {
    return {
      writeValue: '',
      addPhone: '',
      addName: '',
      addJob: '',
      addPwd: '',
      addRePwd: '',
      addRuleCode: '',
      writePhone: '',
      writeName: '',
      writeJob: '',
      writePwd: '',
      writeRePwd: '',
      writeRuleCode: '',
      addRuleList: [],
      sval: 1,
      selectItem: null,
      addStatus: [
        {
          lable: '启用',
          value: 1
        },
        {
          lable: '禁用',
          value: 0
        }
      ],
      columns: [
          // {
          //     type: 'selection',
          //     width: 60,
          //     align: 'center'
          // },
          {
            title: '手机号',
            key: 'phone'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '职务',
            key: 'duty'
          },
          {
            title: '角色',
            key: 'type',
            render: (h, params) => {
              return h('div', this.returnRuleName(params.row.type));
            }
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              return h('div', params.row.status ? '启用' : '禁用');
            }
          }
        ],
        accountList: []
    }
  },
  mixins: [common],
  created() {
    this.getRoleList()
    this.getAccountList()
  },
  methods: {
    tableClick(row) {
      this.selectItem = row
    },
    getRoleList() {
      this.$http.post('/dictionary/getRoleDictionaryList').then(res => {
        if (res.data.returnCode == 200) {
          this.addRuleList = res.data.data
        }
      })
    },
    returnRuleName(code) {
      let name = ''
      this.addRuleList.forEach(item => {
        if (item.code === code) {
          name = item.codeValue
        }
      })
      return name
    },
    getAccountList() {
      this.$http.post('/companyStaffManage/AllStaffs').then(res => {
        this.accountList = res.data.data
      })
    },
    addChangeRule(val) {
      this.addRuleCode = val
    },
    writeChangeRule(val) {
      this.writeRuleCode = val
    },
    addConfirmClose() {
      this.addPhone = ''
      this.addName = ''
      this.addJob = ''
      this.addPwd = ''
      this.addRePwd = ''
      this.sval = 1
      this.$refs.addSelect.clearSingleSelect()
      this.$refs.addSelectRole.clearSingleSelect()
    },
    writeConfirmClose() {
      this.writePhone = ''
      this.writeName = ''
      this.writeJob = ''
      this.writePwd = ''
      this.writeRePwd = ''
      this.$refs.writeSelectRole.clearSingleSelect()
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
        case '启用':
          this.trun(1)
        break;
        case '禁用':
          this.trun(0)
        break;
      }
    },
    add () {
      this.addConfirm = true
    },
    write() {
      if (!this.selectItem) {
        return this.warn('编辑账户警告', '请在列表中选择一条角色信息')
      }
      this.writeConfirm = true
      this.writePhone = this.selectItem.phone
      this.writeName = this.selectItem.name
      this.writeJob = this.selectItem.duty
      this.writeValue = this.selectItem.type
    },
    del() {
      if (!this.selectItem) {
        return this.warn('删除账户警告', '请在列表中选择一条角色信息')
      }
      this.$http.post('/companyStaffManage/deleteStaff',{
        userId: this.selectItem.id
      }).then(res => {
        if (res.data.returnCode == 200) {
          this.$Message.success('删除成功')
          this.getAccountList()
          this.selectItem = null
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    trun(val) {
      if (!this.selectItem) {
        return this.warn('启用/禁用账户警告', '请在列表中选择一条角色信息')
      }
      this.$http.post('/companyStaffManage/updateStaff',{
        status: val,
        userId: this.selectItem.id
      }).then(res => {
        if (res.data.returnCode == 200) {
          this.$Message.success('修改成功')
          this.getAccountList()
          this.selectItem = null
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    addAccount() {
      let phone = this.addPhone
      let name = this.addName
      let duty = this.addJob
      let password = this.addPwd
      let rePassword = md5(this.addRePwd)
      let status = this.sval
      let type = this.addRuleCode
      if (password !== '') {
        password = md5(password)
      }
      this.$http.post('/companyStaffManage/addInfo',{
        phone,
        name,
        duty,
        password,
        rePassword,
        status,
        type
      }).then(res => {
        if (res.data.returnCode == 200) {
          this.addConfirm = false
          this.addConfirmClose()
          this.$Message.success('添加成功')
          this.getAccountList()
        } else {
          this.error(res.data.message)
        }
      })
    },
    writeAccount() {
      this.$http.post('/companyStaffManage/updateInfo',{
        phone: this.writePhone,
        name: this.writeName,
        duty: this.writeJob,
        password: this.writePwd,
        rePassword: this.writeRePwd,
        type: this.writeValue,
        userId: this.selectItem.id
      }).then(res => {
        if (res.data.returnCode == 200) {
          this.writeConfirm = false
          this.writeConfirmClose()
          this.selectItem = null
          this.$Message.success('修改成功')
          this.getAccountList()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.account-manager {
  padding: 0 20px
  .btns-wrapper {
    margin: 25px 0;
  }
}
</style>