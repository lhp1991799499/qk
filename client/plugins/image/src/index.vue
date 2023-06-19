<!--
 * @version: 
 * @Author: leaolly
 * @Date: 2023-03-22 09:35:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-19 12:03:08
 * @Descripttion: 模块描述
-->
<!--test.vue-->
<template>
  <div class="qk-image">
    <img class="qk-image" :src="imageUrl" alt="" />
  </div>
</template>

<script>
export default {
  name: 'QkImage', // 这个名字很重要，它就是未来的标签名<qk-text></qk-text>
  props: {
    imageSrc: {
      type: String
      // default: '/static/demo/demo.jpg'
    }
  },
  data() {
    return {
      imageUrl: ''
    };
  },
  computed: {
    // "resource" + this.$store.state.editor.activeImg.url.split("resource")[1]
    // imageUrl() {
    //   if (this.imageSrc.includes('static')) return this.imageSrc;
    //   return 'resource' + this.imageSrc.split('resource')[1];
    // }
  },
  created() {},
  mounted() {
    this.$bus.$on('ceshi', (item) => {
      console.log(item);
      this.imageUrl =
        'https://img.alicdn.com/imgextra/i3/O1CN01Sf6dER1zbJ3uVQ0lE_!!6000000006732-0-tps-846-472.jpg';
      this.$forceUpdate();
    });
  }
};
</script>

<style lang="scss" scoped>
.qk-image {
  width: 100%;
  height: 100%;
}

img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
