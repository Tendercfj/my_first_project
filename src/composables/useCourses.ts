import type { QueryConditon, CoursesResult } from '@/api/courses'
import { getQueryCourses } from '@/api/courses'

//查询条件
export const queryCondition = ref({
  status: ''
} as QueryConditon)
//查询方法
export const queryCourses = async (params: QueryConditon = {}) => {
  Object.assign(queryCondition.value, params)
  const { data } = await getQueryCourses(queryCondition.value)
  //console.log(data)
  if (data.code === '000000') {
    queriedResult.value = data.data
  } else {
    ElMessage.error('查询失败')
    throw new Error('查询失败')
  }
}
//查询结果
export const queriedResult = ref({} as CoursesResult)
