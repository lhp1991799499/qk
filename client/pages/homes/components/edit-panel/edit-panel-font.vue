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
        <input
          class="picker-color"
          type="color"
          id="head"
          name="head"
          :value="activeElement.commonStyle.color"
          @input="select"
        />
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
              v-model="activeElement.commonStyle.letterSpacing"
              controls-position="right"
              @change="handleChange('jianju')"
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
              v-model="activeElement.commonStyle.lineHeight"
              controls-position="right"
              @change="handleChange('hanggao')"
              :min="0"
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
      <div>
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
      </div>
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
    fontSizeValue() {
      return this.activeElement.commonStyle.fontSize;
    }
  },
  mounted() {
    console.log(this.activeElement);
  },
  components: { menuEditPanel },
  data() {
    return {
      // commonStyle: this.activeElement.commonStyle,
      num01: 0,
      num02: 0,
      fontTypes: fonts,
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
          value: 20,
          label: '20px'
        },
        {
          value: 40,
          label: '40px'
        },
        {
          value: 60,
          label: '60px'
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
      }
    };
  },
  methods: {
    //字体斜体
    fontItalic() {
      this.$store.dispatch('resetElementCommonStyle', {
        fontStyle:
          this.activeElement.commonStyle.fontStyle === 'italic' ? '' : 'italic'
      });
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
    // 颜色选择
    select(e) {
      this.$store.dispatch('resetElementCommonStyle', {
        color: e.target.value
      });
    },
    // 原本未绑定所选中的图层  绑定图层后将里面的方法都注释掉
    handleChange(value) {
      // if (value == 'jianju') {
      //   console.log(value);
      //   this.$store.dispatch('resetElementCommonStyle', {
      //     letterSpacing: this.num01
      //   });
      // } else {
      //   console.log(value);
      //   this.$store.dispatch('resetElementCommonStyle', {
      //     lineHeight: this.num02
      //   });
      // }
    },
    // 修改字体
    onchangeFont(item) {
      this.loadFont(item.name, item.content.ttf);
      // setTimeout(() => {
      this.$store.dispatch('changeFont', item.name);
      // }, 0);
    },
    // 修改字体大小
    onchangeFontSize(item) {
      // console.log('11111' + item.value);
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
    border: 2px solid #f6f7f9;
    padding: 12px 12px 10px;
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
</style>
