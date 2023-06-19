<template>
  <div
    class="editor-pane"
    id="editor-pane"
    @click="handleClickCanvas"
    @keyup.esc="handleKeyup"
    ref="editorPane"
  >
    <div class="editor-pane-inner">
      <div
        class="editor-main"
        :style="{
          transform: 'scale(' + scale + ')',
          width: projectData.width + 'px',
          height: projectData.height + 'px'
        }"
      >
        <!-- id="canvas-panel" -->
        <div
          v-for="(items, index) in projectData.pages"
          class="page-preview-wrapper"
          id="page-preview-wrapper"
          ref="canvas-panel"
          :style="getCommonStyle(activePage.commonStyle)"
          @click="changeActivePage(items)"
          :key="index"
        >
          <!--页面组件列表展示-->
          <edit-shape
            v-for="item in activePage.elements &&
            activePage.elements.filter(
              (e) => e.elName !== 'qk-text' && e.elName !== 'qk-image'
            )"
            :key="item.uuid"
            :uuid="item.uuid"
            :defaultStyle="item.commonStyle"
            :style="
              getCommonStyle({
                width: item.commonStyle.width,
                height: item.commonStyle.height,
                left: item.commonStyle.left,
                top: item.commonStyle.top,
                position: item.commonStyle.position,
                zIndex: item.commonStyle.zIndex
              })
            "
            @handleElementClick="handleElementClick(item.uuid)"
            @resize="handleElementResize"
            :active="item.uuid === activeElementUUID"
          >
            <component
              :style="getCommonStyle({ ...item.commonStyle, top: 0, left: 0 })"
              :is="item.elName"
              class="element-on-edit-pane"
              v-bind="item.propsValue"
            /> </edit-shape
          ><!--页面组件列表展示-->
          <edit-shape-text
            v-for="item in activePage.elements &&
            activePage.elements.filter(
              (e) => e.elName === 'qk-text' || e.elName === 'qk-image'
            )"
            :key="item.uuid"
            :uuid="item.uuid"
            :defaultStyle="item.commonStyle"
            :style="
              getCommonStyle({
                width: item.commonStyle.width,
                height: item.commonStyle.height,
                left: item.commonStyle.left,
                top: item.commonStyle.top,
                position: item.commonStyle.position,
                zIndex: item.commonStyle.zIndex
              })
            "
            @handleElementClick="handleElementClick(item.uuid)"
            @resize="handleElementResize"
            :active="item.uuid === activeElementUUID"
            :elName="item.elName"
          >
            <component
              :style="getCommonStyle({ ...item.commonStyle, top: 0, left: 0 })"
              :is="item.elName"
              class="element-on-edit-pane"
              v-bind="item.propsValue"
            />
          </edit-shape-text>
          <leftTool :pagesData="items" :pagesIndex="index"></leftTool>
        </div>
        <div class="page-wrapper-mask"></div>
        <topTool></topTool>
      </div>
      <div
        class="page-wrapper-menu-operation menu-item-on-edit-panel"
        :style="getMenuOptionsPositionStyle"
        :class="{ active: activeElementUUID }"
        style="display: none"
      >
        <!--         style="display: none"  代码在上面移下来 -->
        <el-tooltip
          v-for="(item, index) in menuOptions"
          :key="index"
          effect="dark"
          :content="item.title"
          placement="right"
        >
          <div
            class="menu-item menu-item-on-edit-panel"
            @click="handleElementCommand(item.value)"
          >
            <i class="menu-item-on-edit-panel" :class="[item.icon]"></i>
          </div>
        </el-tooltip>
      </div>

      <control-editor-panel
        :scale="scale"
        @onScaleSize="onScaleSize"
      ></control-editor-panel>
    </div>
    <el-dialog
      title="预览图片"
      :visible.sync="previewImgFlag"
      top="10vh"
      width="400px"
    >
      <div
        style="
          background-size: cover;
          top: 0px;
          height: 667px;
          width: 375px;
          position: relative;
        "
      >
        <iframe
          :src="$config.baseURL + '/quark/view/' + pageId"
          frameborder="0"
          ref="iframe"
          style="background-color: transparent; width: 100%; height: 100%"
        ></iframe>
      </div>

      <!-- <img :src="previewImgUrl" alt="" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewImgFlag = false">取 消</el-button>
        <el-button type="primary" @click="downloadImg">下 载</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { _qk_register_components_object } from '@client/plugins/index';
import editorProjectConfig from '@client/pages/editor/DataModel';
import editShape from '@/components/edit-shape';
import editShapeText from '@/components/edit-shape-text';
import { mapState, mapGetters } from 'vuex';
import html3canvas from 'html3canvas';
import controlEditorPanel from '../control-editor-panel.vue';
import leftTool from './components/leftTool.vue';

import topTool from '@client/pages/editor/components/editor-panel/components/topTool';
// 导入 html2canvas 和 canvas2svg 库
import html2canvas from 'html2canvas';
import { Canvas } from 'canvas2svg';
import { forEach } from 'lodash';

