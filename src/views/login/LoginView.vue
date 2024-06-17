<template>
  <div class="login">
    <el-form
      :model="form"
      label-width="120px"
      label-position="top"
      size="large"
      :rules="rules"
      ref="formRef"
    >
      <h2>登录</h2>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { login } from '@/api/users'
import { useMyTokenStore } from '@/stores/mytoken'
import { useRouter, useRoute } from 'vue-router'
const store = useMyTokenStore()
const router = useRouter()
const route = useRoute()
//定义表单数据
const form = reactive({
  phone: '18201288771',
  password: '111111'
})
//登录事件处理
const onSubmit = async () => {
  loading.value = true
  //ElMessage.success('提交表单数据')
  //表单校验
  await formRef.value?.validate().catch((err) => {
    ElMessage.error('表单验证失败')
    loading.value = false
    throw err
  })

  //正式发送登录请求
  //console.log('正式登录请求')
  //正式发送登录请求
  const data = await login(form).then((res) => {
    if (!res.data.success) {
      ElMessage.error('登录失败，请检查用户名或密码')
      loading.value = false
      throw new Error('登录失败')
    }
    return res.data
  })

  console.log(data)
  //保存token信息
  store.saveToken(data.content)
  loading.value = false

  ElMessage.success('登录成功!')
  //跳转到首页
  router.push(route.query.redirect || '/')
}
//定义表单校验规则
const rules = reactive({
  phone: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    },
    {
      pattern: /^1\d{10}$/,
      message: '手机号格式不正确',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    { min: 5, max: 18, message: '密码长度在5到18位之间', trigger: 'blur' }
  ]
})
//定义是否登陆加载中
const loading = ref(false)
const formRef = ref()
</script>

<style lang="scss" scoped>
.login {
  h2 {
    text-align: center;
  }
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
  .el-form {
    background-color: #fff;
    width: 300px;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px gray;
    .el-form-item {
      margin-top: 20px;
    }
    .el-button {
      width: 300px;
      margin-top: 20px;
    }
  }
}
</style>
