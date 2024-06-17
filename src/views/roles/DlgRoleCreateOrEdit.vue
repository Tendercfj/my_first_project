<template>
  <el-dialog v-model="dialogFormVisible" :title="msgText + '角色'" width="500">
    <el-form :model="form">
      <el-form-item label="角色名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" prop="name" />
      </el-form-item>
      <el-form-item label="角色编码" :label-width="formLabelWidth" prop="code">
        <el-input v-model="form.code" autocomplete="off" />
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
        <el-input v-model="form.description" autocomplete="off" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { saveOrUpdate, getRoleById } from '@/api/roles'
/* import { queryRoles } from '@/composables/useRoles' */
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const initData = () => ({
  code: '',
  name: '',
  description: ''
})
const form = reactive(initData())
const isCreate = ref(true)
const msgText = ref('')
const initAndShow = async (id = 0) => {
  dialogFormVisible.value = true
  /* Object.assign(form, initData()) */
  if (id) {
    isCreate.value = false
    msgText.value = '更新'
    //有id查询信息
    const { data } = await getRoleById(id)
    if (data.code === '000000') {
      Object.assign(form, data.data)
    } else {
      ElMessage.error(`获取角色信息失败...`)
      throw new Error(`获取角色信息失败...`)
    }
  } else {
    Object.assign(form, initData())
    isCreate.value = true
    msgText.value = '创建'
  }
}
//声明消息对象
const emit = defineEmits<{
  (e: 'role-change'): void
}>()
//提交表单
const onSubmit = async () => {
  const { data } = await saveOrUpdate(form).finally(() => {
    dialogFormVisible.value = false
  })
  if (data.code === '000000') {
    ElMessage.success(`${msgText.value}角色成功`)
    /* queryRoles() */
    emit('role-change')
  } else {
    ElMessage.error(`${msgText.value}角色失败...`)
    throw new Error(`${msgText.value}角色失败...`)
  }
}
defineExpose({
  initAndShow
})
</script>

<style scoped></style>
