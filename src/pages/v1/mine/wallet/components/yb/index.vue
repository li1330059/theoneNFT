<template>
  <div class="m-bank-card ui-content-wrap" v-if="isShow">
    <m-head title="完善资料" :go="onCancel" />
    <div class="m-navigation">
      <div class="main" @click="onCancel">
        <span class="icon-direction" />完善资料
      </div>
    </div>
    <div class="section ui-user-card" v-if="page == 'up-card'">
      <up-user-card
        @listenUpCardSuccess="listenUpCardSuccess"
        @cancel="cancel"
        title=""
      ></up-user-card>
    </div>
    <div class="section" v-if="page == 'user-data'">
      <div class="m-form">
        <div class="m-card-info">
          <div class="bar" v-if="userInfo.realname">
            <div class="label">姓名：</div>
            <div class="value">{{ userInfo.realname }}</div>
          </div>
          <div class="bar" v-if="userInfo.idNumber">
            <div class="label">身份证号：</div>
            <div class="value">{{ userInfo.idNumber }}</div>
          </div>
          <div class="bar" v-if="bankCardInfo.phone">
            <div class="label">银行卡预留手机号：</div>
            <div class="value">{{ bankCardInfo.phone }}</div>
          </div>
          <div class="bar" v-if="bankCardInfo.bankAccont">
            <div class="label">银行卡号：</div>
            <div class="value">{{ bankCardInfo.bankAccont }}</div>
          </div>
        </div>
        <!--     <div class="m-code-wrap">
        <div class="label">验证码：</div>
        <div class="input">
          <el-input type="text" v-model="verifyCode" />
          <div class="post">
            <g-verification-code
              :phone="bankCardInfo.phone"
              :getCode="getCode"
              :isCheck="false"
            ></g-verification-code>
          </div>
        </div>
      </div> -->
        <div class="input-wrap">
          <!--     <div class="input-group">
          <div class="m-code-wrap">
            <div class="label">邮箱：</div>
            <div class="input">
              <el-input type="text" v-model="email" />
            </div>
          </div>
        </div> -->
          <div class="input-group">
            <div class="m-code-wrap">
              <div class="label">身份证所在省市区/县：</div>
              <div class="input">
                <!--  <el-input type="text" v-model="districtCode" /> -->
                <!-- <el-autocomplete
                  v-model="userAreaTxt"
                  :fetch-suggestions="getUserArea"
                  placeholder="请输入内容"
                  @select="handleUserArea"
                ></el-autocomplete> -->
                <yb-address
                  ref="ybAddress"
                  @listen="getAddressCode"
                ></yb-address>
              </div>
            </div>
            <!-- <div class="g-warning-tip">请输入身份证所在区/县</div> -->
          </div>
          <div class="input-group">
            <div class="m-code-wrap">
              <div class="label">银行卡：</div>
              <div class="input">
                <el-select
                  v-if="userBankCards.length > 0"
                  v-model="userSelectedBankCardIdx"
                  placeholder="请选择银行卡"
                  class="el-select"
                  @change="bankChange"
                >
                  <el-option
                    v-for="(item, idx) in userBankCards"
                    :key="item.uuid"
                    :label="item.bankAccont"
                    :value="idx"
                  >
                  </el-option>
                </el-select>
                <div class="link-btn">
                  <span @click="showBindBank">添加银行卡</span>
                </div>
                <!--  <el-input type="text" v-model="bankCardNo" /> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="m-btn-group">
          <div class="btn btn-disable" @click="onCancel">取消</div>
          <div
            class="btn btn-red"
            :class="{ 'btn-disable': subDisabled }"
            @click="onSubmit"
          >
            确定
          </div>
        </div>
      </div>
    </div>

    <bankSubmit
      ref="bankSubmit"
      :userInfo="userInfo"
      @listen="listenBankSubmit"
    ></bankSubmit>
  </div>
