<template>
  <div :class="{ active: isActive }" @mousedown="onMouseDownComponent">
    <span
      v-show="isActiveAndUnlock"
      class="iconfont icon-xiangyouxuanzhuan"
      @mousedown="onMouseDownRotate"
    ></span>
    <div
      v-for="point in resizePoint.points"
      v-show="isActiveAndUnlock"
      :key="point.id"
      class="resize-point"
      :style="point.style"
      @mousedown="handleMouseDownOnPoint(point, $event)"
    ></div>
    <slot></slot>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import ResizePoint from '@/utils/resizePoint';

export default {
  props: {
    element: {
      require: true,
      type: Object,
      default: () => {}
    },

    index: {
      require: true,
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      resizePoint: {}
    };
  },
  computed: {
    ...mapState(['curComponent', 'editor']),
    isActive() {
      return this.element.id == this.curComponent?.id;
    },
    isActiveAndUnlock() {
      return this.isActive && !this.element.isLock;
    }
  },
  watch: {
    element: {
      handler(element) {
        // 当组件的大小和旋转角度变化时，更新圆点的位置和光标
        this.resizePoint.computeStyle(element.style);
      },
      deep: true
    }
  },
  mounted() {
    this.resizePoint = new ResizePoint(this.element.style);
  },
  methods: {
    // 平移：计算鼠标的位移，更新组件位置
    onMouseDownComponent(e) {
      e.stopPropagation();
      this.$store.commit('setCurComponent', {
        component: this.element,
        index: this.index
      });

      const componentStyle = {
        ...this.element.style
      };
      // 组件起始位置
      const startTop = componentStyle.top;
      const startLeft = componentStyle.left;
      // 鼠标起始位置
      const startY = e.clientY;
      const startX = e.clientX;

      let isMove = false;
      const move = (moveEvent) => {
        isMove = true;
        // 鼠标当前位置
        const currentX = moveEvent.clientX;
        const currentY = moveEvent.clientY;
        // 移动后的组件位置
        componentStyle.top = startTop + (currentY - startY);
        componentStyle.left = startLeft + (currentX - startX);

        this.$store.commit('setCurrentComponentStyle', componentStyle);
      };

      const up = () => {
        hasMove && this.$store.commit('recordSnapshot');
        // 触发元素停止移动事件，用于隐藏标线
        eventBus.$emit('unmove');
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },
    // 旋转: 计算鼠标和组件中心点的连线的旋转角度，更新组件旋转角度。
    onMouseDownRotate(e) {
      e.preventDefault();
      e.stopPropagation();

      const componentStyle = {
        ...this.element.style
      };
      // 鼠标起始位置
      const startY = e.clientY;
      const startX = e.clientX;
      // 组件初始角度
      const startRotate = pos.rotate;

      // 获取组件中心点位置
      const rect = this.$el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // 旋转前的角度
      const rotateDegreeBefore =
        Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180);

      let isMove = false;
      const move = (moveEvent) => {
        isMove = true;
        // 鼠标当前位置
        const currentX = moveEvent.clientX;
        const currentY = moveEvent.clientY;
        // 旋转后的角度
        const rotateDegreeAfter =
          Math.atan2(currentY - centerY, currentX - centerX) / (Math.PI / 180);
        // 获取旋转的角度值
        componentStyle.rotate =
          startRotate + ((rotateDegreeAfter - rotateDegreeBefore + 360) % 360);
        // 修改当前组件样式
        this.$store.commit('setCurrentComponentStyle', componentStyle);
      };

      const up = () => {
        isMove && this.$store.commit('recordSnapshot');
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },
    // 处理缩放：计算鼠标在组件高/宽所在方向的位移，更新组件大小和位置。
    handleMouseDownOnPoint(point, e) {
      e.stopPropagation();
      e.preventDefault();

      const editorDOMRect = this.editor.getBoundingClientRect();
      const pointDOMRect = e.target.getBoundingClientRect();
      // 当前点击圆点在画布坐标系(左上角为原点)中的坐标
      const pointCoordinate = {
        x: Math.round(
          pointDOMRect.left - editorDOMRect.left + e.target.offsetWidth / 2
        ),
        y: Math.round(
          pointDOMRect.top - editorDOMRect.top + e.target.offsetHeight / 2
        )
      };

      let isSave = false;

      const isKeepProportion = this.isKeepProportion();
      const componentStyle = { ...this.element.style };
      const move = (moveEvent) => {
        isSave = true;
        const mouseCoordinate = {
          x: moveEvent.clientX - editorDOMRect.left,
          y: moveEvent.clientY - editorDOMRect.top
        };
        // 调用每个point对象的方法，根据组件样式、鼠标当前位置、圆点位置信息计算组件位移信息。
        let newComponentStyle = point.calculateComponentPositonAndSize(
          componentStyle,
          mouseCoordinate,
          isKeepProportion,
          pointCoordinate
        );

        this.$store.commit('setCurrentComponentStyle', newComponentStyle);
      };

      const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        isSave && this.$store.commit('recordSnapshot');
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    }
  }
};
</script>
