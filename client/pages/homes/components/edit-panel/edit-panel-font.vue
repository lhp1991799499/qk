<template>
  <div>
    <div class="font-setting">
      <div class="font-type">
        <el-select
          v-model="activeElement.commonStyle.fontType"
          placeholder="请选择"
          value-key="id"
          @change="onchangeFont"
        >
          <el-option
            v-for="item in fontTypes"
            :key="item.id"
            :label="item.content.alias"
            :value="item"
          >
            <img :src="item.preview.url" alt="" />
          </el-option>
        </el-select>
      </div>
      <div class="font-size">
        <el-select
          v-model="fontSizeValue"
          placeholder="请选择"
          value-key="value"
          @change="onchangeFontSize"
        >
          <el-option
            v-for="item in fontSizes"
            :key="item.value"
            :label="item.label"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="font-color">
      <div>文字颜色</div>
      <div class="color-box">
        <!-- <input
          class="picker-color"
          type="color"
          id="head"
          name="head"
          v-model="fontColor"
          @input="select"
        /> -->

        <el-color-picker
          style="width: 100%; height: 100%"
          v-model="activeElement.commonStyle.color"
          @active-change="colorChange"
        ></el-color-picker>

        <label for="head"></label>
      </div>
    </div>
    <div class="action">
      <div class="action-title mb24">操作</div>
      <div class="flex mb24">
        <div class="flex">
          <div class="image-box">
            <img src="../../../../../assets/image/icon/space.png" alt="" />
          </div>
          <div>
            <el-input-number
              v-model="letterSpacing"
              controls-position="right"
              @change="
                (val) => {
                  handleChange(val, 'letterSpacing');
                }
              "
              :min="0"
              size="small"
            ></el-input-number>
            <!-- :max="10" -->
          </div>
        </div>
        <div class="flex">
          <div class="image-box">
            <img src="../../../../../assets/image/icon/lineh.png" alt="" />
          </div>
          <div>
            <el-input-number
              v-model="lineHeight"
              controls-position="right"
              @change="
                (val) => {
                  handleChange(val, 'lineHeight');
                }
              "
              :min="1"
              size="small"
            ></el-input-number>
            <!-- :max="10" -->
          </div>
        </div>
      </div>
      <div class="flex mb24">
        <div class="img-box" @click="toggleFontDirection">
          <el-tooltip content="文字横竖排列">
            <img
              :src="
                require(activeElement.commonStyle.writingMode === 'vertical-lr'
                  ? '../../../../../assets/image/canvasSvg/height_curr.svg'
                  : '../../../../../assets/image/canvasSvg/height.svg')
              "
              alt=""
          /></el-tooltip>
        </div>
        <div class="img-box w166 flex">
          <el-tooltip content="左对齐">
            <img
              @click="fontDirection('left')"
              :src="
                require(activeElement.commonStyle.textAlign == 'left'
                  ? '../../../../../assets/image/canvasSvg/align_l_curr.svg'
                  : '../../../../../assets/image/canvasSvg/align_l.svg')
              "
              alt=""
          /></el-tooltip>
          <el-tooltip content="居中对齐">
            <img
              @click="fontDirection('center')"
              :src="
                require(activeElement.commonStyle.textAlign == 'center'
                  ? '../../../../../assets/image/canvasSvg/align_c_curr.svg'
                  : '../../../../../assets/image/canvasSvg/align_c.svg')
              "
              alt=""
          /></el-tooltip>
          <el-tooltip content="右对齐">
            <img
              @click="fontDirection('right')"
              :src="
                require(activeElement.commonStyle.textAlign == 'right'
                  ? '../../../../../assets/image/canvasSvg/align_r_curr.svg'
                  : '../../../../../assets/image/canvasSvg/align_r.svg')
              "
              alt=""
          /></el-tooltip>
        </div>
      </div>
      <div class="flex mb24">
        <div class="img-box flex width100">
          <img
            :src="
              require(activeElement.commonStyle.fontWeight == 'bold'
                ? '../../../../../assets/image/canvasSvg/bold_curr.svg'
                : '../../../../../assets/image/canvasSvg/bold.svg')
            "
            @click="handleChangeBold"
            alt=""
          />
          <img
            @click="fontItalic"
            :src="
              require(activeElement.commonStyle.fontStyle == 'italic'
                ? '../../../../../assets/image/canvasSvg/xie_curr.svg'
                : '../../../../../assets/image/canvasSvg/xie.svg')
            "
            alt=""
          />
          <img
            @click="fontUnderLine"
            :src="
              require(activeElement.commonStyle.textDecoration == 'underline'
                ? '../../../../../assets/image/canvasSvg/xiahuaxian_curr.svg'
                : '../../../../../assets/image/canvasSvg/xiahuaxian.svg')
            "
            alt=""
          />
          <img
            @click="fontCenterLine"
            :src="
              require(activeElement.commonStyle.textDecoration == 'line-through'
                ? '../../../../../assets/image/canvasSvg/zhonghuaxian_curr.svg'
                : '../../../../../assets/image/canvasSvg/zhonghuaxian.svg')
            "
            alt=""
          />
        </div>
      </div>
      <menu-edit-panel></menu-edit-panel>
      <div class="bind-title">绑定动态值</div>
      <ul>
        <li
          class="item"
          :class="{ active: item.value == active }"
          v-for="(item, index) in bingValue"
          :key="index"
          @click="selectBindValue(item)"
        >
          <img
            class="select_text"
            src="../../../../../assets/image/icon/select_text.svg"
            alt=""
          />
          {{ item.name }}
        </li>
      </ul>
      <!-- <div>
        <el-select
          class="bind-select-box"
          v-model="actionValue"
          placeholder="请选择"
          value-key="value"
        >
          <el-option
            v-for="item in actionValues"
            :key="item.value"
            :label="item.label"
            :value="item"
          >
          </el-option>
        </el-select>
      </div> -->
    </div>
  </div>
