<!--
    选择套餐类型 颜色分类

    props item 必须 只需id正确 __see_item-detail-info-sheet

    @author herbluo
    change logs:
    2017/5/26 herbluo created
-->
<template>
  <div class="top">
    <div class="text-line with-bottom-line">
      <text class="text">选择套餐类型，颜色分类</text>
      <image
          class="icon"
          src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/item-right.png"
      ></image>
    </div>
    <div class="text-line" @click="onInfoShow">
      <text class="text">产品参数</text>
      <image
          class="icon"
          src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/item-right.png"
      ></image>
    </div>
    <item-detail-info-sheet
        v-if="infoRender"
        :item="item"
        @unRender="onInfoHide"
    ></item-detail-info-sheet>
  </div>
</template>

<style scoped>
  .top {
    height: 176px;
  }

  .text-line {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    height: 88px;
    padding-left: 25px;
    padding-right: 25px;
  }

  .with-bottom-line {
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #eee;
  }

  .text {
    font-size: 30px;
  }

  .icon {
    width: 40px;
    height: 40px;
  }

</style>

<script>
  import ItemDetailInfoSheet from './ItemDetailInfoSheet.vue'

  export default {
    components: {
      ItemDetailInfoSheet
    },
    props: ['item'],
    name: 'item-detail-bar',
    data () {
      return {
        infoRender: false
      }
    },
    methods: {
      onInfoShow () {
        this.infoRender = true
      },
      onInfoHide () {
        this.infoRender = false
      }
    }
  }
</script>

<style></style>