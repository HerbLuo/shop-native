<!--
    
    @author herbluo
    change logs:
    2017/6/8 herbluo created
-->
<template>
  <div class="top" @click="back">
    <image
        class="back-image"
        src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/back.png"
    ></image>
  </div>
</template>

<style scoped>
  .top {
    width: 100px;
    height: 100px;

    justify-content: center;
    align-items: center;
  }

  .back-image {
    width: 50px;
    height: 50px;
  }
</style>

<script>
  import _debounce from 'lodash/debounce'

  export default {
    name: 'back-button-bg-transparent',
    methods: {
      back: _debounce(function () {
        this.$emit('back')
      }, 200, {leading: true, trailing: false})
    }
  }
</script>

<style></style>