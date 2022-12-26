<template>
  <div class="dialog-body" v-if="dialogVisible">
    <div class="mask"></div>
    <div class="dialog-content">
      <div
        class="icon-close iconfont icon-icon_quxiao synthesis-select-close hand"
        @click="hide"
      ></div>
      <section class="dialog-title">提示</section>
      <div class="content">
        <div class="txt">您已选择终极合成</div>
        <div class="list-wrap">
          <div class="txt red-txt synthesis-warning-txt-color" v-for="(item,idx) in list" :key="idx">{{idx+1}}、{{item.commoditySku.name||item.commodity.name}}</div>
        </div>
        <div class="txt">合成后不可撤销，请确认是否使用此藏品合成。</div>
      </div>
      <div class="form-btns">
        <div class="ui-btn ui-btn-default" @click="dialogVisible = false">
          取消
        </div>
        <div class="ui-btn ui-btn-red" @click="submit()">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  props: {},
  data() {
    return {
      dialogVisible: false,
      list: [],
    };
  },
  mounted() {
    // ammount to add on each button press
  },
  methods: {
    show(cb, list) {
      this.cb = cb;
      this.dialogVisible = true;
      console.log(list);
      this.list = list||[];
    },
    hide() {
      this.dialogVisible = false;
    },
    submit() {
      this.hide();
      if (this.cb && typeof this.cb == "function") {
        this.cb();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/active/synthetic-system.scss";
.list-wrap{
    display: flex;
    flex-wrap: wrap;
    .red-txt{
      word-break: keep-all;
    }
}
.dialog-body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999999;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 8);
  }
  .dialog-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    max-width: 572px;
    width: 90%;
    background: #e5e3e3;
    border-radius: 4px;
    padding-bottom: 35px;
    .content {
      padding: 8px 24px 20px;
      .txt {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 28px;
      }
      .red-txt {
      
      }
    }
  }
  .icon-close {
    position: absolute;
    top: 18px;
    right: 24px;
  }
  .dialog-title {
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    padding: 16px 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  .form-btns {
    display: flex;
    justify-content: flex-end;
    padding: 0 27px;
    .ui-btn {
      margin-left: 17px;
    }
  }
}
.ui-btn-default{
  background: #CCCCCC;
}
</style>