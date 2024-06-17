import request from '@/utils/request'

//定义类型
type Common<T> = {
  code: string
  data: T
  mesg: string
  time: string
}
export type MenuItem = {
  createdBy: string
  createdTime: string
  description: string
  href: string
  icon: string
  id: number
  level: number
  name: string
  operatorId: number | null
  oderNum: number
  parentId: number
  shown: boolean
  updatedBy: string
  updatedTime: string
}
// 获取菜单列表
export const getAll = () => {
  return request<Common<MenuItem[]>>({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}
// 新增菜单
export type CreateOrEditMenu = Partial<MenuItem>
export const saveOrUpdate = (menuInfo: CreateOrEditMenu) => {
  return request<Common<boolean>>({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data: menuInfo
  })
}
// 删除菜单
export const deleteMenu = (id: string) => {
  return request<Common<boolean>>({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}

//获取指定id的菜单菜单信息
type SubMenuList = MenuItem & { subMenuList: SubMenuList[] | null }
type EditMenuInfo = Common<{
  menuInfo: MenuItem
  parentMenuList: SubMenuList[]
}>
export const getEditMenuInfo = (id: string) => {
  return request<EditMenuInfo>({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: { id: id }
  })
}
