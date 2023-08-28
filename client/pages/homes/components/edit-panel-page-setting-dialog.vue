<template>
  <el-dialog
    title="编辑画板"
    width="30%"
    :visible="visible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <div class="select-container">
      <div
        v-for="(item, index) in canvasArr"
        :key="index"
        :class="[isIndex == index ? 'curr' : '']"
        @click="changeCanvas(item, index)"
      >
        {{ item.text }}
        <span class="text-blue" style="margin-left: 30px" v-if="item.orig"
          >原尺寸</span
        >
      </div>
    </div>

    <div class="flex-box margin-t20">
      <el-input
        class="input margin-r10"
        type="text"
        data-width
        @focus="getRatio"
        @input="changeInputw"
        size="small"
        v-model.number="projectData.width"
      />
      <img
        class="margin-r10"
        @click="isSuo = !isSuo"
        style="cursor: pointer"
        :src="
          isSuo
            ? require('../../../../assets/image/icon/suo1.png')
            : require('../../../../assets/image/icon/suo_no.png')
        "
      />
      <el-input
        class="input margin-r20"
        type="text"
        data-height
        @focus="getRatio"
        @input="changeInputh"
        size="small"
        v-model.number="activePageHeight"
      />
      <el-select
        v-model="unitValue"
        @on-change="changeUnit"
        @on-open-change="getPrevValue"
        size="small"
        value-key="value"
        class="select-panel"
      >
        <el-option
          v-for="item in unitList"
          :value="item"
          :key="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
    </div>
    <div class="margin-t10">修改尺寸后，设计场景将会对应切换</div>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import mm2px from 'mm2px';
import px2mm from 'px2mm';

export default {
  computed: {
    ...mapState({
      projectData: (state) => state.editor.projectData
    }),
    ...mapGetters(['activePage']),
    activePageHeight: {
      get() {
        return this.activePage.commonStyle.height;
      },
      set(value) {}
    }
  },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    close: {
      default: () => {},
      type: Function
    }
  },
  mounted() {},
  data() {
    return {
      isSuo: false,
      unitValue: 'px',
      isIndex: 4,
      ratio: null,
      unitList: [
        {
          value: 'px',
          label: 'px(像素)'
        }
        // {
        //   value: "cm",
        //   label: "cm(厘米)",
        // },
        // {
        //   value: "mm",
        //   label: "mm(毫米)",
        // },
      ],
      canvasArr: [
        {
          width: 800,
          height: 800,
          orig: false,
          text: '自定义尺寸'
        },
        {
          width: 900,
          height: 500,
          orig: false,
          text: '商品卡片 900px X 500px'
        },
        {
          width: 750,
          height: 1000,
          text: '主图视频 750px X 1000px'
        },
        {
          width: 800,
          height: 800,
          orig: true,
          text: '商标主图 800px X 800px'
        },
        {
          width: 750,
          height: 280,
          orig: false,
          text: 'banner 750px X 280px'
        },
        {
          width: 750,
          height: 950,
          orig: false,
          text: '电商竖版海报 750px X 950px'
        },
        {
          width: 2000,
          height: 2000,
          orig: false,
          text: 'banner 2000px X 2000px'
        },
        {
          width: 300,
          height: 300,
          orig: false,
          text: 'banner 300px X 300px'
        },
        {
          width: 375,
          height: 667,
          orig: false,
          text: '手机 375px X 667px'
        }
      ]
    };
  },
  methods: {
    changeUnit(e) {
      console.log(e);
    },
    changeInputh(e) {
      console.log(e);
      if (!this.isSuo) {
        // this.projectData.width = this.projectData.height * this.ratio;
        this.activePage.commonStyle.height = e * 1;
      }
      this.$store.dispatch('addHistoryCache');
    },
    getPrevValue() {
      this.prevUnitValue = this.unitValue;
      console.log(this.unitValue);
    },
    changeInputw(e) {
      if (!this.isSuo) {
        this.activePage.commonStyle.width = e * 1;
        // this.projectData.height = this.projectData.width / this.ratio;
      }
      this.$store.dispatch('addHistoryCache');
    },
    changeCanvas(item, index) {
      this.isIndex = index;
      switch (this.unitValue) {
        case 'mm':
          this.projectData.width = mm2px(item.width);
          this.projectData.height = mm2px(item.height);
          break;
        case 'cm':
          this.projectData.width = mm2px(item.width * 10);
          this.projectData.height = mm2px(item.height * 10);
          break;
        default:
          this.projectData.width = item.width;
          this.activePage.commonStyle.height = item.height;
          this.$store.dispatch('addHistoryCache');
          this.$bus.$emit('changeLeftToolTop', true);

          // this.projectData.pages.forEach((items) => {
          //   items.commonStyle.height = item.height;
          // });
          break;
      }
    },
    handleClose() {
      this.$emit('close');
    },
    confirm() {
      this.$emit('close');
      this.$bus.$emit('changeUpdataScroll', false);
      this.$bus.$emit('changeLeftToolTop', true);
    },
    getRatio() {
      this.ratio = this.projectData.width / this.projectData.height;
      console.log(this.ratio, 6666);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-select--small {
  .el-input--suffix {
    width: 100%;
  }
}
/deep/ .el-input--small {
  width: 100px;
}
/deep/ .el-dialog__footer,
.dialog-footer {
  width: 100%;
}
/deep/ .el-button--primary {
  background-color: #5584ff;
  border-color: #5584ff;
  width: 100%;
}
/deep/ .el-dialog {
  width: 342px !important;
}
.margin-t10 {
  margin-top: 12px;
}
.margin-r10 {
  margin-right: 10px;
}

.margin-t20 {
  margin-top: 20px;
}
.margin-r20 {
  margin-right: 20px;
}
.flex-box {
  display: flex;
  align-items: center;
}
.text-blue {
  color: #5584ff;
  cursor: pointer;
}
.select-container {
  height: 210px;
  border-radius: 4px;
  border: 1px solid #dbdde1;
  padding: 10px 12px;
  overflow: hidden;
  overflow-y: auto;
  z-index: 2001;
  .curr {
    background: #eef2ff;
  }
  div {
    padding: 0 10px;
    height: 30px;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #666;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
}
/deep/ .el-dialog__footer {
  padding: 20px;
  padding-top: 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}
</style>
