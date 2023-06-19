<!--
 * @version: 
 * @Author: leaolly
 * @Date: 2023-03-22 09:35:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-15 15:28:27
 * @Descripttion: 模块描述
-->
<template>
  <div class="edit-panel-container fontOranimation">
    <div class="header">
      <span
        v-show="
          activeElementUUID &&
          activeElement &&
          activeElement.elName === 'qk-text'
        "
        :class="[labelType == 'qk-text' ? 'active' : '', 'qk-text']"
        @click="tabClick('qk-text')"
        slot="label"
      >
        <!-- <i class="el-icon-date"></i>  -->
        <img
          :src="
            require(labelType == 'qk-text'
              ? '../../../../assets/image/canvasSvg/rightTabFont_curr.svg'
              : '../../../../assets/image/canvasSvg/rightTabFont.svg')
          "
          alt=""
        />
        字体</span
      >
      <span
        v-show="
          activeElementUUID &&
          activeElement &&
          activeElement.elName === 'qk-image'
        "
        :class="[labelType == 'qk-image' ? 'active' : '', 'qk-image']"
        @click="tabClick('qk-image')"
        slot="label"
      >
        <!-- <i class="el-icon-date"></i>  -->
        <img
          :src="
            require(labelType == 'qk-image'
              ? '../../../../assets/image/canvasSvg/rightTabImage_curr.svg'
              : '../../../../assets/image/canvasSvg/rightTabImage.svg')
          "
          alt=""
        />
        图片</span
      >
      <span
        :class="[labelType == 'qk-animation' ? 'active' : '', 'qk-animation']"
        @click="tabClick('qk-animation')"
        slot="label"
      >
        <!-- <i class="el-icon-date"></i>  -->
        <img
          :src="
            require(labelType == 'qk-animation'
              ? '../../../../assets/image/canvasSvg/rightTabVideo_curr.svg'
              : '../../../../assets/image/canvasSvg/rightTabVideo.svg')
          "
          alt=""
        />
        动画</span
      >
    </div>

    <edit-panel-font v-if="labelType === 'qk-text' ? true : false" />
    <imageSet v-if="labelType === 'qk-image'"></imageSet>
    <edit-panel-animation v-if="labelType === 'qk-animation' ? true : false" />

    <!-- <el-tabs type="border-card" stretch>
      <el-tab-pane label="字体">
        <span slot="label"><i class="el-icon-date"></i> 字体</span>
        <edit-panel-font />
      </el-tab-pane>
      <el-tab-pane label="动画">
        <edit-panel-animation />
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>

<script>
var that;
import editPanelFont from './edit-panel/edit-panel-font.vue';
import editPanelAnimation from './edit-panel/edit-panel-animation.vue';
import imageSet from './imageSet.vue';
import { mapState, mapGetters } from 'vuex';
export default {
  components: {
    editPanelFont,
    editPanelAnimation,
    imageSet
  },
  computed: {
    ...mapState({
      activeElementUUID: (state) => state.editor.activeElementUUID,
      projectData: (state) => state.editor.projectData
    }),
    ...mapGetters(['activeElement'])
  },
  data() {
    return {
      labelType: ''
    };
  },
  methods: {
    tabClick(str) {
      this.labelType = str;
    }
  },
  mounted: {
    that: this
  },
  watch: {
    activeElement: {
      handler: function (newVal, oldVal) {
        if (newVal.elName) {
          if (newVal.elName != this.labelType) {
            this.labelType = newVal.elName;
          }
        }
      },
      immediate: true
      // deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-tabs {
  height: 100%;
}
.edit-panel-container {
  width: 320px;
  box-sizing: border-box;
  box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
  background: gainsboro;
}
.fontOranimation {
  background-color: white;
  .header {
    display: flex;
    flex-wrap: nowrap;
    padding: 12px 10px 8px 10px;
    span {
      display: inline-block;
      line-height: 40px;
      width: 150px;
      height: 40px;
      background: #eeeeee;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.15);
      border-radius: 8px 0px 0px 8px;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 600;
      color: #666666;
      cursor: pointer;
    }
    .font {
    }
    .active {
      background: #5584ff;
      color: #ffffff;
    }
    .qk-animation {
      border-radius: 0px 8px 8px 0px;
    }
    .qk-text,
    .qk-image,
    .qk-animation {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        margin: 0 8px;
      }
    }
  }
}
</style>
