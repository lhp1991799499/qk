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
              <div class="img-box" @click="handleClick(i)">
                <img
                  style="width: 100%; height: 100%"
                  :src="i.url ? i.url : ''"
                  alt=""
                />
              </div>
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
            <div class="img-box" @click="handleClick(item)">
              <img
                style="width: 100%; height: 100%"
                :src="item.url ? item.url : ''"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="imgs-container">
        <div v-for="item in imgs" :key="item.idx">
          <div class="img-box" @click="handleClick(item.idx)">
            <img
              style="width: 100%; height: 100%"
              :src="item.url ? item.url : ''"
              alt=""
            />
          </div>
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
              elName: 'qk-image',
              url: 'http://seopic.699pic.com/photo/50051/4111.jpg_wh1200.jpg',
              width: 100,
              height: 66
            },
            {
              img: '1',
              elName: 'qk-image'
              // url: 'https://up.enterdesk.com/edpic_source/eb/34/40/eb34405739ad0e41ec34cd8e16711f30.jpg'
            },
            {
              img: '2',
              elName: 'qk-image',
              url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Ff726ac98-b6da-4003-a098-b9290b3738ef%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1691823094&t=1138e6bc5eff916179373a9f42962d93'
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
              img: '0',
              elName: 'qk-image',
              url: 'https://img.alicdn.com/imgextra/i2/2516501003/O1CN01NLp48t1JHQ5HbENCe_!!2516501003.jpg',
              width: 100,
              height: 133
            },
            {
              img: '1',
              elName: 'qk-image',
              url: 'https://img.alicdn.com/imgextra/i2/2516501003/O1CN01NLp48t1JHQ5HbENCe_!!2516501003.jpg'
            },
            {
              img: '2',
              elName: 'qk-image',
              url: 'https://p6.itc.cn/q_70/images03/20200609/37861e24800c4a0c96f3238cdca3348f.gif'
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
              img: '0',
              elName: 'qk-image',
              url: 'https://st-gdx.dancf.com/odyssey/uxms/430180897/96739/20210222-145154-f50b.jpeg?x-oss-process=image%2Fresize%2Cl_3000',
              width: 790,
              height: 1108
            },
            {
              img: '1',
              elName: 'qk-image',
              url: 'https://gd-filems.dancf.com/gaoding/gaoding/30828/62b8fa1558ee471e820bb210e1549245.png?auth_key=1690357791-cf3af4912a994d058c11ff1002156723-9024220393870738478-233a48051a185ed1f75ab77b02d1cc0a',
              width: 621,
              height: 1104
            },
            {
              img: '2',
              elName: 'qk-image',
              url: 'https://gd-filems.dancf.com/gaoding/gaoding/30828/1deacf328ff94a06815127a4a37384e5.png?auth_key=1690357791-cf3af4912a994d058c11ff1002156723-9024220393870738478-233a48051a185ed1f75ab77b02d1cc0a',
              width: 167,
              height: 212
            }
          ]
        },
        {
          id: '',
          name: '几何',
          items: [
            {
              img: '0',
              elName: 'qk-image',
              url: 'https://gd-filems.dancf.com/gaoding/gaoding/30828/d2d8b77f820c481daac9fb7f06ed3879.png?auth_key=1690357791-cf3af4912a994d058c11ff1002156723-9024220393870738478-233a48051a185ed1f75ab77b02d1cc0a',
              width: 34,
              height: 78
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
        this.moreObj.index = index;
      } else {
        this.allFlag = false;
      }
    },
    handleClick(item) {
      let items = {
        elName: 'qk-image',
        title: '图片',
        icon: 'iconfont iconshouyelunbotu',
        valueType: '', // 标识数据类型，用于表单组件,
        defaultStyle: {
          height: item.height,
          width: item.width
        }
      };
      let props = this.getComponentProps(items.elName);
      props.imageSrc = item.url;
      this.$store.dispatch('addElement', { ...items, needProps: props });
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