// todo 测试用
window._qk_register_components_object = _qk_register_components_object;
export default {
  props: {},
  components: {
    // 批量注册qk组件
    ..._qk_register_components_object,
    // 画板组件
    [editShape.name]: editShape,
    [editShapeText.name]: editShapeText,
    controlEditorPanel,
    leftTool,
    topTool
  },
  data() {
    return {
      scale: 1,
      getCommonStyle: editorProjectConfig.getCommonStyle,
      menuOptions: [
        {
          title: '复制',
          icon: 'iconfont iconfuzhi',
          value: 'copy'
        },
        {
          title: '删除',
          icon: 'iconfont iconshanchu',
          value: 'delete'
        },
        {
          title: '字体放大',
          icon: 'iconfont iconzitifangda',
          value: 'fontA+'
        },
        {
          title: '字体缩小',
          icon: 'iconfont iconzitisuoxiao',
          value: 'fontA-'
        },
        {
          title: '字体加粗',
          icon: 'iconfont iconzitijiacu',
          value: 'fontB'
        },
        {
          title: '字体加下划线',
          icon: 'iconfont iconzitijiaxiahuaxian',
          value: 'fontULine'
        },
        {
          title: '字体加中划线',
          icon: 'iconfont iconzitijiazhonghuaxian',
          value: 'fontCLine'
        },
        {
          title: '图层上移',
          icon: 'iconfont iconziyuan1',
          value: 'layerUp'
        },
        {
          title: '图层下移',
          icon: 'iconfont iconxiayiyiceng',
          value: 'layerDown'
        },
        {
          title: '图层置顶',
          icon: 'iconfont iconcontrol-top',
          value: 'layerTop'
        },
        {
          title: '图层置底',
          icon: 'iconfont iconcontrol-bottom',
          value: 'layerBottom'
        }
      ],
      editorPaneWidth: 0,
      videoSrc: '', //预览视频的路径
      previewImgFlag: false, //预览视频的弹窗
      previewImgUrl: '',
      pageId: ''
    };
  },
  computed: {
    ...mapState({
      projectData: (state) => state.editor.projectData,
      activePageUUID: (state) => state.editor.activePageUUID,
      activeElementUUID: (state) => state.editor.activeElementUUID
    }),
    ...mapGetters([
      'currentPageIndex',
      'activeElementIndex',
      'activeElement',
      'activePage'
    ]),

    getMenuOptionsPositionStyle() {
      const width = 60;
      const id = this.activeElementUUID;

      const editorPaneWidth = this.$refs.editorPane
        ? this.$refs.editorPane.offsetWidth
        : 0;
      let both =
        (editorPaneWidth - this.projectData.width * this.scale) / 2 -
        (width + 15);
      let right = both < width ? 16 : both;

      return {
        cid: id,
        right: right + 'px'
      };
    }
  },

  mounted() {
    this.editorPaneWidth = this.$refs.editorPane.offsetWidth;

    this.$bus.$on('previewCanvas', () => {
      this.previewCanvas();
    });
    // this.$bus.$on('previewVideo', () => {
    //   this.previewVideo();
    // });
  },

  methods: {
    onScaleSize(val) {
      this.scale = val;
    },
    /**
     * 元素被点击
     * @param uuid
     */
    handleElementClick(uuid) {
      this.$store.dispatch('setActiveElementUUID', uuid);
    },
    changeActivePage(item) {
      this.$store.dispatch('setActivePageUUID', item.uuid);
    },
    /**
     * 移动改变元素大小定位
     * @param pos 当pos有值表示移动中需要实时同步样式变化，pos为undefind时则表示移动结束，记一次历史纪录
     * 鼠标移动完成时才记入历史纪录
     */
    handleElementResize(pos) {
      if (!pos) {
        this.$store.dispatch('addHistoryCache');
        return;
      }
      this.projectData.pages[this.currentPageIndex].elements[
        this.activeElementIndex
      ].commonStyle.left = pos.left;
      // 更新元素commonStyle
      this.projectData.pages[this.currentPageIndex].elements[
        this.activeElementIndex
      ].commonStyle = {
        ...pos
      };
    },
    handleClickCanvas(e) {
      if (
        !e.target.classList.contains('element-on-edit-pane') &&
        !e.target.classList.contains('menu-item-on-edit-panel')
      ) {
        this.$store.dispatch('setActiveElementUUID', '');
      }
    },
    /**
     * 对元素进行操作命令
     */
    handleElementCommand(command) {
      this.$store.dispatch('elementCommand', command);
    },
    /**
     * 监听键盘事件
     * @param e
     */
    handleKeyup(e) {},
    /**
     * 提供截屏作为项目主图
     */
    screenshots() {
      const el = document.querySelector('#canvas-panel');
      html3canvas(el, {
        width: 375,
        height: 667,
        proxy: '/quark/html2canvas/corsproxy' // 设置跨域接口
      }).then((canvas) => {
        let url = canvas.toDataURL('image/jpeg');
        this.$store.commit('updateCoverImage', url);
      });
    },
    previewCanvas() {
      this.$API.updatePage({ pageData: this.projectData }).then((res) => {
        this.pageId = this.projectData._id;
        this.previewImgFlag = true;
        // 获取 iframe 元素
        const iframe = this.$refs.iframe;
        // 获取 iframe 的原始 src 属性值
        const src = iframe.getAttribute('src');
        // 手动将 src 属性值重新赋值，触发重新加载
        iframe.setAttribute('src', '');
        iframe.setAttribute('src', src);
      });
    },
    // previewVideo() {
    //   //使用html2canvas库将div转换为canvas
    //   html2canvas(document.querySelector('#editor-pane-inner')).then(
    //     (canvas) => {
    //       //获取视频的宽度和高度
    //       const width = canvas.width;
    //       const height = canvas.height;
    //       //创建一个新的canvas元素，用于渲染视频
    //       const videoCanvas = document.createElement('canvas');
    //       videoCanvas.width = width;
    //       videoCanvas.height = height;
    //       //将div转换的canvas绘制到新的canvas中
    //       const ctx = videoCanvas.getContext('2d');
    //       ctx.drawImage(canvas, 0, 0, width, height);
    //       //将canvas转换为视频
    //       const stream = videoCanvas.captureStream();
    //       const mediaRecorder = new MediaRecorder(stream);
    //       const chunks = [];
    //       //开始录制
    //       mediaRecorder.start();
    //       mediaRecorder.duration = 5000; // 设置视频时长为5秒

    //       //监听录制数据
    //       mediaRecorder.ondataavailable = (e) => {
    //         chunks.push(e.data);
    //       };
    //       //停止录制
    //       mediaRecorder.onstop = () => {
    //         const blob = new Blob(chunks, { type: 'video/webm' });
    //         //将Blob转换为URL
    //         const url = URL.createObjectURL(blob);
    //         //在页面上显示视频
    //         // const video = document.createElement('video');
    //         // video.src = url;
    //         console.log(url);
    //         // document.body.appendChild(video);
    //         this.videoSrc = url;
    //         this.previewImgFlag = true;
    //       };
    //       setTimeout(() => {
    //         mediaRecorder.stop();
    //       }, 5000);
    //       //录制5秒钟
    //     }
    //   );
    // },
    // 下载图片
    downloadImg() {
      const creatDom = document.createElement('a');
      document.body.appendChild(creatDom);
      creatDom.href = this.previewImgUrl;
      creatDom.download = '图片';
      creatDom.click();
      this.previewImgFlag = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.editor-pane {
  // height: 100%;
  min-height: 800px;
  max-height: 850px;
  // width: 100%;
  width: calc(100vw - 746px);
  border: 1px solid #f5f5f5;
  background-color: #eef2f8;
  border-width: 0 1px;
  overflow: auto;
  // background-image: linear-gradient(
  //     45deg,
  //     #f5f5f5 25%,
  //     transparent 0,
  //     transparent 75%,
  //     #f5f5f5 0
  //   ),
  //   linear-gradient(
  //     45deg,
  //     #f5f5f5 25%,
  //     transparent 0,
  //     transparent 75%,
  //     #f5f5f5 0
  //   );
  background-position: 0 0, 13px 13px;
  background-size: 26px 26px;
  display: flex;
  justify-content: center;
}

.editor-pane-inner {
  height: 100%;
  width: 100%;
  overflow: auto;
  padding: 20px;
}

.editor-main {
  border-radius: 3px;
  box-shadow: 0 3px 10px #dcdcdc;
  margin: 25px auto;
  position: relative;
  background: white;
  transform-origin: center top;
  // background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAgMAAAC5h23wAAAAAXNSR0IB2cksfwAAAAlQTFRF9fX18PDwAAAABQ8/pgAAAAN0Uk5T/yIA41y2EwAAABhJREFUeJxjYIAC0VAQcGCQWgUCDUONBgDH8Fwzu33LswAAAABJRU5ErkJggg==");
}

.page-preview-wrapper {
  height: 800px;
  position: relative;
}

.page-wrapper-mask {
  height: 100%;
  width: 100%;
  z-index: 1000;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  outline: rgba(236, 238, 240, 0.77) solid 10000px;
}

.element-on-edit-pane {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.page-wrapper-menu-operation {
  position: absolute;
  right: 0;
  top: 45px;
  width: 0;
  background: white;
  color: #333;
  text-align: center;
  z-index: 1002;
  border-radius: 4px;
  // display: none;
  transition: all 0.28s;
  // opacity: 0;
  .menu-item {
    padding: 10px;
    cursor: pointer;
    &.i {
      font-size: 24px;
      line-height: 30px;
    }
    &:hover {
      background: rgba(37, 165, 137, 0.09);
      color: $primary;
      &.i {
        font-weight: bold;
        font-size: 26px;
      }
    }
  }
  &.active {
    display: block;
    width: 60px;
    opacity: 1;
  }
}
</style>
