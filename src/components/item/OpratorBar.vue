<!--
    
    @author herbluo
    change logs:
    2017/5/31 herbluo created
-->
<template>
  <div class="top">
    <div class="small-button border-right">
      <image
          class="small-button-image"
          src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/item-op-chat.png"
      ></image>
      <text class="small-button-text">客服</text>
    </div>
    <div class="small-button border-right">
      <image
          class="small-button-image"
          src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/item-op-shop.png"
      ></image>
      <text class="small-button-text">店铺</text>
    </div>
    <div class="small-button">
      <image
          class="small-button-image"
          src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/item-op-collect.png"
      ></image>
      <text class="small-button-text">收藏</text>
    </div>
    <div class="big-button add-to-car">
      <text class="big-button-text">加入购物车</text>
    </div>
    <div class="big-button buy-now" @click="buy">
      <text class="big-button-text">立即购买</text>
    </div>
  </div>
</template>

<style scoped>
  .top {
    position: fixed;
    bottom: 0;
    left: 0;

    height: 100px;
    width: 750px;

    flex-direction: row;
  }

  .small-button {
    flex: 2;

    border-top-style: solid;
    border-top-width: 1px;
    border-top-color: #ddd;

    align-items: center;
    justify-content: center;

    background-color: #fff;
  }

  .border-right {
    border-right-style: solid;
    border-right-width: 1px;
    border-right-color: #ddd;
  }

  .small-button-image {
    width: 45px;
    height: 45px;
    margin-bottom: 5px;
  }

  .small-button-text {
    color: #888;
    font-size: 20px;
  }

  .big-button {
    flex: 5;

    justify-content: center;
    align-items: center;
  }

  .big-button-text {
    color: white;
    font-size: 30px;
  }

  .add-to-car {
    background-image: linear-gradient(to right, #ffdc00, #ffa11d);
    border-right-style: solid;
    border-right-width: 1px;
    border-right-color: #ffa11d;
  }

  .buy-now {
    background-image: linear-gradient(to right, #ff7600, #ff1100);
    border-right-style: solid;
    border-right-width: 1px;
    border-right-color: #ff1100;
  }
</style>

<script>
  import {waitWhileLogin} from '../../utils/app/login'

  export default {
    name: 'oprator-bar',
    methods: {
      buy () {
        waitWhileLogin('Order').then((state) => {
          if (state) {
            setTimeout(() => {
              this.push('Order')
            }, 0)
          }
        })
      }
    }
  }
</script>

<style></style>