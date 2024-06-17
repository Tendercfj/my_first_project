<template>
  <el-dialog v-model="dialogFormVisible" title="分配角色" width="500">
    <el-form :model="form">
      <el-form-item :label-width="formLabelWidth" label=" ">
        <el-select v-model="hasRolesIds" placeholder="请选择角色">
          <el-option v-for="role in allRoles" :key="role.id" :label="role.name" value="role.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { queryUsers, queryCondition, queriedResult } from '@/composables/useUsers'
import { getRolesWithUserPermission } from '@/api/users'
import type { UserRole } from '@/api/users'
import { th } from 'element-plus/es/locale/index.mjs'
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
})
const hasRolesIds = ref([] as number[])
//保存所有角色信息
const allRoles = ref([] as UserRole[])
//封装显示的方法
const initAndShow = async (userId: number) => {
  dialogFormVisible.value = true
  const { data } = await getRolesWithUserPermission(userId)
  if (data.code === '000000') {
    allRoles.value = data.data
    hasRolesIds.value = data.data.filter((r) => r.hasPermission).map((r) => r.id)
    console.log(hasRolesIds.value)
  } else {
    ElMessage.error('获取角色信息失败')
    throw new Error('获取角色信息失败')
  }
}
defineExpose({
  initAndShow
})
</script>

<style scoped></style>
