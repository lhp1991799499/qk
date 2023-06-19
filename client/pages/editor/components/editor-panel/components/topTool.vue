<template>
  <!-- 画布上侧音乐播放器 -->
  <div class="topTool">
    <span class="currentMusic">当前音乐</span>
    <div class="musicPlayer">
      <div class="control" @click="playOrpause"></div>
      <el-tooltip :content="musicData.name || '暂无音乐'" placement="top">
        <div class="musicName">{{ musicData.name || '暂无音乐' }}</div>
      </el-tooltip>
      <audio ref="audio" style="opacity: 0" :src="musicData.src"></audio>

      <img
        style="width: 14px; height: 14px"
        src="../../../../../../assets/image/canvasSvg/canvasClose.svg"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
  props: {},
  computed: {
    ...mapState({ musicData: (state) => state.editor.musicData })
  },
  data() {
    return {};
  },
  mounted() {
    this.$bus.$on('playOrpause', (val) => {
      if (val == 'play') {
        this.$nextTick(() => {
          this.$refs.audio.play();
        });
      } else {
        this.$nextTick(() => {
          this.$refs.audio.pause();
        });
      }
    });
  },
  methods: {
    playOrpause() {
      this.$refs.audio.play();
    }
  },
  beforeDestroy() {
    this.$bus.$off('playOrpause');
  }
};
</script>

<style lang="scss" scoped>
.topTool {
  display: flex;
  flex-wrap: nowrap;
  height: 36px;
  z-index: 1000; //图层等级太高   会有阴影部分覆盖
  top: -44px;
  position: fixed;
  .currentMusic {
    width: 48px;
    height: 20px;
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 20px;
    display: inline-block;
    margin-top: 16px;
  }
  .musicPlayer {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: center;
    width: 160px;
    height: 36px;
    background: #f8fafc;
    border-radius: 22px;
    border: 1px solid #9082ff;
    margin-left: 8px;
    .control {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #333333;
    }
    .musicName {
      width: 92px;
      height: 20px;
      font-size: 12px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
