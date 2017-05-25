<!--
    
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
    }
</style>

<script>
    import TabBar from "../components/common/Tabbar.vue";

    export default {
        components: {TabBar},
        name: 'home'
    }
</script>

<style></style>