<!--
    
    @author herbluo
    change logs:
    2017/6/14 herbluo created
-->
<template>
  <div class="top">
    <popup-page :hidden="hidden" :height="570" @unRender="unRender">
      <div class="title">
        <div class="title-text-box" @click="hide">
          <text class="title-text">取消</text>
        </div>
        <div class="title-text-box bold" @click="finish">
          <text class="title-text">完成</text>
        </div>
      </div>
      <div class="content">
        <prov-city-area
            v-if="provCityArea" :provCityArea="provCityArea"
            @areaSelected="areaSelected"
        ></prov-city-area>
        <div class="line-top"></div>
        <div class="line-bottom"></div>
        <loading v-if="loading"></loading>
      </div>
    </popup-page>
  </div>
</template>

<style scoped>
  .top {
  }

  .bold {
    font-weight: bold;
  }

  .title {
    height: 80px;
    padding-left: 20px;
    padding-right: 20px;

    flex-direction: row;
    justify-content: space-between;
  }

  .title-text-box {
    height: 80px;
    justify-content: center;
    align-items: center;
  }

  .title-text {
    font-size: 32px;
    color: #378ff5;
  }

  .content {
    height: 490px;
    background-color: #eee;
  }

  .line-top, .line-bottom {
    position: absolute;

    top: 210px;
    height: 1px;
    left: 0;
    right: 0;

    border-top-style: solid;
    border-top-width: 1px;
    border-top-color: #888;
  }

  .line-bottom {
    top: 280px;
  }


</style>

<script>
  import '../../utils/log'
  import _find from 'lodash/find'
  import city, {FETCH_PROV_CITY_AREA} from '../../store/modules/city'
  import {registerModuleIfNotExist} from '../../store'

  import PopupPage from '../common/PopupPage.vue'
  import Loading from '../common/Loading.vue'
  import ProvCityArea from './ProvCityArea.vue'

  registerModuleIfNotExist('city', city)

  export default {
    components: {
      ProvCityArea,
      Loading,
      PopupPage
    },
    name: 'city-picker',
    data () {
      return {
        hidden: false,
        loading: true,
        areaCode: '110101'
      }
    },
    mounted () {
      setTimeout(() => {
        this.$store.dispatch(FETCH_PROV_CITY_AREA).then(() => {
          this.loading = false
        }).catch(::console.error)
      }, 500)
    },
    computed: {
      provCityArea () {
        return this.$store.state.city.provCityArea
      }
    },
    methods: {

      areaSelected (e) {
        this.areaCode = e.areaCode
      },
      unRender () {
        this.$emit('unRender')
      },
      hide () {
        this.hidden = true
      },

      finish () {
        const areaCode = this.areaCode | 0
        const cityCode = (areaCode / 100) | 0
        const provCode = (cityCode / 100) | 0

        if (areaCode < 100000) {
          console.error('地址编码错误 %s' + areaCode)
        }

        const provCityArea = this.provCityArea

        let prov = _find(provCityArea[1], {code: provCode})
        let city = _find(provCityArea[2][provCode], {code: cityCode})
        let area = _find(provCityArea[3][cityCode], {code: areaCode})

        if (!prov || !city || !area) {
          console.error('地址信息有空')
          prov = prov || {name: '-'}
          city = city || {name: '-'}
          area = area || {name: '-'}
        }

        this.$emit('finished', {
          describe: prov.name + city.name + area.name,
          code: this.areaCode
        })

        this.hidden = true
      }
    }
  }
</script>

<style></style>