<template>
  <!-- 画布左侧工具栏 -->
  <div
    class="leftTool"
    :style="{
      top: pagesIndex * projectData.height + 'px'
    }"
  >
    <div
      v-for="(item, i) in toolList"
      :key="i"
      class="tools"
      @click="changePage(item)"
    >
      <el-tooltip
        class="item"
        effect="dark"
        :content="item.text"
        placement="right"
      >
        <img
          :src="
            require('../../../../../../assets/image/canvasSvg/' + item.imgUrl)
          "
          alt=""
        />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
  props: {
    pagesData: {
      type: [Object, Array]
    },
    pagesIndex: {
      type: Number
    }
  },
  computed: {
    ...mapState({
      projectData: (state) => state.editor.projectData,
      activePageUUID: (state) => state.editor.activePageUUID,
      activeElementUUID: (state) => state.editor.activeElementUUID
    }),
    ...mapGetters(['activePage'])
  },
  data() {
    return {
      toolList: [
        {
          text: '上一页',
          imgUrl: 'canvasUp.svg'
        },
        {
          text: '下一页',
          imgUrl: 'canvasNext.svg'
        },
        {
          text: '新增页面',
          imgUrl: 'canvasNew.svg',
          value: 'addPage'
        },
        {
          text: '复制页面',
          imgUrl: 'canvasCopy.svg',
          value: 'copyPage'
        },
        {
          text: '删除',
          imgUrl: 'canvasDelete.svg',
          value: 'deletePage'
        }
      ]
    };
  },
  methods: {
    changePage(item) {
      this.$store.dispatch(
        item.value,
        this.pagesData ? this.pagesData.uuid : ''
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.leftTool {
  width: 32px;
  z-index: 1001;
  right: -40px;
  top: 0px;
  position: fixed;
  .tools {
    width: 32px;
    height: 32px;
    margin-bottom: 8px;
    img {
      width: 14px;
      height: 14px;
      margin: 9px;
    }
  }
  .tools:hover {
    background: #d6deea;
    border-radius: 4px;
  }
}
</style>
