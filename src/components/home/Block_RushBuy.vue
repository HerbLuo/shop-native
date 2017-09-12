<!--
    该模块的实现方式已废弃，
    新的实现方式请参考./Block_JiYouJia.vue的实现
    @author herbluo
    change logs:
    2017/4/19 herbluo created
-->
<!--suppress CommaExpressionJS -->
<!--suppress JSUnresolvedVariable -->
<template>
  <div class="rush-buy content">
    <div class="row" v-for="row in block.content">
      <div class="item" v-for="item in row">
        <image
            class="image"
            :src="item.img"
            :placeholder="item.placeholder"
        ></image>
      </div>
    </div>
    <timer v-if="block.content.length > 0 && startTimestamp"
           class="par-timer"
           :startTimestamp="startTimestamp"
    ></timer>
  </div>
</template>

<style scoped>
  .rush-buy {
    width: 750px;
    height: 450px;
    position: relative;
  }

  .content {
    background-color: #e8e8e8;
    justify-content: space-between;
  }

  .row {
    justify-content: space-between;
    flex-direction: row;
  }

  .image {
    width: 374px;
    height: 224px;
  }

  .par-timer {
    position: absolute;
    top: 60px;
    left: 23px;
  }
</style>

<script>
  import '../../utils/log'
  import home, {ON_REFRESHING_MUTATION} from '../../store/modules/home'
  import block, {FETCH_RUSHBUY} from '../../store/modules/block'
  import {registerModuleIfNotExist} from '../../store'

  import Timer from './rushbuy/Timer.vue'

  registerModuleIfNotExist('block', block)
  registerModuleIfNotExist('home', home)

  const logKey = 'VIEW/BLOCK/RUSHBUY'
  let runTimes = 0

  export default {
    components: {Timer},
    name: 'block-rush-buy',
    created () {
      this.render()
      if (runTimes === 0) {
        runTimes++
        this.registerRefreshEvent()
      }
    },
    data () {
      return {}
    },
    computed: {
      block () {
        return this.$store.state.block.rush_buy
      },
      startTimestamp () {
        return this.block.content.length > 0 &&
          this.block.content[0].length > 0 &&
          this.block.content[0][0].startTimestamp
      }
    },
    methods: {
      render () {
        return this.$store.dispatch(FETCH_RUSHBUY).catch((error) => {
          console.error(error)
        })
      },
      /**
       * 注册刷新事件
       */
      registerRefreshEvent () {
        // 注册刷新事件
        this.$store.commit(ON_REFRESHING_MUTATION, {
          callWhenRefreshing: (callWhenFinished) => {
            console.info('[%s] 抢购刷新中', logKey)
            this.render()
              .then(callWhenFinished)
              .catch(::console.error)
          }
        })
      }
    }
  }
</script>

<style></style>