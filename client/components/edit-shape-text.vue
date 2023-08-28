<template>
  <!-- 父元素设置鼠标点击穿透问题 子元素恢复  因为有两个tranform要绑定  父元素绑定·动画  子元素绑定旋转  导致父元素实质上并未发生旋转  点击依旧会触发点击事件  选不中下面的其它元素 -->
  <div id="components" style="pointer-events: none">
    <div
      class="components-edit-shape"
      @click="handleTopWrapperClick"
      @mousedown="handleMouseDownOnElement"
      :class="{ active: this.active }"
      :style="
        getCommonStyle(
          {
            transform: `rotate(${commonStyle.rotate}deg)`,

            height: commonStyle.height,
            width: commonStyle.width,
            writingMode: commonStyle.writingMode,
            pointerEvents: 'auto'
          },
          elName != 'qk-text' ? transformScalce : 1
        )
      "
      ref="activeDom"
    >
      <div
        ref="componentsEditShapeContent"
        id="componentsEditShapeContent"
        :style="{
          height: elName != 'qk-text' ? '100%' : '', //不是文字就让宽高随父元素 图片撑起整个元素  设置百分百
          width: elName != 'qk-text' ? '100%' : ''
        }"
      >
        <slot> </slot>
      </div>

      <div
        class="edit-shape-point"
        v-for="item in active
          ? elName == 'qk-text' // 如果是文字
            ? commonStyle.writingMode //如果进行横竖拍列
              ? pointListTextWritingMode //横竖排列的数组
              : pointListText //文字正常数组
            : pointList //图片用的八个点位的数组
          : []"
        :key="item"
        @mousedown.stop.prevent="handleMouseDownOnPoint($event, item)"
        :style="getPointStyle(item)"
      ></div>
      <div v-if="commonStyle.lock && active" @click="lockClick" class="lockImg">
        <el-tooltip content="点击解除锁定" placement="bottom">
          <img src="../../assets/image/canvasSvg/lock.svg" alt="" />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import runAnimations from '@client/common/js/runAnimations';
import $bus from '@client/eventBus';
import { mapGetters, mapState } from 'vuex';
import editorProjectConfig from '@client/pages/editor/DataModel';
import { divide } from 'lodash';
import calculateComponentPositonAndSize, {
  updataElementFontSize
} from '@client/utils/calculateComponentPositonAndSize.js';

