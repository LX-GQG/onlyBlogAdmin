<template>
    <div class="user-table">
      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="search" class="search" >
        <!-- <el-form-item class="el-item" >
          <el-input  v-model="search" placeholder="Search"></el-input>
        </el-form-item>
        <el-form-item class="el-item">
          <lx-button type="danger" @click="SearchValue"><el-icon><Scissor /></el-icon>Search</lx-button>
        </el-form-item> -->
        <el-form-item class="el-item">
          <!-- <lx-button type="danger" @click="batchRemove">Batch Delete</lx-button> -->
          <el-button type="primary" plain :icon="Edit" @click="addToAdmin">Add Admin</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="adminData" border @selection-change="handleSelectionChange" row-key="id">
        <el-table-column type="selection" width="55" />
        <el-table-column label="用户名称" prop="username"></el-table-column>
        <el-table-column label="禁用/启用" prop="status">
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
        <el-table-column label="角色">
            <template #default="{ row }">
                {{ row.roles[0] ? row.roles[0].role_type : '无角色' }}
            </template>
        </el-table-column>
        <el-table-column label="Operations" width="180px">
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
                @confirm="confirmEvent(row)"
              >
                <template #reference>
                  <lx-button type="danger">Detail</lx-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="adminData.length"
        class="pagination"
        :total="adminData.length"
        :current-page="params.pageNo"
        :page-size="params.pageSize"
        :page-sizes="[5, 10, 20, 50]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      <el-dialog :title="isEdit?'ADD':'EDIT'" v-model="dialogTableVisible" width="450px">
        <el-form :model="form" label-width="100px">
          <el-form-item label="username">
            <el-input v-model="form.username" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="new Pass">
            <el-input v-model="form.password" placeholder="" show-password></el-input>
          </el-form-item>
          <el-form-item label="role">
            <el-select v-model="form.rid" @change="handleRoleChange" placeholder="请选择用户角色" style="width:310px" clearable :disabled="isDisabled">
                <el-option
                  v-for="(item, index) in roleData"
                  :key="index"
                  :label="item.role_type"
                  :value="item.id"
                  >
                </el-option>
            </el-select>
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
import { adminList, addAdmin, updateAdmin, deleteAdmin } from "@/api/admin";
import { roleList } from '@/api/role';
import { ElMessage } from "element-plus";
import { reactive, ref, toRefs } from "vue";
import { Scissor, Edit } from '@element-plus/icons-vue';

const isDisabled = ref(false)
const isEdit = ref(false)
const adminData = ref([]);
const roleData = ref([]);
const dialogTableVisible = ref(false);
const multipleSelection = ref([])
const search = ref()

// 解构失去响应式
const editData = reactive({
  form: {},
});
// 用 toRefs()方法为它们添加响应性
const { form } = toRefs(editData);
const params = reactive({
  keyword: "",
  pageNo: 1,
  pageSize: 10,
});

function getAdminList() {
  adminList(params)
    .then((res) => {
      adminData.value = res.data.rows;
    })
    .catch((err) => {
      console.log(err);
    });
}

function getRoleList() {
    roleList().then((res) => {
      if (res.code == 200) {
        roleData.value = res.data.rows
      }
    }).catch((err) => {
      isDisabled.value = true
      // console.log(err)
    })
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
  getRoleList();
  dialogTableVisible.value = true;
  editData.form = {};
}

function confirmAdd() {
  addAdmin(editData.form)
    .then(res => {
      if(res.code == 200) {
        ElMessage({
          type: 'success',
          message: 'Successfully modified!'
        })
      }
      dialogTableVisible.value = false
      getAdminList()
    })
}

function handleSizeChange(val) {
  params.pageSize = val;
  getAdminList();
}

function handleCurrentChange(val) {
  params.pageNo = val;
  getAdminList();
}
// 编辑
function handelEdit(data) {
  isEdit.value = false
  getRoleList();
  dialogTableVisible.value = true;
  editData.form = data;
}
// 确认
const confirmEdit = () => {
  updateAdmin(editData.form)
    .then((res) => {
      if(res.code == 200) {
        ElMessage({
          type: 'success',
          message: 'Successfully modified!'
        })
      }
      dialogTableVisible.value = false
      getAdminList()
    })
    .catch((err) => {
      ElMessage({
          type: 'error',
          message: 'Fail to Edit!'
      })
      console.log(err);
    });
};

const SearchValue = () => {
  params.keyword = search.value
  adminList(params)
    .then((res) => {
      userList.value = res.data.records;
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
//            getAdminList()
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
  deleteAdmin({id: data.id})
  .then((res) => {
    if(res.code == 200) {
      ElMessage({
        type:'success',
        message: 'successfully deleted!'
      })
    }
    getAdminList()
  })
  .catch((err) => {
    console.log(err)
    ElMessage({
      type:'error',
      message: err
    })
  })
}

getAdminList();
</script>

<style lang="scss" scoped>
.user-table {
  padding: 15px;
}
.search {
  display: flex;
  padding: 10px 0;
  align-items: center;
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
.el-item {
  margin-bottom: 0;
}
</style>
