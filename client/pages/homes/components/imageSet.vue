<template>
  <div class="image-set-container">
    <div class="title">图片</div>
    <el-upload
      action="#"
      class="avatar-uploader"
      :show-file-list="false"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    >
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
  </div>
</template>

<script>
import editor from '@client/mixins/editor.js';
import { mapGetters } from 'vuex';
import menuEditPanel from './edit-panel/common/menu-edit-panel.vue';

export default {
  mixins: [editor],
  computed: {
    ...mapGetters(['activeElement'])
  },
  mounted() {},
  components: { menuEditPanel },
  data() {
    return {};
  },
  methods: {
    handleSuccess(res, file) {
      if (res.code === 200) {
        console.log(res);
        // this.$emit("input", res.body.url);
        // this.$emit("uploaded", res.body.url);
        // this.$emit("getPostPath", res.body.url);
        this.$store.commit('setImgActive', res.body.url);
      }
    },
    beforeUpload(file) {
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
      this.$API.uploadFile(params).then((res) => {
        this.handleSuccess(res, file);
      });
      return false;
    },
    transform(val) {
      let transform = '';
      const defaultTransform = this.activeElement.commonStyle.transform;
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
    replaceImg() {}
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
</style>
