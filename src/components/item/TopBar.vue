<!--
    
    @author herbluo
    change logs:
    2017/5/31 herbluo created
-->
<template>
  <div class="top" :style="topBind">
    <div class="left">
      <div class="cicle-btn back-btn" @click="back">
        <image
            class="cicle-btn-image"
            src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/item-back.png"
        ></image>
      </div>
    </div>
    <div class="right">
      <div class="cicle-btn">
        <image
            class="cicle-btn-image"
            src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/item-cart.png"
        ></image>
      </div>
      <div class="cicle-btn">
        <image
            class="cicle-btn-image"
            src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/item-more.png"
        ></image>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .top {
    position: fixed;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;

    top: 0;
    left: 0;

    height: 100px;
    width: 750px;
  }

  .right {
    flex-direction: row;
  }

  .cicle-btn {
    width: 80px;
    height: 80px;

    justify-content: center;
    align-items: center;

    margin-left: 25px;
    margin-right: 25px;

    border-radius: 40px;

    background-color: #000;
    opacity: 0.4;
  }

  .back-btn {
    padding-right: 8px;
  }

  .cicle-btn-image {
    width: 38px;
    height: 38px;
  }
</style>

<script>
  import {platform} from '../../utils/global'

  export default {
    name: 'top-bar',
    methods: {
      back () {
        this.pop()
      }
    },
    data () {
      return {
        topBind: platform === 'iOS' ? {
          top: '46px'
        } : {}
      }
    }
  }
</script>

<style></style>