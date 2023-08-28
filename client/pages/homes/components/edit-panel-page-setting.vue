<template>
  <div class="edit-panel-container">
    <div class="title-box widthBox">
      <div class="title">总体画布尺寸</div>
    </div>
    <div class="content-box widthBox">
      <el-input v-model="w" disabled class="w">
        <template slot="append">宽</template>
      </el-input>
      <el-input v-model="totalH" disabled>
        <template slot="append">高</template>
      </el-input>
    </div>
    <div class="title-box widthBox">
      <div class="title">当前画布尺寸</div>
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
      <!-- <input
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
      <label for="head widthBox"></label> -->

      <el-color-picker
        style="width: 100%; height: 100%"
        :value="activePage.commonStyle.backgroundColor"
        show-alpha
        :predefine="predefineColors"
        @active-change="colorChange"
      >
      </el-color-picker>
      <edit-dialog
        style="position: fixed"
        :visible="visible"
        @close="handleClose"
      ></edit-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import editPanelFont from './edit-panel/edit-panel-font.vue';
import editPanelAnimation from './edit-panel/edit-panel-animation.vue';
import editDialog from './edit-panel-page-setting-dialog.vue';
import { forEach } from 'lodash';

export default {
  components: {
    editPanelFont,
    editPanelAnimation,
    editDialog
  },
  watch: {
    activePageUUID(val, value) {
      this.changeTotalH();
    }
  },
  computed: {
    ...mapState({
      projectData: (state) => state.editor.projectData,
      activePageUUID: (state) => state.editor.activePageUUID
    }),
    ...mapGetters(['activePage']),
    w() {
      return this.projectData.width + 'px';
    },
    h() {
      return this.activePage.commonStyle.height + 'px';
    }
  },
  mounted() {
    this.clearBtn(); // 清楚 清空按钮 和 确定按钮
    this.pageBackgroundColor = this.activePage.commonStyle.backgroundColor;
    this.$bus.$on('changeTotalH', this.changeTotalH);
  },
  data() {
    return {
      visible: false,
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      observer: null,
      totalH: 0, //总高
      PageBackgroundColor: '',
      timer: null //定时器
    };
  },
  methods: {
    handleClose() {
      this.visible = false;
      this.changeTotalH();
      this.$bus.$emit('changeUpdataScroll', false);
    },
    editCanvas() {
      this.visible = true;
      this.$bus.$emit('changeUpdataScroll', true);
    },
    // 颜色选择
    select(e) {
      this.activePage.commonStyle.backgroundColor = e.target.value;
    },
    bgReset() {
      this.activePage.commonStyle.backgroundColor = 'rgba(255,255,255,1)';
      this.$store.dispatch('addHistoryCache');
    },
    // 颜色发生变化时
    colorChange(value) {
      this.activePage.commonStyle.backgroundColor = value;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.$store.dispatch('addHistoryCache');
      }, 1000);
    },

    // 改变画布的总高
    changeTotalH() {
      let h = 0;
      this.projectData.pages.forEach((item) => {
        h += item.commonStyle.height;
      });
      this.totalH = h + 'px';
    },
    // 清除颜色选择器的清除按钮 和 确认按钮
    clearBtn() {
      let bottomBtns = document.querySelector('.el-color-dropdown__btns');
      bottomBtns.style.display = 'none';

      let clearBtn = document.querySelector('.el-color-dropdown__link-btn');
      let sureBtn = document.querySelector('.el-color-dropdown__btn');
      clearBtn.style.display = 'none';
      sureBtn.style.display = 'none';
    }
  },
  beforeDestroy() {
    this.$bus.$off('changeTotalH');
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
  top: 55px;
  position: absolute;
  left: 80px;
  bottom: 0;
  background: #ffffff;
  box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
  z-index: 999;
  left: unset;
  right: 0;
  font-size: 14px;
  width: 320px;
  .widthBox {
    width: 272px;
    margin-left: 24px;
  }
  .color-box {
    // border: 2px solid #f6f7f9;
    // padding: 12px 12px 10px;
    // margin-top: 16px;
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
    // margin-bottom: 16px;
    padding: 16px 0;
    height: 56px;
    .title {
      // width: 64px;
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
    margin-bottom: 12px;
    .w {
      margin-right: 12px;
    }
  }
}
/deep/.el-color-picker__trigger {
  width: 100%;
  padding: 8px 12px;
}
/deep/.el-color-picker__color is-alpha {
  height: 22px;
}

/deep/ .el-color-dropdown__link-btn-perform {
  display: none;
}
// 隐藏清空按钮
.-color-dropdown__link-btn {
  display: none;
}
</style>
