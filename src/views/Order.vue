<!--
    
    @author herbluo
    change logs:
    2017/6/4 herbluo created
-->
<template>
  <scroller class="scroller">
    <div class="empty-bar"></div>
    <top-bar class="par-top-bar"></top-bar>
    <address-bar></address-bar>
    <item-box @count="setCount"></item-box>
    <oprator-bar :count="count"></oprator-bar>
  </scroller>
</template>

<style scoped>
  .par-top-bar {
    position: fixed;
    top: 0;
    left: 0;

    width: 750px;
    height: 100px;
  }

  .empty-bar {
    height: 100px;
    width: 750px;
  }


</style>

<script>
  import TopBar from '../components/order/TopBar.vue'
  import AddressBar from '../components/order/AddressBar.vue'
  import ItemBox from '../components/order/ItemBox.vue'
  import OpratorBar from '../components/order/OpratorBar.vue'

  export default {
    components: {
      OpratorBar,
      ItemBox,
      AddressBar,
      TopBar
    },
    name: 'order',
    data () {
      return {
        count: 0
      }
    },
    methods: {
      setCount (count) {
        this.count = count
      }
    }
  }
</script>

<style></style>