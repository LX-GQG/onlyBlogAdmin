<template>
    <div class="user-table">
      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="params" class="search" >
        <el-form-item label="Title:" class="el-item" >
          <el-input v-model="params.title" placeholder="Title"></el-input>
        </el-form-item>
        <el-form-item label="Author:" class="el-item" >
          <el-input v-model="params.author" placeholder="Author"></el-input>
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
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column label="ID" prop="id" width="60" align="center"></el-table-column>
        <el-table-column label="标题" align="center">
          <template #default="{ row }">
            <el-tooltip
                :content="row.title"
                raw-content
                placement="top-start"
                v-if="row.title">
              <span v-if="row.title && row.title.length <= 30">
                  {{ row.title }}
              </span>
              <span v-if="row.title && row.title.length > 30">                
                  {{ row.title.substr(0, 30) + "..."}}
              </span>
            </el-tooltip>
            <span v-else-if="row.title== null"> 无 </span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" width="80" align="center"></el-table-column>
        <el-table-column label="发布人" align="center" width="100">
            <template #default="{ row }">
                {{ row.author ? row.author : '无' }}
            </template>
        </el-table-column>
        <el-table-column label="封面" min-width="80" align="center">
          <template #default="{ row }">
            <el-image
                class="cover-img"
                preview-teleported="true"
                :src="row.cover ? row.cover : ''"
                :preview-src-list="[row.cover ? row.cover : '']"
                fit="cover"
              />
          </template>
        </el-table-column>
        <!-- <el-table-column label="标签" min-width="80" align="center">
          <template #default="{ row }">
            <el-tag class="ml-2 tag" type="success" v-for="(item, index) in row.tags" :key="index">{{ item.name }}</el-tag>
          </template>
        </el-table-column> -->
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
        <el-table-column label="Operations" width="250px" align="center">
          <template #default="{ row }">
            <div class="operations">
              <lx-button type="primary" @click="handleEdit(row)">Edit</lx-button>
              <el-button type="warning" @click="handleComment(row)">Comment</el-button>
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
      <el-dialog :title="isEdit?'ADD':'EDIT'" v-model="dialogTableVisible" width="400px" fullscreen draggable>
        <el-form :model="form" label-width="100px">
          <el-form-item label="Title">
            <el-input v-model="form.title" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="Tag" v-if="hasTags">
            <el-select
                  v-model="form.tags"
                  value-key="id"
                  multiple
                  >
                  <el-option
                    v-for="item in tagData"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
          </el-form-item>
          <el-form-item label="Cover">
            <upload :imageUrl="form.cover" @upload-success="handleSuccess"></upload>
          </el-form-item>
          <el-form-item label="Content">
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
      <!-- 评论弹窗 -->
      <el-dialog
        v-model="dialogCommentVisible"
        :before-close="handleClose"
        draggable
      >
        <template #header="{ titleId, titleClass }">
          <div class="dialog-header">
            <div class="dialog-left">
              <h5 :id="titleId" :class="titleClass">Comment</h5>
              <lx-button type="primary" @click="addCommentVisible">Add</lx-button>
            </div>
          </div>
        </template>
        <el-empty v-if="commentList.length == 0" :image-size="200" />   
        <div class="comment_list">
          <div class="comment_item" v-for="(item) in commentList" :key="item.id">
            <div class="item_right">
              <div class="user_info">
                <img class="user_avatar" :src="item.user.avatar ? item.user.avatar : '../src/assets/img/empty_avatar.png'" alt="avatar" />
              </div>
              <div class="user_comment">
                <div class="username">
                  {{ item.user.username ? item.user.username : '' }}
                </div>
                <div class="content">
                  {{ item.content ? item.content : '' }}
                </div>
              </div>
            </div>
            <div class="item_left">
              <el-popconfirm
                width="230px"
                confirm-button-text="Yes"
                cancel-button-text="No"
                :icon="Scissor"
                icon-color="#c25afd"
                title="Are you sure to delete this?"
                @confirm="handleDel(item.id)"
                >
                <template #reference>
                  <div class="del">
                    DEL
                  </div>
                </template>
              </el-popconfirm>
              <div class="thumb">
                <!-- 点赞，暂时还没做 -->
              </div>
            </div>
          </div>
        </div>
        <el-dialog
          title="Add Comment"
          v-model="dialogAddVisible"
          width="400px"
          append-to-body
          draggable
        >
          <el-form :model="addParams" label-width="100px">
            <el-form-item label="Content">
              <el-input v-model="addParams.content" placeholder=""></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <lx-button type="info" style="margin-left: 15px;" @click="dialogAddVisible = false">Cancel</lx-button>
              <lx-button type="primary" style="margin-left: 20px;" @click="confirmAddComment()">Confirm</lx-button>
            </div>
          </template>
        </el-dialog> 
      </el-dialog>
    </div>
