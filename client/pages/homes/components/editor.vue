<!--
 * @version: 
 * @Author: leaolly
 * @Date: 2023-03-22 09:35:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-25 13:56:20
 * @Descripttion: 模块描述
-->
<template>
  <div>
    <!--页面编辑区域-->
    <div class="editor-main" @contextmenu="onContextmenu">
      <div class="control-bar-wrapper">
        <controlBar
          :scale.sync="canvasConfig.scale"
          @import-psd-data="importPsdData"
          @cancel="cancelFn"
          @publish="publishFn"
          @save="saveFn"
        />
      </div>
      <editorPan :scale.sync="canvasConfig.scale" />
    </div>
  </div>
</template>

<script>
import controlBar from '../../../pages/editor/components/control-bar.vue';
import editorPan from '../../editor/components/editor-panel';
export default {
  components: {
    controlBar,
    editorPan
  },
  computed: { projectData: (state) => state.template.projectData },
  data() {
    return {
      canvasConfig: {
        scale: 1
      },
      showMakingPanel: false
    };
  },
  methods: {
    importPsdData() {},
    cancelFn() {},
    publishFn() {},
    saveFn() {},

    onContextmenu(e) {
      e.preventDefault();
      return false;
    }
  }
};
</script>

<style></style>
