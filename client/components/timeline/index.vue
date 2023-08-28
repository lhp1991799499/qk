<template>
  <div
    class="container"
    ref="timeLine"
    @click.prevent.stop="clearSelectElement"
    :style="{
      height: timelineheight + 'px'
    }"
  >
    <div class="h5ds-timeline">
      <div class="h5ds-timeline-btn" @mousedown.prevent.stop="moveTimeLine">
        <div class="title">
          <img src="~@/common/fonts/drag.svg" class="el-icon-upload2" />
          <span class="text-box">拖拽此处可以控制高度</span>
        </div>

        <div class="color-boxs">
          <div class="block-box">
            <i style="background-color: #5584ff"></i>
            <span>进场动画</span>
          </div>
          <div class="block-box">
            <i style="background-color: #66e9d3"></i>
            <span>强调动画</span>
          </div>
          <div class="block-box">
            <i style="background-color: #f6b25a"></i>
            <span>退场动画</span>
          </div>
        </div>
      </div>
      <div class="h5ds-timeline-header">
        <div
          class="h5ds-timeline-left h5ds-global-clearfix"
          style="height: 100%"
        >
          <div class="element-name">元素名称</div>
        </div>

        <div class="h5ds-timeline-right">
          <!-- <div
               :class="'h5ds-timeline-bar' + (banAnimate ? ' h5ds-ban-animate' : '')"
               :style="{
                    transform: `translateX(${-left}px)`,
                    animation: `h5dsTimeLineBarKeyFrames ${timebar / 100}s linear`,
                    WebkitAnimation: `h5dsTimeLineBarKeyFrames ${timebar / 100}s linear`
                  }"
              >

              </div> -->

          <ul
            class="h5ds-timeline-scale h5ds-js-timeline-scale"
            :style="{
              width: timeScale * eachLiWidth + 'px',
              transform: `translateX(${-left}px)`
            }"
          >
            <li v-for="(elem, a) in timeScale" :key="a">
              <i
                v-for="(i, w) in new Array(9).fill(1)"
                :key="w"
                class="h5ds-timeline-dot"
              />
              <span>{{ a }} s</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="h5ds-timeline-body">
        <div class="h5ds-timeline-left clearfix">
          <ul class="h5ds-timeline-layers-left">
            <li
              v-for="(element, b) in activePage.elements"
              :key="b"
              @click.stop="selectElementName(element)"
              class="timeline-item"
              :class="
                activeElement && activeElement.uuid === element.uuid
                  ? 'selectElement'
                  : ''
              "
            >
              <div class="text" style="text-indent: 0.5em">
                <span v-if="element.elName === 'qk-text'">{{
                  element.propsValue.text
                }}</span>
                <span v-else-if="element.elName == 'qk-image'">图片</span>
              </div>

              <div class="operate">
                <img
                  src="~@/common/fonts/add.svg"
                  style="width: 12px"
                  @click="copyElement(element)"
                />
                <img
                  src="~@/common/fonts/delete.svg"
                  style="width: 12px"
                  @click="deleteElement(element)"
                />
              </div>
            </li>
          </ul>
        </div>

        <div class="h5ds-timeline-right h5ds-global-clearfix">
          <ul
            class="h5ds-timeline-layers-right h5ds-js-timeline-layers"
            :style="{
              width: timeScale.length * eachLiWidth + 10,
              transform: `translateX(${-left}px)`
            }"
          >
            <li v-for="(element, index) in activePage.elements" :key="index">
              <div
                v-for="(animation, i) in element.animations"
                class="active-box"
                :style="{
                  left: sizeDelay(animation.delay) + 'px'
                }"
                @mousedown.prevent.stop="
                  (ev) => {
                    mousedownAnimate(ev, element, animation, 'delay');
                  }
                "
                @click.prevent.stop="selectElement(element, animation)"
                :key="i"
              >
                <div
                  class="timeline-box"
                  :style="{
                    width: sizeRevers(animation.duration) + 'px',
                    backgroundColor: countBgcColor(animation)
                  }"
                >
                  <span class="time-box">{{ animation.duration }}s</span>
                </div>
                <div
                  class="active-border"
                  v-show="
                    animation.uuid
                      ? selectAnimotions.selectAnimateUUID === animation.uuid
                      : false
                  "
                >
                  <div
                    class="active-left"
                    @mousedown.prevent.stop="
                      (ev) =>
                        mousedownAnimate(
                          ev,
                          element,
                          animation,
                          'duration',
                          'left'
                        )
                    "
                  >
                    <i class="active-common" style="left: 50%"></i>
                  </div>
                  <div
                    class="active-right"
                    @mousedown.prevent.stop="
                      (ev) =>
                        mousedownAnimate(
                          ev,
                          element,
                          animation,
                          'duration',
                          'right'
                        )
                    "
                  >
                    <i class="active-common" style="right: 50%"></i>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="h5ds-timeline-footer" v-if="showfooter">
        <div class="h5ds-timeline-left h5ds-global-clearfix" />
        <div class="h5ds-timeline-right h5ds-global-clearfix">
          <div
            class="h5ds-timeline-slider"
            @scroll.prevent.stop="timeLineSliderScroll"
          >
            <div
              :style="{
                width: timeScale * eachLiWidth + 'px'
              }"
              class="h5ds-timeline-slider-leng"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./index.js"></script>
