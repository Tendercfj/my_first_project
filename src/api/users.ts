import { useMyTokenStore } from '@/stores/mytoken'
import request from '@/utils/request'

//用户登录请求

// 用户登录-参数类型
type LoginInfo = {
  phone: string
  password: string
}
//用户登录-返回数据类型
type LoginResult = {
  success: boolean
  state: number
  message: string
  content: string
}
export const login = (loginInfo: LoginInfo) => {
  return request<LoginResult>({
    method: 'post',
    url: '/front/user/login',
    data: `phone=${loginInfo.phone}&password=${loginInfo.password}`
  })
}
/*
      接口请求数据类型是：application/x-www-form-urlencoded:
            需要把数据拼接成data:`属性值1=值1&属性值2=值2`
            例如：
            `phone=${loginInfo.phone}&password=${loginInfo.password}`  
      接口请求数据类型是：application/json 
            只需要直接传对象  data:loginInfo  
 */

//获取用户信息
type UserInfo = {
  //泛型，表示使用的函数的返回值是这个泛型的类型
  success: boolean
  state: number
  message: string
  content: {
    isUpdatedPassword: boolean
    portrait: string
    userName: string
  }
}
export const getInfo = () => {
  return request<UserInfo>({
    method: 'get',
    url: '/front/user/getInfo'
  })
}

//用户退出
export const logout = () => {
  return request({
    method: 'post',
    url: '/front/user/logout'
  })
}
//刷新token
type RToken = {
  message: string
  state: number
  success: boolean
  content: string
}
export const refreshToken = () => {
  return request<RToken>({
    method: 'post',
    url: '/front/user/refresh_token',
    params: {
      refreshtoken: useMyTokenStore().token?.refresh_token
    }
  })
}

//获取用户信息
export type QueryConditon = Partial<{
  currentPage: number
  pageSize: number
  phone: string
  userId: number | null
  startCreateTime: string
  endCreateTime: string
}>
//公共类型
type Common<T> = {
  code: string
  data: T
  mesg: string
  time: string
}
//每一个用户信息的类型
export type UserItem = {
  accountNonExpired: boolean
  accountNonLocked: boolean
  createTime: string
  credentialsNonExpired: boolean
  id: number
  isDel: boolean
  name: string
  password: string
  phone: string
  portrait: string | null
  regIp: string | null
  status: 'ENABLE' | 'DISABLE'
  updateTime: string
}
//用户查询结果的类型
export type QueryResult = {
  current: number
  hintCount: boolean
  optimizeCountSql: boolean
  orders: any[]
  pages: number
  records: UserItem[]
  searchCount: boolean
  size: number
  total: number
}
export const getUserPages = (queryCondition: QueryConditon = {}) => {
  return request<Common<QueryResult>>({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data: queryCondition
  })
}
//启用用户
export const enableUser = (userId: number) => {
  return request<Common<boolean>>({
    method: 'GET',
    url: '/boss/user/enableUser',
    params: { userId }
  })
}
//禁用用户
export const forbidUser = (userId: number) => {
  return request<Common<boolean>>({
    method: 'POST',
    url: '/boss/user/forbidUser',
    data: { userId }
  })
}
//根据指定id获取该id对应用户的角色信息
export type UserRole = {
  id: number
  name: string
  hasPermission: boolean
}
export const getRolesWithUserPermission = (userId: number) => {
  return request<Common<UserRole[]>>({
    method: 'GET',
    url: '/boss/role/getRolesWithUserPermission',
    params: { userId }
  })
}
