<template>
  <!-- 接收通知 -->
  <div class="receive-alert">
    <div class="left">
      <img src="~@/assets/img/icon/volume@2x.png" class="img" alt="" />
      <div class="text ellipsis">接收通知：您有转移的藏品待接收</div>
    </div>
    <div class="right" @click="openDialog">点击接收</div>
    <Dialog title="商品接收" v-model="receiveDialogShow">
      <div class="subtitle">单次接收可选择 {{ selNum }}/10 个藏品</div>
      <div class="list">
        <div
          class="item"
          v-for="(item, i) in receiveList"
          :key="i"
          @click.stop="handleCheck(item)"
        >
          <img
            v-if="selNum === 10 && !item.selected"
            class="radio-icon"
            src="~@/assets/img/icon/radio-disabled.png"
            alt=""
          />
          <img
            v-else-if="!item.selected"
            class="radio-icon"
            src="~@/assets/img/icon/radio.png"
            alt=""
          />
          <img
            v-else-if="item.selected"
            class="radio-icon"
            src="~@/assets/img/icon/radio-checked.png"
            alt=""
          />
          <img :src="item.cover" class="cover" alt="" />
          <div class="desc">
            <div class="name ellipsis">{{ item.name }}</div>
            <div class="number">编号：{{ item.number }}</div>
          </div>
        </div>
      </div>
      <div class="agreement">
        <div class="checkbox">
          <img
            v-show="agreementCheck === false"
            @click="agreementCheck = !agreementCheck"
            class="radio-icon"
            src="~@/assets/img/icon/radio.png"
            alt=""
          />
          <img
            v-show="agreementCheck === true"
            @click="agreementCheck = !agreementCheck"
            class="radio-icon"
            src="~@/assets/img/icon/radio-checked.png"
            alt=""
          />
          <span>
            <span
              class="agreement-title"
              @click="agreementCheck = !agreementCheck"
              >我知晓并同意</span
            >
            <span class="blue-text" @click="openAgreement"
              >《数字身份标识艺术品收藏确认函》、《DIY拼脸艺术品接收确认函》、《自主上链数字艺术品接收确认西》</span
            >
          </span>
        </div>
      </div>

      <div class="bottom" v-loading="btnLoading">
        <div class="btn" @click="handleReturnBack">退回</div>
        <div class="btn light" @click="handleRecrive">接收</div>
      </div>
    </Dialog>
    <Dialog title="接收须知" v-model="noticeDialogShow">
      <div class="notice-dialog">
        <div class="text" v-html="agreementText"></div>
        <div class="bottom">
          <div class="btn" @click="handleAgree(false)">不同意</div>
          <div
            class="btn light"
            @click="handleAgree(true)"
            v-if="readTime <= 0"
          >
            同意
          </div>
          <div class="btn disabled" v-else>请阅读全文{{ readTime }}s</div>
        </div>
      </div>
    </Dialog>
  </div>
