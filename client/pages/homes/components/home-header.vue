<template>
  <div class="header">
    <div class="left-item">
      <div class="logo">
        <img
          style="width: 80px; height: 20px"
          src="../../../../assets/image/canvasSvg/dbsjLogo.png"
          alt=""
        />
      </div>
      <div class="operation">
        <img
          class="icon"
          @click="editorUndo"
          :src="
            canUndo
              ? require('../../../../assets/image/canvasSvg/revocationCopy.svg')
              : require('../../../../assets/image/canvasSvg/revocation.svg')
          "
        />
        <img
          class="icon"
          @click="editorRedo"
          :src="
            canRedo
              ? require('../../../../assets/image/canvasSvg/renewalCopy.svg')
              : require('../../../../assets/image/canvasSvg/renewal.svg')
          "
        />
      </div>

      <div class="main-title">
        <!-- <img class="mr3" src="../../../../assets/image/icon/point.png" />
        <div class="sub">标题</div> -->
        <el-tooltip
          effect="dark"
          content="重命名"
          placement="bottom"
          :disabled="topToolFlag"
        >
          <el-input
            class="borderNone"
            label="标题"
            placeholder="测试的"
            width="305px"
            size="small"
            v-model="inputName"
            @focus="InputFocus"
            @blur="inputBlur"
          ></el-input>
        </el-tooltip>
      </div>
    </div>
    <div class="titleLeft">
      <!-- <el-tooltip
        class="item"
        effect="dark"
        content="请输入你设计视频的总时长"
        placement="bottom"
      >
        <div class="animationDuration">
          <img
            src="../../../../assets/image/canvasSvg/animationDuration.svg"
            alt=""
          />
          <span>视频时间设定</span>
          <div
            style="
              width: 70px;
              height: 28px;
              display: flex;
              flex-wrap: nowrap;
              align-items: center;
            "
          >
            <el-form
              :model="animationForm"
              ref="animationForm"
              class="demo-ruleForm"
              style="width: 100%; height: 100%; margin-top: -12px"
            >
              <el-form-item
                prop="animationDuration"
                :rules="[
                  { required: true, message: '视频时长不能为空' },
                  { type: 'number', message: '视频时长必须为数字值' },
                  {
                    pattern: /^(1|[1-9]|[1-2][0-9]|30)$/,
                    message: '范围在1-30',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  size="mini"
                  v-model.number="animationForm.animationDuration"
                  onkeyup="this.value=this.value.replace(/\D/g,'')"
                  onafterpaste="this.value=this.value.replace(/\D/g,'')"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-form>

            <span style="margin-left: 10px">s</span>
          </div>
        </div>
      </el-tooltip> -->

      <el-button @click="preview('h5')">H5预览</el-button>
      <el-button @click="preview('imgae')">图片预览</el-button>
      <el-button @click="publishFun">生成视频</el-button>
      <el-button type="primary" class="save" @click="publishFun"
        >上传</el-button
      >
    </div>

    <!--预览-->

    <makingPanel
      v-if="showMakingPanel"
      :pageData="projectData"
      @closePanel="showMakingPanel = false"
      @saveFn="saveFn"
    />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import editorProjectConfig from '@client/pages/editor/DataModel';
import { isArray, isEmpty, clone, cloneDeep, forEach } from 'lodash';
import $ from 'cash-dom';
import html3canvas from 'html3canvas';
import $bus from '@client/eventBus';
import shortid from 'js-shortid';
import Timeout from 'await-timeout';
import topTool from '@client/pages/editor/components/editor-panel/components/topTool';
import makingPanel from '@client/pages/editor/components/making-panel';
export default {
  components: {
    makingPanel
  },
  data() {
    return {
      historyIndex: -1,
      getCommonStyle: editorProjectConfig.getCommonStyle,
      pagesData: { pages: [] },
      videoData: [],
      widgetHistory: [], // 记录历史记录变动的
      widgetHistoryBack: [], //记录历史记录返回
      inputName: '测试input', //input的名称
      topToolFlag: false, //是否显示重命名
      showMakingPanel: false,
      animationDuration: 0,
      animationForm: {
        animationDuration: 0
      }
    };
  },
  computed: {
    ...mapGetters(['canUndo', 'canRedo', 'activePage']),
    ...mapState({ projectData: (state) => state.editor.projectData }),

    canClickPrev() {
      // 是否能点击上一步
      return this.historyIndex > -1;
    },
    canClickNext() {
      return (
        this.historyIndex < this.widgetHistory.length - 1 &&
        this.widgetHistory.length > 0
      );
    }
  },
  methods: {
    ...mapActions(['editorUndo', 'editorRedo']),
    /**
     * 保存
     */

    async saveFn() {
      const updatePageData = (pageData) => {
        this.$API.updatePage({ pageData }).then(() => {
          this.$message.success('保存成功!');
          this.showMakingPanel = false;
        });
      };
      this.$prompt('请输入标题', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.projectData.title
      })
        .then(({ value }) => {
          const data = { ...this.projectData, title: value };
          updatePageData(data);
        })
        .catch(() => {});
    },
    // ---------------------------- 生成视频
    publishFun() {
      let times = 0;
      this.activePage.elements.forEach((item) => {
        item.animations.forEach((items) => {
          if (times < items.delay + items.duration) {
            times = items.delay + items.duration;
          }
        });
      });
      this.$store.commit('setVideoDuration', times);
      const data = JSON.parse(
        JSON.stringify({ ...this.projectData, isPublish: true })
      );
      data.pages = cloneDeep([this.activePage]);
      this.showMakingPanel = true;
      // this.$API.updatePage({ pageData: data });
      this.$nextTick(() => $bus.$emit('publish'));

      // this.$refs.animationForm.validate((valid) => {
      //   if (valid) {

      //   } else {
      //     return false;
      //   }
      // });
    },
    // --------------------
    // @blur 是当元素失去焦点时所触发的事件
    // @focus是元素获取焦点时所触发的事件
    InputFocus() {
      this.topToolFlag = true;
    },
    inputBlur() {
      this.topToolFlag = false;
    },
    preview(type) {
      this.$bus.$emit('previewCanvas', type);
    },
    previewVideo() {
      this.$emit('publish');
    },
    video() {}
  }
};
</script>

