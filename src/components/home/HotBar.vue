<!--
    
    @author herbluo
    change logs:
    2017/4/18 herbluo created
-->
<!--suppress JSUnresolvedVariable, CommaExpressionJS -->
<template>
  <div class="hot-bar">
    <image class="hot-image" :src="hotImage"></image>
    <slider class="slider" interval="3000" auto-play="true">
      <div v-if="hots" v-for="(hot_items, index) in hots">
        <div class="hot-item" v-for="hot in hot_items">
          <div class="hot-type">
            <text class="hot-type-text">{{ hot.type }}</text>
          </div>
          <text class="hot-title-text">{{ hot.title }}</text>
        </div>
      </div>
    </slider>
  </div>
</template>

<style scoped>
  .hot-bar {
    width: 750px;
    height: 86px;
    flex-direction: row;
    align-items: center;
  }

  .hot-image {
    margin-left: 16px;
    margin-right: 16px;
    width: 84px;
    height: 68px;
  }

  .slider {
    height: 82px;
    width: 660px;
  }

  .hot-item {
    flex-direction: row;
    margin-top: 3px;
    margin-bottom: 3px;
    align-items: center;
  }

  .hot-title-text {
    font-size: 26px;
    margin-bottom: 3px;
  }

  .hot-type {
    border-color: #d81421;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    margin-right: 12px;
    align-items: center;
    justify-content: center;

    padding-left: 5px;
    padding-right: 5px;
    padding-top: 2px;
    padding-bottom: 2px;
  }

  .hot-type-text {
    font-size: 20px;
    color: #d81421;
  }


</style>

<script>
  export default {
    name: 'hot-bar',
    data () {
      return {
        hotImage: '//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/9a4abed3d7eb6a61c0f13928bcbfb50fa7f94de7.png',
        hots: [
          [{
            type: '热评',
            title: 'AMD立大功，Intel又着急了'
          }, {
            type: '食艺',
            title: '小米6只是开胃菜，雷军真正的大招是这个'
          }],
          [{
            type: '热评',
            title: 'AMD立大功2，Intel又着急了'
          }, {
            type: '热评',
            title: '小米6只是开心菜，雷军真正的大招是这个'
          }], [{
            type: '热评',
            title: 'AMD立大功3，Intel又着急了'
          }, {
            type: '科技',
            title: '小米6只是开脑菜，雷军真正的大招是这个'
          }]
        ]
      }
    }
  }
</script>

<style></style>