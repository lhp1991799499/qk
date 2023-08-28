<!--
 * @version: 
 * @Author: leaolly
 * @Date: 2023-05-17 08:56:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-12 15:29:57
 * @Descripttion: 模块描述
-->
<template>
  <div>
    <home-header />
    <home-container v-loading="loading" />
  </div>
</template>

<script>
import homeHeader from './components/home-header.vue';
import homeContainer from './components/home-container.vue';
import editorProjectConfig from '@/pages/editor/DataModel';
import { mapState, mapGetters } from 'vuex';

// import timeline from  '@/components/timeline/index.vue';
export default {
  created() {
    this.newPage();
  },
  data() {
    return {
      loading: true,
      zero: 0,
      quan: 213,
    };
  },
  computed: {
    ...mapGetters(['activePage', 'activeElement'])
  },
  components: {
    homeHeader,
    homeContainer
  },
  methods: {
    // 新建页面
    newPage() {
      let newPageData = editorProjectConfig.getProjectConfig();
      this.$API
        .createPage({ ...newPageData })
        .then((res) => {
          if (res.body) {
            let id = res.body._id;
            this.initPageData(id);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * 初始化页面数据
     */
    initPageData(id) {
      console.log(this.id);
      // this.loading = true;
      this.$API
        .getPageDetail({ pageId: id })
        .then((res) => {
          // this.loading = false;
          this.$store.dispatch('setPrjectData', {
            ...res.body
          });
          this.loading = false;
        })
        .catch(() => {
          // this.loading = false;
        });
    },
  }
};
</script>

<style lang="scss">
/deep/ .el-button--primary {
  background: #5584ff;
  border-color: #5584ff;
  color: #ffffff;
}
</style>
