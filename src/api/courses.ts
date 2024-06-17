import request from '@/utils/request'

interface Common<T> {
  code: string
  data: T
  mesg: string
  time: string
}

export interface CoursesResult {
  records: CourseItem[]
  total: number
  size: number
  current: number
  pages: number
}

export interface CourseItem {
  id: number
  courseName: string
  price: string
  sortNum: number
}
//分页查询课程信息

//查询条件
export type QueryConditon = Partial<{
  currentPage: number
  pageSize: number
  courseName: string
  status: number | ''
}>
export const getQueryCourses = (params: QueryConditon = {}) => {
  return request<Common<CoursesResult>>({
    url: '/boss/course/getQueryCourses',
    method: 'POST',
    data: params
  })
}
export interface Course {
  id?: number
  courseName: string
  brief: string
  teacherDTO: TeacherDTO
  previewFirstField: string
  previewSecondField: string
  sortNum: number
  courseListImg: string
  courseImgUrl: string
  discounts: number
  price: number
  sales: number
  discountsTag: string
  activityCourse: boolean
  activityDTO: ActivityDTO
  courseDescriptionMarkdown: string
  status: number
}

interface ActivityDTO {
  beginTime: string
  endTime: string
  amount: number
  stock: number
}

interface TeacherDTO {
  teacherName: string
  position: string
  description: string
}
//保存或者更新课程信息
export const saveOrUpdateCourse = (params: Course) => {
  return request<Common<boolean>>({
    url: '/boss/course/saveOrUpdateCourse',
    method: 'POST',
    data: params
  })
}
//通过ID查询课程信息
export const getCourseById = (id: string) => {
  return request<Common<Course>>({
    url: '/boss/course/getCourseById',
    method: 'GET',
    params: {
      id
    }
  })
}
export interface SectionDTO {
  id: number
  courseId: number
  sectionName: string
  description: string
  createTime: string
  updateTime: string
  isVisible: boolean
  isDe: boolean
  orderNum: number
  lastOperatorId: null
  lessonDTOS: LessonDTO[]
  status: number
}

interface LessonDTO {
  id: number
  courseId: number
  sectionId: number
  theme: string
  duration: number
  durationNum: number
  isFree: boolean
  startImgUrl: string
  orderNum: number
  status: number
  isTimingPublish: boolean
  publishTime: string
  fileId: number
}
//获取指定课程中的章节课时
export const getSectionAndLesson = (courseId: string) => {
  return request<Common<SectionDTO[]>>({
    url: '/boss/course/section/getSectionAndLesson',
    method: 'GET',
    params: { courseId }
  })
}
//章节-获取基本信息根据ID
export const getBySectionId = (sectionId: number) => {
  return request<Common<SectionDTO>>({
    url: '/boss/course/section/getBySectionId',
    method: 'GET',
    params: { sectionId }
  })
}
//章节-保存或者更新基本信息
export const saveOrUpdateSection = (data: Partial<SectionDTO>) => {
  return request<Common<boolean>>({
    url: '/boss/course/section/saveOrUpdateSection',
    method: 'POST',
    data: data
  })
}

//根据ID获取课时信息
export const getLessonById = (lessonId: number) => {
  return request<Common<LessonDTO>>({
    method: 'GET',
    url: '/boss/course/lesson/getById',
    params: { lessonId }
  })
}

//课时-保存或者更新基本信息
export const saveOrUpdateLesson = (data: Partial<LessonDTO>) => {
  return request<Common<boolean>>({
    method: 'POST',
    url: '/boss/course/lesson/saveOrUpdate',
    data
  })
}
