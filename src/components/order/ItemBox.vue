<!--
    
    @author herbluo
    change logs:
    2017/6/18 herbluo created
-->
<template>
  <div class="top">
    <div class="shop" v-if="item && item.shop">
      <image
          class="shop-image"
          src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/order-shop.png"
      ></image>
      <text class="shop-text">{{item.shop.name}}</text>
    </div>
    <div class="item" v-if="item && item.id">
      <image
          class="item-image"
          :src="item.picLinksJson[0]"
      ></image>
      <div class="item-describe">
        <text lines="2" class="item-describe-title">{{item.name}}</text>
        <text lines="2" class="item-describe-type">套餐类型：无API，颜色分类：无API</text>
        <div class="item-describe-price-bar">
          <text class="item-describe-price-text">￥{{item.price}}</text>
          <text class="item-quantity">x{{quantity}}</text>
        </div>
      </div>
    </div>
    <div class="op-bar">
      <text class="op-bar-title">购买数量</text>
      <div class="op-bar-op">
        <div class="op-quantity-box" @click="sub">
          <text class="op-quantity-text">-</text>
        </div>
        <div class="op-quantity">
          <text>{{quantity}}</text>
        </div>
        <div class="op-quantity-box" @click="add">
          <text class="op-quantity-text">+</text>
        </div>
      </div>
    </div>
    <div class="op-bar">
      <text class="op-bar-title">配送方式</text>
      <div class="op-bar-op">
        <text class="base-text">无API</text>
        <image
            class="more-image"
            src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/address-right.png"
        ></image>
      </div>
    </div>
    <div class="op-bar">
      <text class="op-bar-title">运费险</text>
      <div class="op-bar-op">
        <text class="base-text">无API</text>
        <image
            class="more-image"
            src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/address-right.png"
        ></image>
      </div>
    </div>
    <div class="op-bar">
      <text class="op-bar-title">发票抬头：</text>
      <input class="op-bar-input" placeholder="请输入发票抬头，如：个人"/>
    </div>
    <div class="op-bar">
      <text class="op-bar-title">买家留言：</text>
      <input class="op-bar-input" placeholder="选填：对本次交易的说明"/>
    </div>
    <div class="count">
      <text class="count-text">共{{quantity}}件商品 小计：</text>
      <text class="count-price">￥{{itemCount()}}</text>
    </div>
    <div class="bg-h100"></div>
  </div>
</template>

<style scoped>
  .top {

  }

  .shop {
    margin-top: 20px;
    height: 80px;
    padding-left: 20px;

    flex-direction: row;
    align-items: center;
  }

  .shop-image {
    width: 40px;
    height: 40px;
    margin-right: 20px;
  }

  .shop-text {
    font-size: 28px;
  }

  .item {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 10px;

    flex-direction: row;
    background-color: #eee;
  }

  .item-image {
    width: 200px;
    height: 200px;
  }

  .item-describe {
    width: 490px;
    height: 200px;
    margin-left: 20px;

    justify-content: space-between;
  }

  .item-describe-title {
    /*noinspection CssUnknownProperty*/
    lines: 2;
    font-size: 28px;
    text-overflow: ellipsis;
  }

  .item-describe-type {
    /*noinspection CssUnknownProperty*/
    lines: 2;
    color: #aaa;
    font-size: 28px;
  }

  .item-describe-price-bar {
    flex-direction: row;
    justify-content: space-between;
  }

  .item-describe-price-text {
    color: #f40;
  }

  .op-bar {
    padding-left: 20px;
    padding-right: 20px;

    height: 100px;
    border-bottom-style: solid;
    border-bottom-color: #eee;
    border-bottom-width: 1px;

    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .op-quantity-box, .op-quantity {
    width: 60px;
    height: 50px;

    justify-content: center;
    align-items: center;
  }

  .op-quantity-box {
    background-color: #ddd;
  }

  .op-bar-title, .base-text {
    font-size: 32px;
  }

  .op-quantity-text {
    color: #666;
    font-weight: bold;
  }

  .op-bar-op {
    flex-direction: row;
  }

  .op-bar-input {
    width: 500px;
  }

  .more-image {
    width: 40px;
    height: 40px;
  }

  .count {
    height: 100px;

    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .count-text {
    font-size: 26px;
  }

  .count-price {
    padding-left: 20px;
    padding-right: 20px;

    font-size: 30px;
    color: #f40;
  }

  .bg-h100 {
    height: 100px;
    background-color: #eee;
  }
</style>

<script>
  import {registerModuleIfNotExist} from '../../store'
  import item, {FETCH_ITEM} from '../../store/modules/item'

  registerModuleIfNotExist('item', item)

  export default {
    name: 'item-box',
    data () {
      return {
        loading: true,
        quantity: 1
      }
    },
    created () {
      this.$store.dispatch(FETCH_ITEM, {itemIds: [this.currentItemId]})
        .then(() => {
          this.loading = false
        })
    },
    computed: {
      currentItemId () {
        return this.$store.state.item.currentItemId
      },
      item () {
        return this.currentItemId
          ? this.$store.state.item.items[this.currentItemId]
          : undefined
      },
      pay () {
        return this.item
          ? Math.round(this.quantity * this.item.price * 100) / 100
          : 0
      }
    },
    methods: {
      sub () {
        this.quantity > 1 && this.quantity--
      },
      add () {
        this.quantity++
      },
      itemCount () {
        this.$emit('count', this.pay)
        return this.pay
      }
    }

  }
</script>

<style></style>