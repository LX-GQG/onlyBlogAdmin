<template>
    <div class="user-table">
      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="params" class="search" >
        <el-form-item class="el-item" label="ID:">
            <el-input v-model="params.id" placeholder="Search Id"></el-input>
        </el-form-item>
        <el-form-item class="el-item" label="Username:">
            <el-input v-model="params.username" placeholder="Search Username"></el-input>
        </el-form-item>
        <el-form-item label="CreateTime:" class="el-item">
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
            <el-button type="primary" plain :icon="Search" @click="SearchValue">Search</el-button>
        </el-form-item>
        <el-form-item class="el-item">
          <!-- <lx-button type="danger" @click="batchRemove">Batch Delete</lx-button> -->
          <el-button type="warning" plain :icon="Edit" @click="addToAdmin">Add User</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="userData" border @selection-change="handleSelectionChange" row-key="id">
        <el-table-column type="selection" width="55" />
        <el-table-column label="ID" prop="id" width="60" align="center"></el-table-column>
        <el-table-column label="用户名称" prop="username" align="center" min-width="100"></el-table-column>
        <el-table-column label="用户头像" width="100" align="center">
            <template #default="{ row }">
                <img class="avatar-img" :src="row.avatar ? row.avatar : unloginImg" alt="avatar" />
            </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
        <el-table-column label="IP" prop="ip" align="center"></el-table-column>
        <el-table-column label="备注" prop="remark" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="170" align="center"></el-table-column>
        <el-table-column label="状态" prop="status" width="70">
          <template #default="{ row }">
            <el-switch
              class="ml-2"
              style="--el-switch-on-color: #b37df1; --el-switch-off-color: #dcdfe6"
              :active-value="1" 
              :inactive-value="0" 
              v-model="row.status"
              @change="changeStatus(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="Operations" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <div class="operations">
              <lx-button type="primary" @click="handelEdit(row)">Edit</lx-button>
              <el-popconfirm
                width="230px"
                confirm-button-text="Yes"
                cancel-button-text="No"
                :icon="Scissor"
                icon-color="#c25afd"
                title="Are you sure to delete this?"
                @confirm="confirmEvent(row)">
                <template #reference>
                  <lx-button type="danger">Detail</lx-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="userData.length"
        class="pagination"
        :total="userData.length"
        :current-page="params.pageNo"
        :page-size="params.pageSize"
        :page-sizes="[5, 10, 20, 50]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      <el-dialog :title="isEdit?'ADD':'EDIT'" v-model="dialogTableVisible" width="450px">
        <el-form :model="form" label-width="100px">
          <el-form-item label="Username">
            <el-input v-model="form.username" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="Email">
            <el-input v-model="form.email" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="Remark">
            <el-input v-model="form.ramark" placeholder=""></el-input>
          </el-form-item>
          <el-form-item class="form-bottom">
              <lx-button type="info" style="margin-left: 15px;" @click="cancelEdit">Cancel</lx-button>
              <lx-button type="primary" style="margin-left: 20px;" @click="isEdit?confirmAdd():confirmEdit()">Confirm</lx-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script setup>
import { userList, addUser, updateUser, deleteUser } from "@/api/user";
import { roleList } from '@/api/role';
import { ElMessage } from "element-plus";
import { reactive, ref, toRefs } from "vue";
import { Search, Edit } from '@element-plus/icons-vue';

const isDisabled = ref(false)
const isEdit = ref(false)
const userData = ref([]);
const roleData = ref([]);
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
  username: "",
  startDate: "",
  endDate: "",
  keyword: "",
  pageNo: 1,
  pageSize: 10,
});

function getUserList() {
    userList(params)
    .then((res) => {
      userData.value = res.data.rows;
    })
    .catch((err) => {
      console.log(err);
    });
}

function changeStatus(data) {
  updateAdmin(data).then((res) => {
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
  addUser(editData.form)
    .then(res => {
      if(res.code == 200) {
        ElMessage({
          type: 'success',
          message: 'Successfully modified!'
        })
      }
      dialogTableVisible.value = false
      getUserList()
    })
}

function handleSizeChange(val) {
  params.pageSize = val;
  getUserList();
}

function handleCurrentChange(val) {
  params.pageNo = val;
  getUserList();
}
// 编辑
function handelEdit(data) {
  isEdit.value = false
  dialogTableVisible.value = true;
  editData.form = data;
}
// 确认
const confirmEdit = () => {
  updateUser(editData.form)
    .then((res) => {
      if(res.code == 200) {
        ElMessage({
          type: 'success',
          message: 'Successfully modified!'
        })
      }
      dialogTableVisible.value = false
      getUserList()
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
  getUserList()
}

const SearchValue = () => {
  params.keyword = search.value
  userList(params)
    .then((res) => {
        userData.value = res.data.rows;
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
const handleRoleChange = (data) => {
}
//    const batchRemove = () => {
//      removeBatchUser(multipleSelection.value)
//        .then((res: any) => {
//          if(res.code == 200) {
//            ElMessage({
//              type:'success',
//              message: 'Bulk deletion succeeded!'
//            })
//            getUserList()
//          }
//        })
//        .catch((err) => {
//          console.log(err)
//          ElMessage({
//            type:'error',
//            message: err
//        })
//      })
//    }

// 确认删除
const confirmEvent = (data) => {
  deleteUser({id: data.id})
  .then((res) => {
    if(res.code == 200) {
      ElMessage({
        type:'success',
        message: 'successfully deleted!'
      })
    }
    getUserList()
  })
  .catch((err) => {
    console.log(err)
    ElMessage({
      type:'error',
      message: err
    })
  })
}

getUserList();
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
