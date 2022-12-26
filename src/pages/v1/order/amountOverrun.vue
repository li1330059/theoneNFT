<template>
  <div class="amount">
    <el-dialog
      class="theone-dialog page-login dialogContain"
      :visible.sync="isShow"
      append-to-body
      width="570px"
      title="唯一艺术平台提醒您"
    >
      <div class="line" />
      <p>单笔交易金额超限，无法支付</p>
      <p>请调整您的支付金额</p>
      <div class="footer">
        <div class="footer-btn" @click="hide">确定</div>
        <div
          class="footer-icon"
          @click="showImg = !showImg"
        ></div>
      </div>
      <img
        v-if="showImg"
        src="//static.theone.art/pc/icons/buy-lead.png"
        alt=""
      />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
      showImg: false,
    }
  },
  methods: {
      show(){
          this.isShow = true;
      },
      hide(){
          this.showImg = false;

          this.isShow = false;
      }
  }
};
</script>
<style lang="scss" scoped>
.amount {
  position: relative;
}
.line {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin-top: -30px;
  margin-bottom: 16px;
}
p {
    text-align: center;
    color: rgba(0, 0, 0, 0.79)
}
.footer {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  &-btn {
    background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
    border-radius: 15px;
    width: 96px;
    line-height: 30px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
    cursor: pointer;
  }
  &-icon {
    position: absolute;
    width: 15px;
    height: 15px;
    right: 29px;
    bottom: 6px;
    background: url("//static.theone.art/pc/icons/buy-question.png")
      no-repeat center;
    background-size: contain;
  }
}
img {
  position: absolute;
  bottom: -30px;
  right: 5px;
  width: 260px;
}
</style>