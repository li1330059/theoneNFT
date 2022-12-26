<template>
  <div class="body-wrap">
    <el-dialog
      title="支付"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
    >
      <div class="code-wrap">
        <div class="des">使用支付宝扫下方二维码支付</div>
        <div class="content">
          <div id="pay-code-img"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
export default {
  data() {
    return {
      dialogVisible: false,
      payurl: "",
    };
  },

  created() {},
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    init(payurl, orderNo, orderType) {
      this.dialogVisible = true;
      this.payurl = payurl;
      this.orderNo = orderNo;
      this.orderType = orderType;
      this.createCode();
      this.checkStatus();
    },
    handleClose() {
      this.dialogVisible = false;
            clearInterval(this.timer);
    },
    createCode() {
      this.$nextTick(() => {
        if (this.qrcode) {
          this.qrcode.clear(); // 清除代码
          this.qrcode.makeCode(this.payurl);
        } else {
          this.qrcode = new QRCode("pay-code-img", {
            width: 316,
            height: 316,
            text: this.payurl,
            colorDark: "#333333",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.L,
          });
        }
      });
    },
    checkStatus() {
      clearInterval(this.timer);
      this.timer = setInterval(async () => {
        const res = await this.$api.service.v2_getResult({
          orderNo: this.orderNo,
          orderType: this.orderType,
        });

        if (res && res.data.code == 200) {
          // 支付状态 0、无支付订单 1待支付 2、支付成功 3、支付失败 4、支付取消
          const now_time = new Date().getTime();
          const expire_time = new Date(res.data.data.timeExpire).getTime();
          if (now_time >= expire_time) {
            this.dialogVisible = false;
            clearInterval(this.timer);
          }
          if (res.data.data.status == 2) {
            clearInterval(this.timer);
            this.$router.push("/order/success");
          } else if (res.data.data.status == 3) {
            clearInterval(this.timer);
            this.$router.push("/mine/buy");
          }
        } else {
          this.$message.error(res.data.message);
        }
      }, 3000);
    },
  },
};
</script>
<style lang="scss" scoped>
.code-wrap {
  padding-bottom: 42px;
  .des {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    text-align: center;
    padding: 16px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.body-wrap {
  ::v-deep .el-dialog__body {
    padding: 0;
  }
}
</style>
