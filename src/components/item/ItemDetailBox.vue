<!--
    商品详情（轮播图下方的商品介绍）

    props: item 非必须 只需商品id

    @author herbluo
    change logs:
    2017/5/26 herbluo created
-->
<template>
  <div class="top">
    <div class="row" v-if="item">
      <text class="name" :lines="2">{{item.name}}</text>
      <div class="share">
        <image
            class="share-img"
            src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/item-share.png"
        ></image>
        <text class="share-text">分享</text>
      </div>
    </div>
    <div class="row" v-if="item">
      <div class="sym-box">
        <text class="sym">¥</text>
      </div>
      <text class="price">{{item.price}}</text>
    </div>
    <div class="row selling-info" v-if="item">
      <text class="selling-info-text">{{'快递:' + '暂无API'}}</text>
      <text class="selling-info-text">{{'销售' + item.itemSellingInfo.sales + '笔'}}</text>
      <text class="selling-info-text">{{'无发货地址API'}}</text>
    </div>
  </div>
</template>

<style scoped>
  .top {
    height: 250px;
  }

  .row {
    flex-direction: row;
  }

  .name {
    width: 630px;

    padding-left: 25px;
    padding-right: 25px;
    padding-top: 20px;
    padding-bottom: 3px;

    font-size: 34px;
    line-height: 52px;
  }

  .share {
    width: 120px;
    height: 120px;
    padding-top: 20px;
    justify-content: space-around;
    align-items: center;
  }

  .share-img {
    width: 50px;
    height: 50px;
  }

  .share-text {
    font-size: 20px;
    color: #999;
  }

  .price {
    font-size: 46px;
    color: #f40;
  }

  .sym-box {
    padding-left: 25px;
    height: 50px;

    justify-content: flex-end;
  }

  .sym {
    color: #f40;
    font-size: 32px;
  }

  .selling-info {
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 25px;

    justify-content: space-between;
  }

  .selling-info-text {
    color: #999;
    font-size: 26px;
  }


</style>

<script>
  export default {
    name: 'item-detail-box',
    props: ['item']
  }
</script>

<style></style>