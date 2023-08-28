<template>
  <div class="container" style="display: block">
    <div class="add-btn" @click="handleClick(item)">
      <img
        class="margin-r10"
        src="../../../../../assets/image/icon/add.png"
      />添加文字
    </div>

    <!--div class="box-addFont">
      <ul>
        <li
          v-for="(item,index) in editorList"
          :key="index"
          @click="onchangeFont(item.dclass)"
          data-name="ziti"
          data-text="输入文字"
          :data-class="item.dclass"
          :class="[item.dclass, 'ziti item']">
          <p>输入文字</p>
        </li>
      </ul>
    </div-->

    <div class="fontShadow">
      <div
        class="special"
        v-for="(item, index) in 5"
        :key="index"
        @click="texiao(index)"
      >
        <div style="width: 103px; height: 68px; background-color: white"></div>
      </div>
    </div>
  </div>
</template>

<script>
import scrollTabs from '../scroll-tabs.vue';
import templateContainer from '../template-container.vue';
import editor from '@client/mixins/editor.js';
import { _qk_register_components_object } from '@client/plugins/index';
window._qk_register_components_object = _qk_register_components_object;
import { camelCase } from 'lodash';
export default {
  mixins: [editor],
  components: {
    scrollTabs,
    templateContainer
  },
  data() {
    return {
      item: {
        elName: 'qk-text',
        title: '文字',
        icon: 'iconfont iconwenben',
        // 每个组件设置props来展示哪些显示哪些编辑项
        valueType: '', // 标识数据类型，用于表单组件
        defaultStyle: {
          height: 22
        }
      }
    };
  },
  methods: {
    // addFont() {},
    addWidget(dclass) {
      this.$emit('addWidget', 'text', '', dclass);
    },
    handleClick(item) {
      let props = this.getComponentProps(item.elName);
      console.log(item, props);
      this.$store.dispatch('addElement', { ...item, needProps: props });
    },
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
    texiao(index) {
      let props = this.getComponentProps('qk-text');
      let item = {
        default: {
          height: 22
        },
        elName: 'qk-text',
        icon: 'iconfont iconwenben',
        title: '文字',
        valueType: ''
      };
      let css = {
        textShadow: ''
      };
      if (index == 1) {
        css.textShadow =
          '1px 1px rgba(197, 223, 248, 0.8),2px 2px rgba(197, 223, 248, 0.8), 3px 3px rgba(197, 223, 248, 0.8), 4px 4px rgba(197, 223, 248, 0.8), 5px 5px rgba(197, 223, 248, 0.8),6px 6px rgba(197, 223, 248, 0.8)';
      } else if (index == 2) {
        css.textShadow =
          '-1px -1px rgba(197, 223, 248, 0.8), -2px -2px rgba(197, 223, 248, 0.8), -3px -3px rgba(197, 223, 248, 0.8), -4px -4px rgba(197, 223, 248, 0.8), -5px -5px rgba(197, 223, 248, 0.8), -6px -6px rgba(197, 223, 248, 0.8)';
      }
      this.$store.dispatch('addElement', {
        ...item,
        needProps: props,
        css3: css
      });
      this.$nextTick(() => {
        this.$bus.$emit('resetComponentsEditShape');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 320px;
  height: calc(100vh - 55px);
  padding: 24px;
  box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
  display: flex;
  flex-direction: column;
  .add-btn {
    border: 1px solid #5584ff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 4px;
    color: #5584ff;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    .margin-r10 {
      margin-right: 10px;
    }
  }
  .box-addFont {
    margin: 20px 0 0;
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 128px;
        height: 109px;
        background: #f8fafc;
        border-radius: 4px;
        text-align: center;
        margin-bottom: 20px;
        cursor: pointer;
      }
    }
  }
  .fontShadow {
    display: flex;
    flex-wrap: wrap;
    .special {
      width: 128px;
      height: 109px;
      background: #f8fafc;
      border-radius: 4px;
      margin-top: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .fontShadow :nth-child(2n) {
    margin-left: 16px;
  }
}
</style>
