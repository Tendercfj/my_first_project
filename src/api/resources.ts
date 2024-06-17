import request from '@/utils/request'

type Common<T> = {
  code: string
  mesg: string
  data: T
  time: string
}

export type Resources = {
  categoryId: number
  createBy: string
  createTime: string
  description: string
  id: number
  name: string
  operateId: number | null
  selected: boolean
  url: string
  updatedBy: string
  updatedTime: string
}
export type QueriedResult = {
  current: number
  hitCout?: boolean
  optimizeCountSql?: boolean
  orders?: any[]
  pages?: number
  records: Resources[] | []
  searchCount?: boolean
  size: number
  total: number
}

//按条件分页查看资源
export type Condition = Partial<{
  id: number
  name: string
  startCreateTime: string
  url: string
  categoryId: number | ''
  endCreateTime: string
  current: number
  size: number
}>
export const getResourcePages = (conditon: Condition) => {
  return request<Common<QueriedResult>>({
    url: 'boss/resource/getResourcePages',
    method: 'POST',
    data: conditon
  })
}

//保存或者更新资源
export const saveOrUpdate = (resource: Partial<Resources>) => {
  return request<Common<boolean>>({
    url: 'boss/resource/saveOrUpdate',
    method: 'POST',
    data: resource
  })
}

//删除资源（指定ID的资源）
export const deleteResourceById = (id: number) => {
  return request<Common<boolean>>({
    url: `boss/resource/${id}`,
    method: 'DELETE'
  })
}

//根据指定的ID获取资源信息
export const getResourceById = (id: number) => {
  return request<Common<Resources>>({
    url: `boss/resource/${id}`,
    method: 'GET'
  })
}
