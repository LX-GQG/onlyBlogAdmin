<template>
    <el-upload
      class="avatar-uploader"
      action="https://localhost:3000/api/upload"
      :headers="header"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :show-file-list="false"
    >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
</template>

<script>
// import { emit } from 'process';
import { defineProps, defineEmits, defineComponent,toRefs } from 'vue'
import { Local } from '@/cache/index'
import { Plus } from '@element-plus/icons-vue'


export default defineComponent({
    props: {
        imageUrl: {
            type: String,
            default: ''
        }
    },
    setup(props,content) {
        const header = {
            Authorization: 'Bearer ' + Local.get('token')
        }
        const handleSuccess = (response, file, fileList) => {
            // 上传成功的处理逻辑
            props.imageUrl = response.url;
            // 触发自定义事件，将上传成功的值传递给父组件
            content.emit('upload-success', response);
        }

        const beforeUpload = (file) => {
            // 文件上传之前的处理逻辑，例如文件类型和大小的验证
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('只能上传jpg/png文件！');
            }
            if (!isLt2M) {
            this.$message.error('文件大小不能超过2MB！');
            }

            return isJPG && isLt2M;
        }
        return {
            handleSuccess,
            beforeUpload,
            header
        }
    }
})
</script>

<style scoped>
.avatar-uploader .avatar {
    width: 180px;
    object-fit: contain;
    display: block;
}
</style>
<!-- 不能使用scoped -->
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: .2s;
  }
  
  .avatar-uploader .el-upload:hover {
    border-color: #b37df1;
  }
  
  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
</style>