import { defineStore } from 'pinia'
interface Token {
  //interface:有以下这些信息，也可以有其他的数据
  //type:他只能包含所定义的信息，不能有其他的数据
  access_token: string
  refresh_token: string //刷新token
  token_type: string
  expires_in: number
  user_id: string
}
export const useMyTokenStore = defineStore('myToken', () => {
  const tokenJson = ref('') //state
  const token = computed<Token>(() => {
    //getters

    try {
      return JSON.parse(tokenJson.value || window.localStorage.getItem('TokenInfo') || '{}')
    } catch (err) {
      ElMessage.error('Token格式错误')
      window.localStorage.setItem('TokenInfo', '')
      throw err
    }
  })
  function saveToken(data: string) {
    //action
    tokenJson.value = data
    window.localStorage.setItem('TokenInfo', data)
  }
  //向外暴露
  return { token, saveToken }
})
