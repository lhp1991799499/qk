<template>
  <div class="container" style="display: block">
    <el-input
      placeholder="音乐"
      v-model="input"
      clearable
      prefix-icon="el-icon-search"
      clear="onClearChange"
    >
    </el-input>
    <div class="music-list">
      <div
        v-for="item in listAudios"
        :key="item.id"
        :class="`${item.src === musicData.src ? 'item-using' : ''} music-item`"
        @click="playMusic(item)"
      >
        <div class="music-item-left">
          <div>
            <div class="music-left-icon">
              <div
                class="play"
                v-if="item.using && item.src == musicData.src"
                @click.stop="playOrpause(item, 'pause')"
              ></div>
              <div
                class="pause"
                @click.stop="playOrpause(item, 'play')"
                v-else
              ></div>
            </div>
          </div>
          <div class="music-item-left-r">
            <div class="name">{{ item.name }}</div>
            <div class="music-item-left-name">
              <div class="singer">{{ item.singer }}</div>
              <div class="timer">{{ item.timer }}秒</div>
            </div>
          </div>
        </div>
        <div class="using">
          {{ item.using && item.src == musicSrc ? '使用中' : '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import scrollTabs from '../scroll-tabs.vue';
import templateContainer from '../template-container.vue';
import editor from '@client/mixins/editor.js';
import { mapState, mapGetters } from 'vuex';
export default {
  mixins: [editor],
  components: {
    scrollTabs,
    templateContainer
  },
  computed: {
    ...mapState({ musicData: (state) => state.editor.musicData })
  },
  data() {
    return {
      input: '',
      item: {
        elName: 'qk-text',
        title: '文字',
        icon: 'iconfont iconwenben',
        // 每个组件设置props来展示哪些显示哪些编辑项
        valueType: '', // 标识数据类型，用于表单组件
        defaultStyle: {
          // height: 40,
        }
      },
      listAudios: [
        {
          id: '0',
          icon: 'img',
          name: '我把我唱给你听',
          singer: 'jay-zhou',
          timer: '3',
          src: 'https://ev-sycdn.kuwo.cn/4b4d26ee86864fdb4106c207a41abe05/64c1e077/resource/n1/18/22/808666067.mp3?from$baidu&plat$web_www',
          using: false
        },
        {
          id: '1',
          icon: 'img3',
          name: '浪花一朵朵',
          singer: 'jay-zhou',
          timer: '33',
          src: 'https://other-web-nf01-sycdn.kuwo.cn/adddd5f8b17e216f070d8a1615823c16/64c1dfe3/resource/n2/64/28/2870731409.mp3?from$unkown&plat$web_www',
          using: false
        },
        {
          id: '2',
          icon: 'img3',
          name: '红山果',
          singer: 'jay-zhou',
          timer: '33',
          src: 'https://lf-sycdn.kuwo.cn/ded44769636a02d51c1840e8031345de/64c1df2c/resource/n2/84/78/391314227.mp3?from$unkown&plat$web_www',
          using: false
        }
      ],
      musicSrc: '' //当前播放的音乐地址
    };
  },
  methods: {
    onClearChange() {},
    playMusic(item) {
      item.using = false;
      this.$store.dispatch('musicChange', item);
      this.musicSrc = item.src;
      this.$bus.$emit('playOrpause', 'pause');
    },
    // 播放还是暂停
    playOrpause(item, str) {
      str == 'play' ? (item.using = true) : (item.using = false);
      this.musicSrc = item.src;
      this.$store.dispatch('musicChange', item);
      this.$bus.$emit('playOrpause', str);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 320px;
  // overflow-y: scroll;
  height: calc(100vh - 55px);
  padding: 24px;
  box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
  display: flex;
  flex-direction: column;
  .music-list {
    margin-top: 12px;

    .music-item {
      height: 54px;
      padding: 8px 12px 8px 8px;
      background: #f8fafc;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 8px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 2px solid white;
      &:hover {
        box-shadow: 0px 0px 8px 0px rgba(130, 144, 179, 0.5);
        border: 2px solid #5584ff;
      }
      .using {
        color: #5584ff;
        font-size: 12px;
      }
      .music-item-left {
        display: flex;
        .music-item-left-r {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .name {
          color: #333;
          font-size: 14px;
        }
        .music-left-icon {
          position: relative;
          width: 38px;
          height: 38px;
          background-color: aquamarine;
          border-radius: 4px;
          margin-right: 8px;
          .play {
            width: 10px;
            height: 10px;
            position: absolute;
            left: 14px;
            top: 13px;
          }
          .play::before,
          .play::after {
            content: '';
            background: #fff;
            width: 3px;
            height: 10px;
            position: absolute;
            border-radius: 2px;
          }
          .play::after {
            right: 0;
          }
          .pause {
            width: 0;
            height: 0;
            position: absolute;
            border-bottom: 10px solid #fff;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 0px solid transparent;
            transform: rotate(90deg);
            left: 14px;
            top: 13px;
          }
        }
        .music-item-left-name {
          display: flex;
          align-items: center;
          .singer {
            color: #666666;
            font-size: 12px;
            margin-right: 4px;
          }
          .timer {
            color: #999999;
            font-size: 12px;
          }
        }
      }
    }
    .item-using {
      box-shadow: 0px 0px 8px 0px rgba(130, 144, 179, 0.5);
      border: 2px solid #5584ff;
    }
  }
  .add-btn {
    border: 1px solid #5584ff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 4px;
    color: #5584ff;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    .margin-r10 {
      margin-right: 10px;
    }
  }
}
</style>