</template>
<script>
import Dialog from "../../components/Dialog.vue";
export default {
  computed: {
    selNum() {
      return this.receiveList.filter((item) => item.selected).length;
    },
  },
  components: {
    Dialog,
  },
  data() {
    return {
      receiveDialogShow: false,
      receiveList: [],
      agreementCheck: false,
      noticeDialogShow: false,
      readTime: 5,
      hasRead: false,
      btnLoading: false,
      agreementText: ``,
    };
  },
  created() {},
  mounted() {},
  methods: {
    getSubmitList() {
      return this.receiveList
        .filter((item) => item.selected)
        .map((item) => ({
          commoditySkuUuid: item.commoditySkuUuid,
          commodityUuid: item.commodityUuid,
        }));
    },
    async getDataList() {
      let res = await this.$api.service.transferRecordDetail_receiveList();
      this.receiveList = res?.data?.data?.toReceiveList;

      this.receiveList = this.receiveList.map((item) => {
        return {
          ...item,
          selected: false,
        };
      });

      console.log("this.receiveList", this.receiveList);
    },
    handleReturnBack() {
      // 未选藏品
      if (this.selNum < 1) {
        this.$message({
          message: "请选择需要退回的藏品",
          type: "error",
        });
        return;
      }
      // 勾选须知
      if (!this.agreementCheck) {
        this.$message({
          message: "请阅读并同意接收须知",
          type: "error",
        });
        return;
      }
      this.$confirm(`确认退回该藏品至我的唯艺云吗？`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        center: this.$common.isMobile(),
      }).then(async () => {
        this.btnLoading = true;
        try {
          let res = await this.$api.service.transferRecordDetail_refuse({
            refuseList: this.getSubmitList(),
          });
          console.log(res);
          if (res?.data?.data) {
            this.$message({
              message: "退回成功",
              type: "success",
            });
            setTimeout(() => {
              // this.$emit('update')
              this.receiveDialogShow = false;
              this.btnLoading = false;
              this.$store.dispatch("setTransferRecordDetailCount");
            }, 2000);
          } else {
            this.$message({
              message: res?.data?.message,
              type: "error",
            });
          }
        } catch (error) {
          console.log(error);
          this.btnLoading = false;
        }
      });
    },
    async handleRecrive() {
      // 未选藏品
      if (this.selNum < 1) {
        this.$message({
          message: "请选择需要接收的藏品",
          type: "error",
        });
        return;
      }
      if (!this.hasRead) {
        this.openAgreement();
        return;
      }
      // 勾选须知
      if (!this.agreementCheck) {
        this.$message({
          message: "请阅读并同意接收须知",
          type: "error",
        });
        return;
      }

      try {
        this.btnLoading = true;
        console.log(this.btnLoading);
        let res = await this.$api.service.transferRecordDetail_receive({
          receiveList: this.getSubmitList(),
        });
        console.log(res);
        if (res?.data?.data) {
          this.$message({
            message: "接收成功",
            type: "success",
          });
          setTimeout(() => {
            this.$emit("update");
            this.receiveDialogShow = false;
            this.btnLoading = false;
            this.$store.dispatch("setTransferRecordDetailCount");
          }, 2000);
        } else {
          this.$message({
            message: res?.data?.message,
            type: "error",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    openDialog() {
      this.getDataList();
      this.receiveDialogShow = true;
      this.agreementCheck = false;
      this.hasRead = false;
    },
    handleCheck(target) {
      if (target.disabled) return;
      if (!target.selected && this.selNum >= 10) {
        this.$message({
          message: "一次最多选择10件藏品",
          type: "error",
        });
        return;
      }

      this.receiveList = this.receiveList.map((item) => {
        let selected = item.selected;
        if (item.commoditySkuUuid === target.commoditySkuUuid) {
          selected = !selected;
        }

        return {
          ...item,
          selected,
        };
      });
    },
    async openAgreement() {
      try {
        let res = await this.$api.service.dynamicNews_list({
          location: "CLOUD_TRANSFER",
        });
        let agreementText = res?.data?.data?.[0]?.details;
        if (agreementText) {
          this.agreementText = agreementText;
        }

        this.noticeDialogShow = true;
        this.readTime = 5;
        clearInterval(this.timer);

        this.timer = setInterval(() => {
          if (this.readTime > 0) {
            this.readTime -= 1;
          } else {
            clearInterval(this.timer);
          }
        }, 1000);
      } catch (error) {
        this.$message({
          message: error,
          type: "error",
        });
      }
    },
    handleAgree(bool) {
      this.noticeDialogShow = false;
      this.agreementCheck = bool;
      this.hasRead = bool;
    },
  },
};
</script>
<style lang="scss">
.el-message-box--center {
  @media screen and (min-width: 0px) and (max-width: 540px) {
    padding-bottom: 0.32rem;
    width: 6.54rem;
  }
  .el-message-box__btns {
    @media screen and (min-width: 0px) and (max-width: 540px) {
      justify-content: space-between;
    }
  }
  .el-message-box__headerbtn {
    @media screen and (min-width: 0px) and (max-width: 540px) {
      font-size: 0.36rem !important;
      width: 0.36rem;
      height: 0.36rem;
      right: 0.32rem;
      top: 0.22rem;
    }
  }
}
</style>
<style lang="scss" scoped>
::v-deep .el-dialog {
  @media screen and (min-width: 0px) and (max-width: 540px) {
    width: 6.54rem !important;
  }
}
::v-deep .ui-dialog {
  .blue-text {
    color: #397fe7;
  }
  .content {
    .subtitle {
      font-size: 14px;
      color: #4d4d4d;
      margin-bottom: 12px;
      @media screen and (min-width: 0px) and (max-width: 540px) {
        color: #666666;
        font-size: 0.24rem;
        margin-bottom: 0.2rem;
      }
    }
    .radio-icon {
      width: 14px;
      height: 14px;
    }

    .agreement-title {
      display: inline-block;
      min-width: 80px;
    }
    .list {
      max-height: 405px;
      overflow-y: scroll;
      overflow-x: hidden;
      @media screen and (min-width: 0px) and (max-width: 540px) {
        height: 5.8rem;
      }
      .item {
        display: flex;
        align-items: center;
        padding: 16px;
        width: 552px;
        height: 102px;
        background: #fafafa;
        border-radius: 4px;
        cursor: pointer;
        &:not(:last-child) {
          margin-bottom: 12px;
        }
        @media screen and (min-width: 0px) and (max-width: 540px) {
          width: 5.9rem;
          height: 1.8rem;
          border-radius: 0.08rem;
        }
      }
      .cover {
        margin: 0 16px;
        width: 70px;
        height: 70px;
        border-radius: 2px;
        @media screen and (min-width: 0px) and (max-width: 540px) {
          margin: 0 0.2rem 0 0.24rem;
          width: 1.2rem;
          height: 1.2rem;
        }
      }
      .name {
        font-size: 14px;
        color: #4d4d4d;
        width: 380px;
        margin-bottom: 8px;
        @media screen and (min-width: 0px) and (max-width: 540px) {
          font-size: 0.28rem;
          width: 3.2rem;
          margin-bottom: 0.16rem;
        }
      }
      .number {
        font-size: 12px;
        color: #999999;
        @media screen and (min-width: 0px) and (max-width: 540px) {
          font-size: 0.24rem;
        }
      }
    }
  }
  .bottom {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    @media screen and (min-width: 0px) and (max-width: 540px) {
      justify-content: space-between;
      margin-top: 0.32rem;
    }
    .btn {
      padding: 0 17px;
      min-width: 100px;
      height: 30px;
      background: #e5e5e5;
      border-radius: 15px;
      line-height: 30px;
      margin-left: 24px;
      text-align: center;
      cursor: pointer;
      color: #4d4d4d;
      font-size: 14px;
      @media screen and (min-width: 0px) and (max-width: 540px) {
        width: 2.76rem;
        height: 0.72rem;
        border-radius: 0.36rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 0;
      }
    }
    .light {
      background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
      color: #ffffff;
    }
    .disabled {
      background: #e5e5e5;

      color: #999999;
    }
  }
  .agreement {
    margin-top: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 12px;
    color: #666666;
    @media screen and (min-width: 0px) and (max-width: 540px) {
      font-size: 0.24rem;
    }
    .checkbox {
      display: inline-flex;
      // align-items: center;
      line-height: 17px;
      .radio-icon{
        margin-top: 2px;
        @media screen and (min-width: 0px) and (max-width: 540px) {
          margin-top: 0.02rem;}

      }

    }
    .radio-icon {
      margin-right: 4px;
      @media screen and (min-width: 0px) and (max-width: 540px) {
        font-size: 0.04rem;
      }
    }
  }
  .notice-dialog {
    .text {
      height: 262px;
      overflow-y: scroll;
      overflow-x: hidden;
      color: #999999;
      @media screen and (min-width: 0px) and (max-width: 540px) {
        height: 6.7rem;
        font-size: 0.22rem;
      }
    }
  }
}
.receive-alert {
  width: 100%;
  height: 36px;
  background: rgba(230, 31, 26, 0.06);
  border-radius: 4px;
  border: 1px solid rgba(230, 31, 26, 0.1);
  padding: 0 16px;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #333333;
  justify-content: space-between;
  @media screen and (min-width: 0px) and (max-width: 540px) {
    font-size: 0.26rem;
    padding: 0 0.32rem;
    border: none;
    border-radius: 0;
  }

  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .left {
    display: flex;
    align-items: center;
    .img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    .text {
      max-width: 600px;
      @media screen and (min-width: 0px) and (max-width: 540px) {
        max-width: 5.2rem;
      }
    }
  }

  .right {
    color: #e61f1a;
    cursor: pointer;
  }
}
</style>
