/*
 * @version:
 * @Author: leaolly
 * @Date: 2023-04-06 11:59:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-19 09:51:58
 * @Descripttion: 模块描述
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  rules: {
    'no-unused-vars': 0,
    'vue/no-unused-components': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
