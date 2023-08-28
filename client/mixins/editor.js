/*
 * @version:
 * @Author: leaolly
 * @Date: 2023-04-06 09:40:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-13 15:12:21
 * @Descripttion: 模块描述
 */
import { camelCase } from 'lodash';
import { _qk_register_components_object } from '@client/plugins/index';
window._qk_register_components_object = _qk_register_components_object;
export default {
  data() {
    return {};
  },
  methods: {
    /**
     * 元素被点击
     * @param uuid
     */
    handleElementClick(uuid) {
      this.$store.dispatch('setActiveElementUUID', uuid);
    },
    /**
     * 点击事件, 向父组件派发add-element事件，参数： 当前组件对象
     * @param item
     */
    handleClick(item) {
      let props = this.getComponentProps(item.elName);
      this.$store.dispatch('addElement', { ...item, needProps: props });
    },
    /**
     * 根据elname获取组件默认props数据
     * @param elName
     */
    getComponentProps(elName) {
      let elComponentData;
      for (let key in _qk_register_components_object) {
        if (key.toLowerCase() === camelCase(elName).toLowerCase()) {
          elComponentData = _qk_register_components_object[key];
          break;
        }
      }
      if (!elComponentData) return {};

      let props = {};
      for (let key in elComponentData.props) {
        props[key] = [Object, Array].includes(elComponentData.props[key].type)
          ? elComponentData.props[key].default()
          : elComponentData.props[key].default;
      }
      return props;
    },
    //动态加载字体
    loadFont(name, url) {
      //name 字体名称
      //url  字体链接
      let style = document.createElement('style');
      style.type = 'text/css';
      style.innerText =
        '@font-face {font-family:' +
        name +
        ';src:url(' +
        url +
        ')};font-display: swap';
      document.getElementsByTagName('head')[0].appendChild(style);
    }
  }
};
