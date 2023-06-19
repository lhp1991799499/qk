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
export default {
  created() {
    this.newPage();
  },
  data() {
    return {
      loading: true
    };
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
            console.log(res.body);
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
    }
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
