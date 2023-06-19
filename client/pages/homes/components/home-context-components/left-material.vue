<template>
  <div class="container" style="display: block">
    <div class="w100">
      <el-input
        placeholder="搜索素材"
        v-model="input"
        clearable
        prefix-icon="el-icon-search"
        @clear="onClearChange"
        @keyup.enter.native="search(input)"
      >
      </el-input>
    </div>
    <div v-if="noData">
      <div class="pic-noData">
        <p>没有找到您要的搜索结果</p>
      </div>
    </div>
    <div v-else>
      <!-- <el-tabs @tab-click="handleClick"> -->
      <!-- <el-tab-pane v-for="item in list1" :label="item.label" :key="item.name">
        </el-tab-pane> -->
      <!-- </el-tabs> -->
      <div class="Material">
        <el-button
          :class="[
            MaterialName == item.name ? 'MaterialButtonPitch' : '',
            'MaterialButton'
          ]"
          size="small"
          v-for="item in list1"
          :key="item.name"
          @click="searchMaterial(item)"
          >{{ item.label }}</el-button
        >
        <div style="position: relative">
          <el-button
            :class="[
              MaterialName == 'more' ? 'MaterialButtonPitch' : '',
              'MaterialButton'
            ]"
            size="small"
            @click="MaterialCascader()"
          >
            {{ more }}
            <img
              style="width: 11px; margin-left: 4px; height: 7px"
              src="../../../../../assets/image/canvasSvg/more.svg"
              alt=""
            />
          </el-button>
          <el-cascader
            class="cascAder"
            popper-class="popperCascader"
            @change="moreChange"
            size="mini"
            ref="cascader"
            :options="options"
            :show-all-levels="false"
          ></el-cascader>
        </div>
      </div>
      <!-- <div>1111</div> -->

      <scrollTabs
        v-show="t_index != 0"
        :tIndex="parseInt(t_index)"
        @change="handleChange($event)"
      />
      <template-container
        :tIndex="parseInt(t_index)"
        :tIndex2="this.t_index2"
        ref="container"
      />
    </div>
  </div>
</template>

<script>
import scrollTabs from '../scroll-tabs.vue';
import templateContainer from '../template-container.vue';

