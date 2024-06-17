<template>
  <AllocCategory
    v-for="item in roleResources"
    :key="item.id"
    :category="item"
    @checkedIds="handleCheckedIds"
  />
  <div class="el-btn">
    <el-button type="primary" @click="onSave">保存</el-button>
    <el-button type="" @click="onClear">清空</el-button>
  </div>
</template>

<script setup lang="ts">
import AllocCategory from './AllocCategory.vue'
import { getRoleResources, allocateRoleResources } from '@/api/roles'
import type { RoleResource, ResourceList } from '@/api/roles'
import router from '@/router'
const props = defineProps({
  roleId: {
    type: String,
    required: true
  }
})
//保存数据
const roleResources = ref<RoleResource[]>([])
//获取角色资源的方法
const loadRoleResources = async () => {
  const { data } = await getRoleResources(props.roleId)
  //console.log(data)
  if (data.code === '000000') {
    roleResources.value = data.data.sort((a, b) => a.sort - b.sort)
  } else {
    ElMessage.error('获取角色资源失败')
    throw new Error('获取角色资源失败' + data.mesg)
  }
}
loadRoleResources()
const checkedIds = [] as Ref<number[]>[]
const handleCheckedIds = (ids: Ref<number[]>) => {
  checkedIds.push(ids)
}
const onSave = async () => {
  const allCheckedIds = checkedIds.reduce((tmp: number[], item) => {
    return [...tmp, ...item.value]
  }, [])
  console.log(allCheckedIds)
  //保存数据到服务端
  const { data } = await allocateRoleResources(props.roleId, allCheckedIds)
  if (data.code === '000000') {
    ElMessage.success('保存成功')
    router.push({ name: 'roles' })
  } else {
    ElMessage.error('保存失败')
    throw new Error('保存失败' + data.mesg)
  }
}
const onClear = () => {
  checkedIds.forEach((item) => {
    item.value = []
  })
}
//存储所有子组件的选中id
</script>

<style scoped>
.el-btn {
  margin: 0 auto;
  width: 200px;
}
</style>
