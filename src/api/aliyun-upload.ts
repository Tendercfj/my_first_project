import request from '@/utils/request'
//总的返回类型
type Common<T> = {
  code: string
  mesg: string
  data: T
  time: string
}
export interface VideoAuth {
  requestId: string
  videoId: string
  uploadAddress: string
  uploadAuth: string
}
//1.获取阿里云上传凭证
export const getVideoUploadAuth = (flieNmae: string, imageUrl: string) => {
  return request<Common<VideoAuth>>({
    method: 'GET',
    url: '/boss/course/upload/aliyunVideoUploadAddressAdnAuth.json',
    params: { flieNmae, imageUrl }
  })
}
export type ImageAuth = {
  requestId: string
  imageId: string
  imageURL: string
  uploadAuth: string
  fileURL: string
  uploadAddress: string
}
//2.获取阿里云图片上传凭证
export const getImageUploadAuth = () => {
  return request<Common<ImageAuth>>({
    method: 'GET',
    url: '/boss/course/upload/aliyunImageUploadAddressAdnAuth.json'
  })
}
//3.刷新视频上传凭证
export const refreshVideoUploadAuth = (videoId: string) => {
  return request({
    method: 'GET',
    url: '/boss/course/upload/refreshAliyunVideoUploadAddressAdnAuth.json',
    params: { videoId }
  })
}
export type VideoOpt = {
  lessonId: number
  coverImageUrl: string
  fileId: number
  fileName: string
}
//4.阿里云转码请求
export const aliyunTransCode = (videoopt: VideoOpt) => {
  return request<Common<boolean>>({
    method: 'POST',
    url: '/boss/course/upload/aliyunTransCode.json',
    data: videoopt
  })
}
//5.阿里云转码进度
export const aliyunTransCodePercent = (videoId: number) => {
  return request<Common<number>>({
    method: 'GET',
    url: '/boss/course/upload/aliyunTransCodePercent.json',
    params: { videoId }
  })
}

//6.获取媒体信息
export const getMediaByLessonId = (lessonId: number) => {
  return request({
    method: 'GET',
    url: '/boss/course/upload/getMediaByLessonId.json',
    params: { lessonId }
  })
}