export default {
  components: {
    scrollTabs,
    templateContainer
  },
  data() {
    return {
      input: '',
      list1: [
        {
          label: '全部',
          name: 'all',
          id: -1
        },
        {
          label: '热门',
          name: 'hot',
          id: 0
        },
        {
          label: '类型',
          name: 'type',
          id: 1
        },
        {
          label: '用途',
          name: 'use'
        },
        {
          label: '节日',
          name: 'festival'
        },
        {
          label: '风格',
          name: 'style'
        }
      ], //主要按钮
      moreList: [], //更多按钮
      more: '更多', //更多
      MaterialName: '', //所选的素材名称
      t_index: 0,
      t_index2: 0,

      noData: false,
      options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致'
                },
                {
                  value: 'fankui',
                  label: '反馈'
                },
                {
                  value: 'xiaolv',
                  label: '效率'
                },
                {
                  value: 'kekong',
                  label: '可控'
                }
              ]
            },
            {
              value: 'daohang',
              label: '导航',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '侧向导航'
                },
                {
                  value: 'dingbudaohang',
                  label: '顶部导航'
                }
              ]
            }
          ]
        },
        {
          value: 'zujian',
          label: '组件',
          children: [
            {
              value: 'basic',
              label: 'Basic',
              children: [
                {
                  value: 'layout',
                  label: 'Layout 布局'
                },
                {
                  value: 'color',
                  label: 'Color 色彩'
                },
                {
                  value: 'typography',
                  label: 'Typography 字体'
                },
                {
                  value: 'icon',
                  label: 'Icon 图标'
                },
                {
                  value: 'button',
                  label: 'Button 按钮'
                }
              ]
            },
            {
              value: 'form',
              label: 'Form',
              children: [
                {
                  value: 'radio',
                  label: 'Radio 单选框'
                },
                {
                  value: 'checkbox',
                  label: 'Checkbox 多选框'
                },
                {
                  value: 'input',
                  label: 'Input 输入框'
                },
                {
                  value: 'input-number',
                  label: 'InputNumber 计数器'
                },
                {
                  value: 'select',
                  label: 'Select 选择器'
                },
                {
                  value: 'cascader',
                  label: 'Cascader 级联选择器'
                },
                {
                  value: 'switch',
                  label: 'Switch 开关'
                },
                {
                  value: 'slider',
                  label: 'Slider 滑块'
                },
                {
                  value: 'time-picker',
                  label: 'TimePicker 时间选择器'
                },
                {
                  value: 'date-picker',
                  label: 'DatePicker 日期选择器'
                },
                {
                  value: 'datetime-picker',
                  label: 'DateTimePicker 日期时间选择器'
                },
                {
                  value: 'upload',
                  label: 'Upload 上传'
                },
                {
                  value: 'rate',
                  label: 'Rate 评分'
                },
                {
                  value: 'form',
                  label: 'Form 表单'
                }
              ]
            },
            {
              value: 'data',
              label: 'Data',
              children: [
                {
                  value: 'table',
                  label: 'Table 表格'
                },
                {
                  value: 'tag',
                  label: 'Tag 标签'
                },
                {
                  value: 'progress',
                  label: 'Progress 进度条'
                },
                {
                  value: 'tree',
                  label: 'Tree 树形控件'
                },
                {
                  value: 'pagination',
                  label: 'Pagination 分页'
                },
                {
                  value: 'badge',
                  label: 'Badge 标记'
                }
              ]
            },
            {
              value: 'notice',
              label: 'Notice',
              children: [
                {
                  value: 'alert',
                  label: 'Alert 警告'
                },
                {
                  value: 'loading',
                  label: 'Loading 加载'
                },
                {
                  value: 'message',
                  label: 'Message 消息提示'
                },
                {
                  value: 'message-box',
                  label: 'MessageBox 弹框'
                },
                {
                  value: 'notification',
                  label: 'Notification 通知'
                }
              ]
            },
            {
              value: 'navigation',
              label: 'Navigation',
              children: [
                {
                  value: 'menu',
                  label: 'NavMenu 导航菜单'
                },
                {
                  value: 'tabs',
                  label: 'Tabs 标签页'
                },
                {
                  value: 'breadcrumb',
                  label: 'Breadcrumb 面包屑'
                },
                {
                  value: 'dropdown',
                  label: 'Dropdown 下拉菜单'
                },
                {
                  value: 'steps',
                  label: 'Steps 步骤条'
                }
              ]
            },
            {
              value: 'others',
              label: 'Others',
              children: [
                {
                  value: 'dialog',
                  label: 'Dialog 对话框'
                },
                {
                  value: 'tooltip',
                  label: 'Tooltip 文字提示'
                },
                {
                  value: 'popover',
                  label: 'Popover 弹出框'
                },
                {
                  value: 'card',
                  label: 'Card 卡片'
                },
                {
                  value: 'carousel',
                  label: 'Carousel 走马灯'
                },
                {
                  value: 'collapse',
                  label: 'Collapse 折叠面板'
                }
              ]
            }
          ]
        },
        {
          value: 'ziyuan',
          label: '资源',
          children: [
            {
              value: 'axure',
              label: 'Axure Components'
            },
            {
              value: 'sketch',
              label: 'Sketch Templates'
            },
            {
              value: 'jiaohu',
              label: '组件交互文档'
            }
          ]
        }
      ]
    };
  },
  methods: {
    handleClick(tab, event) {
      this.t_index = tab.index;
    },
    onClearChange() {
      console.log('12');
      this.noData = false;
    },
    handleChange(name) {
      this.t_index2 = name.substring(2);
    },
    search(txt) {
      this.noData = true;
      //根据txt搜索结果
      // if(this.noData){

      // }
    },
    // 按钮搜索素材事件
    searchMaterial(item) {
      this.MaterialName = item.name;
      this.$refs.container.moreClick(item.id);
      console.log(item);
    },
    // 选中更多时
    MaterialCascader() {
      this.$refs.cascader.$refs.input.$el.click();
      this.MaterialName = 'more';
    },
    moreChange(value) {
      // console.log(value);
      // console.log(this.$refs['cascader'].getCheckedNodes()[0].pathLabels);
      // this.$refs['cascader'].getCheckedNodes()[0].pathLabels  得到的是所有的label
      this.more =
        this.$refs['cascader'].getCheckedNodes()[0].pathLabels[
          this.$refs['cascader'].getCheckedNodes()[0].pathLabels.length - 1
        ];
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-items {
  width: 272px;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
  .el-tabs__header {
    margin: 0;
  }
}
/deep/ .el-tabs__item {
  padding: 0 10px;
}
/deep/ .el-tabs__item.is-active {
  color: #5584ff;
}
/deep/ .el-tabs__active-bar {
  background-color: #5584ff;
}
/deep/ .el-tabs__header {
  margin: 0;
}
.scroll-item {
  height: 32px;
  padding: 8px;
  background: #f8fafc;
  border-radius: 4px;
  text-align: center;
  margin-left: 8px;
  writing-mode: horizontal-tb;
  &:first-child {
    margin-left: 0;
  }
}
.w100 {
  width: 100%;
}
.container {
  width: 320px;
  height: calc(100vh - 55px);
  padding: 24px;
  box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
  display: flex;
  flex-direction: column;
  .pic-noData {
    width: 140px;
    height: 125px;
    background: url('../../../../../assets/no.png') no-repeat;
    margin: 30px auto 20px;
    text-align: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    p {
      padding: 140px 0 0;
    }
  }
  .Material {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #333333;
    .cascAder {
      opacity: 0;
      position: absolute;
      z-index: -1;
      left: 0;
      top: 14px;
    }

    // 选中的按钮
    .MaterialButtonPitch {
      border: 1px solid #5584ff;
      color: #5584ff;
    }
  }
  .MaterialButton {
    height: 32px;
    margin: 12px 8px 0px 0px;
    border-radius: 4px;
    border: 1px solid white;
    background: #f8fafc;
    font-weight: 600;
    /deep/ .el-cascader {
      display: none;
    }
  }
}
</style>
