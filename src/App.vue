<script setup lang="ts">
import { RouterView } from 'vue-router'
import zhCN from 'element-plus/dist/locale/zh-cn'
</script>

<template>
  <el-config-provider :locale="zhCN">
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
