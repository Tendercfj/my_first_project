<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="更改章节状态"
    width="500"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-result icon="info" :title="tittle" />
    <el-form :model="form">
      <el-form-item label="状态更改为" :label-width="formLabelWidth">
        <el-select v-model="form.status">
          <el-option
            v-for="(item, index) in sectionStatusText"
            :label="item"
            :value="index"
            :key="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onsubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { saveOrUpdateSection } from '@/api/courses'
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const form = reactive({
  status: 0
})
let tittle = ''
const showAndInit = (course: any, section: any) => {
  tittle = '当前状态为:' + sectionStatusText[section.status]
  Object.assign(form, section)
  dialogFormVisible.value = true
}
//章节状态按钮-文字
const sectionStatusText = ['隐藏', '待更新', '已发布']
//课时状态按钮-文字
//const lessonStatusText = ['隐藏', '未发布', '已发布']

const emits = defineEmits<{
  (e: 'statusChange'): void
}>()

const onsubmit = async () => {
  const { data } = await saveOrUpdateSection(form)
  if (data.code === '000000') {
    ElMessage.success('修改成功')
    emits('statusChange')
  } else {
    ElMessage.error('修改失败')
    throw new Error('修改失败')
  }
  dialogFormVisible.value = false
}
defineExpose({ showAndInit })
</script>

<style scoped></style>
