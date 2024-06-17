import { getCourseById, getSectionAndLesson } from '@/api/courses'
import type { Course, SectionDTO } from '@/api/courses'
//保存结果
export const course = ref({} as Course) //课程基本信息
export const courseSAL = ref([] as SectionDTO[]) //课程中的章节课时信息
//获取结果的方法
export const loadSAL = async (courseId: string) => {
  const { data: data1 } = await getCourseById(courseId)
  if (data1.code === '000000') {
    course.value = data1.data
    //console.log(data1)
  } else {
    ElMessage.error('获取课程基本信息失败')
    throw new Error('获取课程基本信息失败')
  }

  const { data: data2 } = await getSectionAndLesson(courseId)
  if (data2.code === '000000') {
    courseSAL.value = data2.data
    //console.log(data2)
  } else {
    ElMessage.error('获取课程章节课时信息失败')
    throw new Error('获取课程章节课时信息失败')
  }
}
