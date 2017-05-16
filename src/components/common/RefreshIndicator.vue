<!--
    
    @author herbluo
    change logs:
    2017/4/22 herbluo created
-->
<template>
    <div>
                <div class="indicator">
                    <div class="cricle-right"></div>
                    <div class="block"></div>
                    <div class="cricle-left"></div>
                    <div class="block"></div>
                </div>
    </div>
</template>

<style scoped>
    .cricle-right, .cricle-left {
        position: absolute;
        top: 0;
        left: 0;

        width: 58px;
        height: 58px;
        border-radius: 29px;
        border-width: 2px;
        border-color: #fff;
        border-style: solid;
        /*background-color: #fff;*/
    }
    .indicator {
        position: relative;
        width: 58px;
        height: 58px;

        margin-top: 18px;
        margin-bottom: 12px;
    }
</style>

<script>
    export default {
        name: 'refresh-indicator'
    }
</script>

<style></style>