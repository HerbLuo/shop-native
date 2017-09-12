<!--
    
    @author herbluo
    change logs:
    2017/4/25 herbluo created
-->
<!--suppress JSUnresolvedVariable -->
<template>
  <div class="cheap">
    <split-bar></split-bar>
    <div class="row head">
      <div class="rel" v-for="headBlock in block.head">
        <image :src="headBlock.img" :class="['image-' + headBlock.type]"></image>
        <text v-if="headBlock.type === 'left'" class="text-left">{{headBlock.text}}</text>
        <div v-if="headBlock.type === 'right'" class="text-right-bg">
          <text class="text-right-text">{{headBlock.text}}</text>
        </div>
      </div>
    </div>
    <div class="title">
      <text class="title-text">{{block.title}}</text>
    </div>
    <div class="content">
      <div v-for="row in block.content" class="row">
        <div v-for="item in row">
          <image
              class="content-image"
              :src="item.img"
          ></image>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .rel {
    position: relative;
  }

  .cheap {
    position: relative;
  }

  .row {
    flex-direction: row;
    width: 750px;
    justify-content: space-between;
  }

  /*noinspection CssUnusedSymbol*/
  .image-left {
    width: 499px;
    height: 250px;
  }

  /*noinspection CssUnusedSymbol*/
  .image-right {
    width: 250px;
    height: 250px;
  }

  .title {
    position: absolute;
    left: -29px;
    top: 0;
    align-items: center;
    justify-content: center;
    width: 229px;
    height: 58px;
    border-radius: 29px;
    background-image: linear-gradient(to right, #FF0, #FFBC00);
  }

  .title-text {
    color: white;
    font-size: 34px;
    margin-left: 15px;
  }

  .text-left, .text-right-text {
    color: white;
    font-size: 26px;
  }

  .text-left {
    position: absolute;
    bottom: 20px;
    left: 20px;
  }

  .text-right-bg {
    position: absolute;
    bottom: 18px;
    left: 40px;
    width: 170px;
    height: 38px;
    align-items: center;
    justify-content: center;
    border-top-left-radius: 19px;
    border-bottom-right-radius: 19px;
    background-color: rgba(255, 175, 0, 0.7);
  }

  .content {
    background-color: #e8e8e8;
    justify-content: space-between;
    height: 492px;
  }

  .content-image {
    width: 374px;
    height: 245px;
  }
</style>

<script>
  import '../../utils/log'
  import home, {ON_REFRESHING_MUTATION} from '../../store/modules/home'
  import block, {FETCH_JIYOUJIA} from '../../store/modules/block'
  import {registerModuleIfNotExist} from '../../store'

  import SplitBar from './SplitBar.vue'

  registerModuleIfNotExist('block', block)
  registerModuleIfNotExist('home', home)

  const logKey = 'VIEW/BLOCK/JIYOUJIA'
  let runTimes = 0

  export default {
    components: {SplitBar},
    name: 'block-ji-you-jia',
    data () {
      return {}
    },
    created () {
      this.render()
      if (runTimes === 0) {
        runTimes++
        this.registerRefreshEvent()
      }
    },
    computed: {
      block () {
        return this.$store.state.block.ji_you_jia
      }
    },
    methods: {
      render () {
        return this.$store.dispatch(FETCH_JIYOUJIA).catch(::console.error)
      },
      /**
       * 注册刷新事件
       */
      registerRefreshEvent () {
        // 注册刷新事件
        this.$store.commit(ON_REFRESHING_MUTATION, {
          callWhenRefreshing: (callWhenFinished) => {
            console.log('[%s] 极有家刷新中', logKey)
            this.render()
              .then(callWhenFinished)
              .catch(::console.log)
          }
        })
      }
    }
  }
</script>

<style></style>