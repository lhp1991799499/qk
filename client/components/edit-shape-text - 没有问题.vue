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
            transform: `rotate(${rotateDeg || commonStyle.rotate}deg)`,

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
      console.log(e);
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
        let scalce = 1; //如果是文字  就用缩放  不进行计算  如果是其他的 移动比例计算
        this.elName != 'qk-text' ? (scalce = this.transformScalce) : '';
        pos.top = (currY - startY) / scalce + startTop;
        pos.left = (currX - startX) / scalce + startLeft;
        this.$emit('resize', pos);
      };
      let up = () => {
        lastTime = new Date().getTime();
        if (lastTime - firstTime > 200) {
          this.$emit('resize');
        }

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
      this.cursors = this.getCursor();
      const style = { ...this.defaultStyle }; // 根据旋转角度获取光标位置
      if (style.lock) return;

      if (point == 'c') {
        this.handleRotate(e);
        return;
      }
      if (point.length == 1 || this.elName == 'qk-text') {
        this.handleMouseDownOnPoints(e, point);
        return;
      }
      this.$store.commit('getEditor', this.activePageUUID);

      let scalce = this.transformScalce;
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
      const move = (moveEvent) => {
        // 第一次点击时也会触发 move，所以会有“刚点击组件但未移动，组件的大小却改变了”的情况发生
        // 因此第一次点击时不触发 move 事件
        const curPositon = {
          x: moveEvent.clientX - Math.round(editorRectInfo.left),
          y: moveEvent.clientY - Math.round(editorRectInfo.top)
        };
        let oldStyle = JSON.parse(JSON.stringify(style));
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

        let x = 1 / scalce;
        style.left *= x;
        style.top *= x;
        style.width *= x;
        style.height *= x;

        // 修改当前文字元素的font-size值
        let arr = ['r', 'l'];
        if (style.fontSize && !arr.includes(point)) {
          updataElementFontSize(point, style, oldStyle);
        }
        this.$store.commit('resetElementCommonStyle', style);
      };
      const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        // 鼠标抬起的时候   重置样式
        if (this.pointList.includes(point) && this.elName == 'qk-text') {
          this.resetComponentsEditShape();
        }
        this.$store.commit('addHistoryCache');
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },
    // 鼠标点击ersize老方法  四角拉伸会出现抖动问题  上面的放大不出现抖动 但左右拉伸会出问题 算法没错 是我们的错 他们的缩放是大小发生变化 而我们的缩放本身未发生变化
    handleMouseDownOnPoints(e, point) {
      let activeElement = this.activeElement; //  点击时存入  鼠标抬起时再次赋值
      let downEvent = event;
      const pos = { ...this.defaultStyle };
      if (pos.lock) return;
      // 抛出事件让父组件设置当前元素选中状态
      this.$emit('handleElementClick');
      downEvent.stopPropagation();
      downEvent.preventDefault(); // Let's stop this event.
      let height = pos.height;
      let width = pos.width;
      let top = pos.top;
      let left = pos.left;
      let startX = downEvent.clientX; //开始的x轴坐标
      let startY = downEvent.clientY; //开始的y轴坐标
      let endX = 0;
      let endY = 0;
      let beginX = null;
      let beginY = null;
      let fontSizeOld = this.defaultStyle.fontSize;
      var flag = false;
      let move = (moveEvent) => {
        if (beginX === null || beginY === null) {
          beginX = moveEvent.clientX;
          beginY = moveEvent.clientY;
        }
        let currX = moveEvent.clientX;
        let currY = moveEvent.clientY;
        let disY = currY - startY;
        let disX = currX - startX;
        let hasT = /t/.test(point);
        let hasB = /b/.test(point);
        let hasL = /l/.test(point);
        let hasR = /r/.test(point);
        let newHeight;
        let newWidth = +width + (hasL ? -disX : hasR ? disX : 0);

        if (['l', 'r', 't', 'b'].includes(point)) {
          newHeight = +height + (hasT ? -disY : hasB ? disY : 0);
        } else {
          newHeight = (newWidth / width) * height;
        }
        pos.height = newHeight > 0 ? newHeight : 0;
        pos.width = newWidth > 0 ? newWidth : 0;
        pos.left = +left + (hasL ? disX : 0);
        pos.top = +top + (hasT ? disY : 0);
        endX = currX;
        endY = currY;
        let startRotate = pos.rotate;
        // // 获取组件中心点位置·
        const rect = this.$el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // // 旋转前的角度
        const rotateDegreeBefore =
          Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180);
        // -----------
        if (point === 'c') {
          flag = true;
          const currentX = moveEvent.clientX;
          const currentY = moveEvent.clientY;
          // 旋转后的角度
          const rotateDegreeAfter =
            Math.atan2(currentY - centerY, currentX - centerX) /
            (Math.PI / 180);
          if (flag) {
            this.rotateDeg =
              startRotate +
              ((rotateDegreeAfter - rotateDegreeBefore + 360) % 360);
          }
        }
        // 等比缩放
        if (['lt', 'rt', 'lb', 'rb'].includes(point)) {
          let fontsizes = ((newWidth / width) * fontSizeOld).toFixed(2);
          pos.fontSize = fontsizes;

          this.$store.dispatch('resetElementCommonStyle', {
            fontSize: pos.fontSize,
            statusHistory: false
          });
        }
        this.$bus.$emit('changeImageSize', {
          width: width,
          height: height,
          newWidth: newWidth,
          newHeight: newHeight
        });
        this.$emit('resize', pos);
      };
      let up = (ev) => {
        flag = false;
        // 选中元素后 让父页面点击事件禁止  抬起时在为true
        // 鼠标抬起之后 将初始角度调整为旋转角度
        this.defaultStyle.rotate = this.rotateDeg;
        ev.stopPropagation();
        ev.preventDefault();
        // 鼠标抬起的时候   重置样式
        if (this.pointList.includes(point) && this.elName == 'qk-text') {
          this.resetComponentsEditShape();
        }
        this.$emit('resize');
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
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
