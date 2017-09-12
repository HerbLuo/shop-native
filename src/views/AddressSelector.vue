<!--
    
    @author herbluo
    change logs:
    2017/6/5 herbluo created
-->
<template>
  <div class="top">
    <list class="content">
      <!-- 空，撑起一定高度，显示在顶部栏下方 -->
      <cell class="empty"></cell>
      <!-- 地址 -->
      <cell v-if="addresses.length > 0" class="block" v-for="address in addresses" :key="address.id">
        <div class="receiver">
          <text class="receiver-name-text">{{address.receiverName}}</text>
          <text class="receiver-phone-text">{{address.phone}}</text>
        </div>
        <div class="address">
          <div>
            <text class="default-address-tip-text" v-if="address.areDefault">[默认地址] </text>
            <text class="address-text"
            >{{address.areDefault ? '                    ' + address.address : address.address}}
            </text>
          </div>
        </div>
      </cell>
    </list>
    <!-- 顶部栏 选择收获地址 -->
    <div class="top-bar">
      <back-button-transparent @back="back"></back-button-transparent>
      <text class="title">选择收货地址</text>
      <div class="manage" @click="manage">
        <text class="manage-text">管理</text>
      </div>
    </div>
  </div>
</template>

<style scoped>

  /* 顶部栏 */
  .top-bar {
    position: fixed;
    top: 0;
    left: 0;

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

  .manage {
    width: 100px;
    height: 100px;

    justify-content: center;
    align-items: center;
  }

  .title {
    font-size: 36px;
  }

  .manage-text {
    font-size: 32px;
  }

  .content {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;

    width: 750px;
  }

  .empty {
    height: 100px;
  }

  .title, .manage-text, .receiver-name-text, .receiver-phone-text, .address-text {
    color: #333;
  }

  .block {
    padding: 30px;

    border-top-style: solid;
    border-top-color: #eee;
    border-top-width: 1px;
  }

  .receiver {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    height: 40px;
  }

  .receiver-name-text, .receiver-phone-text, .default-address-tip-text, .address-text {
    font-size: 29px;
  }

  .default-address-tip-text {
    position: absolute;
    top: 0;
    left: 0;

    color: #ff640d;
  }

  .address-text {
  }

  .address {
    height: 80px;

    justify-content: center;
  }

</style>

<script>
  import _debounce from 'lodash/debounce'
  import address, {FETCH_ADDRESS} from '../store/modules/address'
  import {registerModuleIfNotExist} from '../store'

  import BackButtonTransparent from '../components/common/BackButtonBgTransparent.vue'
  import BackButton from '../components/common/BackButton.vue'

  registerModuleIfNotExist('address', address)

  export default {
    components: {
      BackButtonTransparent,
      BackButton
    },
    name: 'address-selector',
    data () {
      return {}
    },
    created () {
      this.$store.dispatch(FETCH_ADDRESS).then(() => {
        this.loading = false
      }).catch(e => {

      })
    },
    computed: {
      addresses () {
        return this.$store.state.address.addresses
      }
    },
    methods: {

      back () {
        this.pop()
      },

      manage: _debounce(function () {
        this.push('AddressManagement')
      }, 200, {leading: true, trailing: false})
    }
  }
</script>

<style></style>