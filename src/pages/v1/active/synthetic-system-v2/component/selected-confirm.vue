<template>
  <div class="confirm-body" v-if="isShow">
    <div class="mask" @click="hide"></div>
    <div class="dialog-content">
      <div
        @click="hide"
        class="icon-close hand iconfont icon-icon_quxiao synthesis-select-close"
      ></div>
      <section class="t-wrap">请确认您要选择的藏品</section>
      <section class="from-wrap">
        <div class="radio-wrap">
          <el-radio v-model="type" label="1">
            <span class="label-wrap">
              <span class="label">全部藏品</span>
              <span class="warning">（包含终极合成藏品）</span>
            </span>
          </el-radio>
        </div>
        <div class="radio-wrap">
          <el-radio v-model="type" label="2">
            <span class="label-wrap">
              <span class="label">部分藏品</span>
              <span class="warning">（除终极合成以外的藏品）</span>
            </span>
          </el-radio>
        </div>
      </section>
      <section class="btn-group">
        <div class="ui-btn ui-btn-default" @click="hide">取消</div>
        <div class="ui-btn ui-btn-red" @click="sure">确定</div>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    return {
      isShow: false,
      type: "1",
    };
  },
  props: {},
  computed: {},
  methods: {
    seeMore() {},
    show(uuid) {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    sure() {
      this.hide();
      this.$emit("listenSure", this.type);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/active/tom.scss";
.ui-btn-default {
  background: #cccccc;
}
.confirm-body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999999;
  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
  }
  .dialog-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    max-width: 572px;
    height: 261px;
    background: #e5e3e3;
    border-radius: 4px;
    width: 90%;
    .t-wrap {
      padding: 16px 24px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }
    .icon-close {
      position: absolute;
      top: 18px;
      right: 24px;
    }
    .label-wrap {
      display: flex;
      align-items: center;
    }
    .radio-wrap {
      margin-bottom: 23px;
    }
    .from-wrap {
      padding: 40px 59px 10px;
    }
    .btn-group {
      display: flex;
      justify-content: flex-end;
      padding: 0 27px;
      .ui-btn {
        margin-left: 17px;
      }
    }

    ::v-deep .el-radio {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style> 