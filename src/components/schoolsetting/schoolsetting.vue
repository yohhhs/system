<template>
  <div class="school-member">
    <div class="query-wrapper">
        <Row class="item" :gutter="16">
            <Col span="6">
            <span class="name">学校名称</span>
            <Input v-model="schoolName" placeholder="请输入学校名称" style="width: 60%"></Input>
            </Col>
            <Col span="6">
                <Button type="primary" :loading="queryLoading" @click="querySchool">
                    <span v-if="!queryLoading">查询</span>
                    <span v-else>Loading...</span>
                </Button>
            </Col>
        </Row>
    </div>
    <div class="btns-wrapper">
      <Button type="primary" v-for="(item, index) in handles" :key='index' v-if="item.turn" style="margin-right:15px;" @click="btn(item.name)">{{item.name}}</Button>
    </div>
    <Table @on-row-click="rowClick" highlight-row border :columns="columns" :data="schoolList"></Table>
    <!--<div class="page-wrapper">-->
        <!--<Page @on-change='changePage' :total="100" show-elevator></Page>-->
    <!--</div>-->
    <Modal v-model="addConfirm" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>添加学校</span>
      </p>
      <div style="text-align:center">
        <Input v-model="addSchoolCode" placeholder="请输入机构代码" style="margin-bottom: 20px"></Input>
        <Input v-model="addSchoolName" placeholder="请输入学校名称" style="margin-bottom: 20px"></Input>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="addLoading" @click="addSchool">确定</Button>
      </div>
    </Modal>
    <Modal v-model="writeConfirm" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>编辑学校</span>
      </p>
      <div style="text-align:center">
        <Input v-model="writeSchoolCode" placeholder="请输入机构代码" style="margin-bottom: 20px"></Input>
        <Input v-model="writeSchoolName" placeholder="请输入学校名称" style="margin-bottom: 20px"></Input>
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
      schoolName: '',
      addSchoolCode: '',
      addSchoolName: '',
      writeSchoolCode: '',
      writeSchoolName: '',
      addConfirm: false,
      writeConfirm: false,
      selectItem: null,
      selectIndex: '',
      columns: [
          {
              title: '名称代码',
              key: 'schoolNameCode'
          },
          {
              title: '学校名称',
              key: 'schoolName'
          },
          {
              title: '状态',
              key: 'status',
              render: (h, params) => {
                return h('div', params.row.status ? '已注册' : '未注册');
              }
          }
      ],
      schoolList: []
    }
  },
  mixins: [common],
  created() {
    this.getSchoolList()
  },
  methods: {
    rowClick(item, index) {
      this.selectItem = item
      this.selectIndex = index
    },
    getSchoolList() {
      this.$http.post('school/getListSchool',{
        schoolName: this.schoolName
      }).then(res => {
        if (res.data.returnCode == 200) {
          this.schoolList = res.data.data
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
      if (!this.selectItem) {
        return this.warn('编辑警告', '请在列表中选择一条学校信息')
      }
      this.writeConfirm = true
      this.writeSchoolCode = this.selectItem.schoolNameCode
      this.writeSchoolName = this.selectItem.schoolName
    },
    del () {
      if (!this.selectItem) {
        return this.warn('删除警告', '请在列表中选择一条学校信息')
      }
    },
    querySchool() {
      this.getSchoolList()
    },
    changePage() {
      // 分页
    },
    addSchool() {
      let addSchoolCode = this.addSchoolCode.trim()
      let addSchoolName = this.addSchoolName.trim()
      if (addSchoolCode && addSchoolName) {
        this.addLoading = true
        this.$http.post('/school/addSchool',{
          schoolNameCode: addSchoolCode,
          schoolName: addSchoolName
        }).then(res => {
          this.addLoading = false
          if (res.data.returnCode == 200) {
            this.addSchoolCode = ''
            this.addSchoolName = ''
            this.schoolList.unshift(res.data.data)
            this.$Message.success('添加学校成功')
            this.addConfirm = false
          } else {
            this.error('添加学校失败')
          }
        }).catch(res => {
          this.addLoading = true
          this.error('添加学校失败')
        })
      } else {
        return this.error('机构代码或学校名称不能为空')
      }
    },
    writeSchool() {
      let writeSchoolCode = this.writeSchoolCode.trim()
      let writeSchoolName = this.writeSchoolName.trim()
      let id = this.selectItem.id
      if (writeSchoolCode && writeSchoolName) {
        this.writeLoading = true
        this.$http.post('/school/updateSchoolByKey',{
          id: id,
          schoolNameCode: writeSchoolCode,
          schoolName: writeSchoolName
        }).then(res => {
          this.writeLoading = false
          if (res.data.returnCode == 200) {
            this.schoolList[this.selectIndex].schoolNameCode = writeSchoolCode
            this.schoolList[this.selectIndex].schoolName = writeSchoolName
            this.$Message.success('编辑学校成功')
            this.writeConfirm = false
            this.writeSchoolCode = ''
            this.writeSchoolName = ''
            this.selectIndex = ''
            this.selectItem = null
          } else {
            this.error('编辑学校失败')
          }
        }).catch(res => {
          this.writeLoading = false
          this.error('编辑学校失败')
        })
      } else {
        return this.error('机构代码或学校名称不能为空')
      }
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
