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
      transformScalce: (state) => state.editor.transformScalce
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
        cursor:
          point
            .split('')
            .reverse()
            .map((m) => this.directionKey[m])
            .join('') + '-resize'
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
    // 点击解锁
    lockClick() {
      this.$bus.$emit('lockClickChange');
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
