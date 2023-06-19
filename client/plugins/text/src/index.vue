<!--
 * @version: 
 * @Author: leaolly
 * @Date: 2023-04-27 12:07:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-12 17:05:54
 * @Descripttion: 模块描述
-->
<!--test.vue-->
<template>
  <div
    class="qk-text"
    contenteditable="plaintext-only"
    @input="changeDivText($event)"
    @focus="divFocus"
    @blur="divBlur"
    v-html="showText"
  ></div>
</template>

<script>
import VueDragResizeRotate from '@gausszhou/vue-drag-resize-rotate';
import { mapGetters, mapState } from 'vuex';
import editorProjectConfig from '@client/pages/editor/DataModel';
export default {
  name: 'QkText', // 这个名字很重要，它就是未来的标签名<qk-text></qk-text>
  components: {
    VueDragResizeRotate
  },
  computed: {
    ...mapState({
      projectData: (state) => state.editor.projectData
    }),
    ...mapGetters(['activeElement', 'activePage'])
  },
  props: {
    text: {
      type: String,
      default: '这是一段文字'
    },
    font: {
      type: String,
      default: 'wryh'
    }
  },
  watch: {
    showText: {
      handler: function (newVal, oldVal) {
        console.log(newVal, oldVal, this.showText);
      },
      deep: true
    }
  },
  data() {
    return {
      defaultStyle: {
        height: 40
      },
      showText: '',
      editing: false
    };
  },
  created() {
    this.showText = this.text;
  },
  methods: {
    resizing(x, y, w, h) {
      console.log('resizing', x, y, w, h);
    },
    rotating(angle) {
      console.log(angle);
    },
    // 文本改变时事件
    changeDivText(event) {
      this.editText = event.target.innerHTML;
      this.$store.dispatch('changeDivText', this.editText);
    },
    divFocus() {
      this.editText = this.value;
    },
    divBlur() {
      this.editText = this.value;
      // this.$emit('input', this.editText);
    }
  }
};
</script>

<style lang="scss" scoped>
div[contenteditable] {
  outline: none;
}
</style>