<style lang="scss" scoped>
@import './index.scss';

$leftWidth: 200px;
$defaultHeight: 14px;
$liHeight: 30px;
$headHeight: 30px;
$barColor: #ac0404;
$liWidth: 100px;

.container {
  //   overflow: hidden;
  position: fixed;
  z-index: 1000;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
  animation: bounceInUp; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 2s;
}

.h5ds-timeline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  span {
    display: inline-block;
  }

  * {
    box-sizing: border-box;
  }

  .ant-input-number-handler-wrap {
    span {
      display: block;
    }
  }
  .h5ds-timeline-btn {
    position: absolute;
    width: 100%;
    height: 40px;
    // line-height: 40px;
    text-align: center;
    background: #fff;
    box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
    top: -40px;
    // left: 0;
    color: #666666;
    // width: 100%;
    // z-index: 9999;
    // background: #000;
    cursor: move;
    z-index: 999999;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .color-boxs {
      position: absolute;
      left: 200px;
      top: 13px;
      display: flex;
      .block-box {
        margin-right: 16px;
        i {
          width: 22px;
          height: 12px;
          display: inline-block;
          border-radius: 2px;
          margin-right: 4px;
        }
        span {
          font-size: 14px;
          color: #666666;
        }
      }
    }

    .title {
      display: inline-block;
      margin-top: 13px;
      position: relative;
      .text-box {
        width: 160px;
        // background-color: red;
        text-align: left;
        position: absolute;
        left: 20px;
        color: #666666;
        font-size: 15px;
      }
    }
  }

  .h5ds-timeline-left {
    width: $leftWidth;
    background: #fff;
    // height: 100%;
    font-size: 12px;
  }

  .h5ds-timeline-right {
    height: 100%;
    top: 0;
    position: absolute;
    left: $leftWidth;
    right: 0;
  }

  //顶部
  .h5ds-timeline-header {
    height: 40px;
    position: relative;
    box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);

    .h5ds-timeline-left {
      position: relative;
      z-index: 200;

      a {
        color: $color2;
        margin: 0 2px;
      }

      .element-name {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 15px;
        box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
      }
    }

    .h5ds-timeline-right {
      // border-bottom: 1px solid $color3;
    }

    .h5ds-timeline-bar {
      position: absolute;
      height: 100%;
      width: 10px;
      margin-left: -4px;
      background: rgba(85, 132, 255, 0.3);
      border: 2px solid rgb(85, 132, 255);
      cursor: move;
      z-index: 100;
      transition-timing-function: linear !important;

      &::before {
        pointer-events: none;
        left: 2px;
        content: '';
        display: block;
        width: 2px;
        position: absolute;
        height: 1000px;
        top: $headHeight - 4px;
        background: #5584ff;
      }
    }
  }

  // 刻度
  .h5ds-timeline-scale {
    height: 100%;
    overflow: hidden;
    position: relative;
    left: 0;

    li {
      display: inline-block;
      width: $liWidth;
      font-size: 12px;
      height: 100%;
      position: relative;
      color: $color2;

      .h5ds-timeline-dot {
        display: inline-block;
        height: 5px;
        width: 1px;
        background: #dddddd;
        margin-left: $liWidth/10px - 1px;
        position: relative;
        top: 24px;
        // opacity: 0.2;
      }

      &::before {
        position: absolute;
        bottom: 0;
        left: -1px;
        content: '';
        display: inline-block;
        height: 14px;
        background: #dddddd;
        width: 1px;
      }

      span {
        display: inline-block;
        position: absolute;
        left: 0;
        top: 8px;
        color: #333;
        font-size: 12px;
        font-weight: 500;
      }
    }
  }

  // body 部分
  .h5ds-timeline-body {
    position: absolute;
    width: 100%;
    bottom: 15px;
    top: 41px;
    left: 0;
    overflow: hidden;
    overflow-y: scroll;

    .h5ds-timeline-left {
      width: $leftWidth;
      position: relative;
      z-index: 9999;
      min-height: 100%;
      // top: 0;
      // left: 0;
      // bottom: 0;
      // background-color: red;
      // bottom: 0;
      // right: 0;
      box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
      // .h5ds-timeline-active {
      //     // background: $color5;
      // }

      .h5ds-timeline-item1 {
        text-indent: 10px;
        height: $liHeight;
        line-height: 30px;
        font-weight: 500;
        color: #333333;
        font-size: 12px;
      }

      li {
        height: $liHeight;
        // background: $timebg;
        color: $color2;
        position: relative;
        // border-bottom: 1px solid $color3;
        cursor: pointer;
        // text-align: center;
        // background-color: red;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .text {
          display: inline-block;
          width: 150px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .operate {
          height: 100%;
          width: 40px;
          padding-right: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
          display: none;
        }
      }
      .h5ds-timeline-layers-left {
        // background-color: #fff;
        // box-shadow: 2px 0px 6px 0px rgba(0,21,41,0.12);
        .timeline-item:hover {
          .operate {
            display: flex;
          }
        }
      }
    }

    .h5ds-timeline-right {
      position: absolute;
      left: $leftWidth;
      top: 0;
      right: 0;

      .h5ds-timeline-timenode {
        display: inline-block;
        background: #5584ff; // 动画是紫色
        color: #fff;
        position: absolute;
        height: 22px;
        // width: 100px;
        // margin: 3px 0;
        border-radius: 5px;
        overflow: hidden;
        font-size: 12px;
        text-indent: 10px;
        cursor: move;

        .h5ds-timeline-timenode-right,
        .h5ds-timeline-timenode-left {
          cursor: col-resize;
          position: absolute;
          height: 100%;
          width: 4px;
          top: 0;
          z-index: 100;
        }

        .h5ds-timeline-timenode-right {
          right: 0;
          background: $line;
        }

        .h5ds-timeline-timenode-left {
          left: 0;
          background: $main;
        }
      }

      .h5ds-timeline-layers-right {
        position: relative;
      }

      .active-box {
        display: inline-block;
        position: absolute;
        height: 100%;
        padding-top: 4px;
        padding-bottom: 4px;
        .timeline-box {
          border-radius: 4px;
          height: 100%;
          display: inline-block;
          //  background-color:#5584FF;
          line-height: 100%;
          position: relative;
          //  padding-top: 2px;
          //  padding-bottom: 2px;
          .time-box {
            width: 30px;
            height: 18px;
            background: rgba(0, 0, 0, 0.2);
            box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
            border-radius: 4px;
            position: absolute;
            top: 50%;
            left: 2px;
            transform: translateY(-50%);
            // opacity: 0.2;
            color: #fff;
            // line-height: 30px;
            font-size: 12px;
            text-align: center;
            line-height: 18px;
            // display:flex;
            // align-items: column;
          }
        }
        .active-border {
          position: absolute;
          left: -10px;
          top: 0px;
          right: -10px;
          bottom: 0;
          border-top: 4px solid #dde6ff;
          border-left: 11px solid #dde6ff;
          border-right: 11px solid #dde6ff;
          border-bottom: 4px solid #dde6ff;
          cursor: pointer;
          z-index: 999;
          border-radius: 4px;
          .active-common {
            width: 3px;
            height: 8px;
            background: #2d5fe2;
            box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
            border-radius: 4px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            //   border: 5px solid rgba(0,0,0,0);
          }

          .active-left {
            position: absolute;
            left: -11px;
            height: 100%;
            width: 10px;
            background-color: #dde6ff;
            //  border-radius: 4px;
            // background-color: red;
          }
          .active-right {
            position: absolute;
            height: 100%;
            width: 10px;
            background-color: #dde6ff;
            right: -11px;
          }
        }
      }

      li {
        // border-bottom: 1px solid $color3;
        height: $liHeight;
        position: relative;

        // line-height: $liHeight;
        // padding-top: 4px;
      }

      i {
        display: inline-block;
        width: 10px;
        height: 20px;
        // border-right: 1px solid $color3;
        cursor: pointer;

        &.h5ds-timeline-selected {
          background: $main;
        }

        &:hover:not(.h5ds-timeline-selected) {
          background: $color5;
        }
      }
    }
  }

  .h5ds-timeline-footer {
    height: 15px;
    line-height: 15px;
    color: $text1;
    font-size: 12px;
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 2000;
    .h5ds-timeline-left {
      background: #fff;
    }

    .h5ds-timeline-right {
      background: #fff;
      border-top: 0.5px solid #c0c0c0;
      border-left: 0.5px solid #c0c0c0;
    }
  }

  .h5ds-timeline-layers {
    li {
      height: $liHeight;
      position: relative;
    }

    .h5ds-timeline-item1 {
      color: $color2;
      padding-left: 5px;
      font-size: 12px;
      text-align: left;
      height: $liHeight;
      overflow: hidden;
    }

    .h5ds-timeline-right {
      height: $liHeight;
    }

    .h5ds-timeline-view,
    .h5ds-timeline-lock {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 100px;
      background: $color2;
      position: relative;
      top: -2px;
      margin: 0 6px;
    }
  }

  // 模拟滚动条
  .h5ds-timeline-slider {
    height: 100%;
    margin: 1px;
    // background: $color5;
    position: relative;
    overflow: auto;
    overflow-y: hidden;
    cursor: move;

    .h5ds-timeline-slider-leng {
      height: 1px;
      top: -1px;
    }

    /* Let's get this party started */
    /* Let's get this party started */
    &::-webkit-scrollbar {
      width: 5px;
      height: 14px;
    }

    &::-webkit-scrollbar-track {
      // background: $color6;
    }

    &::-webkit-scrollbar-thumb {
      background: #c0c0c0;
      // border-radius: 0;
      border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb:window-inactive {
      // background: $color2;
    }

    &::-webkit-scrollbar-button:vertical:decrement,
    &::-webkit-scrollbar-button:vertical:increment {
      height: 5px;
      width: 5px;
      background: $color6;
    }
  }
}

/* 选中元素的背景色 */
.selectElement {
  background: #f7f7f7;
}

.h5ds-global-clearfix:after {
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.el-icon {
  font-size: 16px;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb:window-inactive {
  background-color: rgba(255, 0, 0, 0.4);
}

.animation-bounceInUp {
  animation: bounceInUp;
  animation-duration: 2s;
}
</style>
