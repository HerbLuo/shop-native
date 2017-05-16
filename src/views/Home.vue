<!--
    
    @author herbluo
    change logs:
    2017/3/14 herbluo created
-->
<template>
    <div>
        <top-bar></top-bar>
        <scroller
                class="scroller" :style="scroller"
                show-scrollbar="false"
                loadmoreoffset="600" @loadmore="loadmore"
        >
            <refresh class="refresh" @refresh="onRefresh" @pullingdown="onPullingDown" :display="refreshDisplay">
                <!--<text>onrefresh...</text>-->
                <!--<refresh-indicator></refresh-indicator>-->
                <loading-indicator></loading-indicator>
            </refresh>

            <!-- 轮播图 -->
            <slider-bar></slider-bar>

            <!-- 入口 -->
            <entrance-bar></entrance-bar>

            <!-- 热门 -->
            <hot-bar></hot-bar>
            <split-bar></split-bar>

            <!-- 抢购 -->
            <block-rush-buy></block-rush-buy>
            <split-bar></split-bar>

            <!-- 极有家 -->
            <block-ji-you-jia></block-ji-you-jia>
            <split-bar></split-bar>

            <div style="width: 750px; height: 600px; background-color: green;"></div>
            <div v-if="loadBlock[0]" style="width: 750px; height: 200px; background-color: orange;"></div>
            <div v-if="loadBlock[1]" style="width: 750px; height: 200px; background-color: #ddd;"></div>
            <div v-if="loadBlock[2]" style="width: 750px; height: 200px; background-color: #ccc;"></div>
            <div v-if="loadBlock[3]" style="width: 750px; height: 200px; background-color: #bbb;"></div>
            <div v-if="loadBlock[4]" style="width: 750px; height: 200px; background-color: #aaa;"></div>
            <div v-if="loadBlock[5]" style="width: 750px; height: 200px; background-color: #eee;"></div>
        </scroller>
    </div>
</template>

<style scoped>
    .scroller {
        width: 750px;
    }

    .refresh {
        /*justify-content: center;*/
        align-items: center;
    }
</style>

<script>

    import log from '../utils/log'
    import loadingState from '../utils/LoadingState'
    import {ACTION_SET_HOME_REFRESHING} from '../store/mutation-action'

    import SliderBar from "../components/home/SliderBar.vue";
    import TopBar from "../components/home/TopBar.vue";
    import EntranceBar from "../components/home/EntranceBar.vue";
    import HotBar from "../components/home/HotBar.vue";
    import SplitBar from "../components/home/SplitBar.vue";
    import BlockRushBuy from "../components/home/Block_RushBuy.vue";
    import BlockJiYouJia from "../components/home/Block_JiYouJia.vue";


    //noinspection ES6ModulesDependencies
    const modal = weex.requireModule('modal');

    export default {
        components: {
            BlockJiYouJia,
            BlockRushBuy,
            SplitBar,
            HotBar,
            EntranceBar,
            TopBar,
            SliderBar,
        },
        name: 'home',
        data() {
            return {
                /* style */
                scroller: {
                    height: '0'
                },

                /* data */
                loadBlock: [],
                loadImg: [],
            }
        },
        computed: {
            refreshDisplay() {
                return this.$store.state.home.refreshing ? 'show' : 'hide';
            }
        },
        created() {
            this.render();
        },
        beforeCreate () {
            loadingState.loading('home')
        },
        mounted() {
            loadingState.ok('home')
        },
        methods: {
            /*
             * 计算router的高度
             */
            render() {
                let height;
                try {
                    //noinspection ES6ModulesDependencies
                    let config = weex.config,
                        env = config.env,
                        deviceHeight = env ? env.deviceHeight : config.deviceHeight,
                        deviceWidth = env ? env.deviceWidth : config.deviceWidth;

                    height = (deviceHeight / deviceWidth * 750 - 100) + 'px'
                } catch (e) {
                    log.error(e)
                }
                this.scroller.height = height || '1334px'
            },
            onRefresh() {
                console.info('on refreshing');
                this.$store.dispatch(ACTION_SET_HOME_REFRESHING);
            },
            onPullingDown() {
                console.info('on pullingdown')
            },

            loadmore() {
                console.info('load more');
                this.loadBlock.push(true);
            }

        }
    }
</script>


<style></style>