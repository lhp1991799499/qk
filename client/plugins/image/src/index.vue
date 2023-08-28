<!--
 * @version: 
 * @Author: leaolly
 * @Date: 2023-03-22 09:35:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-22 10:21:42
 * @Descripttion: 模块描述
-->
<!--test.vue-->
<template>
  <div
    class="qk-image"
    style="display: flex; justify-content: center; align-items: center"
  >
    <img
      class="qk-image"
      :style="{
        position: 'absolute',
        transform: 'scale(' + webkitMaskStyle.scale + ')',
        left: webkitMaskStyle.left + 'px',
        top: webkitMaskStyle.top + 'px'
      }"
      ref="qkImage"
      :src="imageSrc"
      alt=""
      crossOrigin="anonymous"
    />

    <div
      ref="scaleImage"
      v-if="commonStyle.WebkitMask"
      style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid red;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
      "
      @mousedown.stop.prevent="handleMouseDownOnElement"
    >
      <div
        ref="moveImage"
        style="
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid red;
          position: absolute;
          background-color: black;
        "
        @mousedown.stop.prevent="ImageMovement"
      ></div>
      <!-- <div
        style="
          width: 20px;
          height: 20px;
          border: 1px solid red;
          position: absolute;
          top: 50px;
        "
        ref="rotateImage"
        @mousedown.stop.prevent="handleMouseDownOnPoint($event)"
      ></div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
  name: 'QkImage', // 这个名字很重要，它就是未来的标签名<qk-text></qk-text>
  props: {
    imageSrc: {
      type: String,
      default: ''
    },
    uuid: {
      type: String,
      default: ''
    },
    commonStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    webkitMaskStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    ...mapState({
      activeElementUUID: (state) => state.editor.activeElementUUID
    }),
    ...mapGetters(['activeElement'])
  },
  data() {
    return {
      w: 0, //图片宽
      h: 0, //图片高
      rotateDeg: 0, //图片旋转角度
      scale: 1, //图片缩放比例
      top: 0, //图片left  top
      left: 0
    };
  },
  mounted() {
    // 元素发生变化时  重置蒙版的移动位置
    this.$bus.$on('changeImageSize', (item) => {
      this.changeImageSize(item);
    });
  },
  methods: {
    //外圈园拖动的事件
    handleMouseDownOnElement(e) {
      let startY = e.clientY;
      let startX = e.clientX;
      // 图片本身的缩放
      let move = (moveEvent) => {
        moveEvent.stopPropagation();
        moveEvent.preventDefault();
        let currX = moveEvent.clientX; //鼠标x轴
        let currY = moveEvent.clientY; //鼠标Y轴
        // 起始位置和拖动位置小于20  20为放大3倍  0为1倍 10为2倍
        if (currX - startX <= 20 && currY - startY <= 20) {
          let scale;
          scale = (currX - startX) / 10; //缩放的比例
          this.$refs.scaleImage.style.width = 40 + (currX - startX) + 'px'; //圆的宽高变化
          this.$refs.scaleImage.style.height = 40 + (currX - startX) + 'px';
          if (
            this.webkitMaskStyle.scale + scale > 0 &&
            this.webkitMaskStyle.scale <= 3 &&
            this.webkitMaskStyle.scale + scale <= 3
          ) {
            this.$store.commit('resetWebkitMaskStyle', {
              scale: this.webkitMaskStyle.scale + scale,
              uuid: this.uuid
            });
          }
        }
      };
      let up = () => {
        // 鼠标抬起  恢复原来大小
        this.$refs.scaleImage.style.width = '40px';
        this.$refs.scaleImage.style.height = '40px';
        // 图片本身的缩放 抬起时  如果缩放小于1了  就让他恢复为1

        // 如果缩放比例小于1  恢复至原来大小 1
        if (this.webkitMaskStyle.scale < 1) {
          this.$store.commit('resetWebkitMaskStyle', {
            scale: 1,
            uuid: this.uuid
          });
        }

        document.removeEventListener('mousemove', move, true);
        document.removeEventListener('mouseup', up, true);
        this.$store.dispatch('setActiveElementUUID', this.uuid);
        this.$store.commit('addHistoryCache');
      };
      document.addEventListener('mousemove', move, true);
      document.addEventListener('mouseup', up, true);
      return true;
    },
    // 图片移动事件
    ImageMovement(e) {
      // 记录起始位置和起始的left和top
      let startY = e.clientY;
      let startX = e.clientX;
      let left = this.webkitMaskStyle.left;
      let top = this.webkitMaskStyle.top;
      let move = (moveEvent) => {
        moveEvent.stopPropagation();
        moveEvent.preventDefault();
        let currX = moveEvent.clientX; //鼠标x轴
        let currY = moveEvent.clientY; //鼠标Y轴
        // 重新定义元素的left和top
        this.$store.commit('resetWebkitMaskStyle', {
          left: left * 1 + (currX - startX) * 1,
          top: top * 1 + (currY - startY) * 1,
          uuid: this.uuid
        });
      };
      let up = () => {
        let maxLeft =
          (this.$refs.qkImage.offsetWidth * (this.webkitMaskStyle.scale - 1)) /
          2;
        if (Math.abs(this.webkitMaskStyle.left) >= maxLeft) {
          this.$store.commit('resetWebkitMaskStyle', {
            left: this.webkitMaskStyle.left * 1 > 0 ? maxLeft : -maxLeft,
            uuid: this.uuid
          });
        }
        let maxTop =
          (this.$refs.qkImage.offsetHeight * (this.webkitMaskStyle.scale - 1)) /
          2;
        if (Math.abs(this.webkitMaskStyle.top) >= maxTop) {
          this.$store.commit('resetWebkitMaskStyle', {
            top: this.webkitMaskStyle.top * 1 > 0 ? maxTop : -maxTop,
            uuid: this.uuid
          });
        }
        document.removeEventListener('mousemove', move, true);
        document.removeEventListener('mouseup', up, true);
        this.$store.dispatch('setActiveElementUUID', this.uuid);
        this.$store.commit('addHistoryCache');
      };
      document.addEventListener('mousemove', move, true);
      document.addEventListener('mouseup', up, true);
      return true;
    },

    // 父元素发生变化时  当编辑的元素和当前元素相同时  初始用老宽高和新宽高做比例
    changeImageSize(item) {
      if (this.uuid === this.activeElementUUID) {
        // 因为如果一直拖拽 会一直计算  所以用上次的新宽高做比例

        this.$store.commit('resetWebkitMaskStyle', {
          left:
            this.webkitMaskStyle.left *
            1 *
            (item.newWidth / (this.w || item.width)),
          uuid: this.uuid
        });
        this.h = item.newHeight;
        this.w = item.newWidth;
        this.$store.commit('addHistoryCache');
      }
    },
    handleMouseDownOnPoint(e) {
      let startX = e.clientX; //开始的x轴坐标
      let startY = e.clientY;
      let startRotate = this.rotateDeg;
      let move = (moveEvent) => {
        const rect = this.$el.getBoundingClientRect();
        console.log(rect);

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // // 旋转前的角度
        const rotateDegreeBefore =
          Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180);
        const currentX = moveEvent.clientX;
        const currentY = moveEvent.clientY;
        const rotateDegreeAfter =
          Math.atan2(currentY - centerY, currentX - centerX) / (Math.PI / 180);

        this.rotateDeg =
          startRotate + ((rotateDegreeAfter - rotateDegreeBefore + 360) % 360);
      };
      let up = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        this.$store.dispatch('setActiveElementUUID', this.uuid);
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    }
  }
};
</script>

<style lang="scss" scoped>
.qk-image {
  width: 100%;
  height: 100%;
}

img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
