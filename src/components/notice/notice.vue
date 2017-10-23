<template>
  <div class="school-member">
    <div class="query-wrapper">
      <Row class="item" :gutter="16">
        <Col span="6">
        <span class="name">活动名称</span> <Input v-model="activeName" placeholder="请输入活动名称"
        style="width: 60%"></Input></Col>
        <Col span="6">
        <span class="name">公告内容</span> <Input v-model="activeBody" placeholder="公告内容" style="width: 60%"></Input></Col>
        <Col span="6">
        <Button type="primary" :loading="queryLoading">
          <span v-if="!queryLoading">查询</span><span v-else>Loading...</span>
        </Button>
        </Col>
      </Row>
    </div>
    <div class="btns-wrapper">
      <Button type="primary" v-for="(item, index) in handles" v-if="item.turn" style="margin-right:15px;" @click="btn(item.name)">{{item.name}}</Button>
    </div>
    <Table @on-selection-change="select" border :columns="columns" :data="listData"></Table>
    <div class="page-wrapper">
      <Page @on-change='changePage' :total="100" show-elevator></Page>
    </div>
    <Modal v-model="addConfirm" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>添加通知公告</span>
      </p>
      <div style="text-align:center">
        <Input v-model="addActiveName" placeholder="请输入活动名称" style="margin-bottom: 20px"></Input> <Input
        v-model="addActiveBody" placeholder="请输入公告内容" style="margin-bottom: 20px"></Input> <Select placeholder="启用"
        placement="top" @on-change="addChange" :value="1">
        <Option v-for="item in turns" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="addQuery" @click="addNotice">确定</Button>
      </div>
    </Modal>
    <Modal v-model="writeConfirm" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>编辑通知公告</span>
      </p>
      <div style="text-align:center">
        <Input v-model="writeActiveName" placeholder="请输入活动名称" style="margin-bottom: 20px"></Input> <Input
        v-model="writeActiveBody" placeholder="请输入公告内容" style="margin-bottom: 20px"></Input>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="wirteQuery" @click="writeNotice">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        addConfirm: false,
        writeConfirm: false,
        queryLoading: false,
        addQuery: false,
        wirteQuery: false,
        selectNum: 0,
        selectArray: [],
        activeName: '',
        activeBody: '',
        addActiveName: '',
        addActiveBody: '',
        writeActiveName: '',
        writeActiveBody: '',
        addSelectValue: 1,
        handles: [],
        turns: [{
          label: '启用',
          value: 1
        }, {
          label: '禁用',
          value: 0
        }],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '活动名称',
            key: 'actionName'
          },
          {
            title: '公告内容',
            key: 'noticeContent'
          },
          {
            title: '创建人',
            key: 'bMemberId'
          },
          {
            title: '创建日期',
            key: 'createDate',
            render: (h, params) => {
              return h('div', this.getTime(`${params.row.createDate}`));
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
    created () {
      this.getList()
      this.userInfo.authList.forEach(item => {
        item.children.forEach(child => {
          if (child.route === this.$route.fullPath) {
            console.log(child.handles)
            this.handles = child.handles
          }
        })
      })
    },
    methods: {
      getList() {
        this.$http.post('/notice/getNoticeList').then(res => {
          if (res.data.returnCode == 200) {
            this.listData = res.data.data
          }
        }).catch(res => {
          console.log(res)
        })
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
      },
      add () {
        this.addConfirm = true
      },
      write () {
        if (this.selectNum !== 1) {
          return this.warn('编辑警告', '请在列表中选择一条公告，且不能多选')
        }
        this.writeConfirm = true
        this.writeActiveName = this.selectArray[0].actionName
        this.writeActiveBody = this.selectArray[0].noticeContent
      },
      del () {
        if (this.selectNum === 0) {
          return this.warn('删除警告', '请在列表中至少选择一条公告，可以多选')
        }
        this.$http.post('/notice/noticeDelete').then(res => {
          if (res.data.returnCode == 200) {
          }
        })
      },
      turnOn () {
        if (this.selectNum === 0) {
          return this.warn('启用警告', '请在列表中至少选择一条公告，可以多选')
        }
        this.$http.post('/notice/noticeAdd').then(res => {
          if (res.data.returnCode == 200) {
          }
        })
      },
      turnOff () {
        if (this.selectNum === 0) {
          return this.warn('禁用警告', '请在列表中至少选择一条公告，可以多选')
        }
        this.$http.post('/notice/noticeAdd').then(res => {
          if (res.data.returnCode == 200) {
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
        let addActiveName = this.addActiveName.trim()
        let addActiveBody = this.addActiveBody.trim()
        if (addActiveName && addActiveBody) {
          this.$http.post('/notice/noticeAdd').then(res => {
            if (res.data.returnCode == 200) {
            }
          })
        } else {
          this.error('名称或内容不能为空')
        }
      },
      writeNotice() {
        let writeActiveName = this.writeActiveName.trim()
        let writeActiveBody = this.writeActiveBody.trim()
        if (writeActiveBody && writeActiveBody) {
          this.$http.post('/notice/noticeUpdate').then(res => {
            if (res.data.returnCode == 200) {
            }
          })
        } else {
          this.error('名称或内容不能为空')
        }
      },
      addChange(val) {
        this.addSelectValue = val
      },
      select (selection) {
        this.selectNum = selection.length
        this.selectArray = selection
        console.log(selection)
      },
      changePage (num) {
        console.log(num)
      },
      getTime (UnixTime) {
        var a = UnixTime.replace('/Date(', '').replace(')/', '')
        var date = new Date(parseInt(a))
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        m = m < 10 ? ('0' + m) : m
        var d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        var h = date.getHours()
        h = h < 10 ? ('0' + h) : h
        var minute = date.getMinutes()
        var second = date.getSeconds()
        minute = minute < 10 ? ('0' + minute) : minute
        second = second < 10 ? ('0' + second) : second
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
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
