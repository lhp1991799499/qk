<template>
  <div
    class="editor-pane"
    id="editor-pane"
    @scroll="editorScroll"
    @click="handleClickCanvas"
    @keyup.esc="handleKeyup"
    :style="{
      left: leftContentShow ? '400px' : '80px',
      paddingTop: editorTop + 'px'
    }"
    ref="editorPane"
  >
    <!-- <div class="editor-pane-inner" ref="editorPaneInner" @scroll="editorScroll"> -->
    <div
      class="editor-main"
      :style="{
        transform: 'scale(' + 1 + ')',
        width: projectData.width * transformScalce + 'px'
      }"
      :key="editorMainKey"
    >
      <!-- height: projectData.height + 'px' -->

      <!-- id="canvas-panel" -->
      <div
        v-for="(items, index) in projectData.pages"
        class="page-preview-wrapper"
        :id="items.uuid"
        ref="canvasPanel"
        :style="
          getCommonStyle(
            {
              ...items.commonStyle,
              zIndex: 1001,
              width: projectData.width
            },
            transformScalce
          )
        "
        :class="[backgroundImageClass(items), canvasDrag(items)]"
        @click.stop.prevent="changeActivePage(items)"
        @mousedown="canvasOnmousedown(items)"
        :pagesIndex="index"
        :key="index"
      >
        <!--页面组件列表展示-->
        <edit-shape
          v-for="item in items.elements &&
          items.elements.filter(
            (e) => e.elName !== 'qk-text' && e.elName !== 'qk-image'
          )"
          :key="item.uuid"
          :uuid="item.uuid"
          :defaultStyle="item.commonStyle"
          :style="
            getCommonStyle(
              {
                width: item.commonStyle.width,
                height: item.commonStyle.height,
                left: item.commonStyle.left,
                top: item.commonStyle.top,
                position: item.commonStyle.position,
                zIndex: item.commonStyle.zIndex
              },
              transformScalce
            )
          "
          @handleElementClick="handleElementClick(item.uuid)"
          @resize="handleElementResize"
          :active="item.uuid === activeElementUUID"
        >
          <component
            :style="
              getCommonStyle(
                { ...item.commonStyle, top: 0, left: 0 },
                transformScalce
              )
            "
            :is="item.elName"
            class="element-on-edit-pane"
            v-bind="item.propsValue"
          /> </edit-shape
        ><!--页面组件列表展示-->
        <edit-shape-text
          v-for="item in items.elements &&
          items.elements.filter(
            (e) => e.elName === 'qk-text' || e.elName === 'qk-image'
          )"
          :key="item.uuid"
          :uuid="item.uuid"
          :defaultStyle="item.commonStyle"
          :style="[
            getCommonStyle(
              {
                left:
                  item.elName == 'qk-text'
                    ? transformScalce * item.commonStyle.left
                    : item.commonStyle.left,
                top:
                  item.elName == 'qk-text'
                    ? transformScalce * item.commonStyle.top
                    : item.commonStyle.top,
                position: item.commonStyle.position,
                zIndex: item.commonStyle.zIndex,
                height: item.commonStyle.height,
                width: item.commonStyle.width,
                fontsize: item.commonStyle.fontsize
              },
              item.elName !== 'qk-text' ? transformScalce : 1
            ),
            item.elName == 'qk-text'
              ? {
                  transform: 'scale(' + transformScalce + ')',
                  transformOrigin: 'left top'
                }
              : {}
          ]"
          :commonStyle="item.commonStyle"
          @handleElementClick="handleElementClick(item.uuid)"
          @resize="handleElementResize"
          :active="item.uuid === activeElementUUID"
          :elName="item.elName"
        >
          <component
            :style="componentStyle(item)"
            :is="item.elName"
            :uuid="item.uuid"
            :webkitMaskStyle="item.commonStyle.webkitMaskStyle"
            :commonStyle="item.commonStyle"
            :imageSrc="item.propsValue.imageSrc"
            class="element-on-edit-pane"
            v-bind="item.propsValue"
          />
        </edit-shape-text>
        <i
          class="select_border"
          v-show="items.uuid === activePageBorderUUID"
        ></i>
        <i
          class="common top"
          v-show="items.uuid === activePageBorderUUID"
          @mousedown.stop="(e) => updateCanvasSize(e, 't')"
        ></i>
        <i
          class="common bottom"
          v-show="items.uuid === activePageBorderUUID"
          @mousedown.stop="(e) => updateCanvasSize(e, 'b')"
        ></i>

        <leftTool
          @scrollTopChange="scrollTopChange"
          :pagesData="items"
          :pagesIndex="index"
        ></leftTool>
        <MarkLine />
        <Grid style="opacity: 0" />
      </div>
      <div class="page-wrapper-mask"></div>
      <topTool style="opacity: 0"></topTool>
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
    <!-- </div> -->
    <el-dialog :visible.sync="previewImgFlag" top="10vh" width="dialogWidth">
      <div
        :style="{
          backgroundSize: 'cover',
          overflow: 'auto'
        }"
      >
        <iframe
          id="iframeH5"
          :src="$config.baseURL + '/quark/view/' + pageId"
          frameborder="0"
          ref="iframe"
          :style="{
            backgroundColor: 'transparent',
            width: projectData.width + 'px',
            height: activePage.commonStyle.height + 'px'
          }"
        ></iframe>
      </div>
    </el-dialog>
    <previewImage
      v-if="previewImageFlag"
      :previewImageList="previewImageList"
      @changepreviewImageFlag="changepreviewImageFlag"
    />
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
import previewImage from './components/previewImage.vue';
import MarkLine from '@client/components/MarkLine/MarkLine.vue';
import Grid from '@client/components/Grid/Grid.vue';
import topTool from '@client/pages/editor/components/editor-panel/components/topTool';
// 导入 html2canvas 和 canvas2svg 库
import html2canvas from 'html2canvas';
import { Canvas } from 'canvas2svg';
import { forEach } from 'lodash';
import { Tooltip } from 'element-ui';
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
    topTool,
    MarkLine,
    Grid,
    previewImage
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
      pageId: '',
      pageIndex: 0, //记录是第几个页面  滚动后改变页面
      scrollHeight: 0, //记录当前页面高度 加上 初始页面的高度的一半
      defaultFlag: true, //默认点击事件  为了防止鼠标拖动元素放大缩小时 移除元素外  触发页面点击事件
      leftContentShow: true, //左侧素材文字主要区域是否显示
      editorTop: 0,
      editorMainKey: 0,
      timer: null, //定时器
      updataScroll: false,
      previewImageFlag: false, //预览图片的弹窗
      previewImageList: [] //预览图片的数据
    };
  },
  computed: {
    ...mapState({
      projectData: (state) => state.editor.projectData,
      activePageUUID: (state) => state.editor.activePageUUID,
      activeElementUUID: (state) => state.editor.activeElementUUID,
      transformScalce: (state) => state.editor.transformScalce,
      activePageBorderUUID: (state) => state.editor.activePageBorderUUID
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
      let both = (editorPaneWidth - this.projectData.width) / 2 - (width + 15);
      let right = both < width ? 16 : both;

      return {
        cid: id,
        right: right + 'px'
      };
    }
  },

  mounted() {
    this.editorPaneWidth = this.$refs.editorPane.offsetWidth;
    this.$bus.$on('imageAnimations', () => {
      let index = 0;
      let arr = [];
      let timer99 = setInterval(
        () => {
          index++;
          const el = document.querySelector('#' + this.activePageUUID);
          html2canvas(el, {
            width: 800,
            height: 800,
            proxy: '/quark/html2canvas/corsproxy' // 设置跨域接口
          }).then((canvas) => {
            let dataURL = canvas.toDataURL('image/jpeg');
            var a = document.createElement('a');
            a.download = '分析报告';
            a.href = dataURL;
            console.log(dataURL, 6666);
            a.click();
            arr.push(dataURL);
          });

          if (index > 10) {
            clearInterval(timer99);
            timer99 = null;
            console.log(arr);
          }
        },
        67,
        10
      );
    });
    this.$bus.$on('previewCanvas', (type) => {
      if (type == 'h5') {
        this.previewH5();
        return;
      }
      // 预览之前清楚所有选中状态
      this.$store.commit('setActivePageUUID', '');
      this.$store.commit('setActiveElementUUID', '');
      this.$nextTick(() => {
        if (type == 'image') {
          this.previewCanvas();
        }
      });
    });

    // 每次撤回都刷新一下这个组件
    this.$bus.$on('refreshEditorMainKey', () => {
      this.editorMainKey++;
    });

    this.$bus.$on('leftContentShow', (val) => {
      this.leftContentShow = val;
    });

    this.$bus.$on('changeUpdataScroll', (val) => {
      this.updataScroll = val;
    });
    // this.$bus.$on('previewVideo', () => {
    //   this.previewVideo();
    // });
  },

  methods: {
    onScaleSize(val) {
      this.scale = val;
      this.editorMainKey++;
    },
    /**
     * 元素被点击
     * @param uuid
     */
    handleElementClick(uuid) {
      let arr = this.projectData.pages.filter((item) => {
        return JSON.stringify(item).indexOf(uuid) !== -1;
      });
      if (arr) {
        this.$store.dispatch('setActivePageUUID', arr[0].uuid);
      }

      this.$store.dispatch('setActiveElementUUID', uuid);
    },
    changeActivePage(item) {
      this.$store.dispatch('setActivePageUUID', item.uuid);
      this.$store.commit('setActivePageBorderUUID', item.uuid);
    },
    /**
     * 移动改变元素大小定位
     * @param pos 当pos有值表示移动中需要实时同步样式变化，pos为undefind时则表示移动结束，记一次历史纪录
     * 鼠标移动完成时才记入历史纪录
     */
    handleElementResize(pos) {
      console.log(pos);
      if (!pos) {
        this.$store.dispatch('addHistoryCache');
        return;
      }
      // this.projectData.pages[this.currentPageIndex].elements[
      //   this.activeElementIndex
      // ].commonStyle.left = pos.left;
      // this.projectData.pages[this.currentPageIndex].elements[
      //   this.activeElementIndex
      // ].commonStyle.top = pos.top;

      // 更新元素commonStyle
      // this.projectData.pages[this.currentPageIndex].elements[
      //   this.activeElementIndex
      // ].commonStyle = {
      //   ...pos
      // };

      // 更新元素commonStyle

      this.$store.commit('resetElementCommonStyle', {
        ...pos
      });
    },
    handleClickCanvas(e) {
      if (
        !e.target.classList.contains('element-on-edit-pane') &&
        !e.target.classList.contains('menu-item-on-edit-panel')
      ) {
        this.$store.dispatch('setActiveElementUUID', '');
      }
      this.$store.commit('setActivePageBorderUUID', '');
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
    canvasToimage(id, w, h) {
      const el = document.querySelector('#' + id);
      return html2canvas(el, {
        width: w,
        height: h,
        proxy: '/quark/html2canvas/corsproxy'
      });
    },

    previewH5() {
      // 加代码是多个页面点击预览，只预览当前选中的页面

      let data = {
        ...this.projectData
      };
      data.pages = [this.activePage];
      this.$API.updatePage({ pageData: data }).then((res) => {
        this.pageId = this.projectData._id;
        this.previewImgFlag = true;
        // 获取 iframe 元素
        this.$nextTick(() => {
          let index = 0;
          const iframe = this.$refs.iframe;
          // 获取 iframe 的原始 src 属性值
          const src = iframe.getAttribute('src');
          // 手动将 src 属性值重新赋值，触发重新加载
          iframe.setAttribute('src', '');
          iframe.setAttribute('src', src);

          var screenshot = document.querySelector('#iframeH5');
          let timer99 = setInterval(
            () => {
              index++;
              // const iframeHtml = this.$refs.iframe.contentWindow; // 获取iframe内容
              // const iframeBody =
              //   iframeHtml.document.getElementsByTagName('body')[0];
              // let a = html2canvas(iframeBody, {
              //   width: 800,
              //   height: 800,
              //   proxy: '/quark/html2canvas/corsproxy'
              // });
              // console.log(a);
              // arr.push(a);
              // console.log(index);
              if (index > 10) {
                // console.log(arr);
                clearInterval(timer99);
                timer99 = null;
                console.log(6666);
              }
            },
            67,
            10
          );
        });
      });
    },
    async previewCanvas() {
      // 遍历数据实现多画布预览  传入uuid 宽度 高度
      this.previewImageList = [];
      let arr = [];
      this.projectData.pages.forEach((item) => {
        let a = this.canvasToimage(
          item.uuid,
          this.projectData.width,
          item.commonStyle.height
        );
        arr.push(a);
      });
      let p = await Promise.all(arr);

      p.forEach((canvas) => {
        let url = canvas.toDataURL('image/jpeg');
        var a = document.createElement('a');
        a.download = '分析报告';
        a.href = url;
        // a.click();
        let obj = {
          url: url,
          height: canvas.height,
          width: canvas.width,
          AdaptiveH:
            canvas.width > canvas.height
              ? (800 / canvas.width) * canvas.height
              : 800, //适配的h和w
          AdaptiveW:
            canvas.width > canvas.height
              ? 800
              : (800 / canvas.width) * canvas.height
        };
        this.previewImageList.push(obj);
      });
      this.previewImageFlag = true;
    },
    //关闭弹窗
    changepreviewImageFlag(flag) {
      this.previewImageFlag = flag;
    },

    // 导出图片
    exportPic(DivID) {
      html2canvas(document.querySelector('#' + DivID), {
        userCORS: true // 配置 useCORS 为 true，后端也需要做 CORS 对应配置
      }).then((canvas) => {
        // userCors:true
        let dataURL = canvas.toDataURL('image/png');
        if (dataURL !== '') {
          var a = document.createElement('a');
          a.download = '分析报告';
          a.href = dataURL;
          console.log(dataURL, 6666);
          a.click();
        }
      });
    },
    dialogWidth() {
      return this.projectData.width + 40 + 'px';
    },
    // 监听滚动高度 判断是那张图片
    editorScroll() {
      if (this.updataScroll) return;

      let st = this.$refs.editorPane.scrollTop;

      // 如果是第一张的时候  滚动高度小于第一张的高度-200 就设置第一张  如果不是第一张 滚动高度超过自身高度加上到顶部的高度-200  就设置当前页面
      for (var i = 0; i < this.$refs.canvasPanel.length; i++) {
        if (i == 0 && st <= this.$refs.canvasPanel[0].offsetHeight - 200) {
          if (this.activePageUUID != this.projectData.pages[0].uuid) {
            this.$store.dispatch(
              'setActivePageUUID',
              this.projectData.pages[0].uuid
            );
            this.$store.commit(
              'setActivePageBorderUUID',
              this.projectData.pages[0].uuid
            );
          }

          return;
        } else if (
          st <=
            this.$refs.canvasPanel[i].offsetTop +
              this.$refs.canvasPanel[i].offsetHeight -
              200 &&
          i !== 0
        ) {
          console.log(22222);
          this.$store.dispatch(
            'setActivePageUUID',
            this.projectData.pages[i].uuid
          );
          this.$store.commit(
            'setActivePageBorderUUID',
            this.projectData.pages[i].uuid
          );
          return;
        }
      }
    },
    // 返回背景颜色
    backgroundImageClass(items) {
      const rgba = items.commonStyle.backgroundColor; // 假设要判断的RGBA颜色值
      // 使用 split() 方法将颜色值拆分成数组
      const alpha = parseFloat(rgba.split(',')[3]);
      let backgroundClass = '';
      if (alpha == 0) {
        backgroundClass = 'backgroundClass';
      }
      return backgroundClass;
    },
    // 是否可以拖拽  如果是当前选中的画布  可以拖拽宽高
    canvasDrag(items) {
      let name = '';
      if (items.uuid == this.activePageUUID) {
        name = 'canvasDrag';
      }
      return name;
    },
    canvasOnmousedown(item) {
      // this.$store.dispatch('setActivePageUUID', item.uuid);
      // var Box = document.getElementsByClassName('canvasDrag')[0];
      // console.log(ev);
      // console.log('点中');
      // //记录鼠标的坐标
      // var x = ev.clientX;
      // var y = ev.clientY;
      // var b = '';
      // //记录box原先的宽高和定位值
      // var W = Box.offsetWidth;
      // var L = Box.offsetLeft;
      // var H = Box.offsetHeight;
      // var T = Box.offsetTop;
      // if (x > Box.offsetLeft + Box.clientWidth - 10) {
      //   //当鼠标落下的地方在box的右边的时候，改变b的值
      //   b = 'right';
      // } else if (x < Box.offsetLeft + 10) {
      //   //当鼠标落下的地方在box的左边的时候，改变b的值
      //   b = 'left';
      // } else if (y > Box.offsetTop + Box.clientHeight - 10) {
      //   //当鼠标落下的地方在box的下边的时候，改变b的值
      //   b = 'bottom';
      // } else if (y < Box.offsetTop + 10) {
      //   //当鼠标落下的地方在box的上边的时候，改变b的值
      //   b = 'top';
      // }
      // let move = (ev) => {
      //   //记录鼠标坐标
      //   var disX = ev.clientX;
      //   var disY = ev.clientY;
      //   //根据b的值来执行不同的动作
      //   //当box缩放到一定程度停止缩放
      //   //box的宽/高度值等于原来的宽/高度加上原先鼠标的坐标值与新的鼠标坐标值之差
      //   //box的定位值等于原来的定位值加上原先鼠标的坐标值与新的鼠标坐标值之差
      //   switch (b) {
      //     case 'bottom':
      //       this.activePage.commonStyle.height = H + disY - y;
      //       if (Box.clientHeight <= 50) {
      //         this.activePage.commonStyle.height = 50;
      //       }
      //       break;
      //     case 'top':
      //       this.activePage.commonStyle.height = H - disY + y;
      //       // this.activePage.commonStyle.top = T + disY - y;
      //       if (Box.clientHeight <= 50) {
      //         this.activePage.commonStyle.height = 50;
      //         // this.activePage.commonStyle.top = T + H - 50;
      //       }
      //       break;
      //   }
      // };
      // let up = () => {
      //   document.onmousemove = null;
      //   document.removeEventListener('mousemove', move, true);
      //   document.removeEventListener('mouseup', up, true);
      // };
      // document.addEventListener('mousemove', move, true);
      // document.addEventListener('mouseup', up, true);
    },

    // 左侧操作的时候 新增复制上移下移让页面显示在主页面
    scrollTopChange(item) {
      let scrollTop = -1; //滚动高度
      //如果是页面上移 滚动高度减去上一个页面的高度
      if (item.type == 'pageUp' && item.pagesIndex != 0) {
        scrollTop =
          this.$refs.editorPane.scrollTop -
          this.projectData.pages[item.pagesIndex - 1].commonStyle.height *
            this.transformScalce;
        this.$bus.$emit('changeLeftToolTop', item.pageIndex);
      } else if (
        item.type == 'pageDown' &&
        item.pagesIndex != this.projectData.pages.length
      ) {
        // 如果是下移  滚动高度就加上当前页面的高度
        scrollTop =
          this.$refs.editorPane.scrollTop +
          this.projectData.pages[item.pagesIndex].commonStyle.height *
            this.transformScalce;
        this.$bus.$emit('changeLeftToolTop', item.pageIndex);
      } else if (item.type == 'addPage' || item.type == 'copyPage') {
        // 如何是新增或者复制  找到新增页面的index 滚动高度加上当前页面的高度
        // scrollTop = this.sumArrayElements(0, item.pagesIndex);
        scrollTop =
          this.$refs.editorPane.scrollTop +
          this.projectData.pages[item.pagesIndex].commonStyle.height *
            this.transformScalce;
      }
      // 如果是删除 不进行任何滚动操作  会自动滚动
      if (item.type != 'deletePage') {
        this.$refs.editorPane.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    },
    componentStyle(item) {
      let obj = { ...item.commonStyle };
      delete obj.width;
      delete obj.height;
      return this.getCommonStyle({
        ...obj,
        top: 0,
        left: 0,
        position: '',
        fontSize: obj.fontSize
      });
    },
    //  修改画布的size
    updateCanvasSize(event, pointname) {
      // pointname 点击的元素的名称
      event.stopPropagation(); // 阻止冒泡
      event.preventDefault(); // 阻止默认事件
      this.updataScroll = true; // 禁止滚筒条选中画布事件
      // 找到当前要修改的画布
      let pageobj = this.projectData.pages.find(
        (page) => page.uuid === this.activePageBorderUUID
      );

      // 首先获取鼠标的位置信息
      let startmouseX = event.clientX; // 起始点横坐标
      let startmouseY = event.clientY; // 起始点纵坐标
      let editorTop = this.editorTop; // 获取当前的 画板的 padding-top 的值
      let canvasheight = pageobj.commonStyle.height; // 获取当前画布的高度

      // 存储坐标点和 坐标名称
      this.mousePoint = {
        startmouseX,
        startmouseY,
        pointName: pointname,
        canvasheight,
        editorTop,
        pageobj
      };

      this.mouseDistanceYCopy = 0;
      // 鼠标按下以后注册鼠标移动事件。
      document.addEventListener('mousemove', this.mouseMove); // 注册鼠标移动事件
      document.addEventListener('mouseup', this.mouseUp); // 注册鼠标抬起事件
    },
    // 鼠标移动之后 计算鼠标移动的距离（ 根据鼠标移动距离计算画布大小）
    mouseMove(event) {
      event.stopPropagation(); // 阻止冒泡
      event.preventDefault(); // 阻止默认事件
      document.onselect = () => false; // 禁止用户选择的网页中的文字
      document.ondragstart = () => false; // 禁止用户拖动元素

      // 获取当前鼠标的 纵坐标点
      let { startmouseY, pointName, canvasheight, editorTop, pageobj } =
        this.mousePoint;

      let mouseY = event.clientY; // 获取鼠标移动的纵坐标

      // 计算鼠标纵坐标移动的距离
      let mouseDistanceY = Number(Math.abs(mouseY - startmouseY));

      // 拷贝一份 画布的配置项目
      var changeProjectData = JSON.parse(JSON.stringify(this.projectData));
      // -------
      var mouseYY = 0;
      mouseYY = event.clientY;
      var viewportHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      var distanceToViewportTop = viewportHeight - mouseYY;

      // ----

      // 顶部拉伸事件
      let topEvent = () => {
        // 判断鼠标有没有移出画布
        if (window.innerHeight - 80 <= distanceToViewportTop) {
          if (!this.timer) {
            this.timer = setInterval(() => {
              changeProjectData.pages.forEach((page) => {
                // 判断当前要修改的画布
                if (page.uuid === this.activePageBorderUUID) {
                  page.commonStyle.height++; //
                  page.elements.forEach((item, index) => {
                    item.commonStyle.top++;
                  });

                  this.mouseDistanceYCopy = mouseDistanceY;
                  if (mouseY - startmouseY > 0) {
                    // 修改当前 top值
                    this.editorTop =
                      editorTop + Math.abs((mouseY - startmouseY) / 3) > 0
                        ? editorTop + Math.abs((mouseY - startmouseY) / 3)
                        : 0;
                  } else {
                    this.editorTop =
                      editorTop - Math.abs((mouseY - startmouseY) / 3) > 0
                        ? editorTop - Math.abs((mouseY - startmouseY) / 3)
                        : 0;
                  }
                }
              });
              this.$store.commit('setPrjectData', {
                ...changeProjectData
              });

              console.log(
                changeProjectData.pages[0].commonStyle,
                '定时器的画布数据'
              );
            });
          }
        } else {
          if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            let pageobj = this.projectData.pages.find(
              (page) => page.uuid === this.activePageBorderUUID
            );
            this.mousePoint.canvasheight = pageobj.commonStyle.height; // 同步当前画布的高度
            this.mousePoint.editorTop = this.editorTop; // 同步一下当前画布的top值
            this.mousePoint.pageobj = pageobj;
            changeProjectData = JSON.parse(JSON.stringify(this.projectData)); // 在他的基础上增加
          }

          changeProjectData.pages.forEach((page) => {
            if (page.uuid === this.activePageBorderUUID) {
              page.commonStyle.height =
                startmouseY > mouseY
                  ? Number(canvasheight) + mouseDistanceY
                  : Number(canvasheight) - mouseDistanceY;

              // 计算当前画布的top值 和 当前画布内元素的top值
              if (page.commonStyle.height < 0) {
                page.commonStyle.height = 20;
              } else {
                this.mouseDistanceYCopy = mouseDistanceY;
                // 判断鼠标是上移还是下移
                if (mouseY - startmouseY > 0) {
                  // 修改当前 top值
                  if (changeProjectData.pages.length > 1) {
                    this.editorTop = 0;
                  } else {
                    this.editorTop =
                      editorTop + Math.abs((mouseY - startmouseY) / 3) > 0
                        ? editorTop + Math.abs((mouseY - startmouseY) / 3)
                        : 0;
                  }
                  page.elements.forEach((item, index) => {
                    item.commonStyle.top =
                      pageobj.elements[index].commonStyle.top - mouseDistanceY;
                  });
                } else {
                  if (changeProjectData.pages.length > 1) {
                    this.editorTop = 0;
                  } else {
                    this.editorTop =
                      editorTop - Math.abs((mouseY - startmouseY) / 3) > 0
                        ? editorTop - Math.abs((mouseY - startmouseY) / 3)
                        : 0;
                  }
                  page.elements.forEach((item, index) => {
                    item.commonStyle.top =
                      pageobj.elements[index].commonStyle.top + mouseDistanceY;
                  });
                }
              }
            }
          });

          // 修改vuex 中的 setProjectData 中的值
          this.$store.commit('setPrjectData', {
            ...changeProjectData
          });
        }
      };
      // 底部拉伸事件 1111
      let bottomEvent = () => {
        if (distanceToViewportTop < 20) {
          if (this.timer) return;
          this.timer = setInterval(() => {
            changeProjectData.pages.forEach((page) => {
              // 判断当前要修改的画布
              if (page.uuid === this.activePageBorderUUID) {
                page.commonStyle.height++;
                //  page.elements.forEach((item, index) => {
                //        item.commonStyle.top = item.commonStyle.top++
                //  });
              }
            });
            this.$refs.editorPane.scrollTop++;
            // 修改当前的画布尺寸
            this.$store.commit('setPrjectData', {
              ...changeProjectData
            });
          });
        } else {
          if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            let pageobj = this.projectData.pages.find(
              (page) => page.uuid === this.activePageBorderUUID
            );
            this.mousePoint.canvasheight = pageobj.commonStyle.height; // 同步当前画布的高度
            this.mousePoint.editorTop = this.editorTop; // 同步一下当前画布的top值
            changeProjectData = JSON.parse(JSON.stringify(this.projectData)); // 在他的基础上增加
          }
          // this.$refs.editorPane.scrollTop =   this.$refs.editorPane.scrollTop + ;
          // console.log( this.$refs.editorPane.scrollTop, 'FFFFFFFFFFF--------FFFFF');
          changeProjectData.pages.forEach((page) => {
            if (page.uuid === this.activePageBorderUUID) {
              page.commonStyle.height =
                mouseY - startmouseY > 0
                  ? Number(canvasheight) +
                    Number(Math.abs(mouseY - startmouseY))
                  : Number(canvasheight) -
                    Number(Math.abs(mouseY - startmouseY));

              // ------------- 计算当前的画布top值 与画布元素的top值
              if (page.commonStyle.height < 0) {
                page.commonStyle.height = 20;
              } else {
                if (mouseY - startmouseY > 0) {
                  this.editorTop =
                    editorTop - mouseDistanceY / 3 > 0
                      ? editorTop - mouseDistanceY / 3
                      : 0;
                } else {
                  this.editorTop =
                    editorTop + mouseDistanceY / 4 > 0
                      ? editorTop + mouseDistanceY / 4
                      : 0;
                }
              }
            }
          });

          // 最后设置当前的画布尺寸
          this.$store.commit('setPrjectData', {
            ...changeProjectData
          });
        }
      };

      // 找到属性对应的方法 减少使用 if else 做判断
      let obj = { t: topEvent, b: bottomEvent };

      // 如果事件存在就执行
      obj[pointName] && obj[pointName]();
    },

    // 鼠标抬起 清除当前鼠标的事件
    mouseUp(event) {
      event.stopPropagation();
      event.preventDefault();
      this.$bus.$emit('changeLeftToolTop', true);
      this.$bus.$emit('changeTotalH');
      clearInterval(this.timer);
      this.timer = null;
      this.$store.dispatch('addHistoryCache');
      document.removeEventListener('mousemove', this.mouseMove);
      document.removeEventListener('mouseup', this.mouseUp);
      console.log(this.$refs.editorPane.style.paddingTop);

      this.$nextTick(() => {
        setTimeout(() => {
          this.editorTop = 0;
          this.updataScroll = false;
        }, 1000);
      });
    }
  },
  beforeDestroy() {
    this.$bus.$off('previewCanvas');
    this.$bus.$off('changeUpdataScroll');
    this.$bus.$off('leftContentShow');
  }
};
</script>

