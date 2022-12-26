<template>
  <el-dialog
    :title="title"
    :visible.sync="value"
    width="600px"
    :destroy-on-close="true"
    :before-close="handleClose"
  >
    <div class="ui-dialog">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
    },
    title: {
      type: String,
    },
  },
  methods: {
    handleClose() {
      this.$emit("input", false);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-dialog__title {
    font-size: 16px;
    @media screen and (min-width: 0px) and (max-width: 540px) {
      font-size: 0.28rem !important;
      font-weight: 500;
    }
  }
  .el-dialog__headerbtn {
    @media screen and (min-width: 0px) and (max-width: 540px) {
      font-size: 0.36rem !important;
    }
  }
  .el-dialog {
    border-radius: 4px;
    @media screen and (min-width: 0px) and (max-width: 540px) {
      border-radius: 0.08rem;
      width: 6.54rem !important;
    }
  }
  .el-dialog__header {
    padding: 16px 24px;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #e5e5e5;
    @media screen and (min-width: 0px) and (max-width: 540px) {
      font-size: 0.28rem;
      padding: 0.32rem;
    }
  }
  .el-dialog__body {
    padding: 15px 24px 18px 24px;
    font-weight: 500;
    border-radius: 18px;

    @media screen and (min-width: 0px) and (max-width: 540px) {
      padding: 0.32rem;
    }
  }
  .ui-dialog {
    overflow: hidden;
  }
}
</style>
