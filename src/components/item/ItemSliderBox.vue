<!--
    
    @author herbluo
    change logs:
    2017/5/25 herbluo created
-->
<template>
    <div class="top">
        <slider class="slider" v-if="picLinks">
            <div class="frame" v-for="img in picLinks">
                <!-- cover 适应后裁剪 -->
                <image class="image" resize="cover" :src="img"></image>
            </div>
            <indicator class="indicator"></indicator>
        </slider>
        <div class="shadow"></div>
    </div>
</template>

<style scoped>
    .top, .slider, .frame, .image {
        width: 750px;
        height: 750px;
    }

    .shadow {
        position: absolute;
        bottom: 0;
        left: 0;

        height: 100px;
        width: 750px;


        opacity: 0.1;
        background-image: linear-gradient(to top, #000, #fff);
    }

    .indicator {
        position: absolute;
        right: 0;
        bottom: 0;

        width: 750px;
        height: 39px;

        item-color: #ddd;
        item-selected-color: #F41;
        item-size: 18px;
        opacity: 0.9;
    }
</style>

<script>
    export default {
        name: 'item-slider-box',
        props: {
            picLinks: {
                type: Array,
            }
        }
    }
</script>

<style></style>