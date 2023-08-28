<template>
  <div class="image-set-container">
    <div class="title">图片</div>
    <el-upload
      action="http://117.43.10.86:83/poster/upload"
      class="avatar-uploader"
      :show-file-list="false"
      :on-success="handleSuccess"
    >
      <!-- :before-upload="beforeUpload"-->
      <el-button type="primary">替换图片</el-button>
    </el-upload>
    <div class="title mt28px">操作</div>
    <div class="mb24px">
      <div>
        <el-button @click="transform('x')"> 水平翻转 </el-button>
      </div>
      <div>
        <el-button class="mt16px" @click="transform('y')"> 垂直翻转 </el-button>
      </div>
    </div>
    <menu-edit-panel></menu-edit-panel>

    <el-popover placement="bottom-start" width="300" trigger="click">
      <div class="maskContent">
        <div
          v-for="(item, index) in maskList"
          :key="index"
          @click="masking(item)"
        >
          <img :src="item.url" alt="" />
        </div>
      </div>
      <div
        style="
          width: 272px;
          height: 68px;
          background: #f6f7f9;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          align-items: center;
        "
        slot="reference"
      >
        <div
          style="
            width: 52px;
            height: 52px;
            background: #ffffff;
            border-radius: 4px;
          "
        >
          <div class="gray-img-add">
            <img
              :style="{
                width: activeElement.commonStyle.WebkitMask ? '40px' : '16px',
                height: activeElement.commonStyle.WebkitMask ? '40px' : '16px'
              }"
              :src="
                activeElement.commonStyle.WebkitMask
                  ? require('../../../../assets/image/icon/animate-default.svg')
                  : require('../../../../assets/image/icon/gray-add.png')
              "
              alt=""
            />
          </div>
        </div>
        <div class="maskTitle">添加蒙版</div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import editor from '@client/mixins/editor.js';
import { mapGetters } from 'vuex';
import menuEditPanel from './edit-panel/common/menu-edit-panel.vue';
import $axios from '@/service/httpServer';
export default {
  mixins: [editor],
  computed: {
    ...mapGetters(['activeElement'])
  },
  mounted() {},
  components: { menuEditPanel },
  data() {
    return {
      maskList: [
        {
          title: '取消蒙版',
          url: ''
        },
        {
          title: '圆',
          url: 'http://117.43.10.86:83/resource/longtemp/230801/1mmzuim3z75f.png'
        },

        {
          title: '五角星',
          url: 'http://117.43.10.86:83/resource/longtemp/230804/ysvfc9t83uwh.png'
        },
        {
          title: '五角星',
          url: 'http://117.43.10.86:83/resource/longtemp/230804/ysvfc9t83uwh.png'
        }
      ]
    };
  },
  methods: {
    handleSuccess(res, file) {
      if (res.code === 0) {
        console.log(res);

        this.$store.dispatch('resetElementCommonStyle', {
          width: this.activeElement.commonStyle.width,
          height:
            (res.height * this.activeElement.commonStyle.width) / res.width,
          statusHistory: false
        });
        // this.$emit("input", res.body.url);
        // this.$emit("uploaded", res.body.url);
        // this.$emit("getPostPath", res.body.url);
        this.$store.commit('setImgActive', res.url);
        this.$store.dispatch('addHistoryCache');
      }
    },
    beforeUpload(file) {
      if (this.activeElement.commonStyle.lock) return; //如果是锁定状态  不能翻转和替换图片
      const { type } = this;
      const ext = file.name.split('.').pop();
      if (ext === 'jpg' || ext === 'png' || ext === 'gif' || ext === 'jpeg') {
        //return true;
      } else {
        this.$message({ message: '格式不支持哦!', type: 'warning' });
        return false;
      }

      const params = new FormData();
      params.append('file', file);
      params.append('id', String(this.$route.query.id));
      // console.log(typeof this.$route.query.id)

      let url1 = 'http://117.43.10.86:83/poster/upload';
      $axios.post(url1, params).then(function (promise) {
        console.log(promise.data);
      });
      // this.$API.uploadFile(params).then((res) => {
      //   this.handleSuccess(res, file);
      // });

      return false;
    },
    transform(val) {
      let transform = '';
      const defaultTransform = this.activeElement.commonStyle.transform;
      if (this.activeElement.commonStyle.lock) return; //如果是锁定状态  不能翻转和替换图片
      if (!defaultTransform) {
        if (val === 'x') {
          transform = 'scale(-1,1)';
        }
        if (val === 'y') {
          transform = 'scale(1,-1)';
        }
      } else {
        if (val === 'x') {
          if (defaultTransform === 'scale(-1,-1)') {
            transform = 'scale(1,-1)';
          }
          if (defaultTransform === 'scale(1,-1)') {
            transform = 'scale(-1,-1)';
          }
          if (defaultTransform === 'scale(1,1)') {
            transform = 'scale(-1,1)';
          }
          if (defaultTransform === 'scale(-1,1)') {
            transform = 'scale(1,1)';
          }
        }
        if (val === 'y') {
          if (defaultTransform === 'scale(-1,-1)') {
            transform = 'scale(-1,1)';
          }
          if (defaultTransform === 'scale(1,-1)') {
            transform = 'scale(1,1)';
          }
          if (defaultTransform === 'scale(1,1)') {
            transform = 'scale(1,-1)';
          }
          if (defaultTransform === 'scale(-1,1)') {
            transform = 'scale(-1,-1)';
          }
        }
      }
      this.$store.dispatch('resetElementCommonStyle', {
        transform
      });
    },
    replaceImg() {},
    masking(item) {
      this.$store.dispatch('resetElementCommonStyle', {
        WebkitMask: item.url
          ? 'url(' + item.url + ') center center / contain no-repeat'
          : ''
      });
      this.$store.commit('changeWebKitMask', {
        WebkitMask: item.url
          ? 'url(' + item.url + ') center center / contain no-repeat'
          : ''
      });
      this.$bus.$emit('refreshEditorMainKey');
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar-uploader {
  width: 100%;
}
.mb24px {
  margin-bottom: 24px;
}
.mt28px {
  margin-top: 28px;
}
.mt16px {
  margin-top: 16px;
}
.image-set-container {
  min-width: 320px;
  box-sizing: border-box;
  padding: 16px 24px;
  height: 100%;
  .title {
    color: #333;
    font-weight: 600;
    margin-bottom: 24px;
  }
  /deep/ .el-button--primary {
    width: 100%;
    background: #5584ff;
  }
  /deep/ .el-button {
    width: 100%;
  }
  /deep/ .el-upload {
    width: 100%;
  }
}

.maskTitle {
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
  width: 160px;
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
.maskContent {
  padding: 10px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  div {
    cursor: pointer;
    width: 52px;
    height: 52px;

    background: #f8fafc;
    border-radius: 4px;
    img {
      width: 24px;
      height: 24px;
      margin: 14px;
    }
  }
}
</style>
