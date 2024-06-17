import { getResourcePages } from '@/api/resources'
import { deleteResourceById, type Condition, type QueriedResult } from '@/api/resources'

//查询条件
export const queryCondition = reactive<Condition>({
  name: '',
  url: '',
  categoryId: '',
  current: 1,
  size: 10
})
//查询结果
export const queriedResult = ref<QueriedResult>({
  current: 1,
  records: [],
  size: 0,
  total: 0
})
//查询方法
export const queryResources = async (params: Condition = {}) => {
  Object.assign(queryCondition, params) //合并
  const { data } = await getResourcePages(queryCondition)
  if (data.code === '000000') {
    queriedResult.value = data.data
  } else {
    ElMessage.error('获取资源失败')
    throw new Error('获取资源失败')
  }
}

//删除方法
export const deleteResource = async (id: number) => {
  const { data } = await deleteResourceById(id)
  if (data.code === '000000') {
    //删除成功
    ElMessage.success('删除成功')
    queryResources({ current: 1 }) //刷新列表
  } else {
    ElMessage.error('删除失败')
    throw new Error('删除失败')
  }
}
//根据指定id查询资源详情
