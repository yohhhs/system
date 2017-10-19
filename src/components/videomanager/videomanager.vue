<template>
    <div class="video-manager">
        <rolling></rolling>
        
        <div class="query-wrapper">
            <Row class="item" :gutter="16">
                <Col span="8">
                <span class="name">活动名称</span>
                <Input v-model="activeName" placeholder="请输入活动名称" style="width: 60%"></Input>
                </Col>
                <Col span="8">
                <span class="name">文件名称</span>
                <Input v-model="fileName" placeholder="请输入文件名称" style="width: 60%"></Input>
                </Col>
                <Col span="8">
                <span class="name">学校名称</span>
                <Input v-model="schoolName" placeholder="请输入学校名称" style="width: 60%"></Input>
                </Col>
            </Row>
            <Row class="item" :gutter="16">
                <Col span="8">
                    <span class="name">文件类型</span>
                    <!-- <Select v-model="model1" style="width:60%" placeholder='全部'>
                        <Option>全部</Option>
                    </Select> -->
                </Col>
                <Col span="8">
                    <span class="name">上传日期</span>
                    <DatePicker :value="time" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 60%"></DatePicker>
                </Col>
                <Col span="8">
                    <Button type="primary" :loading="queryLoading">
                        <span v-if="!queryLoading">查询</span>
                        <span v-else>Loading...</span>
                    </Button>
                </Col>
            </Row>
        </div>
        <div class="btns-wrapper">
            <Button type="primary" style="margin-right:15px;">添加</Button>
            <Button type="primary">编辑</Button>
            <Button type="primary">删除</Button>
            <Button type="primary">查看</Button>
            <Button type="primary">下载</Button>
        </div>
        <Table border :columns="columns4" :data="data1"></Table>
        <div class="page-wrapper">
            <Page @on-change='changePage' :total="100" show-elevator></Page>
        </div>
        
    </div>
</template>
<script>
import Rolling from 'base/rolling/rolling'

export default {
    data() {
        return {
            queryLoading: false,
            activeName: '',
            fileName: '',
            schoolName: '',
            time: '',
            columns4: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
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
                        title: '文件类型',
                        key: 'fileType'
                    },
                    {
                        title: '视频大小',
                        key: 'videoSize'
                    },
                    {
                        title: '上传人',
                        key: 'people'
                    },
                    {
                        title: '上传日期',
                        key: 'time'
                    }
                ],
                data1: [
                    {
                        fileName: '羽毛球视频',
                        activeName: '一校一品活动',
                        schoolName: '北京市四川大学朝阳区芍药居北京市四川大学朝阳区芍药居',
                        fileType: '视频',
                        videoSize: '70M',
                        people: '王小明',
                        time: '2017-08-08 14:20:33'
                    },
                    {
                        fileName: '羽毛球视频',
                        activeName: '一校一品活动',
                        schoolName: '北京市四川大学朝阳区芍药居北京市四川大学朝阳区芍药居',
                        fileType: '视频',
                        videoSize: '70M',
                        people: '王小明',
                        time: '2017-08-08 14:20:33'
                    }
                ]
        }
    },
    components: {
        Rolling
    },
    methods: {
        changePage(num) {
            console.log(num)
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