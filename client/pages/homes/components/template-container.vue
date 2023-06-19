<template>
  <div>
    <div v-if="tIndex == 0">
      <div v-if="!allFlag">
        <div v-for="(item, index) in leftMoreImages" :key="item.name">
          <div class="flex-item">
            <div class="title">{{ item.name }}</div>
            <div class="more" @click="moreClick(index)">更多</div>
          </div>
          <div class="imgs-container">
            <div v-for="i in item.items.slice(0, 3)" :key="i.img">
              <div class="img-box" @click="handleClick(i)"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="imgs-container">
          <div
            v-for="item in leftMoreImages[moreObj.index].items"
            :key="item.img"
          >
            <div class="img-box" @click="handleClick(item)"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="imgs-container">
        <div v-for="item in imgs" :key="item.idx">
          <div class="img-box" @click="handleClick(item.idx)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import editorProjectConfig from "@/pages/editor/DataModel";
import editor from '@client/mixins/editor.js';

export default {
  mixins: [editor],
  props: {
    tIndex: Number,
    tIndex2: Number
  },
  data() {
    return {
      templateArr: [
        {
          id: '',
          name: '节气',
          items: [
            // {
            //   elName: "qk-text",
            //   title: "文字",
            //   icon: "iconfont iconwenben",
            //   // 每个组件设置props来展示哪些显示哪些编辑项
            //   valueType: "", // 标识数据类型，用于表单组件
            //   defaultStyle: {
            //     height: 40,
            //   },
            // },
            {
              img: '0',
              elName: 'qk-image'
            },
            {
              img: '1'
            },
            {
              img: '2'
            }
          ]
        },
        {
          id: '',
          name: '节气2',
          items: [
            {
              img: '0'
            },
            {
              img: '1'
            },
            {
              img: '2'
            }
          ]
        },
        {
          id: '',
          name: '节气3',
          items: [
            {
              img: '0'
            },
            {
              img: '1'
            },
            {
              img: '2'
            }
          ]
        }
      ],
      imgs: [
        {
          idx: 0,
          imgSrc: ''
        },
        {
          idx: 1,
          imgSrc: ''
        },
        {
          idx: 2,
          imgSrc: ''
        },
        {
          idx: 3,
          imgSrc: ''
        }
      ],
      leftMoreImages: [
        {
          id: '',
          name: '节气',
          items: [
            {
              img: '0',
              elName: 'qk-image'
            },
            {
              img: '1',
              elName: 'qk-image'
            },
            {
              img: '2',
              elName: 'qk-image'
            },
            {
              img: '4',
              elName: 'qk-image'
            },
            {
              img: '5',
              elName: 'qk-image'
            },
            {
              img: '6',
              elName: 'qk-image'
            },
            {
              img: '7',
              elName: 'qk-image'
            },
            {
              img: '8',
              elName: 'qk-image'
            },
            {
              img: '9',
              elName: 'qk-image'
            }
          ]
        },
        {
          id: '',
          name: '男装',
          items: [
            {
              img: '0'
            },
            {
              img: '1'
            },
            {
              img: '2'
            },
            {
              img: '4'
            },
            {
              img: '4'
            }
          ]
        },
        {
          id: '',
          name: '女装',
          items: [
            {
              img: '0'
            },
            {
              img: '1'
            },
            {
              img: '2'
            }
          ]
        },
        {
          id: '',
          name: '几何',
          items: [
            {
              img: '0'
            },
            {
              img: '1'
            },
            {
              img: '2'
            }
          ]
        }
      ], //左侧的更多数据图片
      allFlag: false, //是否是全部的分类
      moreObj: { index: 0 } //点击的是那个分类的更多
    };
  },
  async created() {
    // await this.newPage();
    // this.$store.dispatch("setPrjectData");
  },
  computed: {
    ...mapState({
      // projectData: (state) => state.editor.projectData,
      // activePageUUID: (state) => state.editor.activePageUUID,
      // activeElementUUID: (state) => state.editor.activeElementUUID,
    })
  },
  methods: {
    // // 新建页面
    // async newPage(isTemplate) {
    //   let newPageData = editorProjectConfig.getProjectConfig();
    //   this.$API
    //     .createPage({ ...newPageData })
    //     .then((res) => {
    //       if (res.body) {
    //         console.log(res.body);
    //         let id = res.body._id;
    //         this.initPageData(id);
    //       }
    //     })
    //     .catch(() => {
    //       this.loading = false;
    //     });
    // },
    // /**
    //  * 初始化页面数据
    //  */
    // async initPageData(id) {
    //   console.log(this.id);
    //   // this.loading = true;
    //   this.$API
    //     .getPageDetail({ pageId: id })
    //     .then((res) => {
    //       // this.loading = false;
    //       this.$store.dispatch("setPrjectData", {
    //         ...res.body,
    //       });
    //     })
    //     .catch(() => {
    //       // this.loading = false;
    //     });
    // },

    //  点击更多 获取id  掉接口
    moreClick(index) {
      if (index != -1) {
        this.allFlag = true;
        console.log(index);
        this.moreObj.index = index;
      } else {
        this.allFlag = false;
      }
    },
    handleClick() {
      let item = {
        elName: 'qk-image',
        title: '图片',
        icon: 'iconfont iconshouyelunbotu',
        valueType: '', // 标识数据类型，用于表单组件,
        defaultStyle: {
          height: 210
        },
        imageUrl: '/static/demo/demo.jpg'
      };
      //在这里传入图片路径
      this.$bus.$emit('ceshi', item.url);
      let props = this.getComponentProps(item.elName);
      this.$store.dispatch('addElement', { ...item, needProps: props });
    }
  }
};
</script>
<style lang="scss" scoped>
.more {
  cursor: pointer;
  font-weight: 400;
  color: #999999;
  font-size: 13px;
  font-family: 'Microsoft Yahei';
  position: relative;
  padding: 0 10px 0 0;
  line-height: 21px;
}
.more::after {
  content: '';
  position: absolute;
  width: 7px;
  height: 11px;
  top: 5px;
  right: 0;
  background: url('../../../../assets/image/icon/more.png') no-repeat;
}
.flex-item {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}
.title {
  font-size: 13px;
  color: #333333;
  font-family: 'Microsoft Yahei';
  font-weight: bold;
  line-height: 21px;
}
.img-box {
  width: 82px;
  height: 82px;
  background: greenyellow;
  border-radius: 4px;
  margin-top: 12px;
}
.imgs-container {
  display: flex;
  // justify-content: space-between;
  flex-wrap: wrap;

  // /* 父元素中第三个子元素和3的倍数元素的样式 */父元素 :nth-child(3),父元素 :nth-child(3n) {  /* 样式 */}
}
.imgs-container > div {
  margin-right: 12px;
}
.imgs-container :nth-child(3),
.imgs-container :nth-child(3n) {
  margin: 0;
}
</style>
