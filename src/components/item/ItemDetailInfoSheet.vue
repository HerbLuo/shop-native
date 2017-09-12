<!--
    产品参数弹窗（popup-page）（下往上弹）

    props：item 必须 只需id正确

    @author herbluo
    change logs:
    2017/5/27 herbluo created
-->
<!--suppress JSUnresolvedVariable -->
<template>
  <div>
    <popup-page :hidden="hidden" @unRender="onUnRender">
      <div class="title">
        <text class="title-text">产品参数</text>
      </div>
      <loading v-if="loading"></loading>
      <list class="detail" v-if="!loading">
        <cell class="detail-line" v-for="describe in describes" :key="describe.id">
          <text class="detail-key-text">{{describe.key}}</text>
          <text class="detail-value-text">{{describe.value}}</text>
        </cell>
      </list>
      <div class="finish" @click="onHide">
        <text class="finish-text">完成</text>
      </div>
    </popup-page>
  </div>
</template>

<style scoped>
  .title {
    width: 750px;
    height: 80px;

    justify-content: flex-end;
    align-items: center;
  }

  .title-text {
    font-size: 36px;
  }

  .detail {
    width: 750px;
    height: 660px;
  }

  .detail-line {
    flex-direction: row;

    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #eee;

    padding-top: 20px;
    padding-bottom: 20px;
  }

  .detail-key-text {
    width: 180px;

    color: #aaa;

    padding-left: 20px;
    padding-right: 38px;
  }

  .detail-key-text, .detail-value-text {
    font-size: 28px;
    line-height: 46px;
  }

  .detail-value-text {
    color: #333;
  }

  .finish {
    position: absolute;
    left: 0;
    bottom: 0;

    height: 110px;
    width: 750px;

    justify-content: center;
    align-items: center;

    background-image: linear-gradient(to right, #f70, #f40);
  }

  .finish-text {
    color: white;
    font-size: 34px;
  }

</style>

<script>
  import '../../utils/log'
  import * as item from '../../store/modules/item'
  import PopupPage from '../common/PopupPage.vue'
  import Loading from '../common/Loading.vue'

  export default {
    components: {
      Loading,
      PopupPage
    },
    name: 'item-detail-info-sheet',
    props: ['item'],
    data () {
      return {
        loading: true,
        hidden: false
      }
    },
    created () {
      this.$store.dispatch(item.FETCH_ITEM_DETAIL_DESCRIBE, {itemId: this.item.id}).then(() => {
        this.loading = false
      }).catch(e => {
        // TODO 缺少异常处理
      })
    },
    computed: {
      describes () {
        // 注 存在 ‘空指针异常’ 的可能，可使用 局部状态loading避免
        return this.$store.state.item.itemDetails[this.item.id].describes
      }
    },
    methods: {
      onHide () {
        this.hidden = true
      },
      onUnRender () {
        this.$emit('unRender')
      }
    }
  }
</script>

<style></style>