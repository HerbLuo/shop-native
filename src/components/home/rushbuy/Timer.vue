<!--
    
    @author herbluo
    change logs:
    2017/4/21 herbluo created
-->
<!--suppress JSUnresolvedFunction -->
<template>
  <div class="timer" v-if="show">
    <div class="num-box">
      <text class="num">{{ numberFormat(hour) }}</text>
    </div>
    <text class="text">:</text>
    <div class="num-box">
      <text class="num">{{ numberFormat(minute) }}</text>
    </div>
    <text class="text">:</text>
    <div class="num-box">
      <text class="num">{{ numberFormat(second) }}</text>
    </div>
  </div>
</template>

<style scoped>
  .timer {
    flex-direction: row;
  }

  .num-box {
    width: 28px;
    height: 24px;
    background-color: #F14E53;
    border-radius: 4px;

    margin-left: 2px;
    margin-right: 2px;

    justify-content: center;
    align-items: center;
  }

  .num, .text {
    font-size: 18px;
  }

  .text {
    color: #F14E53;
  }

  .num {
    color: #FFF;
  }
</style>

<script>
  import {timer, clearTimer} from '../../../utils/timer'

  export default {
    name: 'timer',
    props: {
      startTimestamp: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
        show: false,
        hour: 0,
        minute: 0,
        second: 0,
        timer: null
      }
    },
    watch: {
      startTimestamp: 'render'
    },
    created () {
      this.render()
    },
    methods: {
      render () {
        this.endTimer()

        let time = this.startTimestamp - new Date().getTime()
        if (time < 0) {
          return
        }

        let timeMS = time % 1000
        time = (time / 1000) | 0

        this.hour = (time / 3600) | 0
        this.minute = (time % 3600 / 60) | 0
        this.second = (time % 60) | 0
        this.show = true

        setTimeout(() => {
          this.startTimer()
        }, timeMS)
      },
      startTimer () {
        const reduceOneSecond = () => {
          // 秒减1
          let second = this.second
          if (--second >= 0) {
            this.second = second
            return
          }

          // 分 -1
          this.second = 59
          let minute = this.minute
          if (--minute >= 0) {
            this.minute = minute
            return
          }

          // 时 -1
          this.minute = 59
          let hour = this.hour
          if (--hour > 0) {
            this.hour = hour
            return
          }

          // 计时结束
          this.hour = 0
          this.minute = 0
          this.second = 0
          this.endTimer()
          this.show = false
        }

        reduceOneSecond()

        /*
         * 由于安卓中 可能存在 销毁vue时无法销毁Interval的问题，
         * 使用该方法代替
         *
         * weex devtool输出：Error: invalid instance id
         */
        this.timer = timer(() => {
          reduceOneSecond()
        }, 1000)
      },

      numberFormat (num) {
        if (num === 0) {
          return '00'
        }
        if (num < 10) {
          return '0' + num
        }
        if (num > 99) {
          return 99
        }
        return num
      },

      endTimer () {
        if (this.timer) {
          clearTimer(this.timer)
          this.timer = null
        }
      }
    },
    beforeDestroy () {
      this.endTimer()
    }
  }
</script>

<style></style>