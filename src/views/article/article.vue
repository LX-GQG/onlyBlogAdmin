<template>
    <div class="user-table">
      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="params" class="search" >
        <el-form-item label="Title:" class="el-item" >
          <el-input v-model="params.title" placeholder="Title"></el-input>
        </el-form-item>
        <el-form-item label="Username:" class="el-item" >
          <el-input v-model="params.username" placeholder="Username"></el-input>
        </el-form-item>
        <el-form-item label="ArticleTime:" class="el-item">
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
          <!-- <lx-button type="danger" @click="batchRemove">Batch Delete</lx-button> -->
          <lx-button type="danger" @click="SearchValue">Search</lx-button>
          <el-button type="primary" plain :icon="Edit" @click="addNews">Add Article</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="articleData" border @selection-change="handleSelectionChange" row-key="id">
        <el-table-column type="selection" width="55" />
        <el-table-column label="标题" prop="title" align="center"></el-table-column>
        <el-table-column label="类型" prop="type" width="80" align="center"></el-table-column>
        <el-table-column label="发布人" align="center">
            <template #default="{ row }">
                {{ row.username ? row.username : '无' }}
            </template>
        </el-table-column>
        <el-table-column label="发布时间" width="180" align="center">
          <template #default="{ row }">
              {{ row.create_time ? row.create_time : '无' }}
          </template>
        </el-table-column>
        <el-table-column label="上架/下架" prop="status" width="90" align="center">
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
        <el-table-column label="Operations" width="180px" align="center">
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
        v-if="articleData.length"
        class="pagination"
        :total="articleTotal"
        :current-page="params.pageNo"
        :page-size="params.pageSize"
        :page-sizes="[5, 10, 20, 50]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      <el-dialog :title="isEdit?'ADD':'EDIT'" v-model="dialogTableVisible" width="400px" fullscreen>
        <el-form :model="form" label-width="100px">
          <el-form-item label="Title">
            <el-input v-model="form.title" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="content">
            <editor ref="froalaEditor" @on-change="changeContent" v-model:value="form.content" :content="form.content"></editor>
          </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
              <lx-button type="info" style="margin-left: 15px;" @click="cancelEdit">Cancel</lx-button>
              <lx-button type="primary" style="margin-left: 20px;" @click="isEdit?confirmAdd():confirmEdit()">Confirm</lx-button>
            </div>
        </template>
      </el-dialog>
    </div>
</template>

<script setup>
import { articleList, addArticle, updateArticle, deleteArticle  } from "@/api/article";
import { ElMessage } from "element-plus";
import { reactive, ref, toRefs, nextTick, onMounted } from "vue";
import { Scissor } from '@element-plus/icons-vue';
import { Edit } from '@element-plus/icons-vue'
import editor from "@/components/editor.vue";

const articleData = ref([]);
const articleTotal = ref(0);
const roleData = ref([]);
const isEdit = ref(false)
const dialogTableVisible = ref(false);
const multipleSelection = ref([])
const search = ref()
const froalaEditor = ref(null);

components: {editor}

// 解构失去响应式
const editData = reactive({
  form: {},
});
// 用 toRefs()方法为它们添加响应性
const { form } = toRefs(editData);
const params = reactive({
  title: "",
  username: "",
  startDate: "",
  endDate: "",
  pageNo: 1,
  pageSize: 10,
});

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
  getArticleList()
}

function changeContent(html) {
    editData.form.content = html
}

function getArticleList() {
  articleList(params)
    .then((res) => {
      articleData.value = res.data.rows;
      articleTotal.value = res.data.count;
    })
    .catch((err) => {
      console.log(err);
    });
}

function changeStatus(data) {
  // 修改状态
  data.status = data.status == true ? 1 : 0;
  updateArticle(data).then((res) => {
    if(res.code == 200) {
      ElMessage({
        type: 'success',
        message: 'Successfully modified!'
      })
    }
  })
}

function addNews() {
  isEdit.value = true
  dialogTableVisible.value = true;
  editData.form = {}
  nextTick(()=>{
    froalaEditor.value.setHtml(editData.form.content)
  });
  
}

function confirmAdd() {
  addArticle(editData.form)
    .then((res) => {
      if(res.code == 200) {
        ElMessage({
          type: 'success',
          message: 'Successfully modified!'
        })
      }
      dialogTableVisible.value = false
      getArticleList()
    })
    .catch((err) => {
      ElMessage({
          type: 'error',
          message: 'Fail to Edit!'
      })
      console.log(err);
    });
}

function handleSizeChange(val) {
  params.pageSize = val;
  getArticleList();
}

function handleCurrentChange(val) {
  params.pageNo = val;
  getArticleList();
}
// 编辑
function handelEdit(data) {
  isEdit.value = false
  dialogTableVisible.value = true;
  editData.form = data;
  nextTick(() => {
    froalaEditor.value.setHtml(editData.form.content);
  });
}
// 确认
const confirmEdit = () => {
  updateArticle(editData.form)
    .then((res) => {
      if(res.code == 200) {
        ElMessage({
          type: 'success',
          message: 'Successfully modified!'
        })
      }
      dialogTableVisible.value = false
      getArticleList()
    })
    .catch((err) => {
      ElMessage({
          type: 'error',
          message: 'Fail to Edit!'
      })
      console.log(err);
    });
};

// 搜索
const SearchValue = () => {
  getArticleList()
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

//    const batchRemove = () => {
//      removeBatchUser(multipleSelection.value)
//        .then((res: any) => {
//          if(res.code == 200) {
//            ElMessage({
//              type:'success',
//              message: 'Bulk deletion succeeded!'
//            })
//            getArticleList()
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
 deleteArticle({id: data.id})
  .then((res) => {
    if(res.code == 200) {
      ElMessage({
        type:'success',
        message: 'successfully deleted!'
      })
    }
    getArticleList()
  })
  .catch((err) => {
    console.log(err)
    ElMessage({
      type:'error',
      message: err
    })
  })
}

getArticleList();
</script>

<style>
.dialog-footer {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
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
</style>
