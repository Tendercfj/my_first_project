<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      @onCreated="handleCreated"
    />
  </div>
</template>
<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { th } from 'element-plus/es/locale/index.mjs'

//声明属性
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
//声明消息
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')
//当属性变化时，自动赋值给valueHtml
watchEffect(() => {
  valueHtml.value = props.modelValue
}) // 监听 props 变化
//当 valueHtml 变化时，自动告诉父组件
watch(valueHtml, (newValue) => {
  emit('update:modelValue', newValue) // 触发 update:modelValue 事件
}) // 监听 valueHtml 变化
// 模拟 ajax 异步获取内容
/* onMounted(() => {
  setTimeout(() => {
    valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
  }, 1500)
}) */

const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: '/boss/course/upload',
      filedName: 'file',
      customInsert(res: any, insertFn: any) {
        console.log(res.data.name)
        if (res.code === '000000') {
          insertFn(res.data.name)
          ElMessage.success('上传成功')
        } else {
          ElMessage.error('上传失败')
          throw new Error('上传失败')
        }
      }
    }
  }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
</script>
