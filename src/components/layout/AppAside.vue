<template>
  <el-aside>
    <el-scrollbar>
      <el-menu router unique-opened :collapse="isCollapse">
        <a href="/" class="logo">
          <img src="@/assets/logo.svg" alt="" />
          <h1>Tender</h1>
        </a>
        <el-sub-menu index="1">
          <template #title>
            <el-icon><IEpLock /></el-icon> <span>权限管理</span>
          </template>
          <el-menu-item index="/menus">
            <el-icon><IEpSetting /> </el-icon> <span>菜单列表</span>
          </el-menu-item>
          <el-menu-item index="/resources">
            <el-icon><IEpSetting /></el-icon> <span>资源列表</span>
          </el-menu-item>
          <el-menu-item index="/roles">
            <el-icon><IEpSetting /></el-icon> <span>角色列表</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/users">
          <el-icon><IEpUser /></el-icon> <span>用户管理</span>
        </el-menu-item>

        <el-menu-item index="/courses">
          <el-icon><IEpFilm /></el-icon> <span>课程管理</span>
        </el-menu-item>

        <el-sub-menu index="2">
          <template #title>
            <el-icon><IEpSetting /></el-icon> <span>广告管理</span>
          </template>
          <el-menu-item index="/advertisement">
            <el-icon><IEpSetting /></el-icon> <span>广告列表</span>
          </el-menu-item>
          <el-menu-item index="/advertisement-space">
            <el-icon><IEpSetting /></el-icon> <span>广告位</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>
<script setup>
//const isCollapse = ref(true)
import { isCollapse } from './isCollapse'
</script>

<style lang="scss" scoped>
.el-aside {
  background-color: #e9e9eb;
  height: 100vh;
  width: auto;
}
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: black;
  height: 60px;
  img {
    width: 32px;
    height: 32px;
  }
}
.el-menu {
  background-color: #e9e9eb;
  width: 200px;
  border-right: none;
  white-space: nowrap;
  overflow: hidden;
  &.el-menu--collapse {
    width: 60px;
    & h1 {
      display: none;
    }
  }
}
</style>
