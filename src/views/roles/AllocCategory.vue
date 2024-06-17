<template>
  <el-card style="width: auto">
    <template #header>
      <div class="card-header">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          {{ props.category.name }}
        </el-checkbox>
      </div>
    </template>
    <el-checkbox-group v-model="checkedIds" @change="handleCheckedCitiesChange">
      <el-row>
        <el-col :span="8" v-for="resource in category.resourceList" :key="resource.id">
          <el-checkbox :label="resource.id" :value="resource">
            {{ resource.name }}
          </el-checkbox>
        </el-col>
      </el-row>
    </el-checkbox-group>
  </el-card>
</template>

<script setup lang="ts">
import type { CheckboxValueType } from 'element-plus/lib/components/checkbox/src/checkbox.js'
import { type Ref, ref } from 'vue'
import type { RoleResource } from '@/api/roles'
//接收父组件的数据
const props = defineProps<{
  category: RoleResource
}>()
const emit = defineEmits<{
  (e: 'checkedIds', ids: Ref<number[]>): void
}>()

//初始化设置
const checkAll = ref(props.category.selected) //全部项目是否选中
const checkedIds = ref([] as number[]) //所有已经选择的项目
emit('checkedIds', checkedIds) //向父组件发送已选择的项目
const allItemIds = [] as number[] //所有可选择的项目
const isIndeterminate = ref(
  checkedIds.value.length > 0 && checkedIds.value.length < allItemIds.length
) //是否半选

//初始化数据,填充allItemIds、checkedIds
props.category.resourceList?.forEach((res) => {
  allItemIds.push(res.id)
  if (res.selected) {
    checkedIds.value.push(res.id)
  }
})
//监听，当组内没有被选中项的时候，将全选/全不选置为false
watchEffect(() => {
  if (checkedIds.value.length === 0) {
    checkAll.value = false
    isIndeterminate.value = false
  }
})

const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedIds.value = val ? allItemIds : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allItemIds.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allItemIds.length
}
</script>

<style scoped>
.el-card {
  margin-bottom: 37px;
}
</style>
