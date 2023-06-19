<template>
  <div class="animation-panel-container">
    <!-- <div class="animation-panel">
      <div class="left-panel">
        <div class="title">进场动画</div>
        <div class="preview">预览</div>
      </div>
      <div class="cancel">取消动画</div>
    </div>

    <div class="animation-select">
      <div class="item">
        <div class="left">
          <div class="png">img</div>
          <div class="name">name</div>
        </div>
        <div>
          <el-button type="text">更换</el-button>
        </div>
      </div>
    </div> -->
    <!-- <div class="animation-strong">
      <div class="title">强调动画</div>
      <div class="panel">
        <div class="gray-img-add"></div>
        <div>添加动效</div>
      </div>
    </div>
    <div class="animation-strong">
      <div class="title">退场动画</div>
      <div class="panel">
        <div class="gray-img-add"></div>
        <div>添加动效</div>
      </div>
    </div> -->
    <add-animation
      v-for="item in usedItems"
      :key="item.title"
      :adminItem="item"
      :animarionIndex="item.index"
      :anminTitle="item.title"
      :animation="animationObj(item)"
    ></add-animation>
  </div>
</template>

<script>
import addAnimation from './common/add-animation.vue';
import $bus from '@client/eventBus';
import runAnimations from '@client/common/js/runAnimations';
export default {
  components: {
    addAnimation
  },
  mounted() {
    this.animatePlaying = false;
    // animations 是所有的动画  animation 是预览的当前动画
    // $bus.$on('RUN_ANIMATIONS', (uuid, animations, animation) => {
    //   console.log(animations, uuid, this.uuid);

    //   // if (uuid !== this.uuid) {
    //   //   return;
    //   // }
    //   // 正在执行的动画不允许插入新动画
    //   if (this.animatePlaying) return;
    //   let cssText = this.$el.style.cssText;
    //   this.animatePlaying = true;

    //   runAnimations(this.$el, animations, true, animation, () => {
    //     this.$el.style.cssText = cssText;
    //     this.animatePlaying = false;
    //   });
    // });
  },
  computed: {
    usedItems() {
      this.items.forEach((e) => {
        console.log(
          this.$store.getters.activeElement,
          this.$store.getters.activeElement.animations
        );
        const animations =
          this.$store.getters.activeElement &&
          this.$store.getters.activeElement.animations;
        if (animations) {
          for (const i in animations) {
            if (Object.hasOwnProperty.call(animations, i)) {
              const element = animations[i];
              this.items.forEach((e) => {
                if (e.title === element.title) {
                  e.animations = element;
                }
              });
            }
          }
        }
      });
      return this.items;
    }
  },
  data() {
    return {
      animationTime: 0,
      animationDelay: 0,
      items: [
        {
          title: '进场动画',
          name: 'enter',
          index: 0,
          list: [
            // { label: '渐显', value: 'fadeIn' },
            // { label: '向左进入', value: 'fadeInLeft' },
            // { label: '向右进入', value: 'fadeInRight' },
            // { label: '向上进入', value: 'fadeInUp' },
            // { label: '向下进入', value: 'fadeInDown' },
            // { label: '弹入', value: 'bounceIn' },
            // { label: '分割渐显', value: 'fadeIn' },
            // { label: '向左进入', value: 'fadeInLeft' },
            // { label: '向右进入', value: 'fadeInRight' },
            // { label: '向上进入', value: 'fadeInUp' },
            // { label: '向下进入', value: 'fadeInDown' },
            // { label: '弹入', value: 'bounceIn' },
            // { label: '渐显', value: 'fadeIn' },
            // { label: '向左进入', value: 'fadeInLeft' },
            // { label: '向右进入', value: 'fadeInRight' },
            // { label: '向上进入', value: 'fadeInUp' },
            // { label: '向下进入', value: 'fadeInDown' },
            // { label: '弹入', value: 'bounceIn' },
            // { label: '渐显', value: 'fadeIn' },
            // { label: '向左进入', value: 'fadeInLeft' },
            // { label: '向右进入', value: 'fadeInRight' },
            // { label: '向上进入', value: 'fadeInUp' },
            // { label: '向下进入', value: 'fadeInDown' },
            // { label: '测试', value: 'bounce' }
            { label: '渐显', value: 'fadeIn' },
            { label: '向左进入', value: 'fadeInLeft' },
            { label: '向右进入', value: 'fadeInRight' },
            { label: '向上进入', value: 'fadeInUp' },
            { label: '向下进入', value: 'fadeInDown' },
            { label: '向左长距进入', value: 'fadeInLeftBig' },
            { label: '向右长距进入', value: 'fadeInRightBig' },
            { label: '向上长距进入', value: 'fadeInUpBig' },
            { label: '向下长距进入', value: 'fadeInDownBig' },
            { label: '旋转进入', value: 'rotateIn' },
            { label: '左顺时针旋转', value: 'rotateInDownLeft' },
            { label: '右逆时针旋转', value: 'rotateInDownRight' },
            { label: '左逆时针旋转', value: 'rotateInUpLeft' },
            { label: '右逆时针旋转', value: 'rotateInUpRight' },
            { label: '弹入', value: 'bounceIn' },
            { label: '向左弹入', value: 'bounceInLeft' },
            { label: '向右弹入', value: 'bounceInRight' },
            { label: '向上弹入', value: 'bounceInUp' },
            { label: '向下弹入', value: 'bounceInDown' },
            { label: '光速进入', value: 'lightSpeedIn', unclick: true },
            { label: 'Y轴旋转', value: 'flip', unclick: true },
            { label: '中心X轴旋转', value: 'flipInX', unclick: true },
            { label: '中心Y轴旋转', value: 'flipInY', unclick: true },
            { label: '左长半径旋转', value: 'rollIn' },
            { label: '由小变大进入', value: 'zoomIn' },
            { label: '左变大进入', value: 'zoomInLeft' },
            { label: '右变大进入', value: 'zoomInRight' },
            { label: '向上变大进入', value: 'zoomInUp' },
            { label: '向下变大进入', value: 'zoomInDown' },
            { label: '向左滑动展开', value: 'slideInLeft' },
            { label: '向右滑动展开', value: 'slideInRight' },
            { label: '向上滑动展开', value: 'slideInUp' },
            { label: '向下滑动展开', value: 'slideInDown' }
          ]
        },
        {
          title: '强调动画',
          name: 'emphasize',
          index: 1,
          list: [
            // { label: '向右退出', value: 'fadeOutRight' },
            // { label: '向上退出', value: 'fadeOutUp' },
            // { label: '向下退出', value: 'fadeOutDown' },
            // { label: '向左长距退出', value: 'fadeOutLeftBig' },
            // { label: '向右长距退出', value: 'fadeOutRightBig' },
            // { label: '向上长距退出', value: 'fadeOutUpBig' }
            { label: '弹跳', value: 'bounce', unclick: true },
            { label: '闪烁', value: 'flash', unclick: true },
            { label: '放大缩小', value: 'pulse', unclick: true },
            { label: '放大缩小弹簧', value: 'rubberBand', unclick: true },
            { label: '左右晃动', value: 'shake', unclick: true },
            { label: '左右小幅晃动', value: 'headShake', unclick: true },
            { label: '左右扇形摇摆', value: 'swing', unclick: true },
            { label: '放大晃动缩小', value: 'tada', unclick: true },
            { label: '扇形摇摆', value: 'wobble', unclick: true },
            { label: '左右上下晃动', value: 'jello', unclick: true },
            { label: 'Y轴旋转', value: 'flip', unclick: true }
          ]
        },
        // { title: '退场动画', list: [{ name: '', nickName: '淡出' }] }
        {
          title: '退场动画',
          name: 'exit',
          index: 2,
          list: [
            { label: '渐隐', value: 'fadeOut' },
            { label: '向左退出', value: 'fadeOutLeft' },
            { label: '向右退出', value: 'fadeOutRight' },
            { label: '向上退出', value: 'fadeOutUp' },
            { label: '向下退出', value: 'fadeOutDown' },
            { label: '向左长距退出', value: 'fadeOutLeftBig' },
            { label: '向右长距退出', value: 'fadeOutRightBig' },
            { label: '向上长距退出', value: 'fadeOutUpBig' },
            { label: '向下长距退出', value: 'fadeOutDownBig' },
            { label: '旋转退出', value: 'rotateOut' },
            { label: '左顺时针旋转', value: 'rotateOutDownLeft' },
            { label: '右逆时针旋转', value: 'rotateOutDownRight' },
            { label: '左逆时针旋转', value: 'rotateOutUpLeft' },
            { label: '右逆时针旋转', value: 'rotateOutUpRight' },
            { label: '弹出', value: 'bounceOut' },
            { label: '向左弹出', value: 'bounceOutLeft' },
            { label: '向右弹出', value: 'bounceOutRight' },
            { label: '向上弹出', value: 'bounceOutUp' },
            { label: '向下弹出', value: 'bounceOutDown' },
            { label: '光速进出', value: 'lightSpeedOut', unclick: true },
            { label: '中心X轴旋转', value: 'flipOutX', unclick: true },
            { label: '中心Y轴旋转', value: 'flipOutY', unclick: true },
            { label: '左长半径旋转', value: 'rollOut' },
            { label: '由小变大退出', value: 'zoomOut' },
            { label: '左变大退出', value: 'zoomOutLeft' },
            { label: '右变大退出', value: 'zoomOutRight' },
            { label: '向上变大退出', value: 'zoomOutUp' },
            { label: '向下变大退出', value: 'zoomOutDown' },
            { label: '向左滑动收起', value: 'slideOutLeft' },
            { label: '向右滑动收起', value: 'slideOutRight' },
            { label: '向上滑动收起', value: 'slideOutUp' },
            { label: '向下滑动收起', value: 'slideOutDown' }
          ]
        }
      ]
    };
  },
  methods: {
    // 循环时，找到当前动画，对应 强调 进入 退出 动画
    animationObj(item) {
      let obj = {};
      const animations =
        this.$store.getters.activeElement &&
        this.$store.getters.activeElement.animations;
      for (const i in animations) {
        if (item.title == animations[i].title) {
          obj = animations[i];
        }
      }
      return obj;
    }
  }
};
</script>

<style lang="scss" scoped>
.animation-panel-container {
  padding: 9px 24px;
}
.animation-panel {
  padding: 9px;
  .left-panel {
    display: flex;
    align-items: center;
    .title {
      font-weight: 600;
      color: #333333;
      font-size: 14px;
    }
    .preview {
      color: #5584ff;
      font-size: 13px;
      margin-left: 16px;
    }
  }
  .cancel {
    font-weight: 500;
    font-size: 13px;
    color: #999999;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.animation-select {
  .item {
    padding: 8px 16px 8px;
    margin-bottom: 12px;
    display: flex;
    background: #f6f7f9;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      .png {
        width: 52px;
        height: 52px;
      }
      .name {
        margin-left: 16px;
      }
    }
  }
}
.animation-strong {
  margin-top: 24px;
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
      background: url('../../../../../assets/image/icon/gray-add.png') no-repeat
        center center;
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
