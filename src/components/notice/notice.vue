<template>
  <div class="school-member">
    <div class="query-wrapper">
            <Row class="item" :gutter="16">
                <Col span="6">
                <span class="name">活动名称</span>
                <Input v-model="activeName" placeholder="请输入活动名称" style="width: 60%"></Input>
                </Col>
                <Col span="6">
                <span class="name">公告内容</span>
                <Input v-model="activeName" placeholder="公告内容" style="width: 60%"></Input>
                </Col>
                <Col span="6">
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
            <Button type="primary">启用/禁用</Button>
        </div>
        <Table border :columns="columns4" :data="data1"></Table>
        <div class="page-wrapper">
            <Page @on-change='changePage' :total="100" show-elevator></Page>
        </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      columns4: [
          {
              type: 'selection',
              width: 60,
              align: 'center'
          },
          {
              title: '活动名称',
              key: 'activeName'
          },
          {
              title: '公告内容',
              key: 'notice'
          },
          {
              title: '创建人',
              key: 'people'
          },
          {
              title: '创建日期',
              key: 'time'
          },
          {
              title: '状态',
              key: 'state'
          }
      ],
      data1: [
        {
          activeName: '一校一品',
          notice: '四川大学',
          people: '张三',
          time: '2008-8-8',
          state: '启用'
        }
      ]
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