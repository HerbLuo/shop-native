<!--
    
    @author herbluo
    change logs:
    2017/6/17 herbluo created
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
        <street-list
            v-if="!loading && streets" :streets="streets"
            @streetSelected="streetSelected"
        ></street-list>
      </div>
      <div class="line-top"></div>
      <div class="line-bottom"></div>
      <loading v-if="loading"></loading>
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
    width: 750px;
    height: 490px;
    background-color: #eee;
  }

  .line-top, .line-bottom {
    position: absolute;

    top: 290px;
    height: 1px;
    left: 0;
    right: 0;

    border-top-style: solid;
    border-top-width: 1px;
    border-top-color: #888;
  }

  .line-bottom {
    top: 360px;
  }
</style>

<script>
  import '../../utils/log'
  import _find from 'lodash/find'
  import {FETCH_STREET} from '../../store/modules/city'
  import StreetList from './StreetList.vue'
  import PopupPage from '../common/PopupPage.vue'

  export default {
    components: {
      StreetList,
      PopupPage
    },
    name: 'street-picker',
    props: ['areaCode'],
    data () {
      return {
        hidden: false,
        loading: true,
        streetCode: 0
      }
    },
    computed: {
      streetss () {
        return this.$store.state.city.streetss
      },
      streets () {
        return this.streetss && this.streetss[this.areaCode]
      }
    },
    created () {
      this.$store.dispatch(FETCH_STREET, {areaCode: this.areaCode}).then(() => {
        this.loading = false
        this.streetCode = this.streetss[this.areaCode][0].code
      })
    },
    methods: {
      unRender () {
        this.$emit('unRender')
      },
      hide () {
        this.hidden = true
      },

      streetSelected (e) {
        this.streetCode = e.streetCode
      },
      finish () {
        const streets = this.streets
        if (!streets) {
          console.error('该地区下可能没有街道信息')
          return
        }

        const street = _find(streets, {code: this.streetCode})
        if (!street) {
          console.error('找不到该街道/streetCode: ' + this.streetCode)
        }

        this.$emit('finished', {
          describe: street.name,
          code: this.streetCode
        })

        this.hidden = true
      }
    }
  }
</script>

<style></style>