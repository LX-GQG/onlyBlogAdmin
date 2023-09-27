<template>
    <div class="login-content">
        <div class="login-music">
            MUSIC
        </div>
        <div class="login">
          <div class="login-describe">
            <div class="login-form">
              <div class="login-neon">
                <div class="login-table">
                  <div class="login-name">
                    玥愔
                  </div>
                  <el-form class="form" :model="loginForm">
                    <el-form-item prop="username">
                      <el-input
                        class="login-input"
                        v-model.trim="loginForm.username"
                        placeholder="Username"
                        type="text"
                        size="large"
                      ></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                      <el-input
                        class="login-input"
                        v-model.trim="loginForm.password"
                        placeholder="Password"
                        type="password"
                        size="large"
                        show-password
                      ></el-input>
                    </el-form-item>
                    <el-form-item prop="identifyCode">
                      <el-input
                        class="login-input"
                        maxlength="4"
                        v-model.trim="loginForm.identifyCode"
                        @keyup.enter="handleLogin"
                      >
                      </el-input>
                      <IdentifyCode
                        ref="identify"
                        class="code-box"
                        :contentWidth="100"
                        :contentHeight="38"
                        @updateIdentifyCode="setIdentifyCode"
                      ></IdentifyCode>
                      </el-form-item>
                    <div class="login-button" @click.prevent="handleLogin">
                      Login
                    </div>
                  </el-form>
                </div>
              </div>
            </div>
            <div class="login-main">
              <div class="login-logo">
                <img src="@/assets/img/logo.png" alt="logo">
              </div>
              <div class="login-detail">
                MUSIC
                <div class="login-title">
                  System Dug
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { login, getMenu } from "../api/login";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from '../store/modules/user';
import { storeToRefs } from 'pinia'
import { Local } from '@/cache/index'
import IdentifyCode from "@/components/IdentifyCode.vue";
import { ElMessage, ElLoading } from "element-plus";

const userStore = useUserStore()
const { userInfo, token } = storeToRefs(userStore);
/*
      reactive
      作用：定义多个数据的响应式
      const proxy = reactive(obj) 接收一个普通对象然后返回该普通对象的响应式代理器对象
      响应式转换是"深层"：会影响对象内部所有嵌套的属性
      内部基于ES6的Proxy实现，通过代理对象操作源对象内部数据都是响应式的
*/
//  const redirect = ref(undefined);
const router = useRouter();
const route = useRoute();

// 定义响应式数据 ref 对象
const loginForm = reactive({
  username: "",
  password: "",
  identifyCode: ""
});

// 验证码
const identify = ref(null)
let curIdentifyCode = ref("");

const setIdentifyCode = (val) => {
  curIdentifyCode.value = val;
};

const handleLogin = () => {
  if (curIdentifyCode.value.toUpperCase() === loginForm.identifyCode.toUpperCase()) {
    loginAdmin()
  } else {
    ElMessage({
        type: 'error',
        message: 'Verification code error!'
    })
    identify.value.refreshCode();
  }
};

const loginAdmin = () => {
  const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." })
  login({
      username: loginForm.username,
      password: loginForm.password,
  })
    .then((res) => {
        if (res.code == 200) {
          userStore.setToken(res.data.token);
          userStore.setUserInfo(res.data.userinfo);
          Local.set("userinfo",res.data.userinfo);
          Local.set("token",res.data.token);
          getMenu().then((ret) => {
            let url = ret.data[0].path ? ret.data[0].path : ret.data[0].children[0].path;
            console.log(url);
            if (ret.code == 200) {
              Local.set('menu',ret.data);
              loadingInstance.close();
              router.push({ path: route.query.redirect || url });
            }
          }).catch((err) => {
            loadingInstance.close();
            // 清空
            userStore.setToken("");
            userStore.setUserInfo({});
            Local.clear();
          });
        }
    })
    .catch((err) => {
      console.log(err);
      loadingInstance.close();
    });
}
</script>

<style lang="scss" scoped>

