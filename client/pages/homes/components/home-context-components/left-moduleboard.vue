<template>
  <div class="container" style="display: block">
    <el-input
      placeholder="搜索主图"
      v-model="input"
      clearable
      prefix-icon="el-icon-search"
      clear="onClearChange"
    >
    </el-input>
    <div class="music-list">
      <div class="item">add</div>
      <div v-for="item in listAudios" :key="item.id" class="item"></div>
    </div>
  </div>
</template>

<script>
import scrollTabs from '../scroll-tabs.vue';
import templateContainer from '../template-container.vue';
import editor from '@client/mixins/editor.js';

export default {
  mixins: [editor],
  components: {
    scrollTabs,
    templateContainer
  },
  data() {
    return {
      input: '',
      item: {
        elName: 'qk-text',
        title: '文字',
        icon: 'iconfont iconwenben',
        // 每个组件设置props来展示哪些显示哪些编辑项
        valueType: '', // 标识数据类型，用于表单组件
        defaultStyle: {
          // height: 40,
        }
      },
      listAudios: [
        {
          id: '',
          icon: 'img',
          name: '稻香',
          singer: 'jay-zhou',
          timer: '3',
          using: true
        },
        {
          id: '2',
          icon: 'img3',
          name: '稻香2',
          singer: 'jay-zhou2',
          timer: '33',
          using: false
        }
      ]
    };
  },
  methods: {
    onClearChange() {}
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 320px;
  overflow-y: scroll;
  height: calc(100vh - 55px);
  padding: 24px;
  box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
  display: flex;
  .music-list {
    flex-wrap: wrap;
    display: flex;
    margin-top: 12px;
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f8fafc;
      width: 122px;
      height: 122px;
      margin-top: 16px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        border: 2px solid #5584ff;
      }
      &:nth-child(2n) {
        margin-left: 10px;
      }
    }
  }
}
</style>
