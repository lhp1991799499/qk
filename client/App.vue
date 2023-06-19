<!--
 * @version: 
 * @Author: leaolly
 * @Date: 2023-05-10 12:37:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-13 10:11:17
 * @Descripttion: 模块描述
-->
<template>
  <div id="app">
    <router-view />
    <!-- <homes /> -->
  </div>
</template>
<script>
import homes from '@/pages/homes';
export default {
  components: {
    homes
  }
};
</script>
<style lang="scss">
html,
body {
  position: relative;
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: relative;
  height: 100%;
  overflow-y: hidden;
}
</style>