</template>

<script>
import fonts from '../../../../../fonts.json';
import editor from '@client/mixins/editor.js';
import menuEditPanel from '../edit-panel/common/menu-edit-panel.vue';
import { mapGetters } from 'vuex';
export default {
  mixins: [editor],
  computed: {
    ...mapGetters(['activeElement', 'activePage']),
    fontSizeValue: {
      get() {
        return this.activeElement.commonStyle.fontSize;
      },
      set(value) {}
    },
    letterSpacing: {
      get() {
        return this.activeElement.commonStyle.letterSpacing;
      },
      set(value) {}
    },
    lineHeight: {
      get() {
        return this.activeElement.commonStyle.lineHeight;
      },
      set(value) {}
    }
  },
  mounted() {
    this.clearBtn(); // 清楚 清空按钮 和 确定按钮
  },
  components: { menuEditPanel },
  created() {
    this.fontType = fonts;
  },
  data() {
    return {
      // commonStyle: this.activeElement.commonStyle,
      num01: 0,
      num02: 0,
      fontTypes: fonts,
      fontColor: '#000000',
      fontSizes: [
        {
          value: 14,
          label: '14px'
        },
        {
          value: 16,
          label: '16px'
        },
        {
          value: 18,
          label: '18px'
        },
        {
          value: 24,
          label: '24px'
        },
        {
          value: 30,
          label: '30px'
        },
        {
          value: 36,
          label: '36px'
        },
        {
          value: 48,
          label: '48px'
        },
        {
          value: 60,
          label: '60px'
        },
        {
          value: 72,
          label: '72px'
        },
        {
          value: 84,
          label: '84px'
        },
        {
          value: 96,
          label: '96px'
        },
        {
          value: 108,
          label: '108px'
        },
        {
          value: 120,
          label: '120px'
        },
        {
          value: 140,
          label: '140px'
        },
        {
          value: 150,
          label: '150px'
        },
        {
          value: 160,
          label: '160px'
        },
        {
          value: 180,
          label: '180px'
        },
        {
          value: 200,
          label: '200px'
        },
        {
          value: 250,
          label: '250px'
        },
        {
          value: 300,
          label: '300px'
        },
        {
          value: 400,
          label: '400px'
        },
        {
          value: 500,
          label: '500px'
        }
      ],
      actionValues: [
        {
          value: '单买价',
          label: '单买价'
        }
      ],
      actionValue: '',
      fontType: '',
      fontSize: {
        value: this.fontSizeValue || 16,
        label: this.fontSizeValue || 16 + 'px'
      },
      bingValue: [
        {
          name: '无绑定动态值',
          value: '0'
        },
        {
          name: '单买价',
          value: '1'
        },
        {
          name: '团购价',
          value: '2'
        },
        {
          name: '市场价',
          value: '3'
        },
        {
          name: '属性名称',
          value: '4'
        },
        {
          name: '自定义名称',
          value: '5'
        }
      ],
      active: '3',
      timer: null //定时器
    };
  },

  methods: {
    // 选中的动态绑定值
    selectBindValue(select) {
      this.active = select.value;
    },
    //字体斜体
    fontItalic() {
      // this.$store.dispatch('resetElementCommonStyle', {
      //   fontStyle:
      //     this.activeElement.commonStyle.fontStyle === 'italic' ? '' : 'italic'
      // });
      this.$store.dispatch('elementCommand', 'fontItalic');
    },
    //字体加下划线
    fontUnderLine() {
      //this.fontUnderLineFlag = !this.fontUnderLineFlag;
      //this.$store.dispatch('resetElementCommonStyle', 'fontULine');
      // fontUnderLine() {
      //   this.$store.dispatch("resetElementCommonStyle", {
      //     textDecoration:
      //       this.activeElement.commonStyle.textDecoration === "underline" ? "" : "underline",
      //   });
      this.$store.dispatch('elementCommand', 'fontULine');
    },
    //字体加中划线
    fontCenterLine() {
      // this.$store.dispatch('resetElementCommonStyle', 'fontCLine');
      this.$store.dispatch('elementCommand', 'fontCLine');
      //    this.$store.dispatch("resetElementCommonStyle", {
      //   textDecoration:
      //     this.activeElement.commonStyle.textDecoration === "line-through" ? "" : "line-through",
      // });
    },
    // fontCenterLine() {
    //   this.$store.dispatch("resetElementCommonStyle", {
    //     textDecoration:
    //       this.activeElement.commonStyle.textDecoration === "line-through" ? "" : "line-through",
    //   });
    // },
    // 文字横竖排
    toggleFontDirection() {
      // console.log(this.activeElement.commonStyle, '横竖排列交换宽高');
      let height = this.activeElement.commonStyle.height;
      let width = this.activeElement.commonStyle.width;
      console.log(height, width, 999);
      this.$store.dispatch('resetElementCommonStyle', {
        writingMode:
          this.activeElement.commonStyle.writingMode === 'vertical-lr'
            ? ''
            : 'vertical-lr',
        height: width,
        width: height
      });
    },
    // 文字左对齐
    fontDirection(e) {
      this.$store.dispatch('resetElementCommonStyle', {
        textAlign: e
      });
    },

    // 字体加粗
    handleChangeBold() {
      this.$store.dispatch('elementCommand', 'fontB');
    },
    // 颜色发生变化时
    colorChange(value) {
      this.activeElement.commonStyle.color = value;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.$store.dispatch('addHistoryCache');
      }, 1000);
    },
    // 颜色选择
    select(e) {
      // this.$store.commit('resetElementCommonStyle', {
      //   color: e.target.value
      // });
      // this.activeElement.commonStyle.color = e.target.value;
      // if (this.timer) {
      //   clearTimeout(this.timer);
      //   this.timer = null;
      // }
      // this.timer = setTimeout(() => {
      //   this.$store.dispatch('addHistoryCache');
      // }, 1000);
    },
    // 原本未绑定所选中的图层  绑定图层后将里面的方法都注释掉
    handleChange(val, style) {
      if (style == 'letterSpacing') {
        this.$store.commit('resetElementCommonStyle', {
          letterSpacing: val,
          statusHistory: false
        });
      } else {
        this.$store.commit('resetElementCommonStyle', {
          lineHeight: val,
          statusHistory: false
        });
      }

      this.$nextTick(() => {
        this.$bus.$emit('resetComponentsEditShape');
        this.$store.commit('addHistoryCache');
      });
    },
    // 修改字体
    onchangeFont(item) {
      this.loadFont(item.name, item.content.ttf);
      // setTimeout(() => {
      this.$store.dispatch('changeFont', item);
      // }, 0);
    },
    // 修改字体大小
    onchangeFontSize(item) {
      console.log(666666);
      this.$store.dispatch('resetElementCommonStyle', {
        fontSize: item.value,
        width:
          (this.activeElement.commonStyle.width /
            this.activeElement.commonStyle.fontSize) *
          item.value,
        height:
          (this.activeElement.commonStyle.height /
            this.activeElement.commonStyle.fontSize) *
          item.value
      });

      this.$nextTick(() => {
        this.$bus.$emit('resetComponentsEditShape');
      });
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
  }
};
</script>

