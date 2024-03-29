<template>
    <div class="user-table">
      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="params" class="search" >
        <!-- <el-form-item class="el-item">
            <el-button type="primary" plain :icon="Search" @click="SearchValue">Search</el-button>
        </el-form-item> -->
        <el-form-item class="el-item">
          <el-button type="warning" plain :icon="Edit" @click="addToAdmin">{{ $t('tableHead.add_tag') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tagData" border @selection-change="handleSelectionChange" row-key="id">
        <el-table-column type="selection" width="55" />
        <el-table-column label="ID" prop="id" width="120" align="center"></el-table-column>
        <el-table-column :label="$t('tableHead.tagname')" prop="name" align="center" min-width="100"></el-table-column>
        <el-table-column :label="$t('tableHead.operation')" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <div class="operations">
              <lx-button type="primary" @click="handelEdit(row)">{{ $t('tableHead.edit') }}</lx-button>
              <el-popconfirm
                width="230px"
                confirm-button-text="Yes"
                cancel-button-text="No"
                :icon="Scissor"
                icon-color="#c25afd"
                title="Are you sure to delete this?"
                @confirm="confirmEvent(row)">
                <template #reference>
                  <lx-button type="danger">{{ $t('tableHead.delete') }}</lx-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="tagData.length"
        class="pagination"
        :total="tagData.length"
        :current-page="params.pageNo"
        :page-size="params.pageSize"
        :page-sizes="[5, 10, 20, 50]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      <el-dialog :title="isEdit?$t('tableHead.add'):$t('tableHead.edit')" v-model="dialogTableVisible" width="450px" draggable>
        <el-form :model="form" label-width="100px">
          <el-form-item :label="$t('tableHead.tagname')">
            <el-input v-model="form.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item class="form-bottom">
              <lx-button type="info" style="margin-left: 15px;" @click="cancelEdit">{{ $t('tableHead.cancel') }}</lx-button>
              <lx-button type="primary" style="margin-left: 20px;" @click="isEdit?confirmAdd():confirmEdit()">{{ $t('tableHead.confirm') }}</lx-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script setup>
import { tagList, addTag, updateTag, deleteTag } from "@/api/tag";
import { ElMessage } from "element-plus";
import { reactive, ref, toRefs } from "vue";
import { Search, Edit } from '@element-plus/icons-vue';

const isDisabled = ref(false)
const isEdit = ref(false)
const tagData = ref([]);
const dialogTableVisible = ref(false);
const multipleSelection = ref([])
const search = ref()

const unloginImg = ref('../src/assets/img/unlogin.png');

// 解构失去响应式
const editData = reactive({
  form: {},
});
// 用 toRefs()方法为它们添加响应性
const { form } = toRefs(editData);
const params = reactive({
  id: "",
  name: "",
  pageNo: 1,
  pageSize: 10,
});

function getTagList() {
    tagList(params)
    .then((res) => {
      tagData.value = res.data.rows;
    })
    .catch((err) => {
      console.log(err);
    });
}

function changeStatus(data) {
  data.status = data.status == true ? 1 : 0;
  updateTag(data).then((res) => {
    if(res.code == 200) {
      ElMessage({
        type: 'success',
        message: 'Successfully modified!'
      })
    }
  })
}

// 添加
function addToAdmin() {
  isEdit.value = true
  dialogTableVisible.value = true;
  editData.form = {};
}

function confirmAdd() {
  addTag(editData.form)
    .then(res => {
      if(res.code == 200) {
        ElMessage({
          type: 'success',
          message: 'Successfully modified!'
        })
      }
      dialogTableVisible.value = false
      getTagList()
    })
}

function handleSizeChange(val) {
  params.pageSize = val;
  getTagList();
}

function handleCurrentChange(val) {
  params.pageNo = val;
  getTagList();
}
// 编辑
function handelEdit(data) {
  isEdit.value = false
  dialogTableVisible.value = true;
  editData.form = {};
  editData.form = data;
}
// 确认
const confirmEdit = () => {
  updateTag(editData.form)
    .then((res) => {
      if(res.code == 200) {
        ElMessage({
          type: 'success',
          message: 'Successfully modified!'
        })
      }
      dialogTableVisible.value = false
      getTagList()
    })
    .catch((err) => {
      ElMessage({
          type: 'error',
          message: 'Fail to Edit!'
      })
      console.log(err);
    });
};

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
  getTagList()
}

const SearchValue = () => {
  params.keyword = search.value
  tagList(params)
    .then((res) => {
        tagData.value = res.data.rows;
    })
    .catch((err) => {
        console.log(err);
    });
}

const cancelEdit = () => {
  dialogTableVisible.value = false
}
// 处理批量选中的事件
const handleSelectionChange = (val) => {
  // 每次点击都对之前的数据进行清空
  multipleSelection.value = [];
  val.map((item, index) => {
    multipleSelection.value.push(item['id'])
  })
}

// 确认删除
const confirmEvent = (data) => {
  deleteTag({id: data.id})
  .then((res) => {
    if(res.code == 200) {
      ElMessage({
        type:'success',
        message: 'successfully deleted!'
      })
    }
    getTagList()
  })
  .catch((err) => {
    console.log(err)
    ElMessage({
      type:'error',
      message: err
    })
  })
}

getTagList();
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
