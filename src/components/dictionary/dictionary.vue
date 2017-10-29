<template>
    <div class="dictionary">
        <div class="query-wrapper">
        <Row class="item" :gutter="16">
            <Col span="6">
            <span class="name">字典类型</span>
            <Select v-if="turns" :value="turns && turns[0].id" placeholder="请选择字典类型" @on-change="typeChange" style="width: 60%">
            <Option v-for="item in turns" :value="item.id" :key="item.id">{{ item.codeValue }}</Option>
            </Select>
            </Col>
        </Row>
        <div class="btns-wrapper">
            <Button type="primary" @click="addDictionary" style="margin-right: 15px;">添加</Button>
        </div>
        </div>
        <div class="list-wrapper">
            <p class="title">字典名称</p>
            <div>
                <Row class="item" :gutter="16">
                    <Col style="margin-bottom: 20px;" span="3" v-if="listData" v-for="(item, index) in listData" :key='item.id'>
                        <span style="cursor: pointer" @click='changeDictionary(index, item)'>{{item.codeValue}}</span>
                    </Col>
                </Row>
            </div>
        </div>
        <Modal v-model="addConfirm" width="360" @on-cancel='addConfirmClose'>
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>添加字典</span>
        </p>
        <div style="text-align:center">
            <Input v-model="addValue" placeholder="请输入字典名称" style="margin-top: 15px"></Input>
        </div>
        <div slot="footer">
            <Button type="primary" size="large" long :loading="addLoading" @click="queryAddDictionary">确定</Button>
        </div>
        </Modal>
        <Modal v-model="writeConfirm" width="360" @on-cancel='writeConfirmClose'>
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>编辑字典</span>
        </p>
        <div style="text-align:center">
            <Input v-model="currentValue" placeholder="请输入字典名称" style="margin-top: 15px"></Input>
        </div>
        <div slot="footer">
            <Button type="primary" size="large" long :loading="writeLoading" @click="writeDictionary">确定</Button>
        </div>
        </Modal>
    </div>
</template>
<script>
import {common} from 'common/js/mixin'

export default {
  data () {
    return {
        addValue: '',
        currentValue: '',
        currentIndex: '',
        turns: null,
        currentTypeId: '',
        writeDictionaryName: '',
        columns: [
            {
                type: 'selection',
                width: 60,
                align: 'center'
            },
            {
                title: '字典名称',
                key: 'codeValue'
            }
        ],
        listData: null
    }
  },
  mixins: [common],
  created() {
      this.getType()
  },
  methods: {
      getType() {
          this.$http.post('dictionary/getDictionarTypeList').then(res => {
              if (res.data.returnCode == 200) {
                  this.turns = res.data.data
                  this.getList(res.data.data[0].id)
              }
          })
      },
      getList(id) {
          this.$http.post('dictionary/getDictionaryList',{
              dictionaryTypeId: id
          }).then(res => {
              if (res.data.returnCode == 200) {
                this.listData = res.data.data
              }
          })
      },
      typeChange(id) {
          this.currentTypeId = id
          this.getList(id)
      },
      addDictionary() {
          this.addConfirm = true
      },
      addConfirmClose() {
          this.addValue = ''
      },
      writeConfirmClose() {
      },
      changeDictionary(index, item) {
          this.writeConfirm = true
          this.currentValue = item.codeValue
          this.currentIndex = index
      },
      queryAddDictionary() {
          let text = this.addValue.trim()
          let id = this.currentTypeId == '' ? this.turns[0].id : this.currentTypeId
          if (text) {
              this.addLoading = true
              this.$http.post('dictionary/addDictionary',{
                  dictionaryTypeId: id,
                  codeValue: text
              }).then(res => {
                  this.addLoading = false
                  console.log(res)
                  if (res.data.returnCode == 200) {
                      this.listData.push(res.data.data)
                      this.addConfirm = false
                      this.addValue = ''
                      this.$Message.success('添加成功')
                  }
              })
          } else {
              this.error('字典名称不能为空')
          }
      },
      writeDictionary() {
          let text = this.currentValue.trim()
          let id = this.listData[this.currentIndex].id
          if (text) {
              this.writeLoading = true
              this.$http.post('dictionary/updateDictionary',{
                dictionaryId: id,
                codeValue: text
              }).then(res => {
                  this.writeLoading = false
                  if (res.data.returnCode == 200) {
                      this.$Message.success('修改成功')
                      this.listData[this.currentIndex].codeValue = text
                      this.writeConfirm = false
                  }
              })
          } else {
              this.error('字典名称不能为空')
          }
      }
  }
}
</script>
<style lang="stylus" scoped>
.dictionary {
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
    .btns-wrapper {
      margin: 25px 0;
    }
    .list-wrapper {
        text-align: center
        .title {
            margin-bottom: 10px
            font-size: 14px
            font-weight: 700
        }
    }
}

</style>