<template>
    <div class="user-table">
      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="search" class="search" >
        <!-- <el-form-item class="el-item" >
          <el-input  v-model="search" placeholder="Search"></el-input>
        </el-form-item>
        <el-form-item class="el-item">
          <lx-button type="danger" @click="SearchValue">Search</lx-button>
        </el-form-item> -->
        <el-form-item class="el-item">
          <!-- <lx-button type="danger" @click="batchRemove">Batch Delete</lx-button> -->
          <el-button type="primary" plain :icon="Edit" @click="addToRole">{{ $t('tableHead.add_role') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="roleData" border @selection-change="handleSelectionChange" row-key="id">
        <el-table-column type="selection" width="55" />
        <el-table-column :label="$t('tableHead.rolename')" prop="role_type"></el-table-column>
        <el-table-column :label="$t('tableHead.remark')" prop="remark"></el-table-column>
        <el-table-column :label="$t('tableHead.operation')" width="280px">
          <template #default="{ row }">
            <div class="operations">
              <lx-button type="primary" @click="handelEdit(row)">{{ $t('tableHead.edit') }}</lx-button>
              <lx-button type="danger" @click="handelPromission(row)">{{ $t('tableHead.promission') }}</lx-button>
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
                  <lx-button type="warning">{{ $t('tableHead.delete') }}</lx-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="roleData.length"
        class="pagination"
        :total="roleData.length"
        :current-page="params.pageNo"
        :page-size="params.pageSize"
        :page-sizes="[5, 10, 20, 50]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      <el-dialog :title="isEdit?$t('tableHead.add'):$t('tableHead.edit')" v-model="dialogTableVisible" width="400px">
        <el-form :model="form" label-width="100px">
          <el-form-item :label="$t('tableHead.rolename')">
            <el-input v-model="form.role_type" placeholder=""></el-input>
          </el-form-item>
          <el-form-item :label="$t('tableHead.remark')">
            <el-input v-model="form.remark" placeholder=""></el-input>
          </el-form-item>
          <el-form-item class="form-bottom">
              <lx-button type="info" style="margin-left: 15px;" @click="cancelEdit">{{ $t('tableHead.cancel') }}</lx-button>
              <lx-button type="primary" style="margin-left: 20px;" @click="isEdit?confirmAdd():confirmEdit()">{{ $t('tableHead.confirm') }}</lx-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
            :title="$t('tableHead.promission')"
            v-model="authDialog"
            width="400px"
            align-center
            draggable
            >
              <el-tree
                :data="authList"
                :props="treeProps"
                empty-text="加载中..."
                node-key="id"
                ref="editTreeRef"
                :default-expanded-keys="editKeys"
                show-checkbox
                :default-checked-keys="editKeys"
                check-strictly
                check-on-click-node
                @check-change="handleCheckChange"
              ></el-tree>
              <div class="form-bottom">
                <el-button @click="authDialog = false">{{ $t('tableHead.cancel') }}</el-button>
                <el-button type="primary" @click="confirmAuth">{{ $t('tableHead.confirm') }}</el-button>
              </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { roleList, addRole, updateRole, deleteRole, permissionList, assignPermission } from "@/api/role";
import { ElMessage } from "element-plus";
import { reactive, ref, toRefs, getCurrentInstance, onMounted, nextTick } from "vue";
import { Scissor, Edit } from '@element-plus/icons-vue';

let {ctx:that, proxy} = getCurrentInstance()
const roleData = ref([]);
const dialogTableVisible = ref(false);
const multipleSelection = ref([])
const search = ref()
const isEdit = ref(false)

// 权限分配
const editTreeRef = ref();
const authDialog = ref(false);
const authList = ref([]);
const editKeys = ref([]);
const editId = ref(null);
const treeProps = {
  children: "children",
  label: "title",
};

const handelPromission = (data) => {
    editId.value = data.id;
    editKeys.value = [];
    authDialog.value = true;
    authList.value = [];
    permissionList({id: editId.value}).then((res) => {
        authList.value = res.data;
        for (let i = 0; i < authList.value.length; i++) {
            getLeafKeys(authList.value[i], editKeys.value)
        }
    });
    nextTick(() => {
        that.$forceUpdate()
    })
    
}

const getLeafKeys = (node, keys) => {
    if (!node.children || node.children.length == 0) {
        if(node.checked) {
            return keys.push(node.id)
        }else{
            return;
        }
    }
    // 递归遍历树节点，将所有叶子节点的key值存入keys数组中
    node.children.forEach(item => {
        if(node.checked){
            keys.push(node.id)
            getLeafKeys(item, keys)
        }
    })
}

// 树节点选中状态发生变化时触发
const handleCheckChange = (node,check) => {
  // 因为采用的是check-strictly，所以只有叶子节点的选中状态发生变化时才会触发
  // 当子节点选中的时候，父节点必须选中
  if (check === true) {
    // 将当前节点的父节点选中的样式
    editTreeRef.value.setChecked(node.pid, true)
    // 当父节点选中的时候，子节点需要展开
    if(editTreeRef.value.store.nodesMap[node.id]) {
      editTreeRef.value.store.nodesMap[node.id].expanded = true;
    }
  }
  // 判断是否含有子节点需要先判断是否有子列表，子列表是否有长度，这个位置根据后端数据的处理相关
  if(node.children && node.children.length !== 0) {
    // 如果父节点取消选中，子节点也要取消选中
    if(check === false) {
      // 获取父节点的引用
      const parentNode = editTreeRef.value.store.nodesMap[node.id];
      // 遍历子节点，并设置选中状态为false
      for (const childNode of parentNode.childNodes) {
        editTreeRef.value.setChecked(childNode.data.id, false);
      }
    }
  }
}

const confirmAuth = () => {
    // 把editKeys.value重复的去掉
    let permissionList = editTreeRef.value.getCheckedKeys();
    assignPermission({id: editId.value,permission:permissionList}).then((res) => {
      if(res.code == 200) {
        authDialog.value = false;
        ElMessage({
          type: 'success',
          message: 'Successfully modified!'
        })
      }
    })
    
}


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


function getRoleList() {
    roleList(params).then((res) => {
        roleData.value = res.data.rows
    })
}

function handleSizeChange(val) {
  params.pageSize = val;
  getRoleList();
}

function handleCurrentChange(val) {
  params.pageNo = val;
  getRoleList();
}

// 添加
function addToRole() {
  isEdit.value = true
  dialogTableVisible.value = true;
  editData.form = {};
}

const confirmAdd = () => {
  addRole(editData.form)
    .then((res) => {
      if(res.code == 200) {
        ElMessage({
          type: 'success',
          message: 'Successfully modified!'
        })
      }
      dialogTableVisible.value = false
      getRoleList()
    })
    .catch((err) => {
      ElMessage({
          type: 'error',
          message: 'Fail to Edit!'
      })
      console.log(err);
    });
};


// 编辑
function handelEdit(data) {
  isEdit.value = false
  dialogTableVisible.value = true;
  editData.form = data;
}
// 确认
const confirmEdit = () => {
  updateRole(editData.form)
    .then((res) => {
      if(res.code == 200) {
        ElMessage({
          type: 'success',
          message: 'Successfully modified!'
        })
      }
      dialogTableVisible.value = false
      getRoleList()
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
  roleList(params)
    .then((res) => {
      roleData.value = res.data;
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
  deleteRole({id: data.id})
  .then((res) => {
    if(res.code == 200) {
      ElMessage({
        type:'success',
        message: 'Successfully Deleted!'
      })
    }
    getRoleList()
  })
  .catch((err) => {
    console.log(err)
    ElMessage({
      type:'error',
      message: err
    })
  })
}

getRoleList();
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
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-img {
  width: 50px;
  height: 50px;
}
.el-item {
  margin-bottom: 0;
}
</style>
