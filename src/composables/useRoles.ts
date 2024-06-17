import { getRolePages } from '@/api/roles'
import type { Role, QueriedResult, Condition } from '@/api/roles'

//查询条件
export const queryCondition = reactive<Condition>({
  name: '',
  size: 10
})
//查询结果
export const queriedResult = ref<QueriedResult>({
  records: [],
  size: 0,
  total: 0
})
//查询结果
export const queryRoles = async (params: Condition = {}) => {
  Object.assign(queryCondition, params)
  const { data } = await getRolePages(queryCondition)
  if (data.code === '000000') {
    queriedResult.value = data.data
  } else {
    ElMessage.error('查询角色信息失败')
    throw new Error('查询角色信息失败')
  }
}
