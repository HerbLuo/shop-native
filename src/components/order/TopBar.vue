<!--
    
    @author herbluo
    change logs:
    2017/6/5 herbluo created
-->
<template>
  <div class="top">
    <div class="back" @click="back">
      <image
          class="back-image"
          src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/item-back.png"
      ></image>
    </div>
    <text class="ensure-order-text">确认订单</text>
  </div>
</template>

<style scoped>
  .top {
    height: 100px;
    width: 750px;

    flex-direction: row;
    align-items: center;

    background-color: #f40;
  }

  .back {
    width: 100px;
    height: 100px;

    justify-content: center;
    align-items: center;
  }

  .back-image {
    width: 50px;
    height: 50px;
  }

  .ensure-order-text {
    color: white;
    font-size: 36px;
  }
</style>

<script>
  export default {
    name: 'top-bar',
    methods: {
      back () {
        this.pop()
      }
    }
  }
</script>

<style></style>