<style lang="scss" scoped>
.mr32 {
  margin-right: 32px;
}
.ml56 {
  margin-left: 56px;
}
.icon {
  width: 19px;
  height: 18px;
  cursor: pointer;
}
.left-item {
  display: flex;
  height: 28px;
  .logo {
    margin-top: 5px;
    height: 20px;
  }
  .operation {
    width: 100px;
    height: 20px;
    margin-top: 4px;
    border-left: 1px solid #f0f0f0;
    border-right: 1px solid #f0f0f0;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    margin-left: 40px;
  }
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 55px;
  padding: 0 25px;
  z-index: 10;
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.12);
  .titleLeft {
    display: flex;
    flex-wrap: nowrap;
  }
  .animationDuration {
    font-size: 14px;
    width: 230px;
    height: 40px;
    background: #fbfbfb;
    border-radius: 4px;
    border: 1px dashed #e0e0e0;
    margin-right: 16px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: center;
    padding: 0 16px;
    img {
      width: 20px;
      height: 20px;
    }
  }
}
.save {
  color: #ffffff;
  // padding: 5px 16px;
  background: #5584ff;
  font-size: 13px;
  border: 0;
}
.main-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  font-weight: 400;
  color: #333333;
  line-height: 22px;
  font-size: 14px;
  width: 126px;

  .sub {
    font-weight: bolder;
    width: 42px;
    font-size: 13px;
    height: 20px;
    line-height: 20px;
  }
  .mr3 {
    margin-right: 3px;
    margin-top: -2px;
  }

  .borderNone /deep/ .el-input__inner {
    border: none;
  }
  .borderNone /deep/ .el-input__inner:hover {
    background: #f5f5f5;
    cursor: pointer;
  }
}
</style>
