<template>
    <div class="user-table">
      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="params" class="search" >
        <el-form-item :label="$t('tableHead.title')+':'" class="el-item" >
          <el-input v-model="params.title" :placeholder="$t('tableHead.title')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tableHead.author')+':'" class="el-item" >
          <el-input v-model="params.author" :placeholder="$t('tableHead.title')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tableHead.article_time')+':'" class="el-item">
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
          <lx-button type="danger" @click="SearchValue">{{ $t('tableHead.search') }}</lx-button>
          <el-button type="primary" plain :icon="Edit" @click="addNews">{{ $t('tableHead.add_article') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="articleData" border @selection-change="handleSelectionChange" row-key="id">
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column label="ID" prop="id" width="60" align="center"></el-table-column>
        <el-table-column :label="$t('tableHead.title')" align="center">
          <template #default="{ row }">
            <el-tooltip
                :content="row.title"
                raw-content
                placement="top-start"
                v-if="row.title">
              <!-- 标题超过30个字符，则用省略号代替 -->
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
        <el-table-column :label="$t('tableHead.type')" prop="type" width="80" align="center"></el-table-column>
        <el-table-column :label="$t('tableHead.publisher')" align="center" width="100">
            <template #default="{ row }">
                {{ row.author ? row.author : '无' }}
            </template>
        </el-table-column>
        <el-table-column :label="$t('tableHead.cover')" min-width="80" align="center">
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
        <el-table-column :label="$t('tableHead.Real_likes')" width="100" align="center">
          <template #default="{ row }">
            {{ row.real_thumbs_num ? row.real_thumbs_num : '0' }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('tableHead.release_time')" width="180" align="center">
          <template #default="{ row }">
              {{ row.create_time ? row.create_time : '无' }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('tableHead.on_off_shelves')" prop="status" width="90" align="center">
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
        <el-table-column :label="$t('tableHead.operation')" width="250px" align="center">
          <template #default="{ row }">
            <div class="operations">
              <lx-button type="primary" @click="handleEdit(row)">{{ $t('tableHead.edit') }}</lx-button>
              <el-button type="warning" @click="handleComment(row)">{{ $t('tableHead.comment') }}</el-button>
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
                  <lx-button type="danger">{{ $t('tableHead.delete') }}</lx-button>
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
      <el-dialog :title="isEdit?$t('tableHead.add'):$t('tableHead.edit')" v-model="dialogTableVisible" width="400px" fullscreen draggable>
        <el-form :model="form" label-width="100px">
          <el-form-item :label="$t('tableHead.title')">
            <el-input v-model="form.title" placeholder=""></el-input>
          </el-form-item>
          <el-form-item :label="$t('tableHead.tag')" v-if="hasTags">
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
          <el-form-item :label="$t('tableHead.cover')">
            <upload :imageUrl="form.cover" @upload-success="handleSuccess"></upload>
          </el-form-item>
          <el-form-item :label="$t('tableHead.content')">
            <editor ref="froalaEditor" @on-change="changeContent" v-model:value="form.content" :content="form.content"></editor>
          </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
              <lx-button type="info" style="margin-left: 15px;" @click="cancelEdit">{{$t('tableHead.cancel')}}</lx-button>
              <lx-button type="primary" style="margin-left: 20px;" @click="isEdit?confirmAdd():confirmEdit()">{{$t('tableHead.confirm')}}</lx-button>
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
              <h5 :id="titleId" :class="titleClass">{{ $t('tableHead.comment') }}</h5>
              <lx-button type="primary" @click="addCommentVisible">{{ $t('tableHead.add') }}</lx-button>
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
                  <span class="content_txt">
                    {{ item.content ? item.content : '' }}
                  </span>
                  <el-popconfirm
                    width="230px"
                    confirm-button-text="Yes"
                    cancel-button-text="No"
                    :icon="Scissor"
                    icon-color="#c25afd"
                    title="Are you sure to delete this?"
                    @confirm="handleDel(item.id,item.aid)"
                    >
                    <template #reference>
                      <span class="del">
                        {{ $t('tableHead.delete') }}
                      </span>
                    </template>
                  </el-popconfirm>
                </div>
              </div>
            </div>
            <div class="item_left">
              <div class="thumb">
                <img src="../../../src/assets/img/thumb.png" alt="thumb"/>
                <span>{{ item.real_thumbs_num }}</span>
              </div>
              <div>
                <span>{{ $t('tableHead.thumb_num') }}</span>
                <el-input class="thumb_input" v-model="item.thumbs_num" @change="changeThumb(item)"></el-input>
              </div>
            </div>
          </div>
        </div>
        <el-dialog
          :title="$t('tableHead.add_comment')"
          v-model="dialogAddVisible"
          width="400px"
          append-to-body
          draggable
        >
          <el-form :model="addParams" label-width="100px">
            <el-form-item :label="$t('tableHead.user')">
              <el-select
                v-model="addParams.uid"
                value-key="id"
                >
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('tableHead.comment')">
              <el-input v-model="addParams.content" placeholder=""></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <lx-button type="info" style="margin-left: 15px;" @click="dialogAddVisible = false">{{ $t('tableHead.cancel') }}</lx-button>
              <lx-button type="primary" style="margin-left: 20px;" @click="confirmAddComment()">{{ $t('tableHead.confirm') }}</lx-button>
            </div>
          </template>
        </el-dialog> 
      </el-dialog>
    </div>
</template>x

<script setup>
import { articleList, addArticle, updateArticle, deleteArticle, getArticleTag, getArticleComment, addComment, delComment, updateComment, getCommentUser } from "@/api/article";
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
const userList = ref([])

// 获取评论用户
function getUser() {
  getCommentUser().then((res) => {
    userList.value = res.data
  }).catch(err => {
    ElMessage({
        type: 'error',
        message: res.msg
    })
  })
}

function handleClose() {
  dialogCommentVisible.value = false
  dialogAddVisible.value = false
}

function getComment(id) {
  getArticleComment({aid: id}).then((res) => {
    commentList.value = res.data
  }).catch(err => {
    ElMessage({
        type: 'error',
        message: res.msg
    })
  })
}

function handleComment(data) {
  addParams.aid = data.id;
  dialogCommentVisible.value = true
  getComment(data.id)
}



// 修改点赞数
function changeThumb(data) {
  // 只能修改点赞数，并只能输入数字
  data.thumbs_num = Number(data.thumbs_num.replace(/[^\d]/g, ''))
  updateComment(data).then((res) => {
    if(res.code == 200) {
      ElMessage({
        type: 'success',
        message: 'Successfully modified!'
      })
    }
  }).catch(err => {
    ElMessage({
        type: 'error',
        message: res.msg
    })
  })
}

function handleDel(id,aid) {
  delComment({id: id}).then((res) => {
    if(res.code == 200) {
      getComment(aid)
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
  // 只允许前台用户发布评论
  addComment(addParams).then((res) => {
    if(res.code == 200) {
      getComment(addParams.aid)
      // 清空 addParams 的数据
      Object.keys(addParams).forEach(key => {
        addParams[key] = "";
      });
      ElMessage({
        type: 'success',
        message: 'Successfully added!'
      })
      dialogAddVisible.value = false
    }
  }).catch(err => {
    ElMessage({
          type: 'error',
          message: err.msg
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
getUser();
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
.thumb_input {
  margin-left: 8px;
  width: 50px;
  height: 30px;
}
.thumb_input .el-input__inner {
  text-align: center;
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
  min-width: 70px;
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.username {
  font-size: 16px;
  font-weight: 600;
}
.content {
  margin-top: 8px;
  max-width: 365px;
}

.content_txt {
  max-width: 365px;
  line-height: 18px;
  word-wrap:break-word;
  font-size: 14px;
  color: #666;

}
.item_left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.del {
  font-size: 14px;
  color: #ff5050;
  cursor: pointer;
  margin-left: 12px;
}
.thumb {
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb img {
  width: 30px;
  height: 30px;
  margin-right: 5px;
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
