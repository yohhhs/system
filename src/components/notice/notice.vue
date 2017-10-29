<template>
  <div class="school-member">
    <div class="query-wrapper">
      <Row class="item" :gutter="16">
        <Col span="6">
        <span class="name">活动名称</span> 
        <Select placeholder="请选择活动名称"  @on-change="changeActive" :clearable='clearable' :filterable='filterable' style="width: 60%">
          <Option v-if="activeList" v-for="item in activeList" :value="item.id" :key="item.id">{{ item.codeValue }}</Option>
        </Select>
        </Col>
        <Col span="6">
        <Button type="primary" :loading="queryLoading" @click='queryNotice'>
          <span v-if="!queryLoading">查询</span><span v-else>Loading...</span>
        </Button>
        </Col>
      </Row>
    </div>
    <div class="btns-wrapper">
      <Button type="primary" v-for="(item, index) in handles" :key='index' v-if="item.turn" style="margin-right:15px;" @click="btn(item.name)">{{item.name}}</Button>
    </div>
    <Table @on-row-click='tableClick' :highlight-row='highlight' border :columns="columns" :data="listData"></Table>
    <div class="page-wrapper">
      <Page @on-change='changePage' :total="total" show-elevator></Page>
    </div>
    <Modal @on-cancel='addConfirmClose' v-model="addConfirm" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>添加通知公告</span>
      </p>
      <div style="text-align:center">
        <Select ref='addSelect1' placeholder="请选择活动名称" :clearable='clearable' :filterable='filterable'  @on-change="addChangeActive" style="margin-bottom: 20px">
          <Option v-for="item in activeList" :value="item.id" :key="item.id">{{ item.codeValue }}</Option>
        </Select>
        <Input
        v-model="addActiveBody" placeholder="请输入公告内容" style="margin-bottom: 20px"></Input>
        <Select ref='addSelect2' placeholder="请选择状态"
        placement="top" @on-change="addChange">
          <Option v-for="item in turns" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="addLoading" @click="addNotice">确定</Button>
      </div>
    </Modal>
    <Modal v-model="writeConfirm" width="360" @on-cancel='writeConfirmClose'>
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>编辑通知公告</span>
      </p>
      <div style="text-align:center">
        <Select ref='writeSelect1' placeholder="请选择活动名称" :clearable='clearable' :filterable='filterable'  @on-change="writeChangeActive" style="margin-bottom: 20px">
          <Option v-for="item in activeList" :value="item.id" :key="item.id">{{ item.codeValue }}</Option>
        </Select>
         <Input
        v-model="writeActiveBody" placeholder="请输入公告内容" style="margin-bottom: 20px"></Input>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="writeLoading" @click="writeNotice">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {common} from 'common/js/mixin'
  import {getTime} from 'common/js/util'
  export default {
    data () {
      return {
        highlight: true,
        filterable: true,
        clearable: true,
        total: 0,
        curPageNo: 1,
        actionName: '',
        noticeContent: '',
        addActiveId: '',
        addActiveBody: '',
        writeActiveId: '',
        writeActiveBody: '',
        addSelectValue: '',
        activeList: null,
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
            title: '活动名称',
            key: 'dictionActionName'
          },
          {
            title: '公告内容',
            key: 'noticeContent'
          },
          {
            title: '创建人',
            key: 'memberName'
          },
          {
            title: '创建日期',
            key: 'createDate',
            render: (h, params) => {
              return h('div', getTime(`${params.row.createDate}`));
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
        listData: []
      }
    },
    mixins: [common],
    created () {
      this.getList()
      this.getActiveList()
    },
    methods: {
      tableClick(row, index) {
        this.selectItem = row
        this.selectIndex = index
      },
      queryNotice() {
        this.curPageNo = 1
        this.getList()
      },
      getActiveList() {
        this.$http.post('dictionary/getDictionaryList',{
          dictionaryTypeId: 'e7e73821b89311e7aa39309c232d4bfb'
        }).then(res => {
          this.activeList = res.data.data
        })
      },
      getList() {
        this.$http.post('/notice/noticeMemberQuery',{
          curPageNo: this.curPageNo,
          actionName: this.actionName,
          noticeContent: this.noticeContent
        }).then(res => {
          if (res.data.returnCode == 200) {
            this.listData = res.data.data.list
            this.total = res.data.data.total
          }
        }).catch(res => {
          console.log(res)
        })
      },
      add () {
        this.addConfirm = true
      },
      write () {
        if (!this.selectItem) {
          return this.warn('编辑警告', '请在列表中选择一条公告')
        }
        this.writeConfirm = true
        this.writeActiveBody = this.selectItem.noticeContent
      },
      writeChangeActive(id) {
        this.writeActiveId = id
      },
      del () {
        if (!this.selectItem) {
          return this.warn('删除警告', '请在列表中选择一条公告')
        }
        this.$http.post('/notice/noticeDelete',{
          id: this.selectItem.id
        }).then(res => {
          if (res.data.returnCode == 200) {
            this.$Message.success('删除成功')
            this.curPageNo = 1
            this.getList()
            this.selectItem = null
            this.selectIndex = ''
          }
        })
      },
      turnOn () {
        if (!this.selectItem) {
          return this.warn('启用警告', '请在列表中选择一条公告')
        }
        this.$http.post('/notice/noticeSetStatus',{
          id: this.selectItem.id,
          Status: 1
        }).then(res => {
            if (res.data.returnCode == 200) {
              this.$Message.success('启用成功')
              this.listData[this.selectIndex].status = 1
              this.selectItem = null
              this.selectIndex = ''
            }
        })
      },
      turnOff () {
        if (!this.selectItem) {
          return this.warn('禁用警告', '请在列表中选择一条公告')
        }
        this.$http.post('/notice/noticeSetStatus',{
          id: this.selectItem.id,
          Status: 0
        }).then(res => {
          if (res.data.returnCode == 200) {
            this.$Message.success('禁用成功')
            this.listData[this.selectIndex].status = 0
            this.selectItem = null
            this.selectIndex = ''
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
          case '启用':
            this.turnOn()
            break;
          case '禁用':
            this.turnOff()
            break;
        }
      },
      addNotice() {
        let addActiveId = this.addActiveId
        let status = this.addSelectValue
        let addActiveBody = this.addActiveBody.trim()
        if (addActiveId && addActiveBody) {
          this.addLoading = true
          this.$http.post('/notice/noticeAdd',{
            actionName: addActiveId,
            noticeContent: this.addActiveBody,
            status: status
          }).then(res => {
            this.addLoading = false
            if (res.data.returnCode == 200) {
              this.addConfirm = false
              this.curPageNo = 1
              this.getList()
              this.addConfirmClose()
              this.$Message.success('添加成功')
            }
          })
        } else {
          this.error('活动或者内容不能为空')
        }
      },
      writeNotice() {
        let writeActiveId = this.writeActiveId
        let writeActiveBody = this.writeActiveBody.trim()
        if (writeActiveId && writeActiveBody) {
          this.writeLoading = true
          this.$http.post('/notice/noticeUpdate',{
              actionName: writeActiveId,
              noticeContent: writeActiveBody,
              id: this.selectItem.id
          }).then(res => {
            if (res.data.returnCode == 200) {
              console.log(this.selectIndex)
              this.writeLoading = false
              this.writeConfirmClose()
              this.writeConfirm = false
              this.listData[this.selectIndex].noticeContent = writeActiveBody
              this.$Message.success('修改成功')
              this.selectItem = null
              this.selectIndex = ''
            }
          })
        } else {
          this.error('活动或内容不能为空')
        }
      },
      addConfirmClose() {
        this.addLoading = false
        this.addActiveBody = ''
        this.$refs.addSelect1.clearSingleSelect()
        this.$refs.addSelect2.clearSingleSelect()
      },
      writeConfirmClose() {
        this.writeLoading = false
        this.writeActiveBody = ''
        this.$refs.writeSelect1.clearSingleSelect()
      },
      addChange(val) {
        this.addSelectValue = val
      },
      changePage (num) {
        this.curPageNo = num
        this.getList()
      },
      changeActive(id) {
        this.actionName = id
      },
      addChangeActive(id) {
        this.addActiveId = id
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
