<template>
  <el-page-header @back="$router.back()">
    <template #content>
      <div class="flex items-center">
        <span class="text-large font-600 mr-3">
          {{ props.courseId ? '编辑课程' : '新建课程' }}
        </span>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button type="primary" class="ml-2" @click="onSubmit">保存</el-button>
      </div>
    </template>
  </el-page-header>
  <el-card style="width: auto">
    <template #header>
      <el-steps class="mb-4" style="width: auto" :space="200" :active="currentStep" simple>
        <el-step title="基本信息" :icon="EditPen" @click="currentStep = 0" />
        <el-step title="课程封面" :icon="Picture" @click="currentStep = 1" />
        <el-step title="销售信息" :icon="Tools" @click="currentStep = 2" />
        <el-step title="秒杀活动" :icon="Clock" @click="currentStep = 3" />
        <el-step title="课程详情" :icon="Document" @click="currentStep = 4" />
      </el-steps>
    </template>
    <el-form :model="course" label-width="120px" size="large">
      <!-- 基本信息 -->
      <div v-show="currentStep === 0">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="course.courseName" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="brief">
          <el-input v-model="course.brief"></el-input>
        </el-form-item>
        <el-form-item label="讲师姓名" prop="teacherDTO.teacherName">
          <el-input v-model="course.teacherDTO.teacherName"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="teacherDTO.position">
          <el-input v-model="course.teacherDTO.position"></el-input>
        </el-form-item>
        <el-form-item label="讲师简介" prop="teacherDTO.description">
          <el-input v-model="course.teacherDTO.description"></el-input>
        </el-form-item>
        <el-form-item label="课程概述1" prop="previewFirstField">
          <el-input
            v-model="course.previewFirstField"
            style="flex: 1; margin-right: 20px"
          ></el-input>
          <el-input v-model="course.previewSecondField" style="flex: 1"></el-input>
        </el-form-item>
        <el-form-item label="课程排序" prop="sortNum">
          <el-input-number v-model="course.sortNum" controls-position="right"></el-input-number>
        </el-form-item>
      </div>
      <!-- 课程封面 -->
      <div v-show="currentStep === 1">
        <el-form-item label="展示图片">
          <el-upload
            class="avatar-uploader"
            action="/boss/course/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="解锁图片">
          <el-upload
            class="avatar-uploader"
            action="/boss/course/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </div>
      <!-- 销售信息 -->
      <div v-show="currentStep === 2">
        <el-form-item label="售卖价格">
          <el-input-number
            v-model="course.discounts"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="商品原价">
          <el-input-number
            v-model="course.price"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="销量">
          <el-input-number
            v-model="course.sales"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="活动标签" style="width: 800px">
          <el-input v-model="course.discountsTag"></el-input>
        </el-form-item>
      </div>
      <!-- 秒杀活动 -->
      <div v-show="currentStep === 3">
        <el-form-item label="限时秒杀">
          <el-switch
            v-model="course.activityCourse"
            class="ml-2"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            :active-value="true"
            :inactive-value="false"
            @change="activityChange"
          /><!-- activityChange不加括号默认传参$event,加括号则需要手动指定传递的参数例如activityChange(props.courseId)，传递的就是当前课程的id，如果是activityChange($event)传递的是当前的事件对象，与不加括号的情况一致 -->
        </el-form-item>
        <template v-if="course.activityCourse">
          <el-form-item label="活动时间" style="width: 800px">
            <el-date-picker
              :v-model="timeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="活动价格">
            <el-input-number
              v-model="course.activityDTO.amount"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="库存">
            <el-input-number
              v-model="course.activityDTO.stock"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </template>
      </div>
      <!-- 课程详情 -->
      <div v-show="currentStep === 4">
        <el-form-item label="课程详情">
          <TestEditor v-model="course.courseDescriptionMarkdown" />
        </el-form-item>
        <el-form-item label="是否上架">
          <el-switch
            v-model="course.status"
            class="ml-2"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </div>
      <div class="form-buttom-btn">
        <el-button v-show="currentStep > 0 && currentStep <= 4" @click="currentStep--"
          >上一步</el-button
        >
        <el-button v-show="currentStep >= 0 && currentStep < 4" @click="currentStep++"
          >下一步</el-button
        >
        <el-button v-show="currentStep === 4" type="primary" @click="onSubmit">保存</el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { EditPen, Tools, Picture, Clock, Document } from '@element-plus/icons-vue'
import TestEditor from './TestEditor.vue'
import { saveOrUpdateCourse, getCourseById } from '@/api/courses'
//步骤条当前位置
const currentStep = ref(0)
//秒杀活动的时间范围
const timeRange = ref([] as any)
//监听时间变化，存储到course
watch(timeRange, (newVal) => {
  if (Array.isArray(newVal)) {
    course.value.activityDTO.beginTime = newVal[0].toISOString()
    course.value.activityDTO.endTime = newVal[1].toISOString()
  } else {
    course.value.activityDTO.beginTime = ''
    course.value.activityDTO.endTime = ''
  }
})
//表单数据---课程信息
const course = ref({
  //基本信息
  courseName: '',
  brief: '',
  teacherDTO: {
    teacherName: '',
    position: '',
    description: ''
  },
  previewFirstField: '',
  previewSecondField: '',
  sortNum: 0,
  //课程封面
  courseListImg: '',
  courseImgUrl: '',
  //销售信息
  discounts: 0,
  price: 0,
  sales: 0,
  discountsTag: '',
  //秒杀活动
  activityCourse: true,
  activityDTO: {
    beginTime: '',
    endTime: '',
    amount: 0,
    stock: 0
  },
  //课程详情
  courseDescriptionMarkdown: '',
  status: 1
})
const props = defineProps({
  courseId: {
    type: String,
    default: ''
  }
})
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()

const imageUrl = ref('')
//回调：图片上传成功之后
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  course.value.courseImgUrl = response.data.url
}
//回调：图片上传之前
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jepg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

//保存或更新课程表单提交事件
onMounted(async () => {
  if (props.courseId) {
    //编辑课程
    const { data } = await getCourseById(props.courseId)
    //console.log(data)
    if (data.code === '000000') {
      course.value = data.data
      if (data.data.activityDTO) {
        timeRange.value = [
          new Date(data.data.activityDTO.beginTime),
          new Date(data.data.activityDTO.endTime)
        ]
      }
    } else {
      ElMessage.error('获取课程信息失败')
    }
  }
})
const onSubmit = async () => {
  const info = props.courseId ? '更新课程' : '创建课程'
  const { data } = await saveOrUpdateCourse(course.value)
  //console.log(data)
  if (data.code === '000000') {
    ElMessage.success(`${info}成功`)
    router.push({ name: 'courses' })
  } else {
    ElMessage.error(`${info}失败`)
    throw new Error(`${info}失败`)
  }
}

//秒杀活动开关变化
const activityChange = (val: string | number | boolean) => {
  if (val && !course.value.activityDTO) {
    course.value.activityDTO = {
      beginTime: '',
      endTime: '',
      amount: 0,
      stock: 0
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
.el-steps {
  cursor: pointer;
}
.form-buttom-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-form {
  padding: 0 180px 0 100px;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
