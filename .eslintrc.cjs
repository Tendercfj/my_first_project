/* eslint-env node */
/* eslint-disable */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  globals:{
    AliyunUpload:true
  },
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    '.eslintrc-auto-import.json'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules:{
    "prettier/prettier":[
      'error',
      {
        semi:false,
        wrapAttributes:false,
        printWidth:100,
        endOfLine:'auto',
      }
    ]
  }
}
