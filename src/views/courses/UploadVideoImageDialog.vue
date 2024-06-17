<template>
  <el-dialog v-model="dialogVisible" title="上传视频" width="40%">
    <div class="upload-body">
      <el-upload
        class="upload-demo"
        action="#"
        accept="video/*"
        :show-file-list="false"
        :before-upload="beforeUpload"
      >
        <el-button type="primary" plain>选择视频</el-button>
        <template #tip>
          <div class="el-upload__tip">{{ uploadvideoTip }}</div>
        </template>
      </el-upload>
      <el-upload
        class="upload-demo"
        action="#"
        accept="image/*"
        :http-request="uploadImage"
        :show-file-list="false"
      >
        <el-button type="primary" plain>选择封面</el-button>
        <template #tip>
          <div class="el-upload__tip">{{ uploadimageTip }}</div>
        </template>
      </el-upload>
      <el-button type="success" @click="handleUpload">开始上传</el-button>
      <h3>视频上传进度:{{ uploadPercent }}%</h3>
      <h3>视频转码进度:{{ transPercent }}%</h3>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  aliyunTransCode,
  aliyunTransCodePercent,
  getImageUploadAuth,
  getVideoUploadAuth
} from '@/api/aliyun-upload'
import type { UploadRequestHandler, UploadRequestOptions } from 'element-plus'

const dialogVisible = ref(false)
const lessonId = ref(0)
const showAndInit = (node: any, data: any) => {
  dialogVisible.value = true
  lessonId.value = data.id
}
defineExpose({ showAndInit })
//上传视频提示
const uploadvideoTip = ref('只支持mp4格式')
//上传封面提示
const uploadimageTip = ref('只支持jpg png gif格式')
//视频上传进度
const uploadPercent = ref(0)
//视频转码进度
const transPercent = ref(0)
//获取一个上传实例
const initUploader = () => {
  return new AliyunUpload.Vod({
    // userID，用于标识上传者的身份，必填，有值即可，可以是阿里云账号ID或者您自定义的用户ID，您可以访问阿里云账号中心（https://account.console.aliyun.com/）查看账号ID
    userId: '122',
    // 上传到视频点播的地域，默认值为'cn-shanghai'，
    //eu-central-1，ap-southeast-1
    region: '',
    // 分片大小默认1 MB，不能小于100 KB（100*1024）
    partSize: 1048576,
    // 并行上传分片个数，默认5
    parallel: 5,
    // 网络原因失败时，重新上传次数，默认为3
    retryCount: 3,
    // 网络原因失败时，重新上传间隔时间，默认为2秒
    retryDuration: 2,
    // 开始上传
    onUploadstarted: function (uploadInfo: any) {},
    // 文件上传成功
    onUploadSucceed: function (uploadInfo: any) {},
    // 文件上传失败
    onUploadFailed: function (uploadInfo: any, code: any, message: any) {},
    // 文件上传进度，单位：字节
    onUploadProgress: function (uploadInfo: any, totalSize: any, loadedPercent: any) {},
    // 上传凭证或STS token超时
    onUploadTokenExpired: function (uploadInfo: any) {},
    // 全部文件上传结束
    onUploadEnd: function (uploadInfo: any) {}
  })
}
//存储上传成功的图片地址
const imageUrl = ref('')
//上传封面，保存图片地址
const uploadImage: UploadRequestHandler = (option: UploadRequestOptions): any => {
  uploadimageTip.value = option.file.name
  //1.获取一个上传实例
  const uploader = initUploader()
  //2.添加要上传的文件
  uploader.addFile(option.file)
  //3.获取上传凭证
  uploader.options.onUploadstarted = async (uploadinfo: any) => {
    const { data } = await getImageUploadAuth()
    if (data.code === '000000') {
      const { uploadAddress, uploadAuth, imageId, imageURL } = data.data
      try {
        uploader.setUploadAuthAndAddress(uploadinfo, uploadAuth, uploadAddress, imageId)
      } catch (e) {
        console.error(e)
      }

      imageUrl.value = imageURL
    } else {
      ElMessage.error('获取图片上传凭证失败')
      throw new Error('获取图片上传凭证失败')
    }
  }
  //4.开始上传
  uploader.startUpload()
  //5.监听上传进度
}
//临时保存上传的文件
const videoFile = ref()
//上传视频，临时保存视频文件
const beforeUpload = (file: any) => {
  videoFile.value = file
  uploadvideoTip.value = file.name
  return false
}
//保存视频文件ID
const videoFileId = ref()
//开始上传
const handleUpload = () => {
  //1.获取一个上传实例
  const uploader = initUploader()
  //2.添加要上传的文件
  uploader.addFile(videoFile.value)
  //3.获取上传凭证
  uploader.options.onUploadstarted = async (uploadinfo: any) => {
    const { data } = await getVideoUploadAuth(videoFile.value.name, imageUrl.value)
    if (data.code === '000000') {
      const { uploadAddress, uploadAuth, videoId } = data.data
      try {
        uploader.setUploadAuthAndAddress(uploadinfo, uploadAuth, uploadAddress, videoId)
        let h = 0
        const hTime = setInterval(() => {
          uploadPercent.value = ++h
          if (h === 100) {
            clearInterval(hTime)
          }
        }, 200)
        videoFileId.value = videoId
      } catch (e) {
        console.error(e)
      }
    } else {
      ElMessage.error('获取视频上传凭证失败')
      throw new Error('获取视频上传凭证失败')
    }
  }

  //5.监听上传进度
  uploader.options.onUploadProgress = (uploadinfo: any, totalSize: any, loadedPercent: any) => {
    uploadPercent.value = Math.round(loadedPercent * 100)
  }
  //6.视频转码
  uploader.options.onUploadEnd = async (uploadinfo: any) => {
    const { data } = await aliyunTransCode({
      lessonId: lessonId.value,
      coverImageUrl: imageUrl.value,
      fileId: videoFileId.value,
      fileName: videoFile.value.name
    })
    if (data.code === '000000') {
      //每1秒获取一次转码的进度值，当进度为100时结束
      const timer = setInterval(() => {
        aliyunTransCodePercent(lessonId.value).then((res) => {
          transPercent.value = res.data.data
          if (res.data.data === 100) {
            clearInterval(timer)
            ElMessage.success('视频上传成功')
          }
        })
      }, 1000)
    }
  }

  //4.开始上传
  uploader.startUpload()
}
</script>

<style scoped lang="scss">
.el-dialog {
  .upload-demo {
    height: 90px;
  }
  h3 {
    margin: 20px 0;
  }
  .upload-body {
    padding-left: 30px;
  }
}
</style>
