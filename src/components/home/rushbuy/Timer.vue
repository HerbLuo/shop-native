<!--
    
    @author herbluo
    change logs:
    2017/4/21 herbluo created
-->
<!--suppress JSUnresolvedFunction -->
<template>
    <div class="timer" v-if="show">
        <div class="num-box">
            <text class="num">{{ numberFormat(hour) }}</text>
        </div>
        <text class="text">:</text>
        <div class="num-box">
            <text class="num">{{ numberFormat(minute) }}</text>
        </div>
        <text class="text">:</text>
        <div class="num-box">
            <text class="num">{{ numberFormat(second) }}</text>
        </div>
    </div>
</template>

<style scoped>
    .timer {
        flex-direction: row;
    }

    .num-box {
        width: 28px;
        height: 24px;
        background-color: #F14E53;
        border-radius: 4px;

        margin-left: 2px;
        margin-right: 2px;

        justify-content: center;
        align-items: center;
    }

    .num, .text {
        font-size: 18px;
    }

    .text {
        color: #F14E53;
    }

    .num {
        color: #FFF;
    }
</style>

<script>

    import {timer, clearTimer} from '../../../utils/timer'

    export default {
        name: 'timer',
        props: {
            startTimestamp: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                show: false,
                hour: 0,
                minute: 0,
                second: 0,
                timer: null,
            }
        },
        beforeCreate() {

        },
        created() {
            const vm = this;

            let time = vm.startTimestamp - new Date().getTime();
            if (time < 0) {
                return;
            }

            let timeMS = time % 1000;
            time = (time / 1000) | 0;

            vm.hour = (time / 3600) | 0;
            vm.minute = (time % 3600 / 60) | 0;
            vm.second = (time % 60) | 0;
            vm.show = true;

            setTimeout(() => {
                vm.startTimer();
            }, timeMS);
        },
        methods: {
            startTimer() {
                const vm = this;

                reduceOneSecond();

                /*
                 * 由于安卓中 可能存在 销毁vue时无法销毁Interval的问题，
                 * 使用该方法代替
                 *
                 * weex devtool输出：Error: invalid instance id
                 */
                vm.timer = timer(() => {
                    reduceOneSecond();
                }, 1000);

                function reduceOneSecond() {
                    // 秒减1
                    let second = vm.second;
                    if (--second >= 0) {
                        vm.second = second;
                        return;
                    }

                    // 分 -1
                    vm.second = 59;
                    let minute = vm.minute;
                    if (--minute >= 0) {
                        vm.minute = minute;
                        return;
                    }

                    // 时 -1
                    vm.minute = 59;
                    let hour = vm.hour;
                    if (--hour > 0) {
                        vm.hour = hour;
                        return;
                    }

                    // 计时结束
                    vm.hour = 0;
                    vm.minute = 0;
                    vm.second = 0;
                    vm.endTimer();
                    vm.show = false;
                }
            },
            numberFormat(num) {
                return num === 0 ? '00'
                    : num < 10 ? '0' + num
                        : num > 99 ? '99'
                            : num;
            },
            endTimer() {
                if (this.timer) {
                    clearTimer(this.timer);
                    this.timer = null;
                }
            },
        },
        beforeDestroy() {
            this.endTimer();
        },
    }
</script>

<style></style>