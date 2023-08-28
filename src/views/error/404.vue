<!--
 * @Author: LX_DUG
 * @Date: 2022-11-25 13:44:07
 * @LastEditors: LX_DUG
 * @LastEditTime: 2022-11-30 22:49:19
 * @Description: description
-->
<template>
    <div class="content">
        <div class="background">
            <div class="back_content">
                <div class="back" @click="back">
                    返回首页
                </div>
            </div>
        </div>
        <div class="tips">
            很抱歉，页面迷路了~~
        </div>
    </div>
</template>

<script setup>
import router from "@/router";

const back = () => {
    router.push({ path: "/" });
}
</script>


<style lang="scss" scoped>
    .content {
        width: 100%;
        min-width: 1280px;
        height: 100%;
        position: relative;
        background-image:linear-gradient(135deg, #84d1fb, #8782f5, #dc78f7);
        .background {
            position: absolute;
            left: 50%;
            top: 25%;
            transform: translateX(-100%);
            background-image: url(@/assets/img/404.png);
            width: 360px;
            height: 295px;
            background-size: cover;
            background-repeat: no-repeat;
            .back_content {
                width: 750px;
                margin-top: 380px;
                display: flex;
                align-items: center;
                justify-content: center;
                .back {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px;
                    width: 70px;
                    border: 1px solid #fff;
                    border-radius: 5px;
                    font-size: 17px;
                    color: #fff;
                    cursor: pointer;
                }
            }
        }
        .tips {
            position: absolute;
            right: 25%;
            bottom: 60%;
            font-size: 29px;
            color: #fff;
        }
    }
    .content::-webkit-scrollbar {
        height: 1px;
    }
</style>