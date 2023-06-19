<template>
  <div
    class="components-edit-shape"
    @click="handleTopWrapperClick"
    @mousedown="handleMouseDownOnElement"
    :class="{ active: this.active }"
    :style="{ transform: `rotate(${rotateDeg}deg)` }"
    ref="activeDom"
  >
    <slot> </slot>

    <div
      class="edit-shape-point"
      v-for="item in active
        ? elName == 'qk-text'
          ? pointListText
          : pointList
        : []"
      :key="item"
      @mousedown.stop.prevent="handleMouseDownOnPoint(item)"
      :style="getPointStyle(item)"
    ></div>
  </div>
</template>

<script>
import runAnimations from '@client/common/js/runAnimations';
import $bus from '@client/eventBus';
import { mapGetters, mapState } from 'vuex';

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
    elName: String
  },
  computed: {
    ...mapState({
      projectData: (state) => state.editor.projectData,
      activePageUUID: (state) => state.editor.activePageUUID
    }),
    ...mapGetters(['activePage'])
  },
  data() {
    return {
      showActive: this.active,
      rotatable: true,
      resizable: false,
      // l = left, t = top, r = right, b = bottom
      pointList: ['lt', 'rt', 'lb', 'rb', 'l', 'r', 't', 'b', 'c'],
      pointListText: ['lt', 'rt', 'lb', 'rb', 'l', 'r', 'c'],
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
    $bus.$on('RUN_ANIMATIONS', (uuid, animations, animation) => {
      if (uuid !== this.uuid) {
        return;
      }
      console.log(animations);
      // 正在执行的动画不允许插入新动画
      if (this.animatePlaying) return;
      let cssText = this.$el.style.cssText;
      this.animatePlaying = true;
      runAnimations(this.$el, animations, true, animation, () => {
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
          newWidth = 30;
          newHeight = 30;
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
      e.stopPropagation();
      e.preventDefault();
    },
    /**
     * 鼠标选中元素拖拽事件
     * @param e
     */
    handleMouseDownOnElement(e) {
      console.log(e.target.innerText);
      console.log(this.projectData);
      console.log(this.activePageUUID);
      this.$emit('handleElementClick');
      console.log('选中元素');
      // this.showActive = false;
      // 抛出事件让父组件设置当前元素选中状态
      const pos = { ...this.defaultStyle };
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

        // let newHeight = +height + (hasT ? -disY : hasB ? disY : 0);
        let newWidth = +width + (hasL ? -disX : hasR ? disX : 0);
        // let newHeight = (newWidth / width) * height;
        let newHeight;
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

        // ----------
        // // 组件初始角度
        // let startY = e.clientY;
        // let startX = e.clientX;
        let startRotate = pos.rotate;
        // // 获取组件中心点位置·
        const rect = this.$el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // // 旋转前的角度
        const rotateDegreeBefore =
          Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180);

        // let isMove = false;
        // console.log(rotateDegreeBefore);
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
        flag = false;
        // 鼠标抬起之后 将初始角度调整为旋转角度
        this.defaultStyle.rotate = this.rotateDeg;

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
    outline: 2px dashed #3f51b5;
  }
  &:hover {
    outline: 2px dashed #3f51b5;
  }
}
</style>
