import { getAll, saveOrUpdate, deleteMenu, getEditMenuInfo } from '@/api/menus'
import type { MenuItem, CreateOrEditMenu } from '@/api/menus'
import router from '@/router/index'
export function useMenus() {
  //1.获取所有菜单列表
  const allMenus = ref([] as MenuItem[])
  const getAllMenus = async () => {
    const { data } = await getAll()
    if (data.code === '000000') {
      allMenus.value = data.data
    } else {
      ElMessage.error('获取菜单列表失败')
      throw new Error('获取菜单列表失败')
    }
  }
  //2.在从所有菜单中过滤出一级菜单
  const topMenus = computed(() => {
    return allMenus.value.filter((menu) => menu.level === 0)
  })
  //表单的响应式数据
  const form = ref<CreateOrEditMenu>({
    name: '',
    href: '',
    parentId: -1,
    description: '',
    icon: '',
    shown: true,
    oderNum: 0
  })
  //2.表单提交事件
  const onSubmit = async () => {
    const { data } = await saveOrUpdate(form.value)
    if (data.code === '000000') {
      ElMessage.success(`${msgText.value}操作成功`)
      router.push({ name: 'menus' })
    } else {
      ElMessage.error(`${msgText.value}操作失败`)
      throw new Error(`${msgText.value}操作失败`)
    }
    return
  }
  //3.删除菜单
  const handleDeleteMenu = async (id: string) => {
    await ElMessageBox.confirm('确认删除该菜单？', '删除提醒', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(() => {
      ElMessage.info('已取消删除')
      return new Promise(() => {}) //pending状态的promise
    })
    //调用接口函数
    const { data } = await deleteMenu(id)
    if (data.code === '000000') {
      ElMessage.success('删除成功')
      getAllMenus()
    } else {
      ElMessage.error('删除失败')
      throw new Error('删除失败')
    }
  }
  //4.根据id获取菜单详情
  const getMenuInFoById = async (id: string) => {
    //根据id判断是否为新增菜单
    if (!Number(id)) {
      isCreate.value = true
      return
    } else {
      isCreate.value = false
    }
    //通过接口获取菜单详情
    const { data } = await getEditMenuInfo(id)
    if (data.code === '000000') {
      form.value = data.data.menuInfo
    } else {
      ElMessage.error('获取菜单详情失败')
      throw new Error('获取菜单详情失败')
    }
  }

  //状态与提示文本
  const isCreate = ref(true)
  const msgText = computed(() => {
    return isCreate.value ? '新增' : '编辑'
  })
  return {
    allMenus,
    getAllMenus,
    topMenus,
    form,
    onSubmit,
    handleDeleteMenu,
    getMenuInFoById,
    msgText
  }
}
