<!--
 * @version: 
 * @Author: leaolly
 * @Date: 2023-03-22 09:35:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-26 09:59:04
 * @Descripttion: 模块描述
-->
<template>
  <div class="container">
    <div class="left">
      <div class="left-menu">
        <left-menus :i="i" @onChangeTab="onChangeTab" />
      </div>
      <home-context :i="i" @onChangeTab="onChangeTab" />
    </div>
    <editor-panel />
    <!-- v-show="!activeElementUUID" -->
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
    <!--   v-show="activeElementUUID && activeElement && activeElement.elName" -->

    <!-- <timeLine
      :activePage="activePage"
      :activeElement="activeElement"
      @selectElement="selectElement"
      @updateDelay="updateDelay"
      @deleteElement="deleteElement"
      @copyElement="copyElement"
    >
    </timeLine> -->
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
import timelinemixins from '@/components/timeline/timelinemixins.js';
export default {
  mixins: [timelinemixins],
  computed: {
    ...mapState({
      activeElementUUID: (state) => state.editor.activeElementUUID,
      projectData: (state) => state.editor.projectData
    }),
    ...mapGetters(['activeElement', 'activePage'])
  },
  data() {
    return {
      i: 0
    };
  },
  mounted() {},
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
  // display: flex;
  // justify-content: space-between;
  // background-color: #eceff1;
}
.left {
  top: 55px;
  left: 0;
  bottom: 0;
  position: absolute;
}
.left-menu {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 80px;
  background: #ffffff;
  z-index: 1000;
}
</style>
