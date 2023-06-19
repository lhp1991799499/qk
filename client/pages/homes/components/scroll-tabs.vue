<template>
  <div class="swiper-container">
    <swiper class="swiper" :options="swiperOption" ref="swiper1">
      <swiper-slide v-for="item in list[tIndex]" :key="item.name">
        <div class="item" @click="changeList(item.name)">{{ item.label }}</div>
      </swiper-slide>
      <!-- <div class="swiper-pagination" slot="pagination"></div> -->
    </swiper>
    <!-- <div class="swiper-button-prev" slot="button-prev"></div>
    <div class="swiper-button-next" slot="button-next"></div> -->
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    tIndex: {
      type: Number
    }
  },
  mounted() {
    this.$refs.swiper1.$swiper.init();
  },
  data() {
    return {
      swiperOption: {
        init: false,
        slidesPerView: 5,
        spaceBetween: 3,
        slidesPerGroup: 5,
        loop: false,
        loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      list: [
        [],
        [
          {
            label: '热门0',
            name: '1_0'
          },
          {
            label: '分割线',
            name: '1_1'
          },
          {
            label: '热门2',
            name: '1_2'
          },
          {
            label: '热门3',
            name: '1_3'
          },
          {
            label: '热门4',
            name: '1_4'
          },
          {
            label: '热门5',
            name: '1_5'
          },
          {
            label: '热门6',
            name: '1_6'
          },
          {
            label: '热门7',
            name: '1_7'
          },
          {
            label: '热门8',
            name: '1_8'
          },
          {
            label: '热门9',
            name: '1_9'
          }
        ],
        [
          {
            label: '类型0',
            name: '2_0'
          },
          {
            label: '分割线',
            name: '2_1'
          },
          {
            label: '类型2',
            name: '2_2'
          },
          {
            label: '类型',
            name: '2_3'
          },
          {
            label: '类型4',
            name: '2_4'
          }
        ],
        [
          {
            label: '用途0',
            name: '3_0'
          },
          {
            label: '分割线',
            name: '3_1'
          },
          {
            label: '用途2',
            name: '3_2'
          },
          {
            label: '用途',
            name: '3_3'
          },
          {
            label: '用途4',
            name: '3_4'
          }
        ],
        [
          {
            label: '节日0',
            name: '4_0'
          },
          {
            label: '分割线',
            name: '4_1'
          },
          {
            label: '节日2',
            name: '4_2'
          },
          {
            label: '节日3',
            name: '4_3'
          },
          {
            label: '节日4',
            name: '4_4'
          }
        ],
        [
          {
            label: '风格0',
            name: '5_0'
          },
          {
            label: '分割线',
            name: '5_1'
          },
          {
            label: '风格2',
            name: '5_2'
          },
          {
            label: '风格3',
            name: '5_3'
          },
          {
            label: '风格4',
            name: '5_4'
          }
        ]
      ]
    };
  },
  methods: {
    changeList(name) {
      this.$emit('change', name);
    }
  }
};
</script>

<style lang="scss" scoped>
.swiper-container {
  position: relative;
  height: 40px;
  .swiper {
    height: 50px;
    width: 100%;

    .swiper-slide {
      .item {
        padding: 6px 4px;
        background: #f8fafc;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        &:hover {
          background: #e8f3ff;
        }
      }
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      // font-weight: bold;
    }
  }
  .swiper-button-prev,
  .swiper-button-prev,
  .swiper-button-prev,
  .swiper-button-next {
    scale: 0.4;
  }
  .swiper-button-prev,
  .swiper-button-prev {
    left: -8px;
  }
  .swiper-button-prev,
  .swiper-button-next {
    right: -8px;
  }
}
</style>
