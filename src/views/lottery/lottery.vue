<template>
    <div class="user-table">
      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="params" class="search" >
        <el-form-item class="el-item" label="IP:">
            <el-input v-model="params.ip" placeholder="Search IP"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tableHead.current_time')+':'" class="el-item">
            <el-date-picker
              v-model="dateValue"
              type="datetimerange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              @change="changeTime"
            />
        </el-form-item>
        <el-form-item class="el-item">
            <el-button type="primary" plain :icon="Search" @click="SearchValue">{{ $t('tableHead.search') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="detectData" border @selection-change="handleSelectionChange" row-key="id">
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column label="ID" prop="id" width="60" align="center"></el-table-column>
        <el-table-column :label="$t('tableHead.type')" prop="price_name" align="center" min-width="100"></el-table-column>
        <el-table-column :label="$t('tableHead.browser_type')" prop="browser" align="center" min-width="100"></el-table-column>
        <el-table-column label="IP" prop="ip" align="center" width="140">
          <template #default="{ row }">
            <span @dblclick="getIpInfo(row)">{{ row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tableHead.trigger_time')" prop="current_time" width="180" align="center"></el-table-column>
      </el-table>
      <el-pagination
        v-if="detectData.length"
        class="pagination"
        :total="total"
        :current-page="params.pageNo"
        :page-size="params.pageSize"
        :page-sizes="[5, 10, 20, 50]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
</template>

<script setup>
import { lotteryList } from "@/api/lottery";
import { reactive, ref, toRefs } from "vue";
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import axios from 'axios'

// 个人网站的数据埋点信息
const total = ref(0);
const detectData = ref([]);
const dialogTableVisible = ref(false);

const options = ref([
  { value: "pv", label: "PV" },
  { value: "click", label: "Click" },
]);

// 解构失去响应式
const editData = reactive({
  form: {},
});
// 用 toRefs()方法为它们添加响应性
const { form } = toRefs(editData);
const params = reactive({
  ip: "",
  type: "",
  startDate: "",
  endDate: "",
  pageNo: 1,
  pageSize: 20,
});

// ip-api.com ,可切换显示语言
let url = ref('http://ip-api.com/json/')

function getIpInfo(data) {
  const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." })
  let ip = data.ip
  axios.get(url.value + ip + '?lang=zh-CN').then((res)=>{
      //请求成功的回调函数
      if(res.data.status == 'success') {
        loadingInstance.close()
        ElMessageBox.alert('国家：' + res.data.country + ', 省份：'+ res.data.regionName +', 城市：' + res.data.city, 'IP info', {
          // if you want to disable its autofocus
          // autofocus: false,
          confirmButtonText: 'OK',
        })
      }
  }
  ).catch((err)=>{
      //请求失败的回调函数
      ElMessage.error(err.info)
      console.log(err)
  })
}
function getlotteryList() {
    lotteryList(params)
    .then((res) => {
        total.value = res.data.count;
        detectData.value = res.data.rows;
    })
    .catch((err) => {
      console.log(err);
    });
}


function handleSizeChange(val) {
  params.pageSize = val;
  getlotteryList();
}

function handleCurrentChange(val) {
  params.pageNo = val;
  getlotteryList();
}

// 搜索时间
const dateValue = ref([]);

const changeTime = (data) => {
  if(data) {
    params.startDate = data[0]
    params.endDate = data[1]
  }else{
    params.startDate = ""
    params.endDate = ""
  }
  getlotteryList()
}

const SearchValue = () => {
  getlotteryList()
}

const cancelEdit = () => {
  dialogTableVisible.value = false
}


getlotteryList();
</script>

<style lang="scss" scoped>
.user-table {
  padding: 15px;
}
.pagination {
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.operations {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.form-bottom {
  margin-top: 25px;
}
.user-img {
  width: 50px;
  height: 50px;
}
.avatar-img {
    width: 70px;
    height: 70px;
    border-radius: 10px;
    object-fit: cover;
}
</style>
