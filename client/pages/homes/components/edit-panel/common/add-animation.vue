<template>
  <div class="components-attr-animate-edit">
    <div class="title-content">
      <div class="title">
        {{ adminItem.title }}
      </div>
      <div class="preview-content" v-if="animation.title">
        <div class="preview" @click="previewAnimation">预览</div>
        <div class="cancel-animation" @click="cancelAnimation">取消动画</div>
      </div>
    </div>
    <div class="animation-content">
      <el-popover
        width="300"
        height="500"
        trigger="click"
        v-model="popoverVisible"
        class="el-popover-box"
        popper-class="popoverStyle"
      >
        <div class="animation-strong" slot="reference">
          <div class="panel">
            <div class="gray-img-add">
              <img
                :style="{
                  width: animation.title ? '40px' : '16px',
                  height: animation.title ? '40px' : '16px'
                }"
                :src="
                  animation.title
                    ? require('../../../../../../assets/image/icon/animate-default.svg')
                    : require('../../../../../../assets/image/icon/gray-add.png')
                "
                alt=""
              />
            </div>
            <div
              style="
                display: flex;
                justify-content: space-between;
                flex-wrap: nowrap;
                width: 160px;
              "
            >
              <div :class="[animation.title ? 'active' : '', 'animationTitle']">
                {{ animation.title ? animation.label : '添加动效' }}
              </div>
              <div class="replaceAninmations" v-if="animation.title">更换</div>
            </div>
          </div>
        </div>
        <div class="context">
          <div class="title">{{ adminItem.title }}</div>
          <div class="list-content">
            <!-- 原代码是 item 循环 item.list  将内部item改为items 后续有问题 将内部items改回item -->
            <div
              class="item-box"
              v-for="(item, i) in adminItem.list"
              :key="i"
              @mouseover="hoverPreviewAnimate = item.value"
              @mouseleave="hoverPreviewAnimate = ''"
              @click="handleChooseAnimate(item)"
            >
              <div class="item">
                <img
                  :class="[
                    hoverPreviewAnimate === item.value &&
                      item.value + ' animated'
                  ]"
                  src="../../../../../../assets/image/icon/animate-default.svg"
                />
              </div>

              <div class="itemLabel">{{ item.label }}</div>
            </div>
          </div>
        </div>
      </el-popover>
      <div v-if="animation.title" class="edit-animation-box">
        <div>
          <div class="delay">动画延迟</div>
          <el-slider
            v-model="animation.delay"
            @change="delayChange"
            show-input
            input-size="mini"
            :max="30"
            :min="0"
            :step="0.1"
          >
          </el-slider>
        </div>
        <div>
          <div class="duration">动画时长</div>
          <el-slider
            v-model="animation.duration"
            show-input
            input-size="mini"
            @change="delayChange"
            :max="30"
            :min="0"
            :step="0.1"
          >
          </el-slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import $bus from '@client/eventBus';
import filterCssData from '@client/common/ffcreatorCssData';
import { forEach } from 'lodash';