<style lang="scss" scoped>
.editor-pane {
  position: absolute;
  top: 55px;
  left: 400px;
  right: 320px;
  bottom: 0;
  overflow: auto;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

.editor-pane-inner {
  // width: 800px;
  // height: 800px;
  // margin: 0 auto;
  // box-sizing: initial;
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
  // height: 800px;
  position: relative;
  overflow: hidden; //溢出隐藏，不然出现多个图层后，下面的图层模块能拖动到上个图层中
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
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  text-align: center;
}
.backgroundClass {
  background-image: linear-gradient(45deg, #ccc 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, #ccc 0),
    linear-gradient(45deg, #ccc 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, #ccc 0);
  background-position: 0 0, 6px 6px, 6px 6px, 12px 12px;
  background-size: 12px 12px !important;
}
.canvasDrag {
  // border-bottom: 15px solid red;
  // border-top: 15px solid red;
}
.select_border {
  width: 100%;
  height: 100%;
  border-left: 2px solid #5584ff;
  border-right: 2px solid #5584ff;
  border-top: 6px solid #5584ff;
  border-bottom: 6px solid #5584ff;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 100;
  box-sizing: border-box;
}
.common {
  width: 24px;
  height: 4px;
  background-color: #fff;
  border-radius: 2px;
  z-index: 9999;
}
.top {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 1px;
}
.bottom {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 1px;
}
.common:hover {
  cursor: ns-resize;
}
</style>
