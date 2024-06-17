<template>
  <el-tree
    ref="menuTree"
    :data="roleMenus"
    style="width: auto; background-color: azure"
    :props="nodeStruct"
    show-checkbox
    default-expand-all
    node-key="id"
    :default-checked-keys="checkedIds"
  />
  <el-button type="primary" @click="onSave">保存</el-button>
  <el-button type="" @click="onClear">清空</el-button>
</template>

<script setup lang="ts">
import { getRoleMenus, allocateRoleMenus } from '@/api/roles'
import type { RoleMenuItem } from '@/api/roles'

import type { ElTree } from 'element-plus/lib/components/tree/index.js'
import { useRouter } from 'vue-router'
const router = useRouter()
/* import { useRoute } from 'vue-router'
const route = useRoute()
const roleId = route.params.id
console.log(roleId) */

const props = defineProps({
  roleId: {
    type: String,
    required: true
  }
})

//存储数据
const roleMenus = ref<RoleMenuItem[]>([])
//配置节点关系
const nodeStruct = {
  children: 'subMenuList',
  label: 'name'
}
//默认被选中的key
const checkedIds = ref<number[]>([])
//创建与引用标识相同的变量名称
const menuTree = ref<InstanceType<typeof ElTree> | null>(null)
//获取所有被选中的菜单的id
const getCheckedIds = (arr: RoleMenuItem[]) => {
  arr.forEach((roleMenu) => {
    if (roleMenu.subMenuList && roleMenu.subMenuList.length > 0) {
      getCheckedIds(roleMenu.subMenuList)
    } else if (roleMenu.selected) {
      checkedIds.value.push(roleMenu.id)
    }
  })
}
//获取数据的方法
const loadRoleMenus = async () => {
  const { data } = await getRoleMenus(props.roleId)
  //console.log(data)
  if (data.code === '000000') {
    roleMenus.value = data.data //获取所有被选中的菜单的id
    getCheckedIds(data.data)
    //console.log(roleMenus.value)
    //console.log(checkedIds)
  } else {
    ElMessage.error('获取角色菜单失败')
    throw new Error('获取角色菜单失败')
  }
}
loadRoleMenus()
//console.log(props.roleId)
//保存更新后的数据
const onSave = async () => {
  //首先获取到当前最新的选项
  const checkedKeys = menuTree.value?.getCheckedKeys()

  //把最新的数据(id数组)通过接口发送给后端
  const { data } = await allocateRoleMenus(props.roleId, checkedKeys as number[])
  if (data.code === '000000' && data.data) {
    ElMessage.success('保存成功')
    router.push({ name: 'roles' })
  } else {
    ElMessage.error('保存失败')
    throw new Error('保存失败' + data.mesg)
  }
}
//清空所有
const onClear = () => {
  menuTree.value?.setCheckedKeys([])
}
</script>

<style scoped>
.el-tree {
  margin-bottom: 20px;
}
</style>
