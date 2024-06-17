import axios, { type AxiosRequestHeaders } from 'axios'
import { useMyTokenStore } from '@/stores/mytoken'
import { refreshToken } from '@/api/users'
import router from '@/router/index'
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

//请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在发送请求之前做某事
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders
    }
    const store = useMyTokenStore()
    config.headers.Authorization = store.token?.access_token
    return config
  },
  (error) => {
    // 请求错误时做些事
    return Promise.reject(error)
  }
)

//响应拦截器

request.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response
  },
  async (error) => {
    // 请求错误时做些事
    if (error.response.status === 401) {
      // 401 代表 token 失效，需要刷新 token
      const { data } = await refreshToken()
      if (data.success) {
        //保存新token
        useMyTokenStore().saveToken(data.content)
        //重新请求之前的请求接口且返回结果
        return request(error.config)
      } else {
        //token刷新失败
        //提示错误信息 跳转到login页面
        ElMessage.error('token刷新失败，请重新登录')
        router.push({ name: 'login' })
        return
      }
    }
    return Promise.reject(error)
  }
)

export default request
