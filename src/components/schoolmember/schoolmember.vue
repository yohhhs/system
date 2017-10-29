<template>
  <div class="school-member">
    <div class="query-wrapper">
            <Row class="item" :gutter="16">
                <Col span="6">
                <span class="name">手机号</span>
                <Input v-model="queryPhone" placeholder="请输入手机号" style="width: 60%"></Input>
                </Col>
                <Col span="6">
                <span class="name">姓名</span>
                <Input v-model="queryName" placeholder="请输入姓名" style="width: 60%"></Input>
                </Col>
                <Col span="6">
                <span class="name">状态</span>
                <Select style="width:60%" clearable placeholder='选择状态' @on-change="queryChange">
                  <Option v-for="item in turns" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                </Col>
                <Col span="6">
                    <Button type="primary" :loading="queryLoading" @click='querySchoolList'>
                        <span v-if="!queryLoading">查询</span>
                        <span v-else>Loading...</span>
                    </Button>
                </Col>
            </Row>
        </div>
        <div class="btns-wrapper">
          <Button type="primary" v-for="(item, index) in handles" v-if="item.turn" :key='item.name' style="margin-right:15px;" @click="btn(item.name)">{{item.name}}</Button>
        </div>
        <Table @on-row-click="rowClick" highlight-row border :columns="columns" :data="memberList"></Table>
        <div class="page-wrapper">
            <Page @on-change='changePage' :total="total" show-elevator></Page>
        </div>
        <Modal v-model="writeConfirm" width="360" @on-cancel='writeConfirmClose'>
          <p slot="header" style="color:#f60;text-align:center" @on-cancel='writeConfirmClose'>
            <Icon type="information-circled"></Icon>
            <span>编辑学校</span>
          </p>
          <div style="text-align:center">
            <Select ref='chooseSchool' placeholder="请选择学校" @on-change="changeSchoolId" clearable filterable style="margin-top: 15px">
          <Option v-for="item in schoolList" :value="item.id" :key="item.id">{{ item.schoolName }}</Option>
        </Select>
          </div>
          <div slot="footer">
            <Button type="primary" size="large" long :loading="writeLoading" @click="writeSchool">确定</Button>
          </div>
        </Modal>
  </div>
</template>
<script>
import {common} from 'common/js/mixin'
export default {
  data () {
    return {
      total: 0,
      queryPhone: '',
      queryName: '',
      queryStatus: '',
      pageNum: 1,
      writeSchoolId: '',
      addSelectValue: 1,
      selectItem: null,
      selectIndex: '',
      turns: [{
        label: '启用',
        value: 1
      }, {
        label: '禁用',
        value: 0
      }],
      columns: [
          {
              title: '姓名',
              key: 'name'
          },
          {
              title: '学校名称',
              key: 'schoolName'
          },
          {
              title: '职务',
              key: 'duty'
          },
          {
              title: '手机号码',
              key: 'phone'
          },
          {
              title: '审核',
              key: 'checked' ,
              render: (h, params) => {
                return h('div', params.row.checked ? '已审核' : '未审核')
              }
          },
          {
              title: '状态',
              key: 'status',
              render: (h, params) => {
                return h('div', params.row.status ? '启用' : '禁用')
              }
          }
      ],
      memberList: [],
      schoolList: []
    }
  },
  mixins: [common],
  created() {
    this.getMember()
    this.getSchoolList()
  },
  methods: {
    changeSchoolId(id) {
      this.writeSchoolId = id
    },
    getSchoolList() {
      this.$http.post('school/getListSchool').then(res => {
        if (res.data.returnCode == 200) {
          this.schoolList = res.data.data
        }
      })
    },
    rowClick(item, index) {
      this.selectItem = item
      this.selectIndex = index
    },
    queryChange(val) {
      this.queryStatus = val
    },
    querySchoolList() {
      this.pageNum = 1
      this.getMember()
    },
    getMember() {
      let phone = this.queryPhone
      let name = this.queryName
      let status = this.queryStatus
      let curPageNo = this.pageNum
      this.$http.post('/memberManage/allTeachers',{
        phone,
        name,
        status,
        curPageNo
      }).then(res => {
        if (res.data.returnCode == 200) {
          this.total = res.data.data.total
          this.memberList = res.data.data.list
        }
      })
    },
    btn(name) {
      switch (name) {
        case '编辑':
          this.write()
          break;
        case '启用':
          this.turn(1)
          break;
        case '禁用':
          this.turn(0)
          break;
        case '审核':
          this.review(1)
          break;
        case '未审核':
          this.review(0)
          break;
      }
    },
    write () {
      if (!this.selectItem) {
        return this.warn('编辑警告', '请在列表中选择一条学校信息')
      }
      this.writeConfirm = true
      this.writeSchoolName = this.selectItem.schoolName
    },
    turn (val) {
      if (!this.selectItem) {
        return this.warn('状态警告', '请在列表中选择一条学校信息')
      }
      this.$http.post('/memberManage/updateTeacher',{
          userId: this.selectItem.id,
          status: val
      }).then(res => {
        if (res.data.returnCode == 200) {
          this.memberList[this.selectIndex].status = val
          this.selectItem = null
          this.$Message.success('修改成功')
        }
      })
    },
    review (val) {
      if (!this.selectItem) {
        return this.warn('审核警告', '请在列表中选择一条学校信息')
      }
      this.$http.post('/memberManage/updateTeacher',{
          userId: this.selectItem.id,
          checked: val
      }).then(res => {
        if (res.data.returnCode == 200) {
          this.memberList[this.selectIndex].checked = val
          this.selectItem = null
          this.$Message.success('修改成功')
        }
      })
    },
    changePage(num) {
      this.pageNum = num
      this.getMember()
    },
    writeSchool() {
      let writeSchoolId = this.writeSchoolId
      this.writeLoading = true
      this.$http.post('/memberManage/updateInfo',{
        schoolId: writeSchoolId
      }).then(res => {
        this.writeLoading = false
        if (res.data.returnCode == 200) {
          this.getMember()
          this.$Message.success('修改成功')
          this.selectItem = null
          this.writeConfirmClose()
          this.writeSchoolId = ''
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch(res => {
        this.writeLoading = false
      })
    },
    writeConfirmClose() {
      this.$refs.chooseSchool.clearSingleSelect()
    }
  }
}
</script>
<style lang="stylus" scoped>
  .school-member {
     padding: 20px;
    .query-wrapper {
        margin: 15px 0;
        border-bottom: 1px solid #D4D6D8;
        .item {
            margin-bottom: 15px
        }
        .name {
            margin-right: 10px;
        }
    }
    .page-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 30px;
    }
    .btns-wrapper {
        margin: 25px 0;
    }
  }
</style>
