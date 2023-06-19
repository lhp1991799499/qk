<template>
  <div class="edit-panel-container">
    <div class="title-box widthBox">
      <div class="title">画布尺寸</div>
      <el-button type="text" @click="editCanvas">编辑</el-button>
    </div>
    <div class="content-box widthBox">
      <el-input v-model="w" disabled class="w">
        <template slot="append">宽</template>
      </el-input>
      <el-input v-model="h" disabled>
        <template slot="append">高</template>
      </el-input>
    </div>
    <div class="title-box widthBox">
      <div class="title">画布颜色</div>
      <el-button type="text" @click="bgReset">恢复初始背景</el-button>
    </div>
    <div class="color-box widthBox">
      <input
        class="picker-color"
        type="color"
        id="head"
        name="head"
        :value="
          activePage.commonStyle.backgroundColor
            ? activePage.commonStyle.backgroundColor
            : '#ffffff'
        "
        @input="select"
      />
      <label for="head widthBox"></label>
    </div>
    <edit-dialog :visible="visible" @close="handleClose"></edit-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import editPanelFont from './edit-panel/edit-panel-font.vue';
import editPanelAnimation from './edit-panel/edit-panel-animation.vue';
import editDialog from './edit-panel-page-setting-dialog.vue';

export default {
  components: {
    editPanelFont,
    editPanelAnimation,
    editDialog
  },
  computed: {
    ...mapState({
      projectData: (state) => state.editor.projectData
    }),
    ...mapGetters(['activePage']),
    w() {
      return this.projectData.width + 'px';
    },
    h() {
      return this.projectData.height * this.projectData.pages.length + 'px';
    }
  },
  mounted() {},
  data() {
    return {
      visible: false
    };
  },
  methods: {
    handleClose() {
      this.visible = false;
    },
    editCanvas() {
      this.visible = true;
    },
    // 颜色选择
    select(e) {
      this.activePage.commonStyle.backgroundColor = e.target.value;
    },
    bgReset() {
      this.activePage.commonStyle.backgroundColor = '';
    }
  }
};
</script>
<style lang="scss" scoped>
input[type='color'] {
  -webkit-appearance: none;
  border: none;
}
input[type='color']::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type='color']::-webkit-color-swatch {
  border: none;
}
.edit-panel-container {
  min-width: 320px;
  // padding: 16px 24px;
  box-sizing: border-box;
  box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
  .widthBox {
    width: 272px;
    margin-left: 24px;
  }
  .color-box {
    border: 2px solid #f6f7f9;
    padding: 12px 12px 10px;
    margin-top: 16px;
  }
  .picker-color {
    border: none;
    padding: 0;
    width: 100%;
  }
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .title {
      width: 64px;
      height: 24px;
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 24px;
    }
    .edit {
      font-weight: 400;
      color: #5584ff;
      font-size: 14px;
    }
  }
  .content-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
    .w {
      margin-right: 12px;
    }
  }
}
</style>
