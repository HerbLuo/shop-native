<!--
    
    @author herbluo
    change logs:
    2017/6/7 herbluo created
-->
<!--suppress JSUnresolvedVariable -->
<template>
  <div class="top">
    <div class="top-bar">
      <back-button-bg-transparent @back="back"></back-button-bg-transparent>
      <div class="top-bar-center">
        <div class="get-position" @click="autoPosition">
          <image class="position-image"
                 src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/position-blue.png"
          ></image>
        </div>
        <div class="title">
          <text class="title-text">添加新地址</text>
        </div>
      </div>
      <div class="save">
        <text class="save-text">保存</text>
      </div>
    </div>
    <div class="bg"></div>
    <list class="content">
      <cell class="block">
        <div class="block-content-s1">
          <text class="block-text">收货人</text>
          <input class="receiver-input" maxlength="12"/>
        </div>
      </cell>
      <cell class="block">
        <div class="block-content-s1">
          <text class="block-text">联系电话</text>
          <input class="phone-input" type="tel" maxlength="11"/>
        </div>
      </cell>
      <cell class="block">
        <div class="block-content-s1">
          <text class="block-text">所在地区</text>
          <div class="select-bar" @click="cityPickerShow">
            <text v-if="!area.describe" class="select-bar-tip-text">请选择</text>
            <text v-if="area.describe" class="select-bar-text">{{area.describe}}</text>
            <image class="select-bar-image"
                   src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/item-right.png"
            ></image>
          </div>
        </div>
      </cell>
      <cell class="block">
        <div class="block-content-s1">
          <text class="block-text">街道</text>
          <div class="select-bar" @click="streetPickerShow">
            <text v-if="!street.describe" class="select-bar-tip-text">请选择</text>
            <text v-if="street.describe" class="select-bar-text">{{street.describe}}</text>
            <image class="select-bar-image"
                   src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/item-right.png"
            ></image>
          </div>
        </div>
      </cell>
      <cell class="block address-ex-box">
                <textarea class="address-ex-textarea"
                          placeholder="请填写详细地址，不少于6个字"
                          v-model="detailDescribe"></textarea>
      </cell>
      <cell class="block">
        <div class="block-content-sb">
          <text class="block-text">设为默认</text>
          <div class="set-default-box">
            <switch class="set-default-switch"></switch>
          </div>
        </div>
      </cell>
    </list>
    <city-picker
        v-if="cityPickerRender"
        @unRender="cityPickerHide"
        @finished="cityPicked"
    ></city-picker>
    <street-picker
        v-if="streetPickerRender"
        :areaCode="area.code"
        @unRender="streetPickerHide"
        @finished="streetPicked"
    ></street-picker>
  </div>
</template>

<style scoped>
  .top {
  }

  /* 顶部栏 */
  .top-bar {
    width: 750px;
    height: 100px;

    background-color: #fafafa;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #eee;

    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .top-bar-center {
    height: 100px;

    flex-direction: row;
    align-items: center;
  }

  .get-position {
    width: 100px;
    height: 100px;

    justify-content: center;
    align-items: center;
  }

  .position-image {
    width: 50px;
    height: 50px;
  }

  .title {
    padding-right: 20px;

    justify-content: center;
  }

  .title-text {
    font-size: 36px;
  }

  .save {
    height: 100px;

    padding-left: 20px;
    padding-right: 20px;

    justify-content: center;
  }

  .save-text {
    font-size: 32px;
  }

  /* 背景色 */
  .bg {
    width: 750px;
    height: 2000px;
    background-color: #ddd;
  }

  /* 内容 */
  .content {
    position: fixed;

    top: 100px;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .block {
    border-bottom-style: solid;
    border-bottom-color: #ddd;
    border-bottom-width: 1px;

    background-color: #fff;

    padding-left: 30px;
    padding-right: 30px;
  }

  .block-content-s1, .block-content-sb {
    height: 96px;

    flex-direction: row;
    align-items: center;
  }

  .block-content-sb {
    justify-content: space-between;
  }

  .block-text {
    width: 200px;

    font-size: 28px;
    color: #333;
  }

  .receiver-input, .phone-input {
    width: 480px; /*490max*/
    height: 62px;
  }

  .select-bar {
    width: 490px;
    height: 96px;

    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .select-bar-text {
    color: #555;
    font-size: 28px;
  }

  .select-bar-tip-text {
    color: #bbb;
    font-size: 28px;
  }

  .select-bar-image {
    margin-left: 36px;
    width: 50px;
    height: 50px;
  }

  .address-ex-box {
    border-bottom-width: 20px;
  }

  .address-ex-textarea {
    padding-top: 30px;
    height: 200px;
  }

  .set-default-box {
    width: 96px;
    height: 56px;
    align-items: flex-start;
  }

  .set-default-switch {
    /*height: 96px;*/
    /*width: 96px;*/
  }

</style>

<script>
  import '../utils/log'
  import _debounce from 'lodash/debounce'
  import StreetPicker from '../components/address/StreetPicker.vue'
  import CityPicker from '../components/address/CityPicker.vue'
  import BackButtonBgTransparent from '../components/common/BackButtonBgTransparent.vue'

  const amap = weex.requireModule('WXAMap')
  const modal = weex.requireModule('modal')

  export default {
    components: {
      StreetPicker,
      CityPicker,
      BackButtonBgTransparent
    },
    name: 'address-updater',
    data () {
      return {

        // 选择器 弹出框
        cityPickerRender: false,
        streetPickerRender: false,

        area: {
          describe: '',
          code: 0
        },
        street: {
          describe: '',
          code: 0
        },
        detailDescribe: ''
      }
    },
    methods: {
      back () {
        this.pop()
      },

      // 自动定位
      autoPosition: _debounce(function () {
        if (!amap || !amap.chooseLocation) {
          console.log('不支持自动定位')
          return
        }
        amap.chooseLocation(this.locationChoosed)
      }, 200, {leading: true, trailing: false}),
      locationChoosed (poi) {
        if (!poi) {
          console.error('您未选择地址信息')
          return
        }

        try {
          poi = JSON.parse(poi)
        } catch (e) {
          console.error('poi数据解析失败')
        }

        // 区
        const area = {}
        area.code = poi.adCode | 0
        area.describe = poi.provinceName + poi.cityName + poi.adName
        this.area = area

        // 街道信息简略
        this.street = {
          code: 0,
          describe: '-'
        }

        // 详细描述信息
        let detailDescribe = ''
        poi.snippet && (detailDescribe += (poi.snippet + ' '))
        poi.title && (detailDescribe += poi.title)
        this.detailDescribe = detailDescribe
      },

      // 选择地区
      cityPickerShow () {
        this.cityPickerRender = true
      },
      cityPickerHide () {
        this.cityPickerRender = false
      },
      cityPicked (event) {
        this.area = event
      },

      // 选择街道
      streetPickerShow () {
        if (!this.area.code) {
          modal.alert({
            message: '请先选择一个地区',
            okTitle: '好'
          })
          return
        }

        this.streetPickerRender = true
      },
      streetPickerHide () {
        this.streetPickerRender = false
      },
      streetPicked (event) {
        this.street = event
      }
    }
  }
</script>

<style></style>