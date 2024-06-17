<template>
  <el-card class="box-card" style="width: auto">
    <template #header>
      <el-form :inline="true" :model="queryCondition" class="demo-form-inline" ref="queryFm">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="queryCondition.name" placeholder="资源名称" clearable />
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input v-model="queryCondition.url" placeholder="资源路径" clearable />
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select v-model="queryCondition.categoryId" placeholder="资源分类" clearable>
            <el-option label="不限" value="" />
            <el-option
              v-for="category in allResourceCategory"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="" @click="queryFm?.resetFields()">重置</el-button>
          <el-button type="primary" @click="queryResources()">搜索查询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-button size="large" @click="dlgCreateOrEdit?.initAndShow()">添加资源</el-button>
    <el-button size="large" @click="handleClick">分类资源</el-button>
    <el-table :data="queriedResult.records" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="name" label="资源名称" align="center" />
      <el-table-column prop="url" label="资源路径" align="center" />
      <el-table-column prop="description" label="描述" align="center" />
      <el-table-column prop="createdTime" label="添加时间" align="center" :formatter="formatDate" />
      <el-table-column label="操作" align="center" v-slot="{ row }">
        <el-button type="primary" @click="dlgCreateOrEdit?.initAndShow(row.id)">编辑</el-button>
        <el-button type="danger" @click="handleDelete(row.id)">删除</el-button>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="queriedResult.current"
      v-model:page-size="queriedResult.size"
      :page-sizes="[5, 10, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queriedResult.total"
      @size-change="(size) => queryResources({ size, current: 1 })"
      @current-change="
        (current) =>
          queryResources({
            current
          })
      "
    />
    <DlgResourceCreateOrEdit ref="dlgCreateOrEdit" /><!-- 对话框组件 -->
  </el-card>
</template>

<script setup lang="ts">
//导入创建或者更新对话框
import DlgResourceCreateOrEdit from './DlgResourceCreateOrEdit.vue'
//查询条件，查询结果，查询方法
import {
  queryCondition,
  queriedResult,
  queryResources,
  deleteResource
} from '@/composables/useResources'
//格式化时间
import { formatDate } from '@/utils/timeHandlers'
//所有分类信息，查询所有分类信息
import { allResourceCategory, getAllResourceCategory } from '@/composables/useResourceCategory'
queryResources() //根据条件获取所有资源
//用户路由跳转
import { useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus/lib/components/form/index.js'
const router = useRouter()
const handleClick = () => {
  router.push({ name: 'resource-category' })
}

const queryFm = ref<FormInstance>() //表单引用
getAllResourceCategory() //获取所有资源分类
const dlgCreateOrEdit = ref<InstanceType<typeof DlgResourceCreateOrEdit> | null>() //对话框组件引用

//删除资源
const handleDelete = async (id: number) => {
  //先进行确认
  await ElMessageBox.confirm('确认删除该资源吗？', '删除询问', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).catch(() => {
    ElMessage.info('取消删除')
    return new Promise(() => {}) //删除取消后，返回一个空promise，阻止代码继续往下执行
  })
  //确认删除后进行真实的删除请求
  deleteResource(id)
}
</script>

<style scoped>
.el-table {
  margin-top: 20px;
  display: flex;
  justify-content: center;

  align-items: center;
}
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

.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