// 修改默认的element-plus的el-input样式
.login-input {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color))
      inset;
    border-radius: 20px;
    cursor: default;
    .el-input__inner {
      cursor: default !important;
    }
    .el-input__inner::placeholder {
      color: #bbaec8;
      font-size: 13px;
    }
    /* 谷歌 */
    .el-input__inner::-webkit-input-placeholder {
      color: #bbaec8;
      font-size: 13px;
    }
    /* 火狐 */
    .el-input__inner:-moz-placeholder {
      color: #bbaec8;
      font-size: 13px;
    }
    /*ie*/
    .el-input__inner:-ms-input-placeholder {
      color: #bbaec8;
      font-size: 13px;
    }
  }
}
.code-box {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  border-left: 1px solid #d4d4d4;
  height: 38px;
}
.login-content {
    width: 100%;
    height: 100%;
}
.login-music {
  position: absolute;
  font-size: 300px;
  font-weight: 900;
  letter-spacing: 20px;
  top: -185px;
  left: 50%;
  font-family: fangsong;
  color: rgba($color: rgb(255, 255, 255), $alpha: 0.2);
  transform: translateX(-50%);
  z-index: 2;
  user-select: none;
}
.login::before {
  content: "";
  position: absolute;
  background-image: url(@/assets/img/back.png);
  background-size: 100% 120%;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}
.login {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to bottom, #c25afd, rgb(131, 137, 255) , #8e6bfd 100%);
  .login-form,
  .login-describe {
    display: flex;
    align-items: center;
    margin-top: 65px;
    z-index: 99;
  }
  .login-form {
    margin-left: 105px;
    margin-bottom: 230px;
    border-radius: 35px;
    box-shadow: rgba(131, 137, 255, 0.45) 0px 11px 28px -2px, rgba(131, 137, 255, 0.2) 0px 0px 2px 2px;
    .login-neon {
      position: relative;
      width: 328px;
      height: 432px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 35px;
    }
    .login-neon::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      background: linear-gradient(transparent,transparent,#c25afd);
      top: -50%;
      left: 50%;
      transform-origin: bottom left;
      animation: neonLight 3.5s linear infinite;
    }
    .login-neon::before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      background: linear-gradient(#8e6bfd,transparent,transparent);
      top: 50%;
      left: -50%;
      transform-origin: top right;
      animation: neonLight 3.5s linear infinite;
    }
    @keyframes neonLight {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    .login-table::before {
      content: "";
      position: absolute;
      background-image: url(@/assets/img/login-icon.png);
      width: 20px;
      height: 20px;
      background-size: cover;
      right: 19px;
      top: 17px;
    }
    .login-table::after {
      content: "";
      position: absolute;
      background-image: url(@/assets/img/login-icon-next.png);
      width: 22px;
      height: 22px;
      background-size: cover;
      left: 12px;
      bottom: 17px;
      transform: rotateZ(328deg);
    }
    .login-table {
      width: 225px;
      height: 330px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      background: #fff;
      padding: 50px;
      border-radius: 35px;
      position: relative;
      z-index: 10;
      .el-form-item {
        margin-bottom: 20px;
      }
      .login-name {
        font-size: 40px;
        letter-spacing: 5px;
        color: rgb(179, 125, 241);
        font-family: kaiTi;
        margin-bottom: 5px;
      }
      .login-button {
        margin-top: 15px !important;
        margin: 0 auto;
        width: 120px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #b37df1;
        color: #fff;
        border-radius: 8px;
        cursor: pointer;
      }
      .form {
        width: 100%;
        margin-bottom: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .login-input {
          border-radius: 20px;
          height: 38px;
          box-shadow: 0 0 0 1px #e4d8ef;
        }
      }
    }
  }
  .login-main {
    margin-left: 130px;
    width: 250px;
    height: 400px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    .login-logo {
      width: 180px;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
      border-radius: 32px;
      box-shadow: #8389ffa6 0px 10px 28px -2px, #8389ff16 0px 0px 0 1px;
      position: relative;
      img {
        width: 110px;
        height: 110px;
        // filter: drop-shadow(rgb(228, 205, 255) 6px 10px 10px);
      }
    }
    .login-logo::before {
      content: "";
      position: absolute;
      width: 135px;
      height: 70px;
      left: 150px;
      background-image: url(@/assets/img/login-note.png);
      background-size: cover;
    }
    .login-detail {
      margin-bottom: 70px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      color: #8e6bfd;
      font-family: fangsong;
      font-size: 40px;
      font-weight: bold;
      letter-spacing: 2px;
      .login-title {
        margin-top: 5px;
        font-size: 32px;
        position: relative;
      }
      .login-title::before,.login-title::after {
        content: "";
        clear: both;
        display: block;
        position: absolute;
        top: 19px;
        width: 20px;
        height: 2px;
        background: #8e6bfd;
      }
      .login-title::before {
        left: -32px;
      }
      .login-title::after {
        right: -32px;
      }
    }
  }
  .login-describe {
    width: 920px;
    height: 420px;
    background: #fff;
    border-radius: 25px;
    box-shadow: rgba(131, 137, 255, 0.65) 0px 6px 28px -2px, rgba(131, 137, 255, 0.4) 0px 0px 2px 2px;
  }
}
</style>