<template>
  <div class="container" style="display: block">
    <el-upload
      action="#"
      class="avatar-uploader"
      :show-file-list="false"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    >
      <el-button type="primary"
        ><i><img src="../../../../../assets/image/icon/uploadi.png" alt="" /></i
        >上传素材</el-button
      >
    </el-upload>
  </div>
</template>

<script>
import scrollTabs from "../scroll-tabs.vue";
import templateContainer from "../template-container.vue";
import editor from "@client/mixins/editor.js";

export default {
  mixins: [editor],
  components: {
    scrollTabs,
    templateContainer,
  },
  computed: {
    imageUrl() {
      if (this.value.includes("static")) return this.value;
      return "resource" + this.value.split("resource")[1];
    },
  },
  data() {
    return {
      item: {
        elName: "qk-image",
        title: "图片",
        icon: "iconfont icontupian",
        valueType: "", // 标识数据类型，用于表单组件,
        defaultStyle: {
          height: 200,
        },
      },
    };
  },
  methods: {
    handleSuccess(res, file) {
      if (res.code === 200) {
        console.log(res);
        // this.$emit("input", res.body.url);
        // this.$emit("uploaded", res.body.url);
        // this.$emit("getPostPath", res.body.url);
        this.$store.commit("setImgActive", res.body.url);
        // this.$store.commit("setImgs", {
        //   url: res.body.url,
        //   uuid: this.$store.state.editor.activeImg.uuid,
        // });
        this.handleClick(this.item);
      }
    },
    beforeUpload(file) {
      const { type } = this;
      const ext = file.name.split(".").pop();
      if (ext === "jpg" || ext === "png" || ext === "gif" || ext === "jpeg") {
        //return true;
      } else {
        this.$message({ message: "格式不支持哦!", type: "warning" });
        return false;
      }

      const params = new FormData();
      params.append("file", file);
      params.append("id", String(this.$route.query.id));
      // console.log(typeof this.$route.query.id)
      this.$API.uploadFile(params).then((res) => {
        this.handleSuccess(res, file);
      });
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-uploader {
  width: 100%;
}
/deep/ .el-button--primary {
  background: #5584ff;
  border-color: #5584ff;
  color: #ffffff;
  width: 100%;
}
/deep/ .el-upload {
  width: 100%;
}
.container {
  width: 320px;
  height: calc(100vh - 55px);
  padding: 24px;
  box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.12);
  display: flex;
  flex-direction: column;
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