</template>

<script setup>
import { articleList, addArticle, updateArticle, deleteArticle, getArticleTag, getArticleComment, addComment, delComment } from "@/api/article";
import { ElMessage } from "element-plus";
import { reactive, ref, toRefs, nextTick, onMounted } from "vue";
import { Scissor, Edit } from '@element-plus/icons-vue';
import editor from "@/components/editor.vue";
import upload from "@/components/upload.vue"
import { Local } from '@/cache/index'

components: {editor,upload}

const articleData = ref([]);
const articleTotal = ref(0);
const isEdit = ref(false)
const dialogTableVisible = ref(false);
const multipleSelection = ref([])
const froalaEditor = ref(null);
const hasTags = ref(false)
const userinfo = ref({})

userinfo.value = Local.get("userinfo");
// 解构失去响应式
const editData = reactive({
  form: {},
});
// 用 toRefs()方法为它们添加响应性
const { form } = toRefs(editData);
const params = reactive({
  title: "",
  author: "",
  startDate: "",
  endDate: "",
  pageNo: 1,
  pageSize: 10,
});
const addParams = reactive({
  aid: "",
  uid: "",
  pid: "",
  content: "",
})

// 上传封面
function handleSuccess(data) {
    editData.form.cover = data.url
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

// 获取标签
const tagData = ref([])
function getTag() {
  getArticleTag().then((res) => {
    if(res.code == 200) {
      tagData.value = res.data
      hasTags.value = true
    }else{
      hasTags.value = false
    }
  }).catch((err) => {
    console.log(err)
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

// 评论
const dialogCommentVisible = ref(false)
const dialogAddVisible = ref(false)
const commentList = ref([])

function handleClose() {
  dialogCommentVisible.value = false
  dialogAddVisible.value = false
}

function handleComment(data) {
  addParams.aid = data.id;
  dialogCommentVisible.value = true
  getArticleComment({aid: data.id}).then((res) => {
    commentList.value = res.data
  }).catch(err => {
    ElMessage({
        type: 'error',
        message: res.msg
    })
  })
}

function handleDel(id) {
  delComment({id: id}).then((res) => {
    if(res.code == 200) {
      commentList.value.splice(id,1)
      ElMessage({
        type: 'success',
        message: 'Successfully deleted!'
      })
    }    
  }).catch(err => {
    ElMessage({
          type: 'error',
          message: res.msg
      })
  })
}

function addCommentVisible() {
  dialogAddVisible.value = true
}

function confirmAddComment() {
  addParams.uid = userinfo.value.id
  console.log(addParams)
  addComment(addParams).then((res) => {
    if(res.code == 200) {
      ElMessage({
        type: 'success',
        message: 'Successfully added!'
      })
      dialogAddVisible.value = false
      addParams = {}
      getArticleComment({aid: addParams.aid}).then((res) => {
        commentList.value = res.data
      }).catch(err => {
        ElMessage({
            type: 'error',
            message: res.msg
        })
      })
    }
  }).catch(err => {
    ElMessage({
          type: 'error',
          message: res.msg
      })
  })
}

// 编辑
function handleEdit(data) {
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
getTag();
</script>

<style>
.dialog-footer {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(table tr span.el-tooltip__trigger) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-form .el-select{
  width: 100%;
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
.tag {
  margin-right: 5px;
}
.cover-img {
  width: auto;
  height: 70px;
  border-radius: 5px;
  object-fit: cover;
}
.comment_list {
}
.comment_item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}
.item_right {
  display: flex;
  align-items: center;
}
.user_info {
  display: flex;
  align-items: center;
  margin-right: 15px;
}
.user_avatar {
  width: 50px;
  height: 50px;
  border: 1px solid #e1e1e1;
  border-radius: 50%;
  object-fit: cover;
}
.user_comment {
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
}
.username {
  font-size: 16px;
  font-weight: 600;
}
.content {
  font-size: 14px;
  color: #666;
}
.item_left {
  display: flex;
  align-items: center;
}
.del {
  cursor: pointer;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog-left {
  display: flex;
  align-items: center;
}
.dialog-left h5 {
  margin: 0;
  margin-right: 25px;
}
</style>
