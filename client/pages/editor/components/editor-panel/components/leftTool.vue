<template>
  <!-- 画布左侧工具栏 -->
  <div
    v-if="activePageUUID == pagesData.uuid"
    class="leftTool"
    :style="{
      top: leftToolTop * transformScalce + 'px'
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
import { forEach } from 'lodash';
export default {
  props: {
    pagesData: {
      //当前页面的数据
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
      activeElementUUID: (state) => state.editor.activeElementUUID,
      transformScalce: (state) => state.editor.transformScalce
    }),
    ...mapGetters(['activePage'])
  },
  data() {
    return {
      toolList: [
        {
          text: '画布上移',
          imgUrl: 'canvasUp.svg',
          value: 'canvasMove',
          type: 'pageUp'
        },
        {
          text: '画布下移',
          imgUrl: 'canvasNext.svg',
          value: 'canvasMove',
          type: 'pageDown'
        },
        {
          text: '新增页面',
          imgUrl: 'canvasNew.svg',
          value: 'addPage',
          type: 'addPage'
        },
        {
          text: '复制页面',
          imgUrl: 'canvasCopy.svg',
          value: 'copyPage',
          type: 'copyPage'
        },
        {
          text: '删除',
          imgUrl: 'canvasDelete.svg',
          value: 'deletePage',
          type: 'deletePage'
        }
      ],
      leftToolTop: 0
    };
  },
  mounted() {
    this.getTop(this.pagesIndex);
    //每次修改画布尺寸时都会重新计算一下左侧的高度
    this.$bus.$on('changeLeftToolTop', () => {
      this.getTop(this.pagesIndex);
    });
  },
  methods: {
    changePage(item) {
      // 判断是否是上下移动 如果是上下移动 传递多个参数
      if (item.value == 'canvasMove') {
        this.$store.dispatch(item.value, {
          uuid: this.pagesData ? this.pagesData.uuid : '',
          type: item.type || ''
        });
      } else {
        this.$store.dispatch(
          item.value,
          this.pagesData ? this.pagesData.uuid : ''
        );
      }
      // 对页面进行操作之后  在进行滚动
      let data = {
        pagesIndex: this.pagesIndex,
        type: item.type
      };
      this.$nextTick(() => {
        this.$emit('scrollTopChange', data);
      });
    },
    // 是否是禁用状态 如果是第一个 上移禁用 如果是最后一个 下移禁用
    tooltipDisabled(item) {
      let flag = false;
      if (item.type && item.type == 'pageUp') {
        flag = this.pagesIndex == 0 ? true : true;
      } else if (item.type && item.type == 'pageDown') {
        flag = this.pagesIndex == this.projectData.pages.length ? true : true;
      }
      return flag;
    },
    // 获取向左上面的边距
    getTop(pagesIndex) {
      // top = 0,  每一张加上 上一张的 height
      let top = 0;
      this.projectData.pages.forEach((item, index) => {
        if (index <= pagesIndex && index != 0) {
          //每次修改画布尺寸时都会重新计算一下左侧的高度  加上上一张的高度  *1 是做类型转换
          top += this.projectData.pages[index - 1].commonStyle.height * 1;
        }
      });
      this.leftToolTop = top;
    }
  },
  beforeDestroy() {
    this.$bus.$off('changeLeftToolTop');
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
