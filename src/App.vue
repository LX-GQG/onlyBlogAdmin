<script setup>
</script>

<template>
  <div class="main">
    <router-view></router-view>
  </div>
</template>


<style>
.el-form--inline .el-form-item {
  margin-right: 15px;
  margin-bottom: 12px;
}
/** 清除黑框问题 **/
.el-dropdown-link:focus-visible {
  outline: unset;
}
:root {
  --f: 0;
}
html, body {
  filter: grayscale(var(--f));
}
</style>
<style scoped>
.main {
  height: 100%;
  position: relative;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.main::-webkit-scrollbar {
  display: none;
}
.el-dialog__footer .dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>