<template>
    <div class="content">
        <el-container>
            <el-aside width="200px">
                <admin-sidebar class="aside"></admin-sidebar>
            </el-aside>
            <el-container>
                <el-header class="el-header"><admin-header></admin-header></el-header>
                <el-main><router-view></router-view></el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import AdminHeader from '@/components/adminHeader.vue'
import AdminSidebar from '@/components/adminSidebar.vue'
import { ref } from 'vue';

component:{
    AdminHeader
    AdminSidebar
}

</script>

<style lang="scss" scoped>
    .search {
        display: flex;
        flex-wrap: wrap;
        padding: 10px 0;
        align-items: center;
    }
    .el-item {
        margin-bottom: 10px;
    }
    .content {
        height: 100%;
        display: flex;
    }
    .aside {
        height: 100%;
    }
    .el-header,.el-main {
        padding: 0;
    }
    .el-header {
        z-index: 10;
    }
    .content::-webkit-scrollbar {
        display: none;
    }
    .el-main::-webkit-scrollbar {
        display: none;
    }
    .form-bottom {
        margin-top: 25px;
    }
</style>