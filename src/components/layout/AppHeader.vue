<template>
  <el-header>
    <!-- 图标 -->
    <el-icon @click="isCollapse = !isCollapse">
      <IEpExpand v-show="isCollapse" />
      <IEpFold v-show="!isCollapse" />
    </el-icon>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in $route.matched"
        :key="index"
        :to="{ path: item.path }"
        >{{ item.meta.tittle }}</el-breadcrumb-item
      >
    </el-breadcrumb>
    <!-- 下拉菜单 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar :size="32" :src="userInfo.portrait" />
        <el-icon class="el-icon--right">
          <i-ep-arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
          <el-dropdown-item divided @click="handelLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-header>
</template>

<script setup>
//const isCollapse = ref(false)
import { isCollapse } from './isCollapse'
import { getInfo, logout } from '@/api/users'
import { useRouter } from 'vue-router'
import { useMyTokenStore } from '@/stores/mytoken'
const router = useRouter()
const userInfo = ref({ portrait: '', userName: '' })

//获取用户登录信息
getInfo().then((res) => {
  userInfo.value = res.data.content //如果是reactive的状态，可以直接赋值给userInfo，会覆盖如果是ref的状态，需要使用.value
})
//退出登录事件处理
const handelLogout = async () => {
  //1.询问，确认
  await ElMessageBox.confirm('确认退出登录吗？', '推出询问', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).catch(() => {
    ElMessage.error('取消退出登录')
    //throw new Error('取消退出登录')
    return new Promise(() => {})
  })
  //2.执行退出
  await logout().catch(() => {})
  ElMessage.success('退出登录成功')
  //3.清空token，跳转到login
  const store = useMyTokenStore()
  store.saveToken('')

  router.push('/login')
}
</script>

<style lang="scss" scoped>
.el-header {
  display: flex;
  align-items: center;
  background-color: #dedfe0;
  .el-icon {
    margin-right: 17px;
  }
}
.el-dropdown {
  margin-left: auto;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
