<template>
    <div class="s-canvas" @click="refreshCode">
        <canvas
            id="s-canvas"
            :width="contentWidth"
            :height="contentHeight"
        ></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

let curIdentifyCode = ref("");

const props = defineProps({
  identifyCode: {
    type: String,
    default: "0123456789ABCDEFGHIJKLMNPQRSTUVWXYZ",
    // 0和O太像了，所以去掉了O
  },
  fontSizeMin: {
    type: Number,
    default: 20,
  },
  fontSizeMax: {
    type: Number,
    default: 35,
  },
  backgroundColorMin: {
    type: Number,
    default: 255,
  },
  backgroundColorMax: {
    type: Number,
    default: 255,
  },
  colorMin: {
    type: Number,
    default: 50,
  },
  colorMax: {
    type: Number,
    default: 160,
  },
  lineColorMin: {
    type: Number,
    default: 10,
  },
  lineColorMax: {
    type: Number,
    default: 60,
  },
  dotColorMin: {
    type: Number,
    default: 0,
  },
  dotColorMax: {
    type: Number,
    default: 10,
  },
  contentWidth: {
    type: Number,
    default: 120,
  },
  contentHeight: {
    type: Number,
    default: 30,
  },
});

watch(curIdentifyCode, () => {
    drawPic()
})

const emit = defineEmits(["updateIdentifyCode"]);

// 生成一个随机数
const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
// 生成一个随机的颜色
const randomColor = (min, max) => {
  let r = randomNum(min, max);
  let g = randomNum(min, max);
  let b = randomNum(min, max);
  return "rgb(" + r + "," + g + "," + b + ")";
};
const drawPic = () => {
  let canvas = document.getElementById("s-canvas");
  let ctx = canvas.getContext("2d");
  ctx.textBaseline = "bottom";
  // 绘制背景
  ctx.fillStyle = randomColor(
    props.backgroundColorMin,
    props.backgroundColorMax
  );
  ctx.fillRect(0, 0, props.contentWidth, props.contentHeight);
  // 绘制文字
  for (let i = 0; i < curIdentifyCode.value.length; i++) {
    drawText(ctx, curIdentifyCode.value[i], i);
  }
  drawLine(ctx);
  drawDot(ctx);
};
const drawText = (ctx, txt, i) => {
  ctx.fillStyle = randomColor(props.colorMin, props.colorMax);
  ctx.font = randomNum(props.fontSizeMin, props.fontSizeMax) + "px SimHei";
  let x = (i + 1) * (props.contentWidth / (curIdentifyCode.value.length + 1));
  let y = randomNum(props.fontSizeMax, props.contentHeight - 5);
  let deg = randomNum(-45, 45);
  // 修改坐标原点和旋转角度
  ctx.translate(x, y);
  ctx.rotate((deg * Math.PI) / 180);
  ctx.fillText(txt, 0, 0);
  // 恢复坐标原点和旋转角度
  ctx.rotate((-deg * Math.PI) / 180);
  ctx.translate(-x, -y);
};
const drawLine = (ctx) => {
  // 绘制干扰线
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = randomColor(props.lineColorMin, props.lineColorMax);
    ctx.beginPath();
    ctx.moveTo(
      randomNum(0, props.contentWidth),
      randomNum(0, props.contentHeight)
    );
    ctx.lineTo(
      randomNum(0, props.contentWidth),
      randomNum(0, props.contentHeight)
    );
    ctx.stroke();
  }
};
const drawDot = (ctx) => {
  // 绘制干扰点
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = randomColor(0, 255);
    ctx.beginPath();
    ctx.arc(
      randomNum(0, props.contentWidth),
      randomNum(0, props.contentHeight),
      1,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
};
 
const refreshCode = () => {
  curIdentifyCode.value = "";
  makeCode(props.identifyCode, 4);
};
const makeCode = (o, l) => {
  for (let i = 0; i < l; i++) {
    curIdentifyCode.value += o[randomNum(0, o.length)];
  }
  // console.log(curIdentifyCode.value);
  emit("updateIdentifyCode", curIdentifyCode.value);
};
 
onMounted(() => {
  drawPic();
  refreshCode();
});
 
defineExpose({
  refreshCode,
});
</script>

<style>
canvas {
    aspect-ratio: auto;
    border-radius: 20px;
}
</style>