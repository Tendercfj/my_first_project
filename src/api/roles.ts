import request from '@/utils/request'

type Common<T> = {
  code: string
  data: T
  mesg: string
  time: string
}
export type Role = {
  code: string
  createdBy?: string
  createdTime?: string
  description: string
  id?: number
  name: string
  operatorId?: number | null
  updatedBy?: string
  updatedTime?: string
}
export type QueriedResult = Partial<{
  current: number
  hintCount: boolean
  optimizeCountSql: boolean
  orders: any[]
  pages: number
  records: Role[]
  searchCount: boolean
  size: number
  total: number
}>

export type Condition = Partial<{
  code: string
  id: number
  name: string
  sartCreateTime: string
  endCreateTime: string
  current: number
  size: number
}>

//按条件查询角色
export const getRolePages = (conditon: Condition) => {
  return request<Common<QueriedResult>>({
    url: '/boss/role/getRolePages',
    method: 'POST',
    data: conditon
  })
}
//保存或者更新角色
export const saveOrUpdate = (role: Role) => {
  return request<Common<boolean>>({
    url: '/boss/role/saveOrUpdate',
    method: 'POST',
    data: role
  })
}

//删除角色
export const deleteRole = (id: number) => {
  return request<Common<boolean>>({
    url: `/boss/role/deleteRole${id}`,
    method: 'DELETE'
  })
}

//获取指定id的角色信息
export const getRoleById = (id: number) => {
  return request<Common<Role>>({
    url: `/boss/role/${id}`,
    method: 'GET'
  })
}
export type RoleMenuItem = {
  [x: string]: any
  createdBy: string
  createdTime: string
  description: string
  href: string
  icon: string
  id: number
  level: number
  name: string
  opratorId: number | null
  orderNum: number
  parentId: number
  selected: boolean
  shown: boolean
  subMenuList: RoleMenuItem[] | null
  updatedBy: string
  updatedTime: string
}

//获取指定角色拥有的菜单列表
export const getRoleMenus = (id: string) => {
  return request<Common<RoleMenuItem[]>>({
    url: '/boss/menu/getRoleMenus',
    method: 'GET',
    params: { roleId: id }
  })
}
//给角色分配菜单信息
export const allocateRoleMenus = (roleId: string, menuIdList: number[]) => {
  return request<Common<boolean>>({
    url: '/boss/menu/allocateRoleMenus',
    method: 'POST',
    data: {
      roleId,
      menuIdList
    }
  })
}
//获取角色拥有的资源列表
export type RoleResource = {
  createdBy: string
  createdTime: string
  id: number
  name: string
  operatorId: number | null
  resourceList: ResourceList[] | null
  selected: boolean
  sort: number
  updatedBy: string
  updatedTime: string
}
export type ResourceList = {
  categoryId: number
  createdBy: string
  createdTime: string
  description: string
  id: number
  name: string
  operatorId: number | null
  selected: boolean
  updatedBy: string
  updatedTime: string
  url: string
}

export const getRoleResources = (id: string) => {
  return request<Common<RoleResource[]>>({
    url: '/boss/resource/getRoleResources',
    method: 'GET',
    params: { roleId: id }
  })
}

//给角色分配资源
export const allocateRoleResources = (roleId: string, resourceIdList: number[]) => {
  return request<Common<boolean>>({
    url: '/boss/resource/allocateRoleResources',
    method: 'POST',
    data: {
      roleId,
      resourceIdList
    }
  })
}
