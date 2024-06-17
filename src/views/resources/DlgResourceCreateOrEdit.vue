<template>
  <el-dialog v-model="dialogFormVisible" :title="msgText + '资源'" width="500">
    <el-form :model="form">
      <el-form-item label="资源名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="资源路径" :label-width="formLabelWidth" prop="url">
        <el-input v-model="form.url" autocomplete="off" />
      </el-form-item>
      <el-form-item label="资源分类" :label-width="formLabelWidth" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="资源分类">
          <el-option label="无限" value="" />
          <el-option
            v-for="category in allResourceCategory"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="资源描述" :label-width="formLabelWidth" prop="description">
        <el-input v-model="form.description" autocomplete="off" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { saveOrUpdate, getResourceById } from '@/api/resources'
import { allResourceCategory, getAllResourceCategory } from '@/composables/useResourceCategory'
import { queryResources } from '@/composables/useResources'
getAllResourceCategory()
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const isCreate = ref(true)
const msgText = ref('')
const initAndShow = async (id = 0) => {
  Object.assign(form, iniData())
  dialogFormVisible.value = true
  if (id) {
    isCreate.value = false
    msgText.value = '更新'
    //根据传参ID获取资源信息并显示
    const { data } = await getResourceById(id)
    if (data.code === '000000') {
      Object.assign(form, data.data)
    } else {
      ElMessage.error('获取资源信息失败')
      throw new Error('获取资源信息失败')
    }
  } else {
    isCreate.value = true
    msgText.value = '创建'
  }
}
defineExpose({
  initAndShow
})
const iniData = () => ({
  name: '',
  categoryId: '',
  url: '',
  description: ''
})
const form = reactive(iniData())

//表单提交
const onSubmit = async () => {
  const { data } = await saveOrUpdate(form).finally(() => {
    dialogFormVisible.value = false
  })
  if (data.code === '000000') {
    ElMessage.success(`${msgText.value}资源成功`)
    queryResources({ current: 1 })
  } else {
    ElMessage.error(`${msgText.value}资源失败`)
    throw new Error(`${msgText.value}资源失败`)
  }
}
</script>

<style scoped></style>
