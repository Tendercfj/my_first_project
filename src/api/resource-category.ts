import request from '@/utils/request'
type Common<T> = {
  code: string
  data: T
  mesg: string
  time: string
}
export type RescoureCategory = {
  createBy: string
  createTime: string
  id: number
  name: string
  operatorId: string | null
  seleted: boolean
  sort: number
  updatedBy: string
  updatedTime: string
}
export const getAll = () => {
  //data是一个数组，所以这里返回的是Common<RescoureCategory[]>
  return request<Common<RescoureCategory[]>>({
    url: 'boss/resource/category/getAll',
    method: 'get'
  })
}
type RescoureCategoryParams = Pick<RescoureCategory, 'name' | 'sort'>
//保存或者更新资源分类
export const saveOrderUpdate = (RescoureCategoryInfo: RescoureCategoryParams) => {
  return request<Common<boolean>>({
    url: 'boss/resource/category/saveOrderUpdate',
    method: 'post',
    data: RescoureCategoryInfo
  })
}

//删除资源类别
export const deleteCategory = (id: number) => {
  return request<Common<boolean>>({
    url: `boss/resource/category${id}`,
    method: 'DELETE'
  })
}
