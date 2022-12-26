<template>
  <div class="account-manage-body">
    <div v-if="isShow">
      <m-head title="结算账户管理" />
      <status-template
        :list="accounts && accounts.length"
        api="/user/api/payChannel/accountInfoList"
        :init="getAccountList"
      >
        <div class="m-account-wrap" v-for="(item, idx) in accounts" :key="idx">
          <div class="head" @click="onTogglePick(idx)">
            <div class="left">
              <span>{{ item.name }}</span>
            </div>
            <div class="right">
              <div class="status">
                <div>
                  <span v-if="item.info.statusPay == 1" class="success">{{
                    item.payTxtSuccess
                  }}</span>
                  <span v-else>{{ item.payTxtError }}</span>
                </div>
                /
                <div>
                  <span
                    v-if="item.info.statusWithdrawal == 1"
                    class="success"
                    >{{ item.drawTxtSuccess }}</span
                  >
                  <span v-else>{{ item.drawTxtError }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="account-p-wrap" :class="{ 'account-pick': item.isPick }">
            <div class="account-content">
              <div
                v-if="item.info.bankAccount && item.info.statusBankCard == 1"
              >
                <div class="line-wrap" v-if="item.info.bankName">
                  <div class="key">银行卡信息</div>
                  <div class="bank-name">{{ item.info.bankName }}</div>
                </div>
                <div class="line-wrap">
                  <div class="key">银行卡号</div>
                  <div class="bank-name">{{ item.info.bankAccount }}</div>
                  <div
                    class="link-btn hand"
                    @click="onBindCard(item)"
                    v-if="item.isShowBindBank"
                  >
                    绑定新卡
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="line-wrap">
                  <div class="key">银行卡信息</div>
                  <div class="bank-name">
                    {{ item.payChannel == "hy" ? "未授权" : "未绑卡" }}
                  </div>
                </div>
              </div>

              <div class="line-wrap" v-if="item.userIdCard">
                <div class="key">身份证照片</div>
                <div class="bank-name">
                  {{ item.info.statusRealName == 1 ? "已上传" : "未上传" }}
                </div>
                <div
                  class="link-btn hand"
                  v-if="item.info.statusRealName == 1"
                  @click="seeIdCard(item)"
                >
                  查看
                </div>
              </div>
              <div class="line-wrap">
                <div class="key">账户认证</div>
                <div
                  class="account-status account-success"
                  v-if="item.accountSuccess"
                >
                  认证成功
                </div>
                <div class="account-status account-warning" v-else>
                  {{ findAccountError(item.check, item.info).name }}
                </div>
              </div>
              <div class="account-status-wrap">
                <account-status
                  v-for="(itemStatus, idx) in item.check"
                  :key="idx"
                  :key-info="itemStatus"
                  :status="item.info[itemStatus.key]"
                  :account="item"
                  @listen="checkAccountEditor"
                ></account-status>
                <account-status
                  :key-info="{ key: '', name: '认证成功' }"
                  :status="item.accountSuccess ? 1 : null"
                ></account-status>
                <div class="line"></div>
              </div>
            </div>
            <div class="footer">
              <span class="txt" @click="goList(item)">认证记录</span>
            </div>
          </div>

          <div
            class="phone-pick"
            @click="onTogglePick(idx)"
            :class="{ transform: item.isPick }"
          >
            <span class="ui-icon icon-p"></span>
          </div></div
      ></status-template>
    </div>

    <bh-improve-data
      ref="BhImproveRef"
      @cancel="showAccount"
      @success="updateAccount"
    ></bh-improve-data>
    <nameVerified
      ref="nameVerified"
      @listen="listenNameVerified"
    ></nameVerified>
    <hxt-improve-data
      @cancel="showAccount"
      @success="updateAccount"
      ref="HxtImproveRef"
    ></hxt-improve-data>
    <hy-improve-data
      @cancel="showAccount"
      @success="updateAccount"
      ref="HyImproveRef"
    ></hy-improve-data>
    <yb-improve-data
      @cancel="showAccount"
      @success="updateAccount"
      ref="YbImproveRef"
    ></yb-improve-data>
    <preview-user-card
      ref="PreviewUserCardRef"
      @cancel="showAccount"
    ></preview-user-card>
    <yb-bind-card
      class="yb-bind-card-wrap"
      ref="YbBindCardRef"
      @listenSuccess="ybBindCardSuccess"
      :accountInfo="accounts[3].info"
    ></yb-bind-card>
  </div>
</template>
<script>
import nameVerified from "../setting/nameVerified.vue";
import AccountStatus from "./components/account-status";
import BhImproveData from "./components/baohu";
import HxtImproveData from "./components/hxt";
import HyImproveData from "./components/hy";
import YbImproveData from "./components/yb";
import PreviewUserCard from "./components/preview-user-card";
import YbBindCard from "../../order/components/yb-bind-card";
export default {
  components: {
    AccountStatus,
    BhImproveData,
    nameVerified,
    HxtImproveData,
    HyImproveData,
    PreviewUserCard,
    YbImproveData,
    YbBindCard,
  },
  data() {
    return {
      showPage: "",
      isShow: true,
      accounts: [
        {
          isPick: true,
          payChannel: "hxt",
          name: "恒信通账户",
          isShowBindBank: false,
          drawTxtSuccess: "可提现",
          drawTxtError: "不可提现",
          payTxtSuccess: "可余额支付",
          payTxtError: "不可余额支付",
          info: {},
          accountSuccess: false,
          userIdCard: false,
          check: [
            {
              key: "status",
              name: "开户成功",
              errorName: "未开户",
              btn: "",
              status: "",
            },
            {
              key: "statusBankCard",
              name: "绑定银行卡",
              btn: "开户并绑定银行卡",
              errorName: "银行卡未绑定",
              hide: true,
              status: "绑卡中",
              check: [],
            },
          ],
        },
        {
          isPick: true,
          payChannel: "baofoo",
          isShowBindBank: true,
          name: "宝付账户",
          drawTxtSuccess: "可提现",
          drawTxtError: "不可提现",
          payTxtSuccess: "可支付",
          payTxtError: "不可支付",
          userIdCard: true,
          info: {},
          accountSuccess: false,
          check: [
            {
              key: "status",
              name: "开户成功",
              errorName: "未开户",
              btn: "去开户",
              status: "开户中",
            },
            {
              key: "statusBankCard",
              name: "绑定银行卡",
              errorName: "银行卡未绑定",
              btn: "去绑定",
              hide: true,
              status: "绑卡中",
              check: ["status"],
            },
            {
              key: "statusRealName",
              name: "身份证照片",
              errorName: "身份证照片未上传",
              btn: "去上传",
              hide: true,
              status: "认证中",
              check: ["status", "statusBankCard"],
            },
            {
              key: "statusPassword",
              name: "设置支付密码",
              errorName: "支付密码未设置",
              btn: "去设置",
              status: "设置中",
              check: ["status", "statusBankCard", "statusRealName"],
            },
          ],
        },
        {
          isPick: true,
          payChannel: "hy",
          name: "汇元账户",
          isShowBindBank: false,
          drawTxtSuccess: "可提现",
          drawTxtError: "不可提现",
          payTxtSuccess: "可支付",
          payTxtError: "不可支付",
          userIdCard: false,
          info: {},
          accountSuccess: false,
          check: [
            {
              hide: true,
              key: "statusBankCard",
              name: "授权银行卡",
              errorName: "银行卡未授权",
              btn: "去授权",
              status: "授权中",
              check: [],
            },
          ],
        },
        {
          isPick: true,
          payChannel: "yb",
          name: "易宝账户",
          isShowBindBank: true,
          drawTxtSuccess: "可提现",
          drawTxtError: "不可提现",
          payTxtSuccess: "可支付",
          payTxtError: "不可支付",
          userIdCard: true,
          info: {},
          accountSuccess: false,
          check: [
            {
              key: "status",
              name: "上传身份证照片并绑定银行卡",
              errorName: "未上传身份证照片并绑定银行卡",
              btn: "去传身份证照片并绑定银行卡",
              hide: true,
              status: "认证中",
              check: [],
            },
          ],
        },
      ],
    };
  },
  created() {
    this.showPage = this.$route.query.page;
    this.getAccountList();
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    ybBindCardSuccess() {
      this.getAccountList();
    },
    async seeIdCard(info) {
      this.hideAccount();
      const res = await this.$api.service.userAttribute_getCardImage();
      console.log(res);
      if (res.data.code == 200 && res.data.data) {
        this.$refs.PreviewUserCardRef.init(
          res.data.data.idnumberBack,
          res.data.data.idnumberFront
        );
      } else {
        this.$message.error(res.data.message);
      }
    },
    onTogglePick(idx) {
      console.log(idx);
      const accounts = JSON.parse(JSON.stringify(this.accounts));
      accounts[idx].isPick = !accounts[idx].isPick;
      this.accounts = accounts;
    },
    listenNameVerified(info) {
      //实名认证结果
      if (info.result) {
        this.$message.success("认证成功");
      } else {
        this.$message.error("认证失败");
      }
    },
    onBindCard(info) {
      switch (info.payChannel) {
        case "baofoo":
          this.hideAccount();
          this.$refs.BhImproveRef[`SETstatusBankCard`]();
          break;
        case "hxt":
          this.hideAccount();
          this.$refs.HxtImproveRef[`SETstatusBankCard`]();
          break;
        case "yb":
          this.$refs.YbBindCardRef.show();
          break;
      }
    },
    updateAccount() {
      this.showAccount();
      this.getAccountList();
    },
    showAccount() {
      this.isShow = true;
    },
    hideAccount() {
      this.isShow = false;
    },
    findAccountError(checkAry, info) {
      for (let i = 0; i < checkAry.length; i++) {
        if (!checkAry[i].isJump) {
          if (info[checkAry[i].key] != 1) {
            return {
              name: checkAry[i].errorName,
            };
          }
        }
      }
      return {};
    },
    ybSetAccount() {
      this.hideAccount();
      this.$refs.YbImproveRef[`SETaccount`]();
    },
    async checkAccountEditor(info) {
      console.log(info);

      const { account, keyInfo, status } = info;
      if (account.payChannel == "yb") {
        //请先实名认证
        if (this.userInfo.statusVerified == 1) {
          this.ybSetAccount();
        } else {
          this.$confirm("请先进行实名认证", "提示", {
            confirmButtonText: "立即认证",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(async () => {
              this.$refs.nameVerified.init();
            })
            .catch(() => {});
        }

        return;
      }
      if (keyInfo.hide) {
        this.hideAccount();
      }

      if (keyInfo.key == "status") {
        const res = await this.$api.service.payChannel_openAccount({
          payChannel: account.payChannel,
        });
        if (res.data.code == 200 && res.data.data.openFlag) {
          this.$message.success(res.data.message);
          this.getAccountList();
        } else if (res.data.code == 30034) {
          this.$confirm(res.data.message, "提示", {
            confirmButtonText: "立即认证",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(async () => {
              this.$refs.nameVerified.init();
            })
            .catch(() => {});
        } else {
          this.$message.error(res.data.message);
        }
      } else {
        document.documentElement.scrollTop = 0;
        switch (account.payChannel) {
          case "baofoo":
            this.$refs.BhImproveRef[`SET${keyInfo.key}`]();
            break;
          case "hxt":
            this.$refs.HxtImproveRef[`SET${keyInfo.key}`]();
            break;
          case "hy":
            this.$refs.HyImproveRef[`SET${keyInfo.key}`]();
            break;
        }
      }
    },
    goList(info) {
      this.$router.push(`/mine/wallet/account_manage_list/${info.payChannel}`);
    },
    async getAccountList() {
      let res = await this.$api.service.payChannel_accountInfoList([
        {
          payChannel: "baofoo",
        },
        {
          payChannel: "hy",
        },
        {
          payChannel: "hxt",
        },
        {
          payChannel: "yb",
        },
      ]);
      if (this.showPage == "yb_account") {
        this.$nextTick(() => {
          this.ybSetAccount();
          this.showPage = null;
        });
      }

      if (res.data.code == 200) {
        const checkAccountSuccess = (checkAry, info) => {
          for (let i = 0; i < checkAry.length; i++) {
            if (info[checkAry[i].key] != 1 && !checkAry[i].isJump) {
              return false;
            }
          }
          return true;
        };
        console.log(this.accounts);
        this.accounts = this.accounts.map((item) => {
          item.info = res.data.data[item.payChannel];
          item.accountSuccess = checkAccountSuccess(item.check, item.info);
          return item;
        });
        console.log(this.accounts);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-success {
  background-image: url("//static.theone.art/pc/pay-manage/icon-success.png");
}
.icon-fail {
  background-image: url("//static.theone.art/pc/pay-manage/icon-fail.png");
}
.icon-round {
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 100px;
}
.icon-p {
  background-image: url("//static.theone.art/pc/icons/icon-p.png");
}
.round-point {
  width: 8px;
  height: 8px;
  background: #29c445;
  display: inline-block;
  border-radius: 100px;
}
.link-btn {
  font-size: 14px;
  font-weight: 400;
  color: #397fe7;
  cursor: pointer;
}
.line-wrap {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
  .key {
    min-width: 80px;
  }
  .link-btn {
    margin-left: 16px;
  }
}
.account-status {
  font-size: 14px;
  font-weight: 400;
}
.account-success {
  color: #29c445;
}
.account-warning {
  color: #e61f1a;
}
.m-account-wrap {
  background: #ffffff;
  box-shadow: 0px 2px 16px 0px rgba(180, 180, 180, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 24px;
  .head {
    background: linear-gradient(180deg, #303a63 0%, #0f1722 100%);
    display: flex;
    justify-content: space-between;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    padding: 16px 40px;
    .right {
      .status {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
      }
      .success {
        color: #ffffff;
      }
    }
    .left {
    }
  }
  .account-content {
    padding: 24px 40px 16px;

    .line-wrap {
      .key {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
        margin-right: 16px;
      }
      .bank-info {
        display: flex;
        margin-bottom: 16px;
        .bank-name {
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          margin-right: 16px;
        }
      }
      .right {
        .status {
          font-size: 14px;
          font-weight: 400;
          color: #29c445;
          margin-left: 12px;
        }
      }
    }
    .account-status-wrap {
      position: relative;
      top: 0;
      left: 0;
      display: flex;
      justify-content: space-between;
      margin-top: 32px;
      margin-bottom: 20px;

      .line {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: rgba(151, 151, 151, 0.2);
        height: 1px;
        width: 100%;
      }
    }
  }
  .footer {
    border-top: 1px solid rgba(151, 151, 151, 0.2);
    padding: 15px 40px;
    margin-bottom: 0;
    display: flex;
    justify-content: flex-end;

    .txt {
      font-size: 14px;
      font-weight: 400;
      color: #397fe7;
      cursor: pointer;
    }
  }
  .phone-pick {
    display: none;
  }
}

@media screen and (min-width: 0px) and (max-width: 540px) {
  .yb-bind-card-wrap {
    ::v-deep .yb-pay-content {
      width: 100%;
      max-width: inherit;
      background-color: #fff;
    }
  }
  .account-manage-body {
    padding: 0.32rem;
    padding-bottom: 1rem;
  }
  .round-point {
    width: 8px;
    height: 8px;
    background: #29c445;
    display: inline-block;
    border-radius: 100px;
  }
  .link-btn {
    font-size: 14px;
    font-weight: 400;
    color: #397fe7;
  }
  .line-wrap {
    display: flex;
    justify-content: space-between;
  }

  .m-account-wrap {
    background: #ffffff;
    box-shadow: 0px 2px 16px 0px rgba(180, 180, 180, 0.1);
    border-radius: 4px;
    overflow: hidden;
    .head {
      background: #fff;

      font-size: 14px;
      font-weight: 600;
      padding: 0.32rem;
      .right {
        .status {
          color: #999999;
          font-weight: 500;
          .round-point {
            margin-left: 6px;
          }
          .success {
            color: #333333;
          }
        }
      }
      .left {
        font-size: 0.3rem;
        font-weight: 400;
        color: #000000;
      }
    }
    .account-p-wrap {
      height: inherit;
      transition: all ease-out 0.26s;
      max-height: 8rem;
    }
    .account-content {
      padding: 0.32rem;

        .line-wrap {
        .key {
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.4);
          margin-right: 16px;
        }
        .bank-info {
          display: flex;
          margin-bottom: 16px;
          .bank-name {
            font-size: 14px;
            font-weight: 400;
            color: #000000;
            margin-right: 16px;
          }
        }
        .right {
          .status {
            font-size: 14px;
            font-weight: 400;
            color: #29c445;
            margin-left: 12px;
          }
        }
      }
      .account-status-wrap {
        position: relative;
        top: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        margin-top: 0.8rem;

        .line {
          position: absolute;
          top: 0.14rem;
          background-color: rgba(151, 151, 151, 0.2);
          height: 1px;
          width: 100%;
        }
      }
    }
    .account-pick {
      overflow: hidden;
      max-height: 0px;
      padding: 0;
    }
    .footer {
      border-top: 1px solid rgba(151, 151, 151, 0.2);
      padding: 15px 40px;
      justify-content: center;

      .txt {
        border-radius: 100px;
        border: 1px solid #9fa0bb;
        display: inline-block;
        line-height: 0.64rem;
        text-align: center;
        padding: 0 0.6rem;
        font-size: 0.24rem;
        font-weight: 400;
        color: #9fa0bb;
      }
    }
    .phone-pick {
      display: flex;
      justify-content: center;
      transition: all ease-in-out 0.26s;
      transform: rotate(0deg);
      margin: 0 0.32rem;
    }
    .transform {
      .ui-icon {
        transform: rotate(-180deg);
      }

      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
