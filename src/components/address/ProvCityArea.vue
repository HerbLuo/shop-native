<!--
    不对provCityArea经行任何的检查

    @author herbluo
    change logs:
    2017/6/16 herbluo created
-->
<!--suppress JSUnresolvedVariable -->
<template>
  <div class="top">

    <!-- 省 -->
    <div class="content-box prov-box">
      <list class="content-list prov-list" offset-accuracy="30"
            @scroll="onProvScroll">
        <!-- 顶部三个空白的撑起高度 -->
        <cell :ref="'prov' + (i - 1)" v-for="i in 3" :key="0">
          <div class="cell-box"></div>
        </cell>
        <cell :ref="'prov' + (index + 3)"
              :key="prov.id" v-for="(prov, index) in provCityArea[1]"
        >
          <div class="cell-box">
            <text class="cell-text">{{prov.name}}</text>
          </div>
        </cell>
        <cell v-for="i in 3" :key="0">
          <div class="cell-box"></div>
        </cell>

      </list>
    </div>

    <!-- 市 -->
    <div class="content-box city-box">
      <list class="content-list city-list" offset-accuracy="30"
            @scroll="onCityScroll">
        <!-- 顶部三个空白的撑起高度 -->
        <cell :ref="'city' + (i - 1)" v-for="i in 3" :key="0">
          <div class="cell-box"></div>
        </cell>
        <cell :ref="'city' + (index + 3)"
              :key="city.id" v-for="(city, index) in provCityArea[2][provCode]"
        >
          <div class="cell-box">
            <text class="cell-text">{{city.name}}</text>
          </div>
        </cell>
        <cell v-for="i in 3" :key="0">
          <div class="cell-box"></div>
        </cell>

      </list>
    </div>

    <!-- 区 -->
    <div class="content-box area-box">
      <list class="content-list area-list" offset-accuracy="30"
            @scroll="onAreaScroll">
        <!-- 顶部三个空白的撑起高度 -->
        <cell :ref="'area' + (i - 1)" v-for="i in 3" :key="0">
          <div class="cell-box"></div>
        </cell>
        <cell :ref="'area' + (index + 3)"
              :key="area.id" v-for="(area, index) in provCityArea[3][cityCode]">
          <div class="cell-box">
            <text class="cell-text">{{area.name}}</text>
          </div>
        </cell>
        <cell v-for="i in 3" :key="0">
          <div class="cell-box"></div>
        </cell>
      </list>
    </div>

  </div>
</template>

<style scoped>
  .top {
    height: 490px;
    width: 750px;

    flex-direction: row;
  }

  .content-box {
    height: 490px;
    flex: 1;
  }

  .content-list {
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
    name: 'prov-city-area',
    props: ['provCityArea'],
    data () {
      return {
        provCode: '11',
        cityCode: '1101',
        areaCode: '110101',
        isPressed: false
      }
    },
    mounted () {
      module && module.registerOnTouchEvent &&
      module.registerOnTouchEvent((number) => {
        this.isPressed = !number
      })
    },
    breforeDestory () {
      module && module.unRegisterOnTouchEvent && module.unRegisterOnTouchEvent()
    },
    watch: {
      isPressed () {
        if (!this.isPressed) {
          whenBlur && whenBlur()
          whenBlur = null
        }
      }
    },
    methods: {

      onProvScroll (e) {
        this.onScroll(e.contentOffset.y, 'prov')
      },
      onCityScroll (e) {
        this.onScroll(e.contentOffset.y, 'city')
      },
      onAreaScroll (e) {
        this.onScroll(e.contentOffset.y, 'area')
      },

      // 滚动了30px以上
      onScroll: _debounce(function (offset, listtype) {
        // 没有按着时
        if (!this.isPressed) {
          whenBlur = null
          this.autoScroll(offset, listtype)

          // 按着时
        } else {
          whenBlur = () => {
            this.autoScroll(offset, listtype)
          }
        }
      }, 1, {leading: false, trailing: true}),

      // 滚动并确认当前激活的城市
      autoScroll: _debounce(function (offset, listtype) {
        // 计算当前应激活的是第几个城市（start from zero）
        let i = Math.abs(offset) / 70
        i = (i - (i | 0) < 0.3) ? (i | 0) : ((i | 0) + 1)

        // 当前应滚到哪个cell
        const el = this.$refs[listtype + i][0]

        // 计算当前激活的城市信息的code
        switch (listtype) {
          case 'prov':
            this.provCode = this.provCityArea[1][i].code
            break
          case 'city':
            this.cityCode = this.provCityArea[2][this.provCode][i].code
            break
          case 'area':
            this.areaCode = this.provCityArea[3][this.cityCode][i].code
            this.$emit('areaSelected', {
              areaCode: this.areaCode
            })
            break
        }

        // 开始滚动
        dom.scrollToElement(el, {})
        if (listtype === 'prov') {
          dom.scrollToElement(this.$refs['city0'][0], {})
        }
        if (listtype === 'prov' || listtype === 'city') {
          dom.scrollToElement(this.$refs['area0'][0], {})
        }
      }, 100, {leading: false, trailing: true})
    }
  }
</script>

<style></style>