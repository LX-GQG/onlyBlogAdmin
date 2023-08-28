<!--
 * @Author: LX_DUG
 * @Date: 2022-12-06 22:12:19
 * @LastEditors: LX_DUG
 * @LastEditTime: 2023-01-28 17:04:59
 * @Description: description
-->
<template>
    <div class="lx-button" :class="type" >
        <slot></slot>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    type: String,
})

</script>


<style lang="scss" scoped>
.lx-button {
    height: 30px;
    padding: 0 10px;
    margin: 0 8px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    font-size: 13px;
    text-align: center;
    cursor: pointer;
    user-select: none;
  }
  .primary {
    color: #fff;
    background-color: #b37df1;
    border: 1px solid #b37df1;
  }
  .primary:active {
    background-color: #be95ea;
    border-color: #be95ea;
  }
  .danger {
    color: #fff;
    background-color: #84d1fb;
    border: 1px solid #84d1fb;
  }
  .danger:active {
    background-color: #b1e2fd;
    border-color: #b1e2fd;
  }
  .warning {
    color: #fff;
    background-color: #f56c6c;
    border: 1px solid #f56c6c;
  }
  .warning {
    background-color: #f78989;
    border-color: #f78989;
  }
  .info {
    color: #fff;
    background-color: #c5c5c5;
    border: 1px solid #afafaf;
  }
  .info:active {
    background-color: #d5d5d5;
    border-color: #c9c9c9;
  }
  .Joyful {
    font-size: 16px;
    border: none;
    background: #6285f8;
    color: white;
    cursor: pointer;
    position: relative;
    z-index: 1;
   }
   
   .Joyful:hover {
    color: rgb(255, 255, 255);
   }
   
   .Joyful::before,.Joyful::after {
    content: "";
    position: absolute;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    background: rgba(128, 128, 128, 0.096);
    backdrop-filter: blur(10px);
    z-index: -1;
    transition: all 0.4s;
   }
   
   .Joyful::after {
    z-index: -2;
    transition: all 0.4s;
   }
   
   .Joyful:hover::before {
    background: rgb(0, 0, 0, 0.315);
    border-radius: 10px;
   }
   
   .Joyful:hover::after {
    background: linear-gradient(to right, #cb6ce6, #38b6ff);
    border-radius: 10px;
    transform: scale(1.07, 1.2) rotateX(180deg);
   }
</style>