<style lang="scss" scoped>
.w32 {
  width: 32px;
  font-weight: 400;
  color: #333333;
  font-size: 12px;
  margin-top: 4px;
  text-align: center;
}
.width100 {
  width: 100%;
}
.w166 {
  width: 166px;
}
.bg-gray {
  padding: 16px;
  background: #f6f7f9;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
.direction {
  flex-direction: column;
}
/deep/ .el-input-number--small {
  width: 100px;
}
// .img-layout {
//   width: 26px;
//   height: 26px;
//   cursor: pointer;
//   &:hover {
//     opacity: 0.8;
//   }
//   padding: 16px;
//   background: #f6f7f9;
// }
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .image-box {
    width: 22px;
    height: 22px;
    margin-right: 8px;
  }
  .img-box {
    img {
      width: 26px;
      height: 26px;
      cursor: pointer;
      display: block;
      &:hover {
        opacity: 0.8;
      }
    }
    padding: 7px 16px;
    background: #f6f7f9;
    border-radius: 4px;
  }
}
.action {
  margin-top: 24px;
  padding-left: 14px;
  padding-right: 14px;
  .action-title,
  .bind-title {
    font-weight: 600;
    color: #333333;
    margin-bottom: 16px;
  }
  .bind-select-box {
    width: 182px;
    margin-right: 8px;
  }
}
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
.font-setting {
  padding-left: 14px;
  padding-right: 14px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  top: 0;
  left: 80px;
  bottom: 0;
  width: 320px;
  background: #ffffff;
  box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
  z-index: 999;
  padding: 24px;
  left: unset;
  right: 0;
  font-size: 14px;
  overflow-y: auto;
  .font-type {
    margin-right: 12px;
    flex: 3;
  }
  .font-size {
    flex: 2;
  }
}
.font-color {
  margin-top: 24px;
  padding-left: 14px;
  padding-right: 14px;
  font-weight: 600;
  color: #333333;
  .color-box {
    // border: 2px solid #f6f7f9;
    // padding: 12px 12px 10px;
    margin-top: 16px;
  }
  .picker-color {
    border: none;
    padding: 0;
    width: 100%;
  }
}
.mb24 {
  margin-bottom: 24px !important;
}
.item {
  // width: 84px;
  height: 40px;
  line-height: 40px;
  padding-left: 30px;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0);
  .select_text {
    display: none;
    position: absolute;
    left: 8px;
    top: 13px;
    width: 14px;
    height: 14px;
  }
}
.active {
  border: 1px solid #5584ff;
  background: #f6f7f9;
  border-radius: 4px;
  position: relative;
  .select_text {
    display: block !important;
  }
}
.item:hover {
  background: #f6f7f9;
  border-radius: 4px;
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
