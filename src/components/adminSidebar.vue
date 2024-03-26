<!--
 * @Author: LX_DUG
 * @Date: 2022-11-29 09:36:14
 * @LastEditors: LX_DUG
 * @LastEditTime: 2023-03-08 23:23:03
 * @Description: 侧边栏
-->
<template>
  <el-menu
    class="el-menu-vertical-demo"
    router
    :default-active="next"
    unique-opened
    active-text-color="#b37df1"
  >
    <div class="header-logo">
        <img src="@/assets/img/logo.png" alt="logo">
        <!-- <span class="logo-name">玥愔</span> -->
    </div>
    <div v-for="(value, index) in menu" :key="index">
      <!-- el-sub-menu的index不能为空 否则选中子菜单也不会自动展开 -->
        <el-sub-menu v-if="value.children && value.children.length > 0" :index="value.title" :key="value.title">
            <template #title>
              <component :is="value.icon" style="width: 16px; height:16px"/>
              <span class="router-name">{{ value.title }}</span>
            </template>
            <el-menu-item v-for="(childs) in value.children" :key="childs.title" :index="childs.path">
              <span class="router-name">{{ childs.title }}</span>
            </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="value.path" :key="index">
            <component :is="value.icon" style="width: 16px; height:16px"/>
            <span class="router-name">{{ value.title }}</span>
        </el-menu-item>
    </div>
  </el-menu>
</template>

<script>
import { defineComponent } from 'vue'
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Local } from "@/cache/index";

export default defineComponent({
    setup() {
      const router = useRouter()
      const menu = Local.get('menu')
      const next = ref(null)

      const goDefaultPage = (menus) => {
          if (menus && menus.length > 0) {
            const path = router.currentRoute.value.path
            // 如果当前路径是子菜单，则打开子菜单，否则打开第一个子菜单
            // 页面使用了菜单项的route作为index
            next.value = path.split("/").length>2 ? path : menus[0].path;
            router.replace(next.value);
          }
      }

      goDefaultPage(menu)

      return {
        menu,
        next,
        goDefaultPage
      }     
    },
})

</script>

<style lang="scss">
.el-menu-item:hover, .el-sub-menu__title:hover {
  background-color: #f7eeff;
}
.router-name {
  margin-left: 10px;
  transform: width 0.4s;
}
.header-logo {
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  .logo-name {
      margin-left: 15px;
      font-family: cursive;
      font-size: 21px;
      background-image:-webkit-linear-gradient(135deg,#84d1fb, #8782f5, #dc78f7); 
      -webkit-background-clip:text;
      background-clip:text;
      -webkit-text-fill-color:transparent;
      transform: width 0.4s;
  }
  img {
      width: 35px;
      height: 35px;
  }
}
.menu-item {
  display: flex;
  align-items: center;
}
</style>
