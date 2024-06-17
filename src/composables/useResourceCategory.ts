import { getAll } from '@/api/resource-category'
import type { RescoureCategory } from '@/api/resource-category'
//保存所有资源类别
export const allResourceCategory = ref<RescoureCategory[]>([])

//获取所有资源类别
export const getAllResourceCategory = async () => {
  const { data } = await getAll()
  if (data.code === '000000') {
    allResourceCategory.value = data.data
  } else {
    ElMessage.error('获取资源类型失败....')
    throw new Error('获取资源类型失败....')
  }
}
