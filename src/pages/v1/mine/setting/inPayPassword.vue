<template>
  <div>
    <el-dialog
      class="v1-dialog-mycenter page-mine-setting-nameVerified"
      :visible.sync="dialogVisible"
      append-to-body
      width="320px"
      title="输入安全锁密码"
    >
      <div class="dialog-content">
        <div class="dialog-form">
          <div class="form-line">
            <h1 class="title">为了您的资产安全请输入安全锁密码</h1>
            <count-letters ref="payNum" class="count-letters" />
            <div class="des-tip">
              <div class="tip">
                <span v-if="pay_count !== -1">剩余{{ pay_count }}次机会</span>
                <span v-else>剩余机会读取中</span>
              </div>
              <div class="forget-password" @click="onEditorPayPassword">
                忘记密码
              </div>
            </div>
          </div>
          <!--     <div class="form-line" v-if="false">
          <div class="input-line phone-code-wrap">
            <el-input v-model="phoneCode" placeholder="请输入验证码"></el-input>
            <getphonecode :type="3" class="code-wrap" />
           
          </div>
        </div> -->

          <!-- <div class="v1-btn mycenter" @click="dialogVisible = false">取消</div> -->
          <div v-if="isRemember">
            <div class="m-select" @click="handleSelect">
              <span
                class="icon"
                :class="{ selected: select }"
              />今日购买不再使用安全锁密码
            </div>
            <div class="des" style="text-align: left">
              为保证您的资产不受到任何侵害请谨慎选择此项
            </div>
          </div>

          <div
            class="sub-btn"
            :class="{ disabled: sub_disabled }"
            @click="submit()"
          >
            立即支付
          </div>
        </div>
      </div>
    </el-dialog>
    <!--   修改支付密码 -->
    <editorPayPassword ref="editorPayPassword" />
  </div>
</template>
<script>
import getphonecode from "@/components/v1/getphonecode";
import editorPayPassword from "./editorPayPassword.vue";
import CryptoJS from "crypto-js";
const KEY = "PAY-PASSWORD";
import Encryption from "@/utils/encryption";
export default {
  components: { editorPayPassword },
  props: {
    isRemember: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      sub_disabled: false,
      dialogVisible: false,
      pay_count: -1,
      phoneCode: null,
      select: false,
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    async init() {
      this.checkLocal();
    },
    handleSelect() {
      this.select = !this.select;
    },
    checkLocal() {
      if (this.isRemember) {
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
            this.$emit("listen", { result: _info.password });
          } else {
            this.rest();
          }
        } else {
          this.rest();
        }
      } else {
        this.rest();
      }
    },

    rest() {
      this.select = false;
      this.dialogVisible = true;
      this.pay_count = -1;
      this.getPayCount();
      this.$nextTick(() => {
        this.$refs.payNum.init();
      });
    },
    async getPayCount() {
      const res = await this.$api.service.userAttribute_getPwdPayCount();
      if (res && res.data.code == 200) {
        this.pay_count = res.data.data;
      }
    },
    onEditorPayPassword() {
      this.$refs["editorPayPassword"].init();
    },
    async submit() {
      const password = this.$refs.payNum.getLetters().join("");
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
        this.$emit("listen", { result: password });
      } else {
        await this.getPayCount();
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
  padding-bottom: 4px;
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
.phone-code-wrap {
  display: flex;
  align-items: center;
  .code-wrap {
    width: 116px;
  }
}
.page-mine-setting-nameVerified .message {
  color: rgba($color: #000000, $alpha: 0.7);
}
.v1-dialog-mycenter .title {
  text-align: center;
  margin-top: -10px;
  padding-bottom: 10px;
  color: rgba(0, 0, 0, 0.7);
}
.count-letters {
  margin-bottom: 12px;
}
.des-tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .tip {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
  }
  .forget-password {
    font-size: 12px;
    font-weight: 400;
    color: #e82821;
    cursor: pointer;
  }
}
.form-btns {
  padding-top: 24px;
}
.sub-btn {
  width: 138px;
  line-height: 36px;
  background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
  border-radius: 18px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin: 24px auto 0;
  cursor: pointer;
}
.disabled {
  background: #e5e5e5;
}
</style>
