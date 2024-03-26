<template>
    <div class="user-table">
      <!-- 搜索筛选 -->
      <div ref="chart" class="chart"></div>
    </div>
</template>

<script setup>
import { detectChart } from "@/api/detect";
import { reactive, ref, toRefs, onMounted, onBeforeMount } from "vue";
import * as echarts from 'echarts';

const todayData = ref([]);
const yesterdayData = ref([]);
const twoDayAgoData = ref([]);
let chart = ref()
let myChart;
// 解构失去响应式
const editData = reactive({
  form: {},
});
// 用 toRefs()方法为它们添加响应性
const { form } = toRefs(editData);
const params = reactive({
  id: "",
  startDate: "",
  endDate: "",
});

function getdetect() {
  return new Promise((resolve, reject) => {
    detectChart(params)
      .then((res) => {
        if (res.data && res.data.today && res.data.yesterday && res.data.twoDaysAgo) {
          todayData.value = res.data.today;
          yesterdayData.value = res.data.yesterday;
          twoDayAgoData.value = res.data.twoDaysAgo;
          resolve(); // Data is valid, resolve the promise
        } else {
          reject(new Error("Invalid data structure")); // Data is not as expected, reject the promise
        }
      })
      .catch((err) => {
        console.log(err);
        reject(err); // 数据获取失败，可以选择 reject 以便在外部处理错误
      });
  });
}

onMounted(() => {
  getdetect().then(() => {
    setTimeout(() => {
      renderChart(); // 在数据获取完成后执行渲染图表的逻辑
      // console.log(myChart.getOption())
    }, 800)
  });
})

function renderChart() {
  const dates = ['Today', 'Yesterday', 'Two Days Ago'];
  const ipData = processIPData(todayData.value, yesterdayData.value, twoDayAgoData.value)
  myChart = echarts.init(chart.value);
  const series = ipData.flatMap(item => {
    return item.browsers.map(browser => {
      return {
        name: (item.ip ?? '无') + ' - ' + (browser.name ?? '-'),
        type: 'line',
        data: browser.counts,
      };
    });
  });
  // console.log(series);
  const option = {
    title: {
      // text: '近三天每天不同IP的click次数',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      formatter: function (params) {
        let tooltipContent = '';
        params.forEach(function (item) {
          tooltipContent += item.seriesName + ': ' + item.value + '<br>';
        });
        return 'Data: ' + params[0].axisValueLabel + '<br>' + tooltipContent;
      },
    },
    legend: {
      data: ipData.map(item => item.ip),
      selected: dates.reduce((acc, cur) => {
        acc[cur] = false;
        return acc;
      }, {})
    },
    xAxis: {
      type: 'category',
      data: dates,
    },
    yAxis: {
      type: 'value',
    },
    series: series,
  };
  myChart.setOption(option);
}

function processIPData(today, yesterday, twoDaysAgo) {
  const ipData = [];

  function processDayData(dayData, index) {
    dayData.forEach(item => {
      let ipItem = ipData.find(ip => ip.ip === item.ip);

      if (ipItem) {
        // IP 已经存在，检查是否存在相同浏览器
        const browserItem = ipItem.browsers.find(browser => browser.name === item.browser);

        if (browserItem) {
          // 相同浏览器存在，更新 count
          browserItem.counts[index] = item.count;
        } else {
          // 相同浏览器不存在，添加新的浏览器项
          ipItem.browsers.push({
            name: item.browser,
            counts: [0, 0, 0],
          });
          // 更新新添加的浏览器项的 count
          ipItem.browsers[ipItem.browsers.length - 1].counts[index] = item.count;
        }
      } else {
        // IP 不存在，添加新的项
        ipData.push({
          ip: item.ip,
          browsers: [{
            name: item.browser,
            counts: [0, 0, 0],
          }],
        });
        // 更新新添加的 IP 项的 count
        ipData[ipData.length - 1].browsers[0].counts[index] = item.count;
      }
    });
  }
  processDayData(today, 0);
  processDayData(yesterday, 1);
  processDayData(twoDaysAgo, 2);
  return ipData;
}

</script>

<style lang="scss" scoped>
.chart {
    padding: 15px;
    max-width: 680px;
    width: 100%;
    height: 100%;
    min-height: 450px;
}
</style>
