<!--
    
    @author herbluo
    change logs:
    2017/3/14 herbluo created
-->
<template>
  <div class="top">
    <!-- hear has a topbar, but the code is in bottom -->
    <!-- ... HIDE ... -->
    <scroller class="scroller" show-scrollbar="false" :style="topBinding"
              loadmoreoffset="600" @loadmore="loadmore"
    >
      <refresh class="refresh" :display="refreshDisplay"
               @refresh="onRefresh" @pullingdown="onPullingDown"
      >
        <loading-indicator class="refresh-indicator"></loading-indicator>
        <!--suppress JSUnresolvedVariable -->
        <text class="refresh-text">{{refreshTip}}</text>
      </refresh>

      <!-- 轮播图 -->
      <slider-bar></slider-bar>

      <!-- 入口 -->
      <entrance-bar></entrance-bar>

      <!-- 热门 -->
      <hot-bar></hot-bar>
      <split-bar></split-bar>

      <!-- 抢购 -->
      <block-rush-buy></block-rush-buy>
      <split-bar></split-bar>

      <!-- 极有家 -->
      <block-ji-you-jia></block-ji-you-jia>
      <split-bar></split-bar>

      <div style="width: 750px; height: 600px; background-color: green;"></div>
      <div v-if="loadBlock[0]"
           style="width: 750px; height: 200px; background-color: orange;"></div>
      <div v-if="loadBlock[1]"
           style="width: 750px; height: 200px; background-color: #ddd;"></div>
      <div v-if="loadBlock[2]"
           style="width: 750px; height: 200px; background-color: #ccc;"></div>
      <div v-if="loadBlock[3]"
           style="width: 750px; height: 200px; background-color: #bbb;"></div>
      <div v-if="loadBlock[4]"
           style="width: 750px; height: 200px; background-color: #aaa;"></div>
      <div v-if="loadBlock[5]"
           style="width: 750px; height: 200px; background-color: #eee;"></div>
    </scroller>
    <!-- the top bar in the top -->
    <top-bar class="top-bar"></top-bar>
    <!-- the tab bar is in the bottom -->
    <tab-bar class="tab-bar" routerName="HomeHome"></tab-bar>
  </div>
</template>

<style scoped>
  .top {
  }

  .scroller {
    position: fixed;

    top: 100px;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .refresh {
    align-items: center;
  }

  .refresh-indicator {
    width: 56px;
    height: 56px;
    color: #f40;

    margin-top: 10px;
  }

  .refresh-text {
    width: 750px;
    padding-top: 10px;
    padding-bottom: 10px;

    color: #ff4400;
    font-size: 36px;
    font-weight: bold;
    text-align: center;
  }

  .tab-bar {
    position: fixed;

    left: 0;
    bottom: 0;
    height: 108px;
    width: 750px;
  }
</style>

<script>
  import '../utils/log'
  import home, {
    ON_REFRESHING_MUTATION,
    REFRESHING_ACTION
  } from '../store/modules/home'
  import {platform} from '../utils/global'
  import {registerModuleIfNotExist} from '../store'

  import SliderBar from '../components/home/SliderBar.vue'
  import TopBar from '../components/home/TopBar.vue'
  import EntranceBar from '../components/home/EntranceBar.vue'
  import HotBar from '../components/home/HotBar.vue'
  import SplitBar from '../components/home/SplitBar.vue'
  import BlockRushBuy from '../components/home/Block_RushBuy.vue'
  import BlockJiYouJia from '../components/home/Block_JiYouJia.vue'
  import RefreshIndicator from '../components/common/RefreshIndicator.vue'
  import TabBar from '../components/common/TabBar.vue'

  registerModuleIfNotExist('home', home)

  const logKey = 'VIEW/HOMEHOME'

  export default {
    components: {
      TabBar,
      RefreshIndicator,
      BlockJiYouJia,
      BlockRushBuy,
      SplitBar,
      HotBar,
      EntranceBar,
      TopBar,
      SliderBar
    },
    name: 'home',
    data () {
      return {
        platform,
        canTouchLeave: false,
        topBinding: platform === 'iOS' ? {
          top: '147px'
        } : {},

        /* data */
        loadBlock: []
      }
    },
    computed: {
      refreshTip () {
        return this.canTouchLeave ? '释放刷新' : '下拉刷新'
      },
      refreshDisplay () {
        return this.$store.state.home.refreshing ? 'show' : 'hide'
      }
    },
    created () {
      this.render()
    },
    methods: {
      render () {
      },

      onRefresh () {
        console.log('[%s] 刷新中', logKey)
        this.$store.commit(ON_REFRESHING_MUTATION, {
          callWhenRefreshing: (callWhenFinished) => {
            setTimeout(callWhenFinished, 500)
          }
        })
        this.$store.dispatch(REFRESHING_ACTION).catch(::console.error)
      },

      /**
       * 下拉时
       *
       * 拉到一定程度，将 canTouchLeave 设为true，意为可以释放刷新了
       *
       * iOS下，还需要借助下拉距离控制是否显示下拉刷新
       */
      onPullingDown (e) {
        let absP = e.pullingDistance
        absP < 0 && (absP = -absP)
        this.refreshTipShow = absP > 10 // 是否显示下拉刷新

        if (this.canTouchLeave === false) {
          absP > e.viewHeight && (this.canTouchLeave = true)
        } else {
          absP < e.viewHeight && (this.canTouchLeave = false)
        }
      },

      loadmore () {
        console.log('[%s] 加载更多')
        this.loadBlock.push(true)
      }

    }
  }
</script>


<style></style>