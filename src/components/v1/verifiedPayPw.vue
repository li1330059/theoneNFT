<template>
  <el-dialog
    class="v1-dialog-mycenter page-mine-setting-nameVerified"
    :visible.sync="dialogVisible"
    append-to-body
    width="320px"
    :title="title ? title : `安全锁密码验证`"
  >
    <div class="dialog-content">
      <div class="dialog-form">
        <div class="form-line">
          <h1>输入安全锁密码</h1>
          <count-letters ref="payNum" class="count-letters" />
        </div>
        <div class="des" v-if="pay_count !== -1">
          剩余 {{ pay_count }} 次机会
        </div>
        <div class="des" v-else>剩余机会读取中</div>
        <div v-if="warningTxt" class="warning-txt">{{ warningTxt }}</div>
        <!--      <div class="m-select" @click="handleSelect">
          <span
            class="icon"
            :class="{ selected: select }"
          />今日寄售不再使用安全锁密码
        </div> -->
        <!-- <div class="des" style="text-align: left">
          为保证您的资产不受到任何侵害请谨慎选择此项
        </div> -->
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
    userInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
    title: String,
    warningTxt: String,
  },
  data() {
    return {
      select: false,
      dialogVisible: false,
      phoneCode: null,
      pay_count: -1, //剩余次数
    };
  },
  methods: {
    async init(cb) {
      this.select = false;
      this.dialogVisible = false;
      this.pay_count = -1;
      await this.getPayCount();

      if (cb && typeof cb == "function") {
        this.cb = cb;
      }
      this.initPassword();
      //this.checkLocal();
    },
    checkLocal() {
      const info = localStorage.getItem(KEY);
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
    async submit() {
      let password = this.$refs.payNum.getLetters().join("");
      if (password.length != 6) {
        this.$message.error("请输入6位密码");
        return;
      }
      //支付密码校验
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
          localStorage.setItem(KEY, ciphertext);
        }

        this.dialogVisible = false;
        if (this.cb && typeof this.cb == "function") {
          this.cb(password);
        }
      } else {
        this.$message.warning(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.warning-txt {
  font-size: 12px;
  font-weight: 400;
  color: #e8251f;
  margin-top: 12px;
}
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
  color: rgba(0, 0, 0, 0.4);
  text-align: right;
  font-size: 12px;
  padding-top: 10px;
}
</style>