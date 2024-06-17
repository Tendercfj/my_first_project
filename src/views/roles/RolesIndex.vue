<template>
  <el-card style="width: auto">
    <template #header>
      <el-button type="primary" @click="dlgRoleCreateOrEdit?.initAndShow()">新建角色</el-button>
      <el-form :inline="true" :model="queryCondition" class="demo-form-inline">
        <el-form-item label="输入搜索">
          <el-input v-model="queryCondition.name" placeholder="角色名称" clearable prop="name" />
        </el-form-item>
        <el-form-item>
          <el-button type="" @click="queryCondition.name = ''">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryRoles({ current: 1 })">查询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-table :data="queriedResult.records" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="name" label="角色名称" align="center" />
      <el-table-column prop="description" label="描述" align="center" />
      <el-table-column prop="createdTime" label="添加时间" align="center" :formatter="formatDate" />
      <el-table-column label="操作" align="center" width="180" v-slot="{ row }">
        <el-button
          type="primary"
          link
          @click="$router.push({ name: 'alloc-menus', params: { roleId: row.id } })"
          >分配菜单</el-button
        >
        <el-button
          type="primary"
          link
          @click="$router.push({ name: 'alloc-resources', params: { roleId: row.id } })"
          >分配资源</el-button
        >
        <el-button type="primary" link @click="dlgRoleCreateOrEdit?.initAndShow(row.id)"
          >编辑</el-button
        >
        <el-button type="primary" link @click="handleDelete(row.id)">删除</el-button>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="queryCondition.current"
      v-model:page-size="queryCondition.size"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queriedResult.total"
      @size-change="
        (size) => {
          queryRoles({ current: 1, size })
        }
      "
      @current-change="
        (current) => {
          queryRoles({ current })
        }
      "
    />
  </el-card>
  <DlgRoleCreateOrEdit ref="dlgRoleCreateOrEdit" @role-change="queryRoles({ current: 1 })" />
</template>

<script setup lang="ts">
import { queryRoles, queryCondition, queriedResult } from '@/composables/useRoles'
import { formatDate } from '@/utils/timeHandlers'
import DlgRoleCreateOrEdit from './DlgRoleCreateOrEdit.vue'
import { deleteRole } from '@/api/roles'
const dlgRoleCreateOrEdit = ref<InstanceType<typeof DlgRoleCreateOrEdit>>()
queryRoles()

//删除角色的事件处理
const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确认删除该角色吗？', '删除提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).catch(() => {
    ElMessage.info('已取消删除')
    return new Promise(() => {})
  })

  //通过接口删除角色
  const { data } = await deleteRole(id)
  if (data.code === '000000') {
    ElMessage.success('删除成功')
    queryRoles({ current: 1 })
  } else {
    ElMessage.error('删除失败' + data.mesg)
    throw new Error('删除失败' + data.mesg)
  }
}
</script>

<style scoped>
.el-form {
  float: right;
}
.el-table {
  margin-bottom: 20px;
}
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
