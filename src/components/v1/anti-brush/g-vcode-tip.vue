<template>
  <div class="anti-brush">
    <el-dialog
      title="提示"
      :visible.sync="vcodeTip.isShow"
      width="410px"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <div class="ui-dialog-content">
        <div class="txt">{{vcodeTip.message}}</div>
       
      </div>
    </el-dialog>
  </div>
</template>
<script>

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
    vcodeTip() {
      return this.$store.state.vcodeTip;
    },
  },
  watch: {
  
  },
  created() {},
  methods: {
    handleClose() {
      this.$store.commit("setVcodeTip", {
        message:'',
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
