<template>
    <div class="header">
        <div class="header-left">

        </div>
        
        <div class="header-info">
            <el-dropdown class="user-name" trigger="hover" @command="handleCommand">
                <span class="el-dropdown-link">
                    <!-- 默认头像 -->
                    <div class="user-avatar">
                        <img :src="userInfo.avatar ? userInfo.avatar : '/src/assets/img/unlogin.png'" alt="avatar" />
                    </div>
                    <div class="username">
                        {{ userInfo.username }}
                    </div>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="home">个人中心</el-dropdown-item>
                    <el-dropdown-item command="password">修改密码</el-dropdown-item>
                    <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
        </div>
        <el-dialog title="Personal Center" v-model="dialogUserVisible" width="400px">
            <el-form :model="userInfo" label-width="100px">
              <el-form-item label="username">
                <el-input v-model="userInfo.username" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="avatar">
                <upload :imageUrl="userInfo.avatar" @upload-success="handleSuccess"></upload>
              </el-form-item>
              <!--底部按钮区域-->
              <el-form-item class="form-bottom">
                  <lx-button type="info" style="margin-left: 15px;" @click="cancelEdit">Cancel</lx-button>
                  <lx-button type="primary" style="margin-left: 20px;" @click="confirmEdit">Confirm</lx-button>
              </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="Update Password" v-model="dialogPassVisible" width="400px">
            <el-form :model="passwordFrom" label-width="100px">
              <el-form-item label="Old Pass">
                <el-input v-model="passwordFrom.old_password" type="password" placeholder="" show-password></el-input>
              </el-form-item>
              <el-form-item label="New Pass">
                <el-input v-model="passwordFrom.password" type="password" placeholder="" show-password></el-input>
              </el-form-item>
              <el-form-item label="Old Pass">
                <el-input v-model="passwordFrom.re_password" type="password" placeholder="" show-password></el-input>
              </el-form-item>
              <!--底部按钮区域-->
              <el-form-item class="form-bottom">
                  <lx-button type="info" style="margin-left: 15px;" @click="cancelEdit">Cancel</lx-button>
                  <lx-button type="primary" style="margin-left: 20px;" @click="confirmPassword">Confirm</lx-button>
              </el-form-item>
            </el-form>
        </el-dialog>
    </div>
    
</template>

<script>
import { computed, defineComponent, getCurrentInstance, reactive, ref, toRefs } from 'vue'
import router from '@/router'
import upload from "./upload.vue";
import { updateUser, updatePassword } from '@/api/user';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../store/modules/user';
import { Local } from '@/cache/index'

export default defineComponent({
    components: {upload},
    setup() {
        const dialogUserVisible = ref(false);

        const dialogPassVisible = ref(false);
        
        const userInfo = ref({})
        userInfo.value = Local.get("userinfo");
        const passwordFrom = reactive({
            old_password: '',
            password: '',
            re_password: ''
        })
        const FileList = ref([])
        // 用户名下拉菜单选择事件
        function handleCommand(command) {
            // 退出登录
            if (command === "loginout") {
                const userStore = useUserStore();
                userStore.setToken();
                userStore.setUserInfo();
                Local.clear();
                router.push({ path: '/login' })
            }
            if (command === 'home') {
                dialogUserVisible.value = true
                // fileList格式必须要按照name,url的形式（可以参考element ui中文件格式），这里通过接口数据完成图片回显
                FileList.value = [{ name: new Date(), url: userInfo.value.avatar }];
                // console.log(FileList.value)
            }
            if (command === 'password') {
                dialogPassVisible.value = true
                console.log()
            }
        }

        // 确认
        function confirmEdit () {
            updateUser(userInfo.value)
                .then((res) => {
                if (res.code == 200) {
                    Local.set('userinfo',userInfo.value)
                    ElMessage({
                        type: "success",
                        message: "Successfully modified!",
                    });
                    dialogUserVisible.value = false;
                }
                
                })
                .catch((err) => {
                    ElMessage({
                        type: "error",
                        message: "Fail to Edit!",
                    });
                });
        }

        // 确认修改密码
        function confirmPassword() {
            console.log(passwordFrom)
            passwordFrom.id = userInfo.value.id
            // 判断密码和确认密码是否一致
            if (passwordFrom.password !== passwordFrom.re_password) {
                ElMessage({
                    type: "error",
                    message: "Password and confirmation password do not match"
                })
                return
            }
            updatePassword(passwordFrom).then((res) => {
                    if (res.code == 200) {
                        ElMessage({
                            type: "success",
                            message: "Successfully modified!",
                        });
                        dialogPassVisible.value = false;
                    }
                })
                .catch((err) => {
                    ElMessage({
                        type: "error",
                        message: "Fail to Edit!",
                    });
                });
        }

        function cancelEdit () {
            dialogUserVisible.value = false;
            dialogPassVisible.value = false;
        };

        // 获取子组件传递的
        function handleSuccess(data) {
            userInfo.value.avatar = data.url
        }

        return {
            userInfo,
            FileList,
            dialogUserVisible,
            dialogPassVisible,
            passwordFrom,
            handleCommand,
            cancelEdit,
            confirmEdit,
            confirmPassword,
            handleSuccess
        }     
    },
})
</script>

<style lang="scss" scoped>
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
        box-shadow: rgba(179, 125, 241, 0.15) 0px 11px 13px -8px;
        border-bottom: 1px solid #e8e8e8;
        height: 100%;
        .header-left {
            display: flex;
            align-items: center;
            .collapse {
                display: flex;
                align-items: center;
            }
            .search {
                margin-left: 10px;
                border-radius: 25px;
                background: rgb(243, 243, 255);
                padding-left: 20px;
                display: flex;
                align-items: center;
                height: 32px;
                .search-input {
                    width: 250px;
                    margin-left: 8px;
                    height: 30px;
                    border: none;
                    background: transparent;
                    outline: none;
                    font-size: 12px;
                }
                .search-input::-webkit-input-placeholder{
                    font-size: 12px;
                    color: #99969c;
                }
                .search-input::-moz-placeholder{  
                    font-size: 12px;
                    color: #99969c;
                }
                .search-input:-ms-input-placeholder{  
                    font-size: 12px;
                    color: #99969c;    
                }
            }
        }
        .header-audio {
            display: flex;
            align-items: center;
        }
        .header-info {
            display: flex;
            align-items: center;
            margin-right: 15px;
            .el-dropdown-link {
                display: flex;
                align-items: center;
            }
            .user-avatar {
                width: 38px;
                height: 38px;
                margin-right: 8px;
                
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                }
            }
            
        }
    }
</style>