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
                <Button type="primary" :loading="queryLoading" @click='queryExpert'>
                    <span v-if="!queryLoading">查询</span>
                    <span v-else>Loading...</span>
                </Button>
            </Col>
        </Row>
    </div>
    <div class="btns-wrapper">
      <Button type="primary" v-for="(item, index) in handles" v-if="item.turn" :key='item.name' style="margin-right:15px;" @click="btn(item.name)">{{item.name}}</Button>
    </div>
    <Table border @on-row-click='tableClick' highlight-row :columns="columns" :data="expertList"></Table>
    <!-- <div class="page-wrapper">
        <Page @on-change='changePage' :total="total" show-elevator></Page>
    </div> -->
    <Modal v-model="addConfirm" width="360" @on-cancel='addConfirmClose'>
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>添加专家</span>
      </p>
      <div style="text-align:center">
        <Input v-model="addExpertPhone" placeholder="请输入手机号" style="margin-bottom: 20px"></Input>
        <Input v-model="addExpertName" placeholder="请输入姓名" style="margin-bottom: 20px"></Input>
        <Input v-model="addExpertJob" placeholder="请输入职务" style="margin-bottom: 20px"></Input>
        <Input v-model="addExpertPwd" type="password" placeholder="请输入密码" style="margin-bottom: 20px"></Input>
        <Select ref="addSchoolSelect" multiple placeholder="请选择关联学校" @on-change="addSchoolChange" v-model="addSelectArray" clearable filterable multiple>
          <Option v-for="item in addSchoolArray" :value="item.id" :key="item.id">{{ item.schoolName }}</Option>
        </Select>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="addLoading" @click="addExpert">确定</Button>
      </div>
    </Modal>
    <Modal v-model="writeConfirm" width="360" @on-cancel='writeConfirmClose'>
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>编辑专家</span>
      </p>
      <div style="text-align:center">
        <Input v-model="writeExpertPhone" placeholder="请输入手机号" style="margin-bottom: 20px"></Input>
        <Input v-model="writeExpertName" placeholder="请输入姓名" style="margin-bottom: 20px"></Input>
        <Input v-model="writeExpertJob" placeholder="请输入职务" style="margin-bottom: 20px"></Input>
        <Input v-model="writeExpertPwd" type="password" placeholder="请输入密码" style="margin-bottom: 20px"></Input>
        <Select ref="writeSchoolSelect" multiple placeholder="请选择关联学校" @on-change="writeSchoolChange" v-model="writeSelectArray" clearable filterable multiple>
          <Option v-for="item in writeSchoolArray" :value="item.id" :key="item.id">{{ item.schoolName }}</Option>
        </Select>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="writeLoading" @click="writeExpert">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import md5 from 'js-md5'
