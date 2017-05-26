<!--
    该组件上级是一个路由，
    安卓平台下的fixed有问题，
    @author herbluo
    change logs:
    2017/5/25 herbluo created
-->
<template>
    <div>
        <router-view></router-view>
        <tab-bar class="par-tabbar"></tab-bar>
    </div>
</template>

<style scoped>
    .par-tabbar {
        position: fixed;
        left: 0;
        bottom: 0;
        height: 108px;
        width: 750px;
    }
</style>

<script>
    import TabBar from "../components/common/TabBar.vue";

    export default {
        components: {TabBar},
        name: 'home'
    }
</script>

<style></style>