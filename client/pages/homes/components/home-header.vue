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
    <div>
      <el-button @click="preview">预览</el-button>
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
      showMakingPanel: false
    };
  },
  computed: {
    ...mapGetters(['canUndo', 'canRedo']),
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
    // ----------------------------
    publishFun() {
      const data = { ...this.projectData, isPublish: true };
      this.showMakingPanel = true;
      this.$API.updatePage({ pageData: data });
      this.$nextTick(() => $bus.$emit('publish'));
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
    preview() {
      this.$bus.$emit('previewCanvas', 111);
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
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.12);
  padding-left: 24px;
  padding-right: 24px;
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
