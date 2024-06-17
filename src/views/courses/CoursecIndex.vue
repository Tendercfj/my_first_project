<template>
  <el-card style="width: auto">
    <template #header>
      <div class="card-header">
        <el-form :inline="true" :model="queryCondition" class="demo-form-inline">
          <el-form-item label="课程名称">
            <el-input v-model="queryCondition.courseName" placeholder="课程名称" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryCondition.status" placeholder="" clearable>
              <el-option label="全部" value="" />
              <el-option label="上架" :value="1" />
              <el-option label="下架" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="() => queryCourses({ currentPage: 1 })"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="$router.push('/courses/create')">新增课程</el-button>
      </div>
    </template>
    <el-table :data="queriedResult.records" border style="width: 100%">
      <el-table-column prop="id" label="ID" align="center" />
      <el-table-column prop="courseName" label="课程名称" align="center" />
      <el-table-column prop="price" label="价格" align="center" />
      <el-table-column prop="sortNum" label="排序" align="center" />
      <el-table-column label="操作" align="center" v-slot="{ row }">
        <el-button
          type="primary"
          @click="$router.push({ name: 'course-edit', params: { courseId: row.id } })"
          >编辑</el-button
        >
        <el-button
          type=""
          @click="$router.push({ name: 'course-content', params: { courseId: row.id } })"
          >内容管理</el-button
        >
      </el-table-column>
    </el-table>
  </el-card>
  <el-pagination
    v-model:current-page="queriedResult.current"
    v-model:page-size="queriedResult.size"
    :page-sizes="[10, 20, 30, 40]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="queriedResult.total || 0"
    @size-change="
      (pageSize) => {
        queryCourses({ currentPage: 1, pageSize })
      }
    "
    @current-change="
      (currentPage) => {
        queryCourses({ currentPage })
      }
    "
  />
</template>

<script setup lang="ts">
import { queryCourses, queryCondition, queriedResult } from '@/composables/useCourses'
queryCourses()
</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}

.el-form-item {
  margin-bottom: 0;
}
.el-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
