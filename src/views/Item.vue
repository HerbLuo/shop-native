<!--
    
    @author herbluo
    change logs:
    2017/5/25 herbluo created
-->
<template>
  <scroller show-scrollbar="false">
    <item-slider-box :picLinks="item && item.picLinksJson"></item-slider-box>
    <item-detail-box :item="item"></item-detail-box>
    <split-bar></split-bar>
    <item-detail-bar :item="item"></item-detail-bar>
    <split-bar></split-bar>
    <div style="height: 400px; width: 750px; background-color:#eee;"></div>

    <top-bar></top-bar>
    <oprator-bar></oprator-bar>
  </scroller>
</template>

<style scoped>

</style>

<script>
  import '../utils/log'
  import item, {
    FETCH_ITEM, UPDATE_CURRENT_ITEM_MUTATION
  } from '../store/modules/item'
  import {createError, errorHandler} from '../utils/error'
  import {registerModuleIfNotExist} from '../store'
  import {readRouterQuery$Promise} from '../utils/app/app-page-helper'

  import ItemSliderBox from '../components/item/ItemSliderBox.vue'
  import ItemDetailBox from '../components/item/ItemDetailBox.vue'
  import SplitBar from '../components/home/SplitBar.vue'
  import ItemDetailBar from '../components/item/ItemDetailBar.vue'
  import OpratorBar from '../components/item/OpratorBar.vue'
  import TopBar from '../components/item/TopBar.vue'

  registerModuleIfNotExist('item', item)

  const logKey = 'VIEW/ITEM'

  export default {
    components: {
      TopBar,
      OpratorBar,
      ItemDetailBar,
      SplitBar,
      ItemDetailBox,
      ItemSliderBox
    },
    name: 'item',
    data () {
      return {
        loading: true
      }
    },
    computed: {
      itemId () {
        return this.$store.state.item.currentItemId
      },
      item () {
        return this.loading
          ? undefined : this.$store.state.item.items[this.itemId]
      }
    },
    created () {
      this.render()
    },
    methods: {
      render () {
        this.generateItemId$Promise().then((itemId) => {
          this.$store.commit(UPDATE_CURRENT_ITEM_MUTATION, {itemId})
          return this.$store.dispatch(FETCH_ITEM, {itemIds: [itemId]})
            .then(() => {
              this.loading = false
            })
        }).catch(error => {
          errorHandler.checkNetworkAndWaitWhileNetworkIsReopen$Promise()
            .then(() => { // network is open
              console.error('[%s] 加载商品信息失败', logKey)
              console.error(error)
            })
            .catch(this.render) // when net is reopen
        })
      },

      generateItemId$Promise () {
        // 路由参数
        return readRouterQuery$Promise('Item').then((query) => {
          // 商品id
          const itemId = query.id | 0
          if (!itemId || typeof itemId !== 'number') {
            return Promise.reject(createError(`[${logKey}] 路由参数非法`, query))
          }

          return itemId
        })
      }

    }
  }
</script>

<style></style>