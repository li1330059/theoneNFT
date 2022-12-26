<template>
  <div class="anti-brush">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="410px"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <div class="ui-dialog-content">
        <div class="txt">您的访问过于频繁，请先休息一下</div>
        <div class="down-time">{{ count }}s</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import countDown from "@/utils/countDown";
export default {
  data() {
    return {
      count: 3,
    };
  },
  props: {
    init: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    dialogVisible() {
      return false
      return this.$store.state.isShowFrequently;
    },
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.countDown = new countDown({
          cdTime: 4,
          tickCall: (obj) => {
            this.count = obj.cdTime;
          },
          endCall: () => {
            this.init();
            this.$store.commit("setAntiBrush", {
              code: 1006,
              isShow: false,
            });
          },
        });
      } else {
        if (this.countDown) {
          this.countDown.stop();
          this.countDown = null;
        }
      }
    },
  },
  created() {},
  methods: {
    handleClose() {
      this.$store.commit("setAntiBrush", {
        code: 10006,
        isShow: false,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.down-time {
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  margin-top: 24px;
  text-align: center;
}
.txt {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
}
.anti-brush {
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
