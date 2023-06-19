<template>
  <div class="leftMenus">
    <div
      v-for="(item, index) in leftMenus"
      :class="['menu', { curr: i == index }]"
      :menu="item.menu"
      :key="index"
      @click="onchangeTabs(index)"
    >
      <div :class="[item.menu, 'icon']"></div>
      <div class="font">{{ item.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    i: {
      default: 0,
      type: Number
    },
    onChangeTab: {
      default: () => {},
      type: Function
    }
  },
  data() {
    return {
      leftMenus: [
        {
          //左侧菜单
          menu: 'sucai',
          text: '素材'
        },
        {
          menu: 'ziti',
          text: '字体'
        },
        {
          menu: 'music',
          text: '音乐'
        },
        {
          menu: 'moban',
          text: '模板'
        },
        {
          menu: 'upload',
          text: '上传'
        }
      ]
    };
  },
  methods: {
    onchangeTabs(val) {
      this.$emit('onChangeTab', val);
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  .font {
    width: 26px;
    height: 21px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 21px;
    margin-top: 2px;
  }
}
.icon {
  width: 24px;
  height: 24px;
}

.curr {
  .moban {
    background: url('../../../../assets/image/icon/moban_curr.png') no-repeat
      center center !important;
  }

  .sucai {
    background: url(../../../../assets/image/icon/sucai_curr.png) no-repeat
      center center !important;
  }
  .ziti {
    background: url(../../../../assets/image/icon/ziti_curr.png) no-repeat
      center center !important;
  }
  .upload {
    background: url(../../../../assets/image/icon/upload_curr.png) no-repeat
      center center !important;
  }
  .music {
    background: url(../../../../assets/image/icon/music-light.png) no-repeat
      center center !important;
    background-size: cover !important;
  }
}
.menu {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  .moban {
    background: url(../../../../assets/image/canvasSvg/moban.svg) no-repeat
      center center;
  }
  .sucai {
    background: url(../../../../assets/image/canvasSvg/sucai.svg) no-repeat
      center center;
  }
  .ziti {
    background: url(../../../../assets/image/canvasSvg/ziti.svg) no-repeat
      center center;
  }

  .upload {
    background: url(../../../../assets/image/canvasSvg/upload.svg) no-repeat
      center center;
  }

  .music {
    background: url(../../../../assets/image/icon/music.png) no-repeat center
      center;
    background-size: cover;
  }
  &:hover {
    color: #5584ff !important;
    .moban {
      background: url('../../../../assets/image/canvasSvg/moban_curr.svg')
        no-repeat center center;
    }

    .sucai {
      background: url(../../../../assets/image/canvasSvg/sucai_curr.svg)
        no-repeat center center;
    }
    .ziti {
      background: url(../../../../assets/image/canvasSvg/ziti_curr.svg)
        no-repeat center center;
    }
    .upload {
      background: url(../../../../assets/image/canvasSvg/upload_curr.svg)
        no-repeat center center;
    }
    .music {
      background: url(../../../../assets/image/icon/music-light.png) no-repeat
        center center;
      background-size: cover;
    }
  }
}
.left-menu {
  width: 80px;
  height: calc(100vh - 55px);
  border-right: 1px solid #f0f0f0;
}
.curr {
  background: #eff3fd url('../../../../assets/image/icon/juxing.png') no-repeat
    left center;
  color: #5584ff !important;
}
</style>
