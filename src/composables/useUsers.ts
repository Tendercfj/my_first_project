import { getUserPages } from '@/api/users'
import type { QueryConditon, QueryResult } from '@/api/users'

//查询条件
export const queryCondition = ref({} as QueryConditon)
//查询结果
export const queriedResult = ref({} as QueryResult)
//查询方法

export const queryUsers = async (params: QueryConditon = {}) => {
  Object.assign(queryCondition.value, params)
  const { data } = await getUserPages(queryCondition.value)
  console.log(data)
  if (data.code === '000000') {
    queriedResult.value = data.data
  } else {
    ElMessage.error('查询失败')
    throw new Error('查询失败')
  }
}
