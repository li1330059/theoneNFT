<template>
  <el-dialog
    class="v1-dialog-mycenter page-mine-setting-nameVerified"
    :visible.sync="dialogVisible"
    append-to-body
    width="320px"
    :title="`宝付账户提现`"
  >
    <div class="dialog-content">
      <div class="dialog-form">
        <div class="form-line">
          <h1>提现位置：</h1>
          <div class="flex-space">
            <div style="width: 100px">银行卡</div>
            <span>{{ bhInfo.bankAccount }}</span>
          </div>
        </div>

        <div class="form-line">
          <h1>提现金额：</h1>
          <el-input
            :disabled="drawMoneDisabled"
            v-model="drawPrice"
            maxlength="8"
            placeholder=""
          ></el-input>
          <span
            class="draw-all"
            :class="{ disabled: drawMoneDisabled }"
            @click="onDrawAll"
            >全部</span
          >
        </div>
        <div class="form-line">
          <h1>安全锁密码</h1>
          <count-letters ref="payNum"></count-letters>
        </div>
        <div class="des" v-if="pay_count !== -1">
          剩余 {{ pay_count }}次机会
        </div>
        <div class="des" v-else>
          剩余机会读取中
        </div>
        <div class="tip-message" style="text-align: left">
          <div>注意：</div>
          账户金额低于{{
            $common.formatMoney(configInfo.confValue1 / 100)
          }}元，需一次性全额提取；账户金额高于{{
            $common.formatMoney(configInfo.confValue1 / 100)
          }}元，{{
            $common.formatMoney(configInfo.confValue1 / 100)
          }}元起提，单笔提现最高{{
            $common.formatMoney(configInfo.confValue2 / 100)
          }}元，单日累计提现限额{{
            $common.formatMoney(configInfo.confValue3 / 100)
          }}元。
        </div>
        <div class="btn" @click="submit()">确定</div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
const KEY = "PAY-PASSWORD";
import CryptoJS from "crypto-js";
import Encryption from "@/utils/encryption";
export default {
  components: {},
  props: {
    bhInfo: {},
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  data() {
    return {
      configInfo: {},
      drawMoneDisabled: false,
      drawPrice: "",
      select: false,
      dialogVisible: false,
      phoneCode: null,
      pay_count: -1, //剩余次数
    };
  },
  methods: {
    async init(amount, cb) {
      this.amount = amount;
      this.select = false;
      this.drawPrice = "";
      this.dialogVisible = false;
      this.pay_count = -1;
      this.getConfig();

      await this.getPayCount();
      if (cb && typeof cb == "function") {
        this.cb = cb;
      }
      this.initPassword();
      //this.checkLocal();
    },
    async getConfig() {
      let result = await this.$api.service.config_get({
        key: "BAOFOO_WITHDRAW_RESTRICT",
      });
      if (result.data.code == 200) {
        this.configInfo = result.data.data;
        this.checkDrawMoney();
      } else {
        this.$message.warning(result.data.message);
      }
    },
    checkDrawMoney() {
      if (this.amount * 100 <= this.configInfo.confValue1) {
        //小于等于1w全额提现
        this.drawPrice = this.amount;
        this.drawMoneDisabled = true;
      } else {
        //this.drawPrice = this.amount;
      }
    },
    checkLocal() {
      const info = localStorage.getItem(`${KEY}${this.userInfo.userUuid}`);
      if (info) {
        const bytes = CryptoJS.AES.decrypt(info, "secret key 123");
        const _info = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        const nowTime = this.$common.formatDate(new Date(), "yyyyMMdd");
        const oldTIme = this.$common.formatDate(
          new Date(_info.time),
          "yyyyMMdd"
        );
        if (nowTime == oldTIme) {
          this.dialogVisible = false;
          if (this.cb && typeof this.cb == "function") {
            this.cb(_info.password);
          }
        } else {
          this.initPassword();
        }
      } else {
        this.initPassword();
        this.select = false;
      }
    },
    initPassword() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.payNum.init();
      });
    },
    async getPayCount() {
      const res = await this.$api.service.userAttribute_getPwdPayCount();
      if (res && res.data.code == 200) {
        this.pay_count = res.data.data;
      } else {
        this.$message.warning(res.data.message);
      }
    },
    handleSelect() {
      this.select = !this.select;
    },
    onDrawAll() {
      if (this.amount * 100 > this.configInfo.confValue2) {
        this.drawPrice = this.configInfo.confValue2 / 100;
      } else {
        this.drawPrice = this.amount;
      }
    },
    async submit() {
      if (!/^\d+(.\d+)?$/.test(this.drawPrice.toString().replace(/,/g, ""))) {
        this.$message.error("请输入正确的金额");
        return;
      }
      if (this.drawPrice * 100 > this.amount * 100) {
        this.$message.error("提现金额超出账户余额！");
        return;
      }
      if (this.drawPrice * 100 > this.configInfo.confValue2) {
        this.$message.error(
          `单笔最高${this.$common.formatMoney(
            this.configInfo.confValue2 / 100
          )}！`
        );
        return;
      }
      if (this.amount * 100 > this.configInfo.confValue1) {
        if (this.drawPrice * 100 < this.configInfo.confValue1) {
          this.$message.error(
            `最低${this.$common.formatMoney(
              this.configInfo.confValue1 / 100
            )}起提！`
          );
          return;
        }
      }

      if (this.drawPrice * 100 > this.configInfo.confValue3) {
        this.$message.error(
          `宝付账户个人用户提现每日限额${this.$common.formatMoney(
            this.configInfo.confValue3 / 100
          )}。请明日再试！`
        );
        return;
      }
      let password = this.$refs.payNum.getLetters().join("");
      if (password.length != 6) {
        this.$message.error("请输入6位密码");
        return;
      }

      const resPassword = await Encryption.getPassword(password);
      if (!resPassword) {
        this.$message.warning("密码加密错误");
        return;
      }

      const res = await this.$api.service.operation_verifiedPayPw({
        password: resPassword,
        type: 1,
      });
      await this.getPayCount();
      if (res && res.data.code == 200 && res.data.data) {
        if (this.select) {
          const passwordInfo = {
            password,
            time: new Date().getTime(),
          };
          const ciphertext = CryptoJS.AES.encrypt(
            JSON.stringify(passwordInfo),
            "secret key 123"
          ).toString();
          localStorage.setItem(`${KEY}${this.userInfo.userUuid}`, ciphertext);
        }

        this.dialogVisible = false;
        if (this.cb && typeof this.cb == "function") {
          this.cb(password, this.drawPrice);
        }
      } else {
        this.$message.warning(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.m-select {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  margin-top: 24px;
  user-select: none;
  .icon {
    width: 12px;
    height: 12px;
    display: inline-block;
    background-image: url("//static.theone.art/pc/icons/icon-select.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    margin-right: 4px;
  }
  .selected {
    background-image: url("//static.theone.art/pc/icons/icon-selected.png");
  }
}
.btn {
  margin: 30px auto 0;
  width: 138px;
  line-height: 36px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
  border-radius: 36px;
}
.des {
  text-align: right;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
}
.tip-message {
  text-align: right;
  font-size: 14px;
  padding-top: 10px;
  font-weight: 400;
  color: #ff7a64;
}
.flex-space {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}
.form-line {
  margin-bottom: 10px;
  position: relative;
  top: 0;
  left: 0;
}
.draw-all {
  position: absolute;
  bottom: 9px;
  right: 15px;
  font-size: 14px;
  font-weight: 400;
  color: #1288e5;
  cursor: pointer;
}
.disabled {
  opacity: 0.5;
}
</style>