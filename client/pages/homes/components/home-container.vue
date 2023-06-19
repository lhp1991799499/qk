<!--
 * @version: 
 * @Author: leaolly
 * @Date: 2023-03-22 09:35:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-06 11:28:37
 * @Descripttion: 模块描述
-->
<template>
  <div class="container">
    <div class="left">
      <div class="left-menu">
        <left-menus :i="i" @onChangeTab="onChangeTab" />
      </div>
      <home-context :i="i" />
    </div>
    <editor-panel />
    <edit-panel-setting-right v-show="!activeElementUUID" />
    <!--     <image-set
      v-show="
        activeElementUUID &&
        activeElement &&
        activeElement.elName === 'qk-image'
      "
    ></image-set> -->

    <!--   (activeElement.elName === 'qk-text' ||
          activeElement.elName === 'qk-image') -->
    <edit-panel-right
      v-show="activeElementUUID && activeElement && activeElement.elName"
    />
  </div>
</template>

<script>
import leftMenus from './home-left-menu.vue';
import homeContext from './home-context.vue';
import editPanelRight from '../components/edit-panel.vue';
import editPanelSettingRight from '../components/edit-panel-page-setting.vue';
import editorPanel from '../../../pages/editor/components/editor-panel/Index.vue';
import imageSet from './imageSet.vue';
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState({
      activeElementUUID: (state) => state.editor.activeElementUUID,
      projectData: (state) => state.editor.projectData
    }),
    ...mapGetters(['activeElement'])
  },
  data() {
    return {
      i: 0
    };
  },
  mounted() {
    console.log(this.activeElement);
  },
  components: {
    leftMenus,
    homeContext,
    editorPanel,
    editPanelRight,
    editPanelSettingRight,
    imageSet
  },
  methods: {
    onChangeTab(val) {
      this.i = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
}
.left {
  display: flex;
  background-color: #ffffff;
}
.left-menu {
  width: 80px;
  height: calc(100vh - 55px);
  border-right: 1px solid #f0f0f0;
}
</style>
