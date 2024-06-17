<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="tittle"
    width="500"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="form" label-position="top">
      <el-form-item label="课程名称" :label-width="formLabelWidth">
        <el-input v-model="form.courseName" autocomplete="off" disabled />
      </el-form-item>
      <el-form-item label="章节名称" :label-width="formLabelWidth">
        <el-input v-model="form.sectionName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="章节描述" :label-width="formLabelWidth">
        <el-input v-model="form.description" autocomplete="off" type="textarea" />
      </el-form-item>
      <el-form-item label="章节排序" :label-width="formLabelWidth">
        <el-input-number v-model="form.oderNum" autocomplete="off" controls-position="right" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Course } from '@/api/courses'
import { getBySectionId, saveOrUpdateSection } from '@/api/courses'

const dialogFormVisible = ref(false)
const formLabelWidth = '100px'
const initData = () => ({
  id: undefined as number | undefined,
  courseId: 0,
  courseName: '',
  sectionName: '',
  description: '',
  oderNum: 0,
  status: 0
})
const form = ref(initData())

const tittle = ref('')
const inintAndShow = async (course: Course, sectionId: number | undefined) => {
  form.value = initData()
  if (sectionId) {
    tittle.value = '更新章节'
    //获取要更新的章节信息
    const { data } = await getBySectionId(sectionId)
    if (data.code === '000000') {
      const { id, sectionName, description, orderNum, status } = data.data
      form.value = Object.assign(form.value, { id, sectionName, description, orderNum, status })
    } else {
      ElMessage.error('获取章节信息失败')
      throw new Error('获取章节信息失败')
    }
  } else {
    tittle.value = '添加章节'
  }
  form.value.courseName = course.courseName
  form.value.courseId = course.id!

  dialogFormVisible.value = true
}
defineExpose({
  inintAndShow
})

const onSubmit = async () => {
  const { data } = await saveOrUpdateSection(form.value)
  if (data.code === '000000') {
    ElMessage.success(`${tittle.value}成功`)
    emits('sectionRefresh')
  } else {
    ElMessage.error(`${tittle.value}失败`)
    throw new Error(`${tittle.value}失败`)
  }
  dialogFormVisible.value = false
}

//声明给父组件的消息
const emits = defineEmits<{
  (e: 'sectionRefresh'): void
}>()
</script>

<style scoped></style>
