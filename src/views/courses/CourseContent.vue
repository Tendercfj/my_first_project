<template>
  <el-page-header @back="$router.back()">
    <template #content>
      <div class="flex items-center">
        <span class="text-large font-600 mr-3"> {{ course.courseName }} </span>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button
          type="primary"
          class="ml-2"
          :icon="Plus"
          @click="sectionDialogCreateOrEdit?.inintAndShow(course, undefined)"
          >添加章节</el-button
        >
      </div>
    </template>
  </el-page-header>
  <el-card style="width: auto">
    <el-tree
      style="width: auto"
      :data="courseSAL"
      :props="defaultProps"
      node-key="id"
      :expand-on-click-node="false"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span v-show="node.level === 1">
            <el-button
              size="large"
              @click.stop="sectionDialogCreateOrEdit?.inintAndShow(course, data.id)"
              >编辑</el-button
            >
            <el-button
              size="large"
              type="primary"
              @click.stop="lessonDialogCreateOrEdit?.showAndInit(node, data, course)"
              >添加课时</el-button
            >
            <el-button size="large" @click.stop="sectionStatusChange?.showAndInit(course, data)">{{
              sectionStatusText[data.status]
            }}</el-button>
          </span>
          <span v-show="node.level === 2">
            <el-button
              size="large"
              @click.stop="lessonDialogCreateOrEdit?.showAndInit(node, data, course)"
              >编辑</el-button
            >
            <el-button
              size="large"
              type="success"
              @click.stop="uploadVideoImageDialog?.showAndInit(node, data)"
              >上传视频</el-button
            >
            <el-button size="large" @click="lessonStatusChange?.showAndInit(course, data)">{{
              lessonStatusText[data.status]
            }}</el-button>
          </span>
        </span>
      </template>
    </el-tree>
  </el-card>
  <SectionDialogCreateOrEdit
    ref="sectionDialogCreateOrEdit"
    @section-refresh="loadSAL(props.courseId)"
  />
  <SectionStatusChange ref="sectionStatusChange" @status-change="loadSAL(props.courseId)" />
  <LessonDialogCreateOrEdit
    ref="lessonDialogCreateOrEdit"
    @update-course="loadSAL(props.courseId)"
  />
  <LessonStatusChange ref="lessonStatusChange" @status-change="loadSAL(props.courseId)" />
  <UploadVideoImageDialog ref="uploadVideoImageDialog" />
</template>

<script setup lang="ts">
import { courseSAL, course, loadSAL } from '@/composables/useCourseContent'
import { Plus } from '@element-plus/icons-vue'
import SectionDialogCreateOrEdit from './SectionDialogCreateOrEdit.vue'
import SectionStatusChange from './SectionStatusChange.vue'
import LessonDialogCreateOrEdit from './LessonDialogCreateOrEdit.vue'
import LessonStatusChange from './LessonStatusChange.vue'
import UploadVideoImageDialog from './UploadVideoImageDialog.vue'
const uploadVideoImageDialog = ref<InstanceType<typeof UploadVideoImageDialog>>()
const lessonStatusChange = ref<InstanceType<typeof LessonStatusChange>>()
const lessonDialogCreateOrEdit = ref<InstanceType<typeof LessonDialogCreateOrEdit>>()
const sectionStatusChange = ref<InstanceType<typeof SectionStatusChange>>()
const sectionDialogCreateOrEdit = ref<InstanceType<typeof SectionDialogCreateOrEdit>>()
const props = defineProps({
  courseId: {
    type: String,
    required: true
    //default: ''
  }
})
loadSAL(props.courseId)

const defaultProps = {
  children: 'lessonDTOS',
  label: (data: any) => data.sectionName || data.theme
}
//章节状态按钮-文字
const sectionStatusText = ['隐藏', '待更新', '已发布']
//可是状态按钮-文字
const lessonStatusText = ['隐藏', '未发布', '已发布']
</script>

<style scoped lang="scss">
.el-page-header {
  margin-bottom: 20px;
}
:deep(.el-tree-node__content) {
  padding: 15px 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 25px;
}
</style>
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