import { mod360 } from '@client/utils/translate.js';
export default {
  name: 'EditShapeText',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    defaultStyle: {
      require: true,
      type: Object
    },
    uuid: String,
    elName: String,
    commonStyle: Object
  },
  computed: {
    ...mapState({
      projectData: (state) => state.editor.projectData,
      activePageUUID: (state) => state.editor.activePageUUID,
      activeElementUUID: (state) => state.editor.activeElementUUID,
      transformScalce: (state) => state.editor.transformScalce,
      editor: (state) => state.editor.editor
    }),
    ...mapGetters(['activePage', 'activeElement'])
  },
  data() {
    return {
      showActive: this.active,
      getCommonStyle: editorProjectConfig.getCommonStyle,
      rotatable: true,
      resizable: false,
      // l = left, t = top, r = right, b = bottom
      pointList: ['lt', 'rt', 'lb', 'rb', 'l', 'r', 't', 'b', 'c'],
      pointListText: ['lt', 'rt', 'lb', 'rb', 'l', 'r', 'c'],
      pointListTextWritingMode: ['lt', 'rt', 'lb', 'rb', 't', 'b', 'c'],
      pointLists: ['lt', 'lt', 'lb', 'rb', 'l', 'r', 't', 'b'], // 八个方向
      initialAngle: {
        // 每个点对应的初始角度
        lt: 0,
        t: 45,
        rt: 90,
        r: 135,
        rb: 180,
        b: 225,
        lb: 270,
        l: 315
      },
      angleToCursor: [
        // 每个范围的角度对应的光标
        { start: 338, end: 23, cursor: 'nw' },
        { start: 23, end: 68, cursor: 'n' },
        { start: 68, end: 113, cursor: 'ne' },
        { start: 113, end: 158, cursor: 'e' },
        { start: 158, end: 203, cursor: 'se' },
        { start: 203, end: 248, cursor: 's' },
        { start: 248, end: 293, cursor: 'sw' },
        { start: 293, end: 338, cursor: 'w' }
      ],
      // 光标问题
      cursors: {},
      // 上下左右 对应的 东南西北
      directionKey: {
        t: 'n',
        b: 's',
        l: 'w',
        r: 'e'
      },

      rotateDeg: 0,
      targetText: '',
      animatePlaying: false
    };
  },
  mounted() {
    this.animatePlaying = false;
    this.rotateDeg = this.commonStyle.rotate;
    $bus.$on('RUN_ANIMATIONS', (uuid, animations, animation) => {
      if (uuid !== this.uuid) {
        return;
      }
      // 正在执行的动画不允许插入新动画
      if (this.animatePlaying) return;
      let cssText = this.$el.style.cssText;
      this.animatePlaying = true;
      runAnimations(this.$el, animations, true, animation, () => {
        this.$el.style.cssText = cssText;
        this.animatePlaying = false;
      });
    });
    if (this.activeElement) this.cursors = this.getCursor(); // 根据旋转角度获取光标位置
    this.$bus.$on('resetComponentsEditShape', this.resetComponentsEditShape);
  },
  methods: {
    /**
     * 获取point计算后样式
     * @param point
     * @returns {{}}
     */
    getPointStyle(point) {
      const pos = this.defaultStyle;
      const height = pos.height;
      const width = pos.width;
      let hasT = /t/.test(point);
      let hasB = /b/.test(point);
      let hasL = /l/.test(point);
      let hasR = /r/.test(point);
      let hasC = /c/.test(point);
      let hasLT = /lt/.test(point);
      let hasLB = /lb/.test(point);
      let hasRT = /rt/.test(point);
      let hasRB = /rb/.test(point);
      let newLeft = 0;
      let newTop = 0;
      let newWidth = 10;
      let newHeight = 10;
      let ml = ''; //marginLeft
      let mt = '-5px'; //marginTop
      if (point.length === 2) {
        newLeft = hasL ? 0 : width;
        newTop = hasT ? 0 : height;

        if (hasRT || hasRB) {
          ml = '-3.5px';
        } else if (hasLT || hasLB) {
          ml = '-5.5px';
        }
      } else {
        // !#zh 上下点，宽度固定在中间
        if (hasT || hasB) {
          newLeft = width / 2;
          newTop = hasT ? 1 : height + 3;
          newWidth = 10;
          newHeight = 10;
          ml = '-6px';
          mt = '-6px';
        }
        // !#zh 左右点，高度固定在中间
        if (hasL || hasR) {
          newLeft = hasL ? 1 : width + 3;
          newTop = height / 2 - 6;

          newWidth = 10;
          newHeight = 10;
          if (hasL) {
            ml = '-7px';
          } else {
            ml = '-6.5px';
          }
        }
        // 旋转点
        if (hasC) {
          newLeft = width / 2 - 5;
          newTop = height + 20;
          newWidth = 30;
          newHeight = 30;
        }
      }
      const style = {
        marginLeft: hasL || hasR || hasT || hasB ? ml : 0,
        marginTop: hasT || hasB ? mt : '1px',
        left: `${
          this.elName !== 'qk-text' ? newLeft * this.transformScalce : newLeft
        }px`,
        top: `${
          this.elName !== 'qk-text' ? newTop * this.transformScalce : newTop
        }px`,
        height: `${newHeight}px`,
        width: `${newWidth}px`,
        cursor: this.cursors[point]
      };
      if (hasC) {
        style.backgroundImage =
          'url(' + require('../../assets/image/canvasSvg/zhuan.svg') + ')';
        style.border = 'none';
        style.marginLeft = '-10.5px';
        style.marginTop = '-10.5px';
        style.backgroundColor = 'transparent';
      }
      return style;
    },
    /**
     * 点击事件，点击后设置当前元素为选中元素
     */
    handleTopWrapperClick(e) {
      // console.log(e);
      e.stopPropagation();
      e.preventDefault();
    },
    /**
     * 鼠标选中元素拖拽事件
     * @param e
     */
    handleMouseDownOnElement(e) {
      this.$emit('handleElementClick');
      this.cursors = this.getCursor(); // 根据旋转角度获取光标位置
      // 锁住 页面的的点击事件不让触发

      console.log('选中元素', e);
      // console.log(JSON.stringify(this.projectData));
      this.$store.commit('setActivePageBorderUUID', '');
      this.$bus.$emit('labelTypeChange', e.target._prevClass);
      // 抛出事件让父组件设置当前元素选中状态
      const pos = { ...this.defaultStyle };
      // 如果是锁定状态  就不走任何步骤
      if (pos.lock) return;
      let startY = e.clientY;
      let startX = e.clientX;
      let startTop = pos.top;
      let startLeft = pos.left;
      let firstTime = '',
        lastTime = '';
      firstTime = new Date().getTime();
      let move = (moveEvent) => {
        // !#zh 移动的时候，不需要向后代元素传递事件，只需要单纯的移动就OK
        moveEvent.stopPropagation();
        moveEvent.preventDefault();
        let currX = moveEvent.clientX; //鼠标x轴
        let currY = moveEvent.clientY; //鼠标Y轴
        let scalce = this.transformScalce; //如果是文字  就用缩放  不进行计算  如果是其他的 移动比例计算
        // this.elName != 'qk-text'
        //   ? (scalce = this.transformScalce)
        //   : (scalce = this.transformScalce);
        pos.top = (currY - startY) / scalce + startTop;
        pos.left = (currX - startX) / scalce + startLeft;
        this.$emit('resize', pos);
        // 如果不使用 $nextTick，吸附后将无法移动
        this.$nextTick(() => {
          // 触发元素移动事件，用于显示标线、吸附功能
          // 后面两个参数代表鼠标移动方向
          // curY - startY > 0 true 表示向下移动 false 表示向上移动
          // curX - startX > 0 true 表示向右移动 false 表示向左移动
          this.$bus.$emit('move', currY - startY > 0, currX - startX > 0);
        });
      };
      let up = () => {
        lastTime = new Date().getTime();
        if (lastTime - firstTime > 200) {
          this.$emit('resize');
        }
        // 触发元素停止移动事件，用于隐藏标线
        this.$bus.$emit('unmove');
        document.removeEventListener('mousemove', move, true);
        document.removeEventListener('mouseup', up, true);
      };
      document.addEventListener('mousemove', move, true);
      document.addEventListener('mouseup', up, true);
      return true;
    },

    /**
     * 鼠标点击可以的按钮resize事件
     * @param point
     * @param downEvent
     */
    handleMouseDownOnPoint(e, point) {
      e.stopPropagation();
      e.preventDefault();
      this.lockPageClick(); // 不让事件冒泡到 外面
      this.cursors = this.getCursor(); // 根据旋转角度获取光标位置
      if (point == 'c') {
        this.handleRotate(e);
        return;
      }

      this.$store.commit('getEditor', this.activePageUUID);
      const style = { ...this.defaultStyle };
      let width = style.width;
      let scalce = this.transformScalce; //如果是文字  就用缩放  不进行计算  如果是其他的 移动比例计算
      style.width = style.width * scalce;
      style.height = style.height * scalce;
      style.left = style.left * scalce;
      style.top = style.top * scalce;

      // 组件宽高比
      const proportion = style.width / style.height;
      // 组件中心点
      const center = {
        x: style.left + style.width / 2,
        y: style.top + style.height / 2
      };

      // 获取画布位移信息
      const editorRectInfo = this.editor.getBoundingClientRect();
      const pointRect = e.target.getBoundingClientRect();
      const curPoint = {
        x: Math.round(
          pointRect.left - editorRectInfo.left + e.target.offsetWidth / 2
        ),
        y: Math.round(
          pointRect.top - editorRectInfo.top + e.target.offsetHeight / 2
        )
      };

      // 获取对称点的坐标
      const symmetricPoint = {
        x: center.x - (curPoint.x - center.x),
        y: center.y - (curPoint.y - center.y)
      };
      let needLockProportion = true;
      // 如果拉的是上下左右  就false
      if (point.length == 1) needLockProportion = false;
      let index = 1;
      let fontSizeOld = this.defaultStyle.fontSize;
      const move = (moveEvent) => {
        // 第一次点击时也会触发 move，所以会有“刚点击组件但未移动，组件的大小却改变了”的情况发生
        // 因此第一次点击时不触发 move 事件
        const curPositon = {
          x: moveEvent.clientX - Math.round(editorRectInfo.left),
          y: moveEvent.clientY - Math.round(editorRectInfo.top)
        };
        calculateComponentPositonAndSize(
          point,
          style,
          curPositon,
          proportion,
          needLockProportion,
          {
            center,
            curPoint,
            symmetricPoint
          }
        );

        if (this.elName == 'qk-image') {
          let arrnew = ['rb', 'lb', 'lt', 'rt'];
          let x = 1 / this.transformScalce;
          if (arrnew.includes(point)) {
            style.left *= x;
            style.top *= x;
            style.width *= x;
            style.height *= x;
          } else if (point == 'l' || point == 'r') {
            style.left *= x;
            style.top = this.defaultStyle.top;
            style.width *= x;
            style.height = this.defaultStyle.height;
          } else {
            style.left = this.defaultStyle.left;
            style.top *= x;
            style.height *= x;
            style.width = this.defaultStyle.width;
          }
        } else if (this.elName == 'qk-text') {
          let arrnew = ['rb', 'lb', 'lt', 'rt'];
          let x = 1 / this.transformScalce;

          if (arrnew.includes(point)) {
            style.left *= x;
            style.top *= x;
            style.width *= x;
            style.height *= x;
          } else if (point == 'l' || point == 'r') {
            style.left *= x;
            style.top = this.defaultStyle.top;
            style.width *= x;
            style.height = this.defaultStyle.height;
          }
        }

        // 修改当前文字元素的font-size值
        let arr = ['r', 'l'];
        if (this.elName == 'qk-text' && !arr.includes(point)) {
          // updataElementFontSize(point, style, oldStyle);
          let fontsizes = ((style.width / width) * fontSizeOld).toFixed(2) * 1;
          style.fontSize = fontsizes;
          this.$store.dispatch('resetElementCommonStyle', {
            fontSize: fontsizes,
            statusHistory: false
          });
          // console.log(style.width, width, fontSizeOld, 66666, fontsizes * 1);
        }
        this.$emit('resize', style);
      };
      const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        // 鼠标抬起的时候   重置样式
        if (this.pointList.includes(point) && this.elName == 'qk-text') {
          this.resetComponentsEditShape();
        }
        this.$store.commit('addHistoryCache');
        this.clearLockPageClick();
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },

    // 处理旋转
    handleRotate(e) {
      e.preventDefault();
      e.stopPropagation();
      // 初始坐标和初始角度
      const pos = { ...this.defaultStyle };
      const startY = e.clientY;
      const startX = e.clientX;
      const startRotate = pos.rotate;

      // 获取元素中心点位置
      const rect = this.$el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // 旋转前的角度
      const rotateDegreeBefore =
        Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180);

      // 如果元素没有移动，则不保存快照
      let hasMove = false;
      const move = (moveEvent) => {
        hasMove = true;
        const curX = moveEvent.clientX;
        const curY = moveEvent.clientY;
        // 旋转后的角度
        const rotateDegreeAfter =
          Math.atan2(curY - centerY, curX - centerX) / (Math.PI / 180);
        // 获取旋转的角度值
        pos.rotate = startRotate + rotateDegreeAfter - rotateDegreeBefore;
        // 修改当前组件样式
        this.$store.commit('resetElementCommonStyle', pos);
      };

      const up = () => {
        hasMove && this.$store.commit('resetElementCommonStyle');
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        this.cursors = this.getCursor(); // 根据旋转角度获取光标位置
        this.$store.commit('addHistoryCache');
        this.clearLockPageClick();
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },

    // 点击解锁
    lockClick() {
      this.$bus.$emit('lockClickChange');
    },

    // 获取光标
    getCursor() {
      const { angleToCursor, initialAngle, pointLists } = this;
      let activeRotate = this.activeElement.commonStyle.rotate
        ? this.activeElement.commonStyle.rotate
        : 0;
      const rotate = mod360(activeRotate); // 取余 360
      const result = {};
      let lastMatchIndex = -1; // 从上一个命中的角度的索引开始匹配下一个，降低时间复杂度
      //计算八个位置
      pointLists.forEach((point) => {
        const angle = mod360(initialAngle[point] + rotate);
        const len = angleToCursor.length;
        while (true) {
          lastMatchIndex = (lastMatchIndex + 1) % len;
          const angleLimit = angleToCursor[lastMatchIndex];
          if (angle < 23 || angle >= 338) {
            result[point] = 'nw-resize';
            return;
          }
          if (angleLimit.start <= angle && angle < angleLimit.end) {
            result[point] = angleLimit.cursor + '-resize';

            return;
          }
        }
      });
      return result;
    },

    // 操作拉伸后重置样式
    resetComponentsEditShape() {
      this.$store.commit('resetElementCommonStyle', {
        height: this.$refs.componentsEditShapeContent.offsetHeight,
        width: this.$refs.componentsEditShapeContent.offsetWidth,
        statusHistory: false
      });
    },

    // 锁住页面的不让事件穿透
    lockPageClick() {
      const pageNode = document.getElementById('editor-pane');
      if (!pageNode) return;
      pageNode.style.pointerEvents = 'none';
    },
    // 清除页面事件的锁定
    clearLockPageClick() {
      const pageNode = document.getElementById('editor-pane');
      if (!pageNode) return;
      pageNode.style.pointerEvents = null;
    }
  },
  beforeDestroy() {
    this.$bus.$off('resetComponentsEditShape');
  }
};
</script>

<style lang="scss" scoped>
.edit-shape-point {
  width: 10px;
  height: 10px;
  background-color: #fff;
  border: 1px solid #59c7f9;
  // border-radius: 10px;
  position: absolute;
  z-index: 1001;
}

.components-edit-shape {
  box-sizing: border-box;
  cursor: move;
  &.active {
    outline: 2px dashed #3f51b5;
  }
  &:hover {
    outline: 2px dashed #3f51b5;
  }
}
.lockImg {
  display: flex;
  width: 24px;
  height: 24px;
  background: #ffffff;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  position: absolute;
  bottom: -12px;
  right: -12px;
  z-index: 1002;
  cursor: pointer;

  el-tooltip {
    width: 22px;
    height: 22px;
    background-color: rgba(85, 132, 255, 0.1);
    margin: auto;
    display: flex;
  }
  img {
    width: 14px;
    height: 14px;
    margin: auto;
  }
}
</style>
