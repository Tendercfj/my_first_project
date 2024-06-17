<template>
  <el-card style="width: auto">
    <template #header>
      <el-form :inline="true" :model="queryCondition" class="demo-form-inline">
        <el-form-item label="手机号">
          <el-input v-model="queryCondition.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryUsers({ currentPage: 1 })">查询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="queriedResult.records" border style="width: 100%">
      <el-table-column prop="id" label="用户ID" align="center" />
      <el-table-column label="头像" align="center" v-slot="{ row }">
        <el-avatar :size="50" :src="row.portrait || circleUrl" />
      </el-table-column>
      <el-table-column prop="name" label="用户名" align="center" />
      <el-table-column prop="phone" label="手机号" align="center" />
      <el-table-column prop="createTime" label="注册时间" align="center" :formatter="formatDate" />
      <el-table-column label="状态" align="center" v-slot="{ row }">
        <el-switch
          v-model="row.status"
          class="mb-2"
          active-text="启用"
          inactive-text="禁用"
          active-value="ENBLE"
          inactive-value="DISABLE"
          @change="handleStatusChange($event as 'ENABLE' | 'DISABLE', row.id)"
        />
      </el-table-column>
      <el-table-column label="操作" align="center" v-slot="{ row }">
        <el-button type="default" @click="dlgAllocRoles?.initAndShow(row.id)">分配角色</el-button>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="queriedResult.current"
      v-model:page-size="queriedResult.size"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queriedResult.total"
      @size-change="
        (size) => {
          queryUsers({ currentPage: 1, pageSize: size })
        }
      "
      @current-change="
        (page) => {
          queryUsers({ currentPage: page })
        }
      "
    />
  </el-card>
  <DlgAllocRoles ref="dlgAllocRoles" />
</template>

<script setup lang="ts">
import { queryUsers, queryCondition, queriedResult } from '@/composables/useUsers'
import { formatDate } from '@/utils/timeHandlers'
import { enableUser, forbidUser } from '@/api/users'
import DlgAllocRoles from './DlgAllocRoles.vue'
const dlgAllocRoles = ref<InstanceType<typeof DlgAllocRoles> | null>()
queryUsers()
//时间范围
const value1 = ref('')
//当时间范围变化时，修改相应的时间条件
watch(value1, (newVal) => {
  if (Array.isArray(newVal)) {
    queryCondition.value.startCreateTime = newVal[0].toISOString()
    queryCondition.value.endCreateTime = newVal[1].toISOString()
  } else {
    queryCondition.value.startCreateTime = ''
    queryCondition.value.endCreateTime = ''
  }
})

//默认用户头像
const circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

//切换用户事件状态的处理函数
const handleStatusChange = async (act: 'ENABLE' | 'DISABLE', userId: number) => {
  //console.log(act, userId)
  const { data } = act === 'ENABLE' ? await enableUser(userId) : await forbidUser(userId)
  if (data.code === '000000') {
    ElMessage.success(`${act}成功`)
  } else {
    ElMessage.error(`${act}失败`)
    throw new Error(`${act}失败`)
  }
  /* let actions = {
    ENABLE: { msg: '启用', fn: enableUser },
    DISABLE: { msg: '禁用', fn: forbidUser }
  }
  const { data } = await actions[act].fn(userId)
  if (data.code === '000000') {
    ElMessage.success(`${actions[act].msg}成功`)
  } else {
    ElMessage.error(`${actions[act].msg}失败`)
    throw new Error(`${actions[act].msg}失败`)
  } */
}
</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
.block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.block:last-child {
  border-right: none;
}
.block .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
