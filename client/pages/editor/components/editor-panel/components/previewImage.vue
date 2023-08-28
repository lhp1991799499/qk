<template>
  <div id="previewImage">
    <div class="left">
      <div
        v-for="(item, index) in previewImageList"
        :key="index"
        @click="changeImage(item)"
        style="width: 128px; margin: 0 0 12px 12px; position: relative"
      >
        <div class="reference">
          {{ index + 1 }}
        </div>
        <img :src="item.url" style="width: 100%" alt="" />
      </div>
    </div>
    <div class="content">
      <img
        :style="{
          height: contentobj.AdaptiveH + 'px',
          width: contentobj.AdaptiveW + 'px',
          margin: 'auto'
        }"
        :src="contentobj.url"
        alt=""
      />
    </div>
    <div class="right">
      <div class="close" @click="changepreviewImageFlag">
        <img src="../../../../../../assets/image/canvasSvg/close.svg" alt="" />
        关闭预览
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
  props: {
    previewImageList: Array
  },
  computed: {
    ...mapState({ musicData: (state) => state.editor.musicData })
  },
  data() {
    return {
      contentobj: {}
    };
  },
  mounted() {
    this.contentobj = this.previewImageList[0];
  },
  methods: {
    //改变主图显示图片
    changeImage(item) {
      this.contentobj = item;
    },
    // 关闭弹窗
    changepreviewImageFlag() {
      this.$emit('changepreviewImageFlag', false);
    }
  },
  beforeDestroy() {}
};
</script>

<style lang="scss" scoped>
#previewImage {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1001;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.left {
  padding: 10px 0;
  width: 140px;
  height: 100%;
  overflow: auto;
}
.content {
  margin: auto;
  width: 800px;
  display: flex;
  align-items: center;
  height: 800px;
}
.right {
  .close {
    margin: 12px;
    width: 110px;
    height: 40px;
    line-height: 40px;
    color: white;
    text-align: center;
    background: #000000;
    border-radius: 4px;
    cursor: pointer;
  }
}
.reference {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  left: 4px;
  bottom: 8px;
  background-color: rgba(0, 0, 0, 0.8);
  line-height: 20px;
  text-align: center;
  font-size: 14px;
  color: white;
}
.left::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.left {
  scrollbar-width: none; /* firefox /
-ms-overflow-style: none; / IE 10+ */
  overflow-y: auto;
}
</style>
