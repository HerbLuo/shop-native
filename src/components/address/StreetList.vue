<!--
    
    @author herbluo
    change logs:
    2017/6/17 herbluo created
-->
<template>
  <div class="top">
    <list class="street-list" offset-accuracy="30"
          @scroll="onStreetScroll">
      <!-- 顶部三个空白的撑起高度 -->
      <cell :ref="'street' + (i - 1)" v-for="i in 3" :key="0">
        <div class="cell-box"></div>
      </cell>
      <cell :ref="'street' + (index + 3)"
            :key="street.id" v-for="(street, index) in streets"
      >
        <div class="cell-box">
          <text class="cell-text">{{street.name}}</text>

        </div>
      </cell>
      <cell v-for="i in 3" :key="0">
        <div class="cell-box"></div>
      </cell>
    </list>
  </div>
</template>

<style scoped>
  .top {
    height: 490px;
    width: 750px;
  }

  .street-list {
    position: absolute;

    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .cell-box {
    height: 70px;

    justify-content: center;
    align-items: center;
  }

  .cell-text {
    font-size: 32px;
  }
</style>
<script>
  import '../../utils/log'
  import _debounce from 'lodash/debounce'

  const dom = weex.requireModule('dom')
  const module = weex.requireModule('WXShpLifecycle')

  let whenBlur

  export default {
    name: 'street-list',
    props: ['streets'],
    data () {
      return {
        isPressed: false
      }
    },
    mounted () {
      // 监听touch事件
      module && module.registerOnTouchEvent &&
      module.registerOnTouchEvent((number) => {
        this.isPressed = !number
      })
    },
    breforeDestory () {
      // 销毁监听器
      module && module.unRegisterOnTouchEvent && module.unRegisterOnTouchEvent()
    },
    watch: {
      // blur后发生的事件
      isPressed () {
        if (!this.isPressed) {
          whenBlur && whenBlur()
          whenBlur = null
        }
      }
    },
    methods: {

      onStreetScroll (e) {
        this.onScroll(e.contentOffset.y)
      },

      // 滚动了30px以上
      onScroll: _debounce(function (offset) {
        // 没有按着时
        if (!this.isPressed) {
          whenBlur = null
          this.autoScroll(offset)

          // 按着时
        } else {
          whenBlur = () => {
            this.autoScroll(offset)
          }
        }
      }, 1, {leading: false, trailing: true}),

      // 滚动并确认当前激活的城市
      autoScroll: _debounce(function (offset) {
        // 计算当前应激活的是第几个城市（start from zero）
        let i = Math.abs(offset) / 70
        i = (i - (i | 0) < 0.3) ? (i | 0) : ((i | 0) + 1)

        // 当前应滚到哪个cell
        const el = this.$refs['street' + i][0]

        // 计算当前激活的城市信息的code

        this.$emit('streetSelected', {
          streetCode: this.streets[i].code
        })

        // 开始滚动
        dom.scrollToElement(el, {})
      }, 100, {leading: false, trailing: true})
    }
  }
</script>

<style></style>