<template>
  <div class="control-container">
    <div>
      <img
        class="image-default"
        @click="updateScale('reduce')"
        src="../../../../assets/image/icon/icon-min.png"
        alt=""
      />
    </div>
    <div class="center-bar">{{ parseFloat(scaleVal * 100).toFixed(0) }}%</div>
    <div>
      <img
        class="image-default"
        @click="updateScale('plus')"
        src="../../../../assets/image/icon/icon-max.png"
        alt=""
      />
    </div>
    <el-divider direction="vertical"></el-divider>
    <div>
      <img
        class="image-right"
        @click="updateScale('reset')"
        src="../../../../assets/image/icon/screen.png"
        alt=""
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    scale: {
      type: Number,
      default: 1
    },
    onScaleSize: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      // 画板缩放
      scaleVal: this.scale
    };
  },
  methods: {
    /**
     * 更新画板大小
     */
    updateScale(type, value) {
      if (type === 'plus') {
        this.scaleVal =
          this.scaleVal + (value || 0.1) > 2
            ? 2
            : this.scaleVal + (value || 0.1);
      } else if (type === 'reduce') {
        this.scaleVal =
          this.scaleVal - (value || 0.1) > 0.5
            ? this.scaleVal - (value || 0.1)
            : 0.5;
      } else if (type === 'reset') {
        this.scaleVal = value || 1;
      }
      this.$emit('onScaleSize', this.scaleVal);
      this.$store.commit('transformScalce', this.scaleVal);
    }
  }
};
</script>

<style lang="scss" scoped>
.control-container {
  height: 44px;
  box-shadow: 1px 1px 8px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 24px;
  right: 360px;
  padding: 10px 16px;
  background-color: #fff;
  .center-bar {
    margin-right: 16px;
    margin-left: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
  }
  .image-default {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
  .image-right {
    width: 28px;
    height: 22px;
    cursor: pointer;
    margin-left: 10px;
  }
}
</style>
