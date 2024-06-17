<template>
  <el-dialog v-model="dialogFormVisible" :title="msgText + '资源类别'" width="500">
    <el-form :model="form" ref="fmResourceCategory">
      <el-form-item label="类别名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
        <el-input v-model="form.sort" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { saveOrderUpdate } from '@/api/resource-category'
import { getAllResourceCategory, allResourceCategory } from '@/composables/useResourceCategory'
import type { FormInstance } from 'element-plus'
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const form = reactive({
  name: '',
  sort: 0
})

const isCreate = ref(true)
const msgText = ref('')
const initAndShowDlg = (id = 0) => {
  fmResourceCategory.value?.resetFields()
  dialogFormVisible.value = true
  if (id) {
    isCreate.value = false
    msgText.value = '更新'
    const res = allResourceCategory.value.find((item) => item.id === id)
    Object.assign(form, res)
  } else {
    isCreate.value = true
    msgText.value = '创建'
  }
}
const fmResourceCategory = ref<FormInstance>()
//提交表单
const onSubmit = async () => {
  const { data } = await saveOrderUpdate(form).finally(() => (dialogFormVisible.value = false))
  if (data.code === '000000') {
    ElMessage.success(`${msgText.value}成功`)
    getAllResourceCategory()
  } else {
    ElMessage.error(`${msgText.value}失败`)
    throw new Error(`${msgText.value}失败`)
  }
}
defineExpose({
  initAndShowDlg,
  isCreate,
  msgText
})
</script>

<style scoped></style>
