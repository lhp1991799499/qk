<template>
  <div
    class="components-edit-shape"
    @click="handleTopWrapperClick"
    @mousedown="handleMouseDownOnElement"
    :class="{ active: this.showActive }"
    :style="{ transform: `rotate(${rotateDeg}deg)` }"
    ref="activeDom"
  >
    <slot> </slot>

    <div
      :class="{ 'edit-shape-point': true, 'rotate-point': item === 'c' }"
      v-for="item in showActive ? pointList : []"
      :key="item"
      @mousedown="handleMouseDownOnPoint(item)"
      :style="getPointStyle(item)"
    ></div>
  </div>
</template>

<script>
import runAnimations from '@client/common/js/runAnimations';
import $bus from '@client/eventBus';
import { mapGetters } from 'vuex';

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
    uuid: String
  },
  computed: {
    ...mapGetters(['activeElement'])
  },
  data() {
    return {
      showActive: this.active,
      rotatable: true,
      resizable: false,
      // l = left, t = top, r = right, b = bottom
      // pointList: ["lt", "rt", "lb", "rb", "l", "r", "t", "b", "c"],
      pointList: ['lt', 'rt', 'lb', 'rb', 'l', 'r', 'c'],
      // 上下左右 对应的 东南西北
      directionKey: {
        t: 'n',
        b: 's',
        l: 'w',
        r: 'e'
      },

      rotateDeg: 0
    };
  },
  mounted() {
    this.animatePlaying = false;
    $bus.$on('RUN_ANIMATIONS', (uuid, animations) => {
      if (uuid !== this.uuid) {
        return;
      }
      // 正在执行的动画不允许插入新动画
      if (this.animatePlaying) return;
      let cssText = this.$el.style.cssText;
      this.animatePlaying = true;
      runAnimations(this.$el, [animations], true, () => {
        this.$el.style.cssText = cssText;
        this.animatePlaying = false;
      });
    });
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
      let newLeft = 0;
      let newTop = 0;
      let newWidth = 10;
      let newHeight = 10;
      if (point.length === 2) {
        newLeft = hasL ? 0 : width;
        newTop = hasT ? 0 : height;
      } else {
        // !#zh 上下点，宽度固定在中间
        if (hasT || hasB) {
          newLeft = width / 2;
          newTop = hasT ? 1 : height + 3;
          newWidth = 12;
          newHeight = 6;
        }
        // !#zh 左右点，高度固定在中间
        if (hasL || hasR) {
          newLeft = hasL ? 1 : width + 3;
          newTop = height / 2 - 6;
          newWidth = 6;
          newHeight = 12;
        }
        // 旋转点
        if (hasC) {
          newLeft = width / 2 - 5;
          newTop = height + 20;
          newWidth = 20;
          newHeight = 20;
        }
      }
      const style = {
        marginLeft: hasL || hasR ? '-5.5px' : 0,
        marginTop: hasT || hasB ? '-5.5px' : 0,
        left: `${newLeft}px`,
        top: `${newTop}px`,
        height: `${newHeight}px`,
        width: `${newWidth}px`,
        cursor:
          point
            .split('')
            .reverse()
            .map((m) => this.directionKey[m])
            .join('') + '-resize'
      };
      return style;
    },
    /**
     * 点击事件，点击后设置当前元素为选中元素
     */
    handleTopWrapperClick(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    /**
     * 鼠标选中元素拖拽事件
     * @param e
     */
    handleMouseDownOnElement(e) {
      this.$emit('handleElementClick');
      console.log('选中元素');
      // this.showActive = false;
      // 抛出事件让父组件设置当前元素选中状态

      const pos = { ...this.defaultStyle };
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

        let currX = moveEvent.clientX;
        let currY = moveEvent.clientY;
        pos.top = currY - startY + startTop;
        pos.left = currX - startX + startLeft;
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
    handleMouseDownOnPoint(point) {
      console.log('点击：' + point);
      let downEvent = event;
      // 抛出事件让父组件设置当前元素选中状态
      this.$emit('handleElementClick');
      downEvent.stopPropagation();
      downEvent.preventDefault(); // Let's stop this event.
      const pos = { ...this.defaultStyle };
      let height = pos.height;
      let width = pos.width;
      let top = pos.top;
      let left = pos.left;
      let startX = downEvent.clientX;
      let startY = downEvent.clientY;
      console.log(startX, startY, height, width, top, left);
      let endX = 0;
      let endY = 0;
      let beginX = null;
      let beginY = null;

      let fontSizeOld = this.defaultStyle.fontSize;
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
        // let newHeight = +height + (hasT ? -disY : hasB ? disY : 0);
        let newWidth = +width + (hasL ? -disX : hasR ? disX : 0);
        let newHeight = (newWidth / width) * height;
        console.log(newWidth, width, newHeight, height);

        pos.height = newHeight > 0 ? newHeight : 0;
        pos.width = newWidth > 0 ? newWidth : 0;
        pos.left = +left + (hasL ? disX : 0);
        pos.top = +top + (hasT ? disY : 0);
        endX = currX;
        endY = currY;
        if (point === 'c') {
          this.rotateDeg =
            (Math.atan2(endY - beginY, endX - beginX) * 180) / Math.PI;
        }
        // 等比缩放
        if (['lt', 'rt', 'lb', 'rb'].includes(point)) {
          // console.log(111111111111111111);
          // newHeight = +height + (hasT ? -disY : hasB ? disY : 0);
          // newWidth = newHeight * (width / height);
          console.log('width: ' + width + 'newWidth: ' + newWidth);
          let fontsizes = ((newWidth / width) * fontSizeOld).toFixed(2);
          // setTimeout(() => {
          //   pos.fontSize = fontsizes;
          //   this.$store.dispatch('resetElementCommonStyle', {
          //     fontSize: pos.fontSize
          //   });
          // }, 200);
          pos.fontSize = fontsizes;
          this.$store.dispatch('resetElementCommonStyle', {
            fontSize: pos.fontSize
          });
        }

        this.$emit('resize', pos);
      };
      let up = () => {
        this.$emit('resize');
        console.log('moved', endX, endY, beginX, beginY, this.rotateDeg);
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    }
  }
};
</script>

<style lang="scss" scoped>
.edit-shape-point {
  width: 10px;
  height: 10px;
  background-color: #fff;
  border: 1px solid #59c7f9;
  border-radius: 10px;
  position: absolute;
  z-index: 1001;
}

.components-edit-shape {
  box-sizing: border-box;
  cursor: move;
  &.active {
    outline: 1px dashed #3f51b5;
  }
  &:hover {
    outline: 1px dashed #3f51b5;
  }
}
</style>
