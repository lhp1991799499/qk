<!--
 * @version: 
 * @Author: leaolly
 * @Date: 2023-03-22 09:35:06
 * @LastEditors: 
 * @LastEditTime: 2023-06-13 10:15:40
 * @Descripttion: 模块描述
-->
<template>
  <div class="page-layout">
    <div class="page-header-wrapper">
      <PageHeader></PageHeader>
    </div>
    <router-view class="sub-page" />
  </div>
</template>

<script>
import PageHeader from '@/components/page-header';
export default {
  components: {
    PageHeader
  }
};
</script>

<style scoped>
.page-layout {
  height: 100%;
  /* padding-top: 48px; */
}
.sub-page {
  position: relative;
  height: 100%;
}
.page-header-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}
</style>
