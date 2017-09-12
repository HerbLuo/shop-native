<!--
    
    @author herbluo
    change logs:
    2017/6/19 herbluo created
-->
<template>
  <div class="top">
    <div class="count-box">
      <text class="count-text">合计：</text>
      <text class="count-price">￥{{count}}</text>
    </div>
    <div class="big-button buy-now">
      <text class="big-button-text">提交订单</text>
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
    background-color: #fff;

    flex-direction: row;
    justify-content: flex-end;
  }

  .count-box {
    height: 100px;
    padding-right: 30px;

    flex-direction: row;
    align-items: center;
  }

  .count-text {
    font-size: 28px;
  }

  .count-price {
    font-size: 30px;
    color: #f40;
  }

  .big-button {
    height: 100px;
    width: 240px;

    justify-content: center;
    align-items: center;
  }

  .big-button-text {
    color: white;
    font-size: 30px;
  }

  .buy-now {
    background-image: linear-gradient(to right, #ff7600, #ff1100);
    border-right-style: solid;
    border-right-width: 1px;
    border-right-color: #ff1100;
  }
</style>

<script>
  export default {
    name: 'oprator-bar',
    props: ['count']
  }
</script>

<style></style>