<template>
  <div class="video-manager">
    <rolling :noticeList='noticeList'></rolling>

    <div class="query-wrapper">
      <Row class="item" :gutter="16">
        <Col span="8">
        <span class="name">活动名称</span> 
        <Select placeholder="请选择活动名称"  @on-change="changeActive" :clearable='clearable' :filterable='filterable' style="width: 60%">
          <Option v-for="item in activeList" :value="item.id" :key="item.id">{{ item.codeValue }}</Option>
        </Select>
        </Col>
        <Col span="8">
        <span class="name">学校名称</span>
        <Select placeholder="请选择学校" @on-change="changeSchoolId" :clearable='clearable' :filterable='filterable' style="width: 60%">
          <Option v-for="item in schoolList" :value="item.id" :key="item.id">{{ item.schoolName }}</Option>
        </Select>
        </Col>
        <Col span="8">
        <span class="name">文件名称</span> <Input v-model="fileName" placeholder="请输入文件名称" style="width: 60%"></Input></Col>
      </Row>
      <Row class="item" :gutter="16">
        <Col span="8">
        <span class="name">上传日期</span>
        <DatePicker @on-change='timeChange' type="datetimerange" placement="bottom-end" placeholder="选择日期"
          style="width: 60%"></DatePicker>
        </Col>
        <Col span="8">
        <Button type="primary" :loading="queryLoading" @click='queryVideoList'>
          <span v-if="!queryLoading">查询</span> <span v-else>Loading...</span>
        </Button>
        </Col>
      </Row>
    </div>
    <div class="btns-wrapper">
      <Button type="primary" v-for="(item, index) in handles" v-if="item.turn" :key='item.name' style="margin-right:15px;"
        @click="btn(item.name)">{{item.name}}
      </Button>
    </div>
    <Table  @on-row-click='tableClick' highlight-row border :columns="columns" :data="videoList"></Table>
    <div class="page-wrapper">
      <Page @on-change='changePage' :total="total" show-elevator></Page>
    </div>
    
    <Modal v-model="addConfirm" width="360" @on-cancel='addConfirmClose'>
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>添加视频</span>
        </p>
        <div style="text-align:center">
            <Select ref='addSelect' placeholder="请选择活动名称" :clearable='clearable' :filterable='filterable'  @on-change="addChangeActive" style="margin-bottom: 20px">
              <Option v-for="item in activeList" :value="item.id" :key="item.id">{{ item.codeValue }}</Option>
            </Select>
            <Upload ref='upLoad' style="width: 100%" :on-success='upLoad' :before-upload='beforeUpload' action="//192.168.3.144/box-education/uploadFile/doUploadFile" accept='video/*'>
              <Button style="width: 100%;border-color:#495060;" type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
        </div>
        <div slot="footer">
            <Button type="primary" size="large" long :loading="addLoading" @click="AddVideo">确定</Button>
        </div>
      </Modal>
      <Modal v-model="writeConfirm" width="360" @on-cancel='writeConfirmClose'>
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>编辑视频</span>
      </p>
      <div style="text-align:center">
        <Select ref='writeSelect' placeholder="请选择活动名称" :clearable='clearable' :filterable='filterable'  @on-change="writeChangeActive" style="margin-top: 15px">
            <Option v-for="item in activeList" :value="item.id" :key="item.id">{{ item.codeValue }}</Option>
          </Select>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="writeLoading" @click="writeVideo">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import Rolling from 'base/rolling/rolling'
  import { common } from 'common/js/mixin'
  import {getTime} from 'common/js/util'

  export default {
    data () {
      return {
        noticeList: [],
        highlight: true,
        writeActiveId: '',
        clearable: true,
        filterable: true,
        activeId: '',
        addActiveId: '',
        fileName: '',
        schoolId: '',
        startTime: '',
        endTime: '',
        activeList: null,
        currentVideo: null,
        schoolList: null,
        pageNum: 1,
        total: 0,
        selectItem: null,
        selectIndex: '',
        turns: [],
        columns: [
          // {
          //     type: 'selection',
          //     width: 60,
          //     align: 'center'
          // },
          {
            title: '文件名称',
            key: 'fileName'
          },
          {
            title: '活动名称',
            key: 'activeName'
          },
          {
            title: '学校名称',
            key: 'schoolName'
          },
          {
            title: '视频大小',
            key: 'fileSize',
            render: (h, params) => {
              return h('div', Number(params.row.fileSize).toFixed(2) + 'M');
            }
          },
          {
            title: '上传人',
            key: 'bMemberId'
          },
          {
            title: '上传日期',
            key: 'updateDate'
          }
        ],
        videoList: []
      }
    },
    mixins: [common],
    components: {
      Rolling
    },
    created() {
      this.getVideoList()
      this.getActiveList()
      this.getSchoolList()
      this.getNoticeList()
    },
    methods: {
      getNoticeList() {
        this.$http.post('/notice/noticeMemberQuery',{
          curPageNo: 1,
          actionName: '',
          noticeContent: ''
        }).then(res => {
          if (res.data.returnCode == 200) {
            this.noticeList = res.data.data.list
          }
        }).catch(res => {
          console.log(res)
        })
      },
      tableClick(item, index) {
        this.selectItem = item
        this.selectIndex = index
      },
      queryVideoList() {
        this.pageNum = 1
        this.getVideoList()
      },
      getVideoList() {
        this.$http.post('media/getMediaList',{
          fileName: this.fileName,
          activeName: this.activeId,
          bSchoolId: this.schoolId,
          beginDate: this.startTime,
          endDate: this.endTime,
          pageNum: this.pageNum
        }).then(res => {
          if (res.data.returnCode == 200) {
            this.total = res.data.data.total
            this.videoList = res.data.data.list
          }
        })
      },
      getSchoolList() {
        this.$http.post('school/getListSchool').then(res => {
          if (res.data.returnCode == 200) {
            this.schoolList = res.data.data
          }
        })
      },
      getActiveList() {
        this.$http.post('dictionary/getDictionaryList',{
          dictionaryTypeId: 'e7e73821b89311e7aa39309c232d4bfb'
        }).then(res => {
          this.activeList = res.data.data
        })
      },
      changePage (num) {
        this.pageNum = num
        this.getVideoList()
      },
      btn (name) {
        switch (name) {
          case '添加':
            this.add()
            break
          case '编辑':
            this.write()
            break
          case '删除':
            this.del()
            break
          case '下载':
            this.down()
            break
        }
      },
      add () {
        this.addConfirm = true
      },
      write () {
        if (!this.selectItem) {
          return this.warn('编辑警告', '请在列表中选择一条专家信息')
        }
        this.writeConfirm = true
      },
      del () {
        if (!this.selectItem) {
          return this.warn('删除警告', '请在列表中选择一条专家信息')
        }
        this.$http.post('media/deleteMedia',{
          mediaId: this.selectItem.id
        }).then(res => {
          if (res.data.returnCode == 200) {
            this.$Message.success('删除成功')
            this.pageNum = 1
            this.getVideoList()
          }
        })
      },
      down() {
        if (!this.selectItem) {
          return this.warn('下载警告', '请在列表中选择一条专家信息')
        }
        this.downLoadFile(this.selectItem.fileName, this.selectItem.filePath)
      },
      downLoadFile(fileName, filePath) {
        let aLink = document.createElement('a')
        aLink.download = fileName
        aLink.href = `http://192.168.3.144/box-education/uploadFile/downloadFile?fileUrl=` + filePath + `&fileName=` + fileName
        aLink.click()
      },
      changeSchoolId (id) {
        this.schoolId = id
      },
      upLoad(res, file) {
        this.currentVideo = file
        console.log(this.currentVideo)
      },
      beforeUpload(file) {
        if (this.currentVideo) {
          this.$refs.upLoad.clearFiles()
        }
      },
      changeActive(id) {
        this.activeId = id
      },
      addChangeActive(id) {
        this.addActiveId = id
      },
      AddVideo() {
        if (this.addActiveId === '') {
          return this.error('请选择活动')
        }
        if (!this.currentVideo) {
          return this.error('请上传视频')
        }
        this.addLoading = true
        this.$http.post('media/addMedia',{
          fileName: this.currentVideo.name,
          filePath: this.currentVideo.response.data,
          activeName: this.addActiveId,
          fileSize: this.currentVideo.size / 1024 / 1024,
          fileType: 1
        }).then(res => {
          this.addLoading = false
          if (res.data.returnCode == 200) {
            this.$Message.success('添加成功')
            this.addConfirm = false
            this.addConfirmClose()
            this.getVideoList()
          }
        })
      },
      addConfirmClose() {
        this.currentVideo = null
        this.$refs.upLoad.clearFiles()
        this.$refs.addSelect.clearSingleSelect()
      },
      writeConfirmClose() {
        this.$refs.writeSelect.clearSingleSelect()
      },
      timeChange(time) {
        this.startTime = time[0]
        this.endTime = time[1]
      },
      writeChangeActive(id) {
        this.writeActiveId = id
      },
      writeVideo() {
        if (this.writeActiveId == '') {
          return this.error('请选择活动')
        }
        this.$http.post('media/updateMedia',{
          activeId: this.writeActiveId,
          mediaId: this.selectItem.id
        }).then(res => {
          if (res.data.returnCode == 200) {
            this.$Message.success('修改成功')
            this.writeConfirm = false
            this.writeConfirmClose()
            this.getVideoList()
          }
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .video-manager {
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
