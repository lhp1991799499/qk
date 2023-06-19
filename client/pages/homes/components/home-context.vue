<template>
  <div class="left-container-content">
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
import material from "./home-context-components/left-material.vue";
import leftFont from "./home-context-components/left-font.vue";
import leftMusic from "./home-context-components/left-music.vue";
import leftUpload from "./home-context-components/left-upload.vue";
import leftModuleboard from "./home-context-components/left-moduleboard.vue";

export default {
  props: {
    i: {
      type: Number,
      default: 0,
    },
  },
  computed: {},
  components: { material, leftFont, leftMusic, leftUpload, leftModuleboard },
  data() {
    return {
      show: true,
    };
  },
  methods: {
    toggleLeft() {
      this.show = !this.show;
    },
  },
};
</script>

<style lang="scss" scoped>
.toggle-btn {
  width: 24px;
  height: 100px;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: #eceff1;
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
  display: flex;
}
</style>
