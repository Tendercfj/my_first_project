<template>
  <el-card style="width: auto" class="box-card">
    <template #header>
      <div class="card-header">
        <h3>资源类别列表</h3>
        <el-button class="button" type="primary" @click="dlgCreateOrEidt?.initAndShowDlg()"
          >创建类别</el-button
        >
      </div>
    </template>
    <el-table :data="allResourceCategory" border style="width: 100%">
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="name" label="类别名称" align="center" />
      <el-table-column prop="createdTime" label="创建时间" align="center" :formatter="formatDate" />
      <el-table-column prop="sort" label="排序" align="center" />
      <el-table-column prop="address" label="操作" align="center" v-slot="{ row }">
        <el-button type="primary" @click="dlgCreateOrEidt?.initAndShowDlg(row.id)">编辑</el-button>
        <el-button type="danger" @click="handleDelete(row.id)">删除</el-button>
      </el-table-column>
    </el-table>
    <DlgResource ref="dlgCreateOrEidt" />
  </el-card>
</template>

<script setup lang="ts">
import { allResourceCategory, getAllResourceCategory } from '@/composables/useResourceCategory'

import { formatDate } from '@/utils/timeHandlers'
import { deleteCategory } from '@/api/resource-category'
import DlgResource from './DlgResource.vue'
getAllResourceCategory()
const dlgCreateOrEidt = ref<InstanceType<typeof DlgResource> | null>()

//console.log(allResourceCategory)

const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确认删除该类别？', '危险动作提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).catch(() => {
    ElMessage.info('取消删除')
    return new Promise(() => {})
  })
  const { data } = await deleteCategory(id)
  console.log(data)
  if (data.code === '000000') {
    ElMessage.success('删除成功')
    getAllResourceCategory()
  } else {
    ElMessage.error('删除失败')
    throw new Error('删除失败')
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.text {
  font-size: 14px;
}
.item {
  marging-bottom: 18px;
}
</style>
