/*
 * @version:
 * @Author: leaolly
 * @Date: 2023-04-06 09:40:20
 * @LastEditors:
 * @LastEditTime: 2023-07-17 18:46:38
 * @Descripttion: 模块描述
 */
/**
 * 公共配置文件
 */
import $config from '../../config';

const configDict = {
  development: {
    baseURL: "http://localhost:4000",
    // baseURL: 'http://192.168.31.60:4000'
  },
  production: {
    baseURL: $config.baseURL
  }
};

const currentConfigKey = process.env.NODE_ENV;
const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'development';

const configObj = {
  isDevelop: isDev || isTest,
  ...configDict[currentConfigKey],

  canvasH5Width: 800,
  canvasH5Height: 800,
  pageModeList: [
    {
      value: 'h5',
      label: '视频',
      disabled: false
    }
  ]
};

export default configObj;