import {common} from 'common/js/mixin'
export default {
  data () {
    return {
      total: 0,
      addSchoolArray: [],
      writeSchoolArray: [],
      addSelectArray: [],
      writeSelectArray: [],
      addSchoolIds: '',
      addExpertPhone: '',
      addExpertName: '',
      addExpertJob: '',
      addExpertPwd: '',
      writeSchoolIds: '',
      writeExpertPhone: '',
      writeExpertName: '',
      writeExpertJob: '',
      writeExpertPwd: '',
      queryPhone: '',
      queryName: '',
      schoolList: [],
      pageNo: 1,
      selectItem: null,
      selectIndex: '',
      columns: [
          {
              title: '姓名',
              key: 'name'
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
              title: '关联学校数量',
              key: 'schoolNum',
              render: (h, params) => {
                  return h('Poptip', {
                      props: {
                          trigger: 'hover',
                          placement: 'right-end'
                      }
                  }, [
                      h('Tag', params.row.schoolName.length + '个学校'),
                      h('div', {
                          slot: 'content'
                      }, [
                          h('ul', params.row.schoolName.map(item => {
                              return h('li', {
                                  style: {
                                      textAlign: 'center',
                                      padding: '4px'
                                  }
                              }, item)
                          }))
                      ])
                  ]);
              }
          }
      ],
      expertList: []
    }
  },
  mixins: [common],
  created() {
    this.getSchoolList()
    this.getExpertList()
  },
  methods: {
    tableClick(item, index) {
      this.selectItem = item
      this.selectIndex = index
    },
    getSchoolIds() {
      this.$http.post('memberManage/quarySchoolsByMemberId', {
        userId: this.selectItem.id
      }).then(res => {
        this.writeSelectArray = res.data.data
      })
    },
    getSchoolList() {
      this.$http.post('school/getListSchool').then(res => {
        if (res.data.returnCode == 200) {
          this.addSchoolArray = res.data.data
          this.writeSchoolArray = res.data.data
        }
      })
    },
    queryExpert() {
      this.getExpertList()
    },
    getExpertList() {
      this.$http.post('/memberManage/getSpecalists',{
        name: this.queryName,
        phone: this.queryPhone,
        curPageNo: this.pageNo
      }).then(res => {
        if (res.data.returnCode == 200) {
          // this.total = res.data.data.total
          this.expertList = this.sortExpertList(res.data.data)
        }
      })
    },
    sortExpertList(list) {
      var sortObj = {}
      var sortArray = []
      list.forEach(item => {
        if (sortObj[item.id]) {
          sortObj[item.id].push(item)
        } else {
          sortObj[item.id] = [item]
        }
      })
      for (var key in sortObj) {
        let schoolName = []
        sortObj[key].forEach(item => {
          schoolName.push(item.schoolName)
        })
        let expertItem = sortObj[key][0]
        expertItem.schoolName = schoolName
        sortArray.push(expertItem)
      }
      return sortArray
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
    addSchoolChange(item) {
      this.addSchoolIds = item.join(',')
    },
    writeSchoolChange(item) {
      this.writeSchoolIds = item.join(',')
    },
    addExpert() {
      let name = this.addExpertName
      let phone = this.addExpertPhone
      let duty = this.addExpertJob
      let password = this.addExpertPwd.trim()
      let schoolIds = this.addSchoolIds
      if (password !== '') {
        password = md5(password)
      }
      this.addLoading = true
      this.$http.post('/memberManage/addSpecialist',{
        name,
        phone,
        duty,
        password,
        schoolIds
      }).then(res => {
        this.addLoading = false
        if (res.data.returnCode == 200) {
          this.$Message.success('添加成功')
          this.addConfirm = false
          this.addConfirmClose()
          this.getExpertList()
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch(res => {
        this.addLoading = false
      })
    },
    addConfirmClose() {
      this.addSchoolIds = ''
      this.addExpertPhone = ''
      this.addExpertName = ''
      this.addExpertJob = ''
      this.addExpertPwd = ''
      this.addSelectArray = []
      this.$refs.addSchoolSelect.clearSingleSelect()
    },
    write () {
      if (!this.selectItem) {
        return this.warn('编辑警告', '请在列表中选择一条专家信息，且不能多选')
      }
      this.writeConfirm = true
      this.writeExpertName = this.selectItem.name
      this.writeExpertPhone = this.selectItem.phone
      this.writeExpertJob = this.selectItem.duty
      this.getSchoolIds()
//      this.writeRoleName = this.selectArray[0].roleName
    },
    writeExpert() {
      let name = this.writeExpertName
      let phone = this.writeExpertPhone
      let duty = this.writeExpertJob
      let password = this.writeExpertPwd.trim()
      let schoolIds = this.writeSelectArray.join(',')
      let userId = this.selectItem.id
      if (password !== '') {
        password = md5(password)
      }
      this.addLoading = true
      this.$http.post('/memberManage/updateSpecalists',{
        name,
        phone,
        duty,
        password,
        schoolIds,
        userId
      }).then(res => {
        this.addLoading = false
        if (res.data.returnCode == 200) {
          this.$Message.success('编辑成功')
          this.writeConfirm = false
          this.writeConfirmClose()
          this.getExpertList()
          this.selectItem = null
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch(res => {
        this.addLoading = false
      })
    },
    writeConfirmClose() {
      this.writeSchoolIds = ''
      this.writeExpertPhone = ''
      this.writeExpertName = ''
      this.writeExpertJob = ''
      this.writeExpertPwd = ''
      this.writeSelectArray = []
      this.$refs.writeSchoolSelect.clearSingleSelect()
    },
    del () {
      if (!this.selectItem) {
        return this.warn('删除警告', '请在列表中选择一条专家信息')
      }
      this.$http.post('/memberManage/deleteSpecalist',{
        userId: this.selectItem.id
      }).then(res => {
        if (res.data.returnCode == 200) {
          this.getExpertList()
          this.$Message.success('删除成功')
          this.selectItem = null
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    changePage() {
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
