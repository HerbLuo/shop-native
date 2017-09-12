<!--
    
    @author herbluo
    change logs:
    2017/4/12 herbluo created
-->
<template>
  <div>
    <text>talk</text>
    <tab-bar class="tab-bar" routerName="HomeTalk"></tab-bar>
  </div>
</template>

<style scoped>
  .tab-bar {
    position: fixed;

    left: 0;
    bottom: 0;
    height: 108px;
    width: 750px;
  }
</style>

<script>
  import TabBar from '../components/common/TabBar.vue'

  export default {
    components: {TabBar},
    name: 'talk'
  }
</script>