export default {
  props: {
    adminItem: {
      type: Object
    },
    anminTitle: String,
    animarionIndex: Number,
    animation: Object
  },
  computed: {
    ...mapGetters(['activeElement'])
  },

  data() {
    return {
      popoverVisible: false,
      hoverPreviewAnimate: '',
      reSelectAnimateIndex: undefined,
      timer: null
      // animation: {
      //   delay: 0,
      //   duration: 0,
      //   type: {}
      // }
    };
  },
  mounted() {
    // this.getAnimation();
  },
  methods: {
    previewAnimation() {
      const animationData = [this.animation];
      this.$bus.$emit('imageAnimations', 666);
      $bus.$emit(
        'RUN_ANIMATIONS',
        this.activeElement.uuid,
        animationData,
        this.adminItem.title
      );
    },
    async getAnimation() {
      const animations =
        this.$store.getters.activeElement &&
        this.$store.getters.activeElement.animations;
      if (Object.keys(animations || {})) {
        for (const i in animations) {
          if (this.adminItem.title == animations[i].title) {
            this.animation = animations[i];
            this.$forceUpdate();
          }
          // if (animations.hasOwnProperty.call(animations, i)) {
          //   const element = animations[i];
          //   if (this.adminItem.title === this.anminTitle) {
          //     console.log(this.adminItem);
          //     this.animation = element;
          //   }
          // }
        }
        // if (!Object.keys(animations || {}).includes(this.adminItem.title)) {

        //   this.animation = {
        //     delay: 0,
        //     duration: 0,
        //     type: {}
        //   };
        // }
      }
    },
    delayChange(e, type) {
      this.animation[type] = e;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.$store.dispatch('addHistoryCache');
      }, 1000);
    },
    /**
     * 选取animate
     * @param item
     */
    async handleChooseAnimate(item) {
      console.log(item);
      let randomAnimate;

      this.showAnimatePanel = false;

      if (item.value === 'random') {
        randomAnimate = this.createRandomAnimate(this.activeName);
        item = randomAnimate;
      }
      if (!this.reSelectAnimateIndex) {
        await this.$store.dispatch('addElementAnimate', {
          title: this.anminTitle,
          animations: item.value,
          label: item.label
        });
        // this.$store.dispatch('addElementAnimate', item.value);
      } else {
        this.activeElement.animations[this.reSelectAnimateIndex].type =
          item.value;
        await this.$store.dispatch('addHistoryCache');
      }
      this.popoverVisible = false;

      // this.getAnimation();
    },
    cancelAnimation() {
      this.$store.dispatch('deleteElementAnimate', this.animation);
      // await this.getAnimation();
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss">
.popoverStyle {
  padding: 0 !important;
}
</style>
<style lang="scss" scoped>
.animation-content {
  background: #f6f7f9;
  // margin-top: 12px;
  padding-bottom: 1px;
  border-radius: 4px;
  .animationTitle {
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #666666;
    line-height: 22px;
    width: 100px;
    text-overflow: ellipsis; /* 溢出显示省略号 */
    overflow: hidden; /* 溢出隐藏 */
    white-space: nowrap; /* 强制不换行 */
  }
  .active {
    color: #333333;
  }
  .replaceAninmations {
    width: 28px;
    height: 20px;
    font-size: 14px;
    font-weight: 500;
    color: #5584ff;
    line-height: 20px;
  }
}
.edit-animation-box {
  margin: 2px;
  padding: 12px;
  height: 136px;
  background: #ffffff;
  border-radius: 4px;
  .delay,
  .duration {
    width: 48px;
    height: 20px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
  }
}
.components-attr-animate-edit {
  // padding: 9px 24px;
  position: relative;
  width: 272px;
}
.context {
  padding: 8px;
  width: 288px;
  //动画效果会出现滚动条  溢出部分隐藏
  overflow: hidden;
  .title {
    margin: 8px 8px 16px 8px;
    width: 64px;
    height: 24px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 24px;
  }
  .list-content {
    flex-wrap: wrap;
    display: flex;
    .item-box {
      // display: flex;
      // justify-content: center;
      margin: 0px 8px 8px 8px;
      align-items: center;

      // margin-right: 16px;
      // margin-bottom: 8px;
      flex-direction: column;
      font-size: 12px;
      color: #666;
      cursor: pointer;
      text-align: center;
      // padding: 8px;
    }
    &:nth-child(4n) {
      margin-right: 0;
    }
    .item {
      width: 52px;
      height: 52px;
      border-radius: 4px;
      background: #f8fafc;
      // margin-bottom: 4px;
      img {
        width: 40px;
        height: 40px;
        margin: 6px;
      }
    }
    .itemLabel {
      margin-top: 4px;
      width: 52px;
      /*1. 先强制一行内显示文本*/
      white-space: nowrap;
      /*2. 超出的部分隐藏*/
      overflow: hidden;
      /*3. 文字用省略号替代超出的部分*/
      text-overflow: ellipsis;
    }
  }
}
.title-content {
  height: 38px;
  display: flex;
  align-items: center;
  width: 100%;
  .title {
    width: 56px;
    font-weight: 600;
    color: #333333;
    font-size: 14px;
    height: 22px;
    line-height: 22px;
    // margin-bottom: 16px;
    // margin-top: 16px;
  }
  .preview-content {
    display: flex;
    justify-content: space-between;
    width: 77%;
    .preview {
      cursor: pointer;
      margin-left: 16px;
      width: 26px;
      height: 20px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #5584ff;
      line-height: 20px;
    }
    .cancel-animation {
      // color: #999999;
      // font-size: 13px;
      // margin-right: 8px;
      cursor: pointer;
      width: 52px;
      height: 20px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #999999;
      line-height: 20px;
    }
  }
}
.animation-strong {
  border-radius: 4px;
  .title {
    font-weight: 600;
    color: #333333;
    font-size: 14px;
    margin-bottom: 8px;
  }
  .panel {
    padding: 8px;
    background: #f6f7f9;
    height: 68px;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #666;
    cursor: pointer;
    &:hover {
      background: #ebeced;
    }
    .gray-img-add {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      width: 52px;
      height: 52px;
      margin-right: 16px;
      border-radius: 4px;
      background-size: 16px;
    }
  }
}
.animation-strong {
  border-radius: 4px;
  .title {
    font-weight: 600;
    color: #333333;
    font-size: 14px;
    margin-bottom: 8px;
  }
  .panel {
    padding: 8px;
    background: #f6f7f9;
    height: 68px;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #666;
    cursor: pointer;

    .gray-img-add {
      background-color: #fff;
      width: 52px;
      height: 52px;
      margin-right: 16px;
      border-radius: 4px;
      background-size: 16px;
    }
  }
}
</style>
