<!--
    
    @author herbluo
    change logs:
    2017/6/5 herbluo created
-->
<template>
  <div class="top" @click="selectAddress">
    <div class="left">
      <image
          class="position-image"
          src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/address-position.png"
      ></image>
    </div>
    <div class="center" v-if="address">
      <div class="receiver">
        <text class="receiver-name-text">收货人：{{address.receiverName}}</text>
        <text class="receiver-phone-text">{{address.phone}}</text>
      </div>
      <div class="address">
        <text class="address-text" lines="2">收货地址： {{address.address}}</text>
      </div>
      <div class="tip">
        <text class="tip-text">(收货不便时，可选择免费代收服务)</text>
      </div>
    </div>
    <div class="right">
      <image
          class="more-image"
          src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/address-right.png"
      ></image>
    </div>
    <loading v-if="loading"></loading>
    <div class="add-address" v-if="!loading && !address">
      <text class="add-address-text">点击添加地址</text>
    </div>
  </div>
</template>

<style scoped>
  .top {
    width: 750px;
    height: 300px;

    flex-direction: row;
    justify-content: space-between;

    background-color: #f5f5f5;
  }

  .add-address {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;

    justify-content: center;
    align-items: center;
  }

  .left, .right {
    justify-content: center;
    align-items: center;

    width: 80px;
    height: 300px;
  }

  .position-image, .more-image {
    width: 50px;
    height: 50px;
  }

  .center {
    width: 590px;
    height: 300px;

    justify-content: center;
  }

  .receiver {
    flex-direction: row;

    height: 100px;

    align-items: center;
    justify-content: space-between;
  }

  .receiver-name-text, .receiver-phone-text {
    font-size: 32px;
  }

  .address {
    height: 60px;

    justify-content: center;
  }

  .address-text {
    font-size: 28px;
  }

  .tip {
    height: 80px;
    justify-content: center;
  }

  .tip-text {
    font-size: 26px;
    color: #ffb809;
  }


</style>

<script>
  import '../../utils/log'
  import _debounce from 'lodash/debounce'
  import Loading from '../common/Loading.vue'
  import {registerModuleIfNotExist} from '../../store'
  import address, {FETCH_ADDRESS} from '../../store/modules/address'

  registerModuleIfNotExist('address', address)

  export default {
    components: {Loading},
    name: 'address-bar',
    data () {
      return {
        loading: true
      }
    },
    created () {
      this.$store.dispatch(FETCH_ADDRESS).then(() => {
        this.loading = false
      }).catch(::console.error)
    },
    computed: {
      address () {
        return this.$store.getters.defaultAddress
      }
    },
    methods: {
      selectAddress: _debounce(function () {
        this.push('AddressSelector')
      }, 200, {leading: true, trailing: false})
    }
  }
</script>

<style></style>