<!--
    
    @author herbluo
    change logs:
    2017/6/6 herbluo created
-->
<template>
  <div class="top">
    <list class="content">
      <!-- 地址 -->
      <cell v-if="addresses.length > 0" class="block" v-for="address in addresses" :key="address.id">

        <!-- 收件人信息 -->
        <div class="receiver">
          <text class="text">{{address.receiverName}}</text>
          <text class="text">{{address.phone}}</text>
        </div>

        <!-- 地址 -->
        <text class="text address-text">{{address.address}}</text>

        <!-- 操作栏 -->
        <div class="operate">

          <!-- 设为默认 -->
          <div class="left" v-if="address.areDefault">
            <image class="default-image"
                   src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/address-select.png"
            ></image>
            <text class="text default-text">默认地址</text>
          </div>
          <div class="left" v-if="!address.areDefault">
            <image class="not-default-image"
                   src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/address-noselect.png"
            ></image>
            <text class="text">默认地址</text>
          </div>

          <!-- 编辑或删除 -->
          <div class="right">
            <div class="edit">
              <image class="edit-image"
                     src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/address-edit.png"
              ></image>
              <text class="text">编辑</text>
            </div>
            <div class="delete">
              <image class="delete-image"
                     src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/address-delete.png"
              ></image>
              <text class="text">删除</text>
            </div>
          </div>

        </div>

        <div class="split-bar"></div>
      </cell>

      <!-- 撑起一定高度，防止最后一个地址被 底部栏覆盖  -->
      <cell class="empty"></cell>
    </list>
    <!-- 顶部栏 -->
    <div class="top-bar">
      <back-button-transparent @back="back"></back-button-transparent>
      <text class="title">管理收货地址</text>
      <div class="top-bar-right"></div>
    </div>
    <!-- 底部栏 -->
    <div class="add-address" @click="addAddress">
      <text class="add-address-text">添加新地址</text>
    </div>
  </div>
</template>

<style scoped>
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

  .top-bar-right {
    width: 100px;
  }

  .title {
    font-size: 36px;
  }

  /* 地址详细信息块 */
  .content {
    position: fixed;

    top: 100px;
    bottom: 100px;
    left: 0;
    right: 0;
  }

  .text {
    color: #333;
    font-size: 28px;
  }

  .receiver, .address-text, .operate {
    padding-left: 30px;
    padding-right: 30px;
  }

  .receiver {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    height: 90px;
  }

  .operate {
    margin-top: 30px;

    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #eee;

    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    height: 90px;
  }

  .default-text {
    color: #f40;
  }

  .left, .right, .edit, .delete {
    flex-direction: row;
    align-items: center;
  }

  /* 图标 */
  .default-image, .not-default-image, .edit-image, .delete-image {
    margin-right: 15px;

    width: 40px;
    height: 40px;
  }

  .edit-image, .delete-image {
    margin-left: 15px;
    margin-right: 8px;
  }

  .split-bar {
    background-color: #eee;
    height: 15px;
  }

  .empty {
    background-color: #eee;
    height: 100px;
  }

  /* 底部 添加新地址 */

  .add-address {
    position: fixed;
    left: 0;
    bottom: 0;

    height: 100px;
    width: 750px;

    justify-content: center;
    align-items: center;

    background-color: #f40;
  }

  .add-address-text {
    color: white;
    font-size: 32px;
  }
</style>

<script>
  import _debounce from 'lodash/debounce'
  import address, {FETCH_ADDRESS} from '../store/modules/address'
  import {registerModuleIfNotExist} from '../store'

  import BackButton from '../components/common/BackButton.vue'
  import BackButtonTransparent from '../components/common/BackButtonBgTransparent.vue'

  registerModuleIfNotExist('address', address)

  export default {
    components: {
      BackButtonTransparent,
      BackButton
    },
    name: 'address-management',
    created () {
      this.$store.dispatch(FETCH_ADDRESS).then(() => {
        this.loading = false
      }).catch(::console.error)
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
      addAddress: _debounce(function () {
        this.push('AddressUpdater')
      }, 200, {leading: true, trailing: false})
    }
  }
</script>

<style></style>