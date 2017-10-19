<template>
  <div class="school-member">
    <div class="query-wrapper">
            <Row class="item" :gutter="16">
                <Col span="6">
                <span class="name">手机号</span>
                <Input v-model="activeName" placeholder="请输入手机号" style="width: 60%"></Input>
                </Col>
                <Col span="6">
                <span class="name">姓名</span>
                <Input v-model="fileName" placeholder="请输入姓名" style="width: 60%"></Input>
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
            <Button type="primary">修改</Button>
            <Button type="primary">删除</Button>
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
              title: '姓名',
              key: 'name'
          },
          {
              title: '职务',
              key: 'job'
          },
          {
              title: '手机号码',
              key: 'moble'
          },
          {
              title: '关联学校数量',
              key: 'schoolNum'
          }
      ],
      data1: [
        {
          name: '张三',
          job: '主任',
          moble: '18484848484',
          schoolNum: 4
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