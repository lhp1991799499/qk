<!--
 * @version: 
 * @Author: leaolly
 * @Date: 2023-04-06 09:40:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-14 10:19:02
 * @Descripttion: 模块描述
-->
<template>
  <div
    class="left-container-content"
    :style="{ transform: show ? 'translateX(0)' : 'translateX(-100%)' }"
  >
    <div v-show="show">
      <material v-if="i === 0" />
      <left-font v-if="i === 1" />
      <left-music v-if="i === 2"></left-music>
      <leftModuleboard v-if="i === 3" />
      <left-upload v-if="i === 4"></left-upload>
    </div>
    <div class="toggle-btn" @click="toggleLeft">
      <div class="img-box">
        <img
          :style="{ transform: !show ? 'rotateY(180deg)' : 'rotateY(0deg)' }"
          src="../../../../assets/image/icon/back.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import material from './home-context-components/left-material.vue';
import leftFont from './home-context-components/left-font.vue';
import leftMusic from './home-context-components/left-music.vue';
import leftUpload from './home-context-components/left-upload.vue';
import leftModuleboard from './home-context-components/left-moduleboard.vue';

export default {
  props: {
    i: {
      type: Number,
      default: 0
    }
  },
  watch: {
    i(val, value) {
      if (val != -1) {
        this.show = true;
      } else if (val == this.leftIndex) {
        this.show = false;
        this.$emit('onChangeTab', -1);
      }
      this.$bus.$emit('leftContentShow', this.show);
    }
  },
  computed: {},
  components: { material, leftFont, leftMusic, leftUpload, leftModuleboard },
  data() {
    return {
      show: true,
      leftIndex: -1
    };
  },
  methods: {
    toggleLeft() {
      if (this.show) {
        this.leftIndex = this.i;
        this.$emit('onChangeTab', -1);
      } else {
        this.$emit('onChangeTab', this.leftIndex);
      }
      this.show = !this.show;
      this.$bus.$emit('leftContentShow', this.show);
    }
  }
};
</script>

<style lang="scss" scoped>
.toggle-btn {
  position: absolute;
  top: 50%;
  right: -24px;
  transform: translateY(-50%);
  width: 24px;
  height: 99px;
  box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
  border-radius: 0px 20px 20px 0px;
  background: #ffffff;
  cursor: pointer;
  justify-content: center;
  z-index: 1;

  .img-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 100px;
    background-color: #fff;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    img {
      width: 16px;
      height: 16px;
    }
  }
}
.left-container-content {
  position: absolute;
  top: 0;
  left: 80px;
  bottom: 0;
  width: 320px;
  background: #ffffff;
  box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
  z-index: 999;
}
</style>