</template>
<script>
const BigNumber = require("bignumber.js");
import bankSubmit from "../../bankSubmit.vue";
import upUserCard from "../up-user-card.vue";
import ybAddress from "../yb-address.vue";
export default {
  components: { bankSubmit, upUserCard, ybAddress },
  data() {
    return {
      page: "",
      isShow: false,
      bankUuid: "",
      verifyCode: "",
      userAreaTxt: "",
      email: "",
      phone: "",
      extendInfo: "",
      bankCardNo: "",
      userBankCards: [],
      userSelectedBankCardIdx: 0,
      subDisabled: false,
      userAreaObj: {},
    };
  },
  props: {
    idCard: {
      type: Object,
      default: () => {
        return {};
      },
    },
    tip: String,
    submit: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    bankCardInfo() {
      return {};
    },
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  created() {},

  methods: {
    //监听地址回调
    getAddressCode(option) {
      this.userAreaObj.districtCode = option;
    },
    onCancel() {
      this.hide();
      this.$emit("cancel");
    },
    listenUpCardSuccess(info) {
      this.getUserCards();
      this.userIdCardInfo = info;
      this.page = "user-data";
    },
    SETaccount() {
      this.isShow = true;
      this.page = "up-card";
    },
    hide() {
      this.isShow = false;
      this.page = "";
    },
    async getUserArea(queryString, cb) {
      if (queryString) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(async () => {
          const res = await this.$api.service.payChannel_queryYbAddressCode({
            addressName: queryString,
          });
          if (res.data.code == 200) {
            let ary = res.data.data;
            if (ary) {
              ary = ary.map((item) => {
                item.value = `${item.provinceName},${item.cityName},${item.districtName}`;
                return item;
              });
            } else {
              ary = [];
            }
            cb(ary);
          } else {
            this.$message.error(res.data.message);
          }
        }, 500);
      } else {
        cb([]);
      }
    },
    handleUserArea(item) {
      this.userAreaObj = item;
    },
    showBindBank() {
      this.$refs.bankSubmit.init();
    },
    listenBankSubmit() {
      this.getUserCards();
    },
    async getUserCards() {
      //获取用户银行卡列表
      const res = await this.$api.service.userbank_findBankAccount();
      if (res.data.code == 200) {
        this.userBankCards = res.data.data || [];
      } else {
        this.$message.error(res.data.message);
      }
    },
    goBindCard() {
      this.$router.push("/mine/wallet/bank");
    },

    async getCode() {
      return await this.$api.service.payChannel_bindCardApply({
        payChannel: "baofoo",
        bankCardUUID: this.userBankCards[this.userSelectedBankCardIdx].uuid,
      });
    },
    async onSubmit() {
      if (this.subDisabled) {
        return;
      }

      if (this.userAreaObj && this.userAreaObj.districtCode) {
        const bannkInfo = this.userBankCards[this.userSelectedBankCardIdx];
        if (!bannkInfo) {
          this.$message.warning("请先绑定银行卡!");
          return;
        }
        this.subDisabled = true;
        const res = await this.$api.service.v2_openAccount({
          accountType: 0,
          extendInfo: this.extendInfo,
          idCardBack: this.userIdCardInfo.idCardBack.id,
          idCardFront: this.userIdCardInfo.idCardFront.id,
          payChannel: "yb",
          bankCardNo: bannkInfo.uuid,
          districtCode: this.userAreaObj.districtCode,
        });
        this.subDisabled = false;
        if (res.data.code == 200 && res.data.data.openFlag) {
          this.$message.warning("开户请求正在审核中，请耐心等待");
          this.hide();
          this.$emit("success");
          /*    this.$confirm(
            `汇元账户开户审核中，请按照手机短信进行操作，短信回复对应验证码即可。`,
            "成功",
            {
              confirmButtonText: "确定",
              showCancelButton: false,
            }
          )
            .then(async () => {
              this.hide();
              this.$emit("success");
            })
            .catch(() => {
              this.hide();
              this.$emit("cancel");
            }); */
        } else {
          this.$message.error(res.data.message);
        }
      } else {
        this.subDisabled = false;
        this.$message.warning("请选择身份证所在省市区/县");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/treasure.scss";
.ui-user-card {
  ::v-deep .m-navigation {
    display: none;
    ::v-deep .ui-head {
      display: none;
    }
  }
}
.link-btn {
  color: #397fe7;
  padding-left: 10px;
  white-space: nowrap;
}
.input-wrap {
  display: flex;
  flex-wrap: wrap;
  .input-group {
    padding-right: 30px;
    width: 50%;
    .input {
      flex: 1;
      ::v-deep .el-select {
        width: 100%;
      }
      ::v-deep .el-autocomplete {
        width: 100%;
      }
    }
  }
  .input-group:nth-child(2n) {
    padding-right: 0;
  }
  @media screen and (max-width: 540px) {
    display: block;
    .input-group {
      padding-right: 0;
      width: 100%;
      .input {
        flex: 1;
      }
    }
  }
}
.ui-head {
  font-size: 14px;
  font-weight: 400;
  padding-bottom: 14px;
  .des {
    color: #333333;
    line-height: 24px;
  }
  .warning {
    color: #e61f1a;
    line-height: 20px;
  }
  .change-banck-card {
    color: #397fe7;
    line-height: 20px;
    cursor: pointer;
  }
  .tool {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 26px;
  }
  @media screen and (max-width: 540px) {
    background: linear-gradient(240deg, #303a63 0%, #0f1722 100%);
    padding: 0.4rem 0.56rem 2rem;
    .des {
      color: #ffffff;
    }
  }
}
.m-card-info {
  border-radius: 3px;
  border: 1px solid #eeeeee;
  padding: 25px 20px 5px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  .bar {
    display: flex;
    width: 50%;
    margin-bottom: 20px;
  }
  @media screen and (max-width: 540px) {
    background: transparent;
    border: none;
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 0.2rem;
    display: block;
    .bar {
      width: 100%;
      justify-content: space-between;
    }
  }
}
.m-code-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 20px;
  .input {
    display: flex;
    align-items: center;
  }
  .post {
    width: 160px;
    text-align: right;
  }
  .label {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    width: 100px;
  }
  @media screen and (max-width: 540px) {
    display: block;
    width: 100%;
    padding: 0.15rem 0.3rem;
    .label {
      margin-bottom: 0.24rem;
    }
  }
}
@media screen and (max-width: 540px) {
  .g-warning-tip {
    padding-left: 0.3rem;
  }
  .ui-content-wrap {
    background-color: transparent !important;
  }
  .m-form {
    background-color: #fff;
    margin: 0rem 0.3rem 0;
    border-radius: 0.1rem;
  }
  .ui-content-wrap {
    ::v-deep .m-user-card {
      padding-top: 0.1rem;
    }
  }
}
</style>
