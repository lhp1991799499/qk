<template>
  <div>
    <div class="flex mb24">
      <div class="flex width100">
        <div class="bg-gray flex direction" @click="lockClick">
          <img
            :src="
              require(activeElement.commonStyle.lock
                ? '../../../../../../assets/image/canvasSvg/suo_curr.svg'
                : '../../../../../../assets/image/canvasSvg/suo.svg')
            "
            alt=""
          />
          <div :class="[activeElement.commonStyle.lock ? 'curr' : '', 'w32']">
            锁定
          </div>
        </div>
        <el-dropdown @command="handleElementCommand">
          <div class="bg-gray flex direction">
            <img src="../../../../../../assets/image/icon/save.png" alt="" />
            <div class="w32">排序</div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              command="layerUp"
              @click="handleElementCommand('layerUp')"
              >上移一层</el-dropdown-item
            >
            <el-dropdown-item
              command="layerDown"
              @click="handleElementCommand('layerDown')"
              >下移一层</el-dropdown-item
            >
            <el-dropdown-item command="layerTop">置于顶层</el-dropdown-item>
            <el-dropdown-item command="layerBottom">置于底层</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="bg-gray flex direction" @click="copyElement">
          <img src="../../../../../../assets/image/icon/copy.png" alt="" />

          <div class="w32">复制</div>
        </div>
        <div class="bg-gray flex direction" @click="deleteElement">
          <img src="../../../../../../assets/image/icon/delete.png" alt="" />
          <div class="w32">删除</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters(['activeElement'])
  },
  data() {
    return {
      lockFlag: false
    };
  },
  methods: {
    handleCommand(c) {
      console.log('ddd', c);
    },
    // 删除元素
    deleteElement() {
      this.$store.dispatch('elementCommand', 'delete');
    },
    /**
     * 对元素进行操作命令
     */
    handleElementCommand(command) {
      console.log(command);
      this.$store.dispatch('elementCommand', command);
    },
    // 复制元素
    copyElement() {
      console.log('coped');
      this.$store.dispatch('elementCommand', 'copy');
    },
    // 锁定
    lockClick() {
      this.lockFlag = !this.lockFlag;
      this.$store.dispatch('resetElementCommonStyle', {
        lock: this.activeElement.commonStyle.lock === true ? false : true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.direction {
  flex-direction: column;
}
.width100 {
  width: 100%;
  border-radius: 4px;
}
.mb24 {
  margin-bottom: 24px;
}
.bg-gray {
  padding: 7px 0;
  background: #f6f7f9;
  width: 56px;
  height: 48px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .image-box {
    width: 22px;
    height: 22px;
    margin-right: 8px;
  }
  .img-box {
    img {
      width: 26px;
      height: 26px;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
    padding: 5px 16px;
    background: #f6f7f9;
  }
}
.curr {
  color: #5584ff;
}
</style>
