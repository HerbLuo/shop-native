<!--
    
    @author herbluo
    change logs:
    2017/5/25 herbluo created
-->
<template>
    <div>
        <item-slider-box @loaded="aComponentLoaded" :picLinks="item.picLinksJson"></item-slider-box>
        <item-detail-box :item="item"></item-detail-box>
        <split-bar></split-bar>

    </div>
</template>

<style scoped>

</style>

<script>

    import log from '../utils/log'
    import dao from '../dao'
    import api from '../api'
    import cache from '../utils/cache'
    import loader from '../utils/shop-native/loader'

    import ItemSliderBox from "../components/item/ItemSliderBox.vue";
    import ItemDetailBox from "../components/item/ItemDetailBox.vue";
    import SplitBar from "../components/home/SplitBar.vue";

    const ITEM = 'item';

    export default {
        components: {
            SplitBar,
            ItemDetailBox,
            ItemSliderBox
        },
        name: 'item',
        data() {
            return {
                item: {},
                loading: true,
                componentsOnLoadingNum: 1
            }
        },
        watch: {
            componentsOnLoadingNum() {
                if (this.componentsOnLoadingNum <= 0)
                    this.loading = false;
            }
        },
        created() {
            this.render();
            setTimeout(() => this.loading = false, 2000)
        },

        methods: {
            async render() {
                // 路由参数
                let params = this.$route.params;
                if (!params) {
                    log.error('[%s] 无法解析路由参数', ITEM);
                    return;
                }

                // 商品id
                let itemId = params.id | 0;
                if (!itemId || typeof itemId !== 'number') {
                    log.error('[%s] 路由参数非法', ITEM);
                    return;
                }

                this.item.version = params.version;

                // 加载item data
                let event = await this.loader(itemId);

                // 加载失败
                if (!event.data || event.data.length !== 1) {
                    log.error('[%s] 加载商品信息失败', ITEM);
                    return;
                }

                // 加载成功
                let item = event.data[0];
                // 处理数据
                this.handler(item);
                // 缓存数据
//                cache.set(`${ITEM}_${itemId}`, item);
                // 绑定到视图
                this.item = item;

            },
            handler(item) {
                item.picLinksJson = JSON.parse(item.picLinksJson);
                if (!(item.picLinksJson instanceof Array)) {
                    log.warning('[%s] item.picLinksJson可解析但非数组: %s', ITEM, item.picLinksJson)
                }
            },
            loader(itemId) {
                return new Promise(resolve => {
                    loader.A({
                        logKey: `[${ITEM}]`,
                        version: this.item.version || 'no-cache',
                        cacheName: `${ITEM}_${itemId}`,
                        storagePromise: dao.get_by__item__by_id(itemId),
                        serverPromiseFunc: () => Vue.axios.get(api.url.getItemById(itemId)),
                        renderCallback: (data, type) => resolve({data, type})
                    })
                })
            },
            aComponentLoaded() {
                this.componentsOnLoadingNum--;
            }
        }
    }
</script>

<style></style>