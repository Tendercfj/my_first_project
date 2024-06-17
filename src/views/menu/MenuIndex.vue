<template>
  <el-card style="width: auto">
    <template #header>
      <div class="card-header">
        <el-button type="primary" @click="handleAddMenu">添加菜单</el-button>
      </div>
    </template>
    <el-table :data="allMenus" border style="width: 100%">
      <el-table-column type="index" label="编号" align="center" width="180px" />
      <el-table-column prop="name" label="菜单名称" align="center" />
      <el-table-column prop="level" label="菜单层级" align="center" />
      <el-table-column prop="icon" label="菜单图标" align="center" />
      <el-table-column prop="orderNum" label="排序" align="center" />
      <el-table-column label="操作" align="center" v-slot="scope">
        <el-button
          type="primary"
          @click="router.push({ name: 'menu-edit', params: { id: scope.row.id } })"
          >编辑</el-button
        >
        <el-button type="danger" @click="handleDeleteMenu(scope.row.id)">删除</el-button>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { useMenus } from '@/composables/useMenus'
const { allMenus, getAllMenus, handleDeleteMenu } = useMenus()
import { useRouter } from 'vue-router'
const router = useRouter()

//存储返回的数据

const handleAddMenu = () => {
  router.push({ name: 'menu-create' })
}
getAllMenus()
</script>

<style lang="scss" scoped></style>
