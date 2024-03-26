<template>
    <div class="header">
        <div class="header-left">
            <!-- {{ $t('headMenus.userName') }} -->
        </div>
        
        <div class="header-info">
            <day-night></day-night>
            <div class="language"  id="top-language">
                <div class="langbox">
                    <div class="langicon">
                        <img src="/src/assets/img/language.png" />{{ $t('lang.language') }}
                        <div class="langitem">
                            <div @click="translate('en-US')">
                                <img src="/src/assets/img/en.png" />
                                English
                            </div>
                            <div @click="translate('zh-CN')">
                                <img src="/src/assets/img/zh.png" />
                                中文
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
import { updateAdmin, updatePassword } from '@/api/admin';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../store/modules/user';
import { Local } from '@/cache/index'
import dayNight from './dayNight.vue'
import { useI18n } from "vue-i18n";

export default defineComponent({
    components: {upload,dayNight},
    setup() {
        const dialogUserVisible = ref(false);

        const dialogPassVisible = ref(false);
        
        const { locale } = useI18n();

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
        // 一键变色
        function changeColor(color) {
            const root = document.documentElement;
            const currentFilterValue = getComputedStyle(root).getPropertyValue('--f').trim();
            const newFilterValue = currentFilterValue === '1' ? '0' : '1';
            root.style.setProperty('--f', newFilterValue);
        }
        // 切换语言
        function translate(lang) {
            locale.value = lang
            Local.set('lang',lang)
        }
        // 确认
        function confirmEdit () {
            updateAdmin(userInfo.value)
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
            handleSuccess,
            translate
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
        .language {
            margin-right: 15px;
            display: flex; 
            justify-content: right;
        }
        
        .language .langicon{
            width:auto;
            display: flex;
            align-items: center;
            height:24px;
            text-align:center;
            font-size:13px;
        }
        .language .langicon img{
            max-height:24px;
            margin-right: 6px;
            vertical-align:middle;
            display:inline-block;
            float: none;
        }
        .language .langbox {
            position:relative;
            float:left;
            display:inline;
        }
        .language .langbox .langitem {
            position:absolute;
            width:110px;
            left:50%;
            margin-left:-60px;
            top:34px;
            background:#fff;
            z-index:9;
            opacity:0;
            visibility:hidden;
            transition:.5s ease;
        }
        .language .langbox .langitem div {
            text-align:left;
            text-decoration:none;
            display:block;
            padding:8px 10px 8px 20px;
            color:#000000;
            font-size: 12px;
            transition:.5s ease;
            cursor: pointer;
        }
        .language .langbox .langitem div img {
            height:15px;
            max-width: 22px;
            object-fit: contain;
        }
        .language .langbox .langitem div:hover {
            background:#77a5fb;
            color:#ffffff;
        }
        .language .langbox:hover .langitem {
            visibility:visible;
            opacity:1;
        }
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