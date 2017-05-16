<!--
    
    @author herbluo
    change logs:
    2017/3/14 herbluo created
-->
<template>
    <!--<div>-->
        <div class="tabbar" ref="tabbar">
            <!--suppress CommaExpressionJS -->
            <div class="tab" v-for="(tab, index) in tabs" @click="tabClick(index)">
                <image
                        class="img"
                        :src="imgbase + (tab.isActived ? tab.imgActived : tab.img)"
                ></image>
            </div>
        </div>
    <!--</div>-->
</template>

<style scoped>
    .tabbar {
        width: 750px;
        height: 108px;
        border-top-width: 1px;
        border-color: #CCC;
        border-style: solid;
        flex-direction: row;
        padding-top: 10px;
        padding-bottom: 10px;
        background-color: #FFF;
    }

    .tab {
        flex: 1;
        align-items: center;
    }

    .img {
        width: 88px;
        height: 88px;
    }
</style>

<script>
    //noinspection ES6ModulesDependencies
    const animation = weex.requireModule('animation');
    const _ = require('lodash/function');

    export default {
        name: 'tab-bar',
        beforeCreate() {
        },
        data() {
            return {
                platform: '',
                imgbase: 'http://closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/',
                tabs: [{
                    name: '首页',
                    routerName: 'home',
                    img: 'tabbar-home.png',
                    imgActived: 'tabbar-home-a.png',
                    isActived: true,
                }, {
                    name: '微淘',
                    routerName: 'talk',
                    img: 'tabbar-talk.png',
                    imgActived: 'tabbar-talk-a.png',
                    isActived: false,
                }, {
                    name: '问大家',
                    routerName: 'qa',
                    img: 'tabbar-qa.png',
                    imgActived: 'tabbar-qa-a.png',
                    isAcvited: false,
                }, {
                    name: '购物车',
                    routerName: 'car',
                    img: 'tabbar-car.png',
                    imgActived: 'tabbar-car-a.png',
                    isActived: false,
                }, {
                    name: '我的淘宝',
                    routerName: 'user',
                    img: 'tabbar-user.png',
                    imgActived: 'tabbar-user-a.png',
                    isActived: false,
                }]
            }
        },
        created() {
            //noinspection ES6ModulesDependencies
            this.platform = weex.config.platform || weex.config.env.platform;
        },
        methods: {
            tabClick(index) {
                this.tabClick_(this, index)
            },
            tabClick_: _.debounce((vm, index) => {

                // 已经激活的tab不必再次激活
                if (vm.tabs[index].isActived) {
                    return;
                }

                // 获取当前的tab
                const tabbar = vm.$refs['tabbar'];
                let tab = vm.platform === 'Web'
                    ? tabbar.$children[index]
                    : tabbar.children[index];

                // 动画第一步
                animation.transition(tab, {
                    styles: {
                        transform: 'scale(0.5, 0.5)',
                        transformOrigin: 'center center'
                    },
                    duration: 60, //ms
                    timingFunction: 'ease-in',
                    delay: 0 //ms
                }, function () {
                    // 动画第二步
                    vm.tabs.forEach(tab => tab.isActived = false);
                    vm.tabs[index].isActived = true;

                    animation.transition(tab, {
                        styles: {
                            transform: 'scale(1, 1)',
                            transformOrigin: 'center center'
                        },
                        duration: 100, //ms
                        timingFunction: 'ease-out',
                        delay: 0 //ms
                    });
                });

                // 路由导航
                vm.$router.push(vm.tabs[index].routerName);

            }, 200, {leading: true, trailing: false}),

        }
    }
</script>
