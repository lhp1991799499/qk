
import { mapState, mapGetters } from 'vuex';

 let timeMixin = {
     data(){
        return {
            timer: null
        }
     },
     methods: {
        /* 修改当前的 */
        updateDelay({ elementUUId, animateUUId, animate: { delay, duration } }) {
           let updata = {
             elementUUId,
             animateUUId,
             animate: { delay, duration }
           };
           this.$store.commit('setAnimateDelayAndDuration', updata);
           if (this.timer) {
             clearTimeout(this.timer);
             this.timer = null;
           }
           this.timer = setTimeout(() => {
             this.$store.dispatch('addHistoryCache');
           }, 1000);
        },
  
        /* 选中当前的元素 */
        selectElement(elementuuid) {
          // 选中当前元素
          this.$store.dispatch('setActiveElementUUID', elementuuid);

          // 切换元素到动画
          this.$bus.$emit('labelTypeChange', 'qk-animation');
        },
  
        /* 删除元素 */
        deleteElement(element) {
          this.$store.dispatch('deleteElement', element.uuid);
        },
    
        /* 复制当前的元素 */
        copyElement(element) {
          this.$store.dispatch('copyElement', element);
        }
     }
}

export default timeMixin