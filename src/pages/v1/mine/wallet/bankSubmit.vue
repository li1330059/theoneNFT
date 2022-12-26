<template>
  <div>
    <el-dialog
      class="v1-dialog-mycenter page-mine-bank-add"
      :visible.sync="dialogVisible"
      append-to-body
      width="500px"
      :title="`${bankOperate == 0 ? '添加银行卡' : '设定开户行'}`"
    >
      <div class="dialog-content">
        <div class="dialog-form">
          <div class="form-line" v-if="userInfo.statusVerified != 1">
            <h1>真实姓名</h1>
            <div class="input-line">
              <el-input
                v-model="submitForm.name"
                placeholder="请输入真实姓名"
              ></el-input>
            </div>
          </div>
          <div class="form-line" v-if="userInfo.statusVerified != 1">
            <h1>身份证号</h1>
            <div class="input-line">
              <el-input
                v-model="submitForm.idcard"
                placeholder="请输入身份证号"
              ></el-input>
            </div>
          </div>
          <div v-if="bankOperate == 1">
            <div class="form-line">
              <h1>银行卡号</h1>
              <div class="input-line">
                {{ submitForm.bankAccont }}
              </div>
            </div>
          </div>
          <div class="form-line">
            <h1>银行</h1>
            <div>
              <div class="input-line select-line">
                <el-input
                  v-model="bankInfoListShortNameParam.bankShortName"
                  placeholder="请选择银行"
                  @input="onSearchBank"
                ></el-input>

                <ul v-if="bankInfoListShortNameResult && bankParam.search">
                  <li
                    v-for="(item, index) in bankInfoListShortNameResult.records"
                    :key="index"
                    @click="chooseBank(item)"
                  >
                    {{ item.bankShortName }}
                  </li>
                  <li v-if="bankInfoListShortNameResult.records.length == 0">
                    未能查询到此银行有关信息
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="form-line">
            <h1>开户行</h1>
            <div class="input-line select-line">
              <el-input
                v-model="bankInfoListParam.bankDetailName"
                placeholder="请选择开户行"
                @input="onSearchBankDetail"
                :disabled="bankInfoListParam.bankShortName ? false : true"
              ></el-input>
              <ul v-if="bankInfoListResult && bankParam.searchDetail">
                <li
                  v-for="(item, index) in bankInfoListResult.records"
                  :key="index"
                  @click="chooseBankDetail(item)"
                >
                  {{ item.bankDetailName }}
                </li>
                <li v-if="bankInfoListResult.records.length == 0">
                  未能查询到此开户行有关信息
                </li>
              </ul>
            </div>
          </div>
          <div v-if="bankOperate == 0">
            <div class="form-line">
              <h1>银行卡号</h1>
              <div class="input-line">
                <el-input
                  v-model="submitForm.bankcard"
                  placeholder="请输入银行卡号"
                ></el-input>
              </div>
            </div>
            <div class="form-line">
              <h1>银行卡预留手机号</h1>
              <div class="input-line">
                <el-input
                  v-model="submitForm.phone"
                  placeholder="请输入银行卡预留手机号"
                ></el-input>
              </div>
            </div>
          </div>

          <!--     <div class="form-line">
          <h1>验证码</h1>
          <div class="input-line phone-code">
            <el-input v-model="submitForm.phoneCode"></el-input>
            <get-phonecode :phone="submitForm.phone" :type="2" api="operation_getAuthCode" />
          </div>
          
        </div> -->
          <div class="tip-message" v-if="user.realname">
            *您实名认证信息是【{{
              user.realname
            }}】，请使用与实名认证相匹配的银行卡进行绑定。
          </div>

          <div class="form-btns">
            <div class="v1-btn mycenter" @click="dialogVisible = false">
              取消
            </div>
            <div class="v1-btn mycenter red" @click="submit()">确定</div>
          </div>
        </div>
      </div>
    </el-dialog>
    <div
      class="success-tip-wrap"
      v-if="show_success"
      @click="show_success = false"
    >
      <div class="content">
        <img
          class="title"
          src="//static.theone.art/pc/mine/ui-bind-bank-title.png"
          alt="icon"
        />
        <div class="des">
          <span class="ui-icon ui-icon-sign" />恭喜你认证成功<span
            class="ui-icon ui-icon-sign"
          />
        </div>
        <div class="ui-btn-group ui-btn-center">
          <div class="ui-btn ui-btn-red">我知道了</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    userInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  computed: {
    user() {
      return this.$store.state.user_info;
    },
  },
  data() {
    return {
      dialogVisible: false,
      show_success: false, //显示绑定成功
      bankInfoListShortNameParam: {
        bankShortName: "",
        pageCount: 1,
        pageSize: 5,
      },
      bankParam: {
        search: true, //开启搜索
        searchDetail: true, //开启支行搜索
      },
      bankInfoListShortNameResult: null,
      bankInfoListParam: {
        bankDetailName: "",
        bankShortName: "",
        pageCount: 1,
        pageSize: 5,
      },
      bankInfoListResult: null,
      submitForm: {
        bankUuid: "",
        bankcard: "",
        idcard: "",
        name: "",
        phoneCode: "111111",
        phone: "",
      },
      bankOperate: 0, //0新增 1更新开户行
      userBankUpdateBnakInfoParam: {
        bankUuid: "",
        uuid: "",
      },
    };
  },
  methods: {
    async init(bank) {
      Object.assign(this.$data, this.$options.data());

      if (bank) {
        this.bankOperate = 1;
        this.submitForm = bank;
        this.userBankUpdateBnakInfoParam.uuid = bank.uuid;
        this.bankInfoListShortNameParam.bankShortName = bank.bankShortName;
        this.bankInfoListParam.bankDetailName = bank.bankDetailName;
        this.bankInfoListParam.bankShortName = bank.bankShortName;
        this.haveBankDetailName = bank.bankDetailName ? true : false;
      } else {
        this.submitForm = {
          bankUuid: "",
          bankcard: "",
          idcard: "",
          name: "",
          phoneCode: "111111",
          phone: "",
        };
      }
      this.dialogVisible = true;
    },
    async onSearchBank() {
      if (this.bankInfoListShortNameParam.bankShortName) {
        this.bankParam.search = true;
        let result = await this.$api.service.bankInfo_listShortName(
          this.bankInfoListShortNameParam
        );
        this.bankInfoListShortNameResult = result.data.data;
        this.restBankDetail();
        console.log(`银行列表`, this.bankInfoListShortNameResult.records);
      }
    },
    restBankDetail() {
      this.bankInfoListParam.bankDetailName = "";
      this.submitForm.bankUuid = "";
      this.userBankUpdateBnakInfoParam.bankUuid = "";
      this.haveBankDetailName = false;
    },
    chooseBank(item) {
      this.bankParam.search = false;
      this.bankInfoListShortNameParam.bankShortName = item.bankShortName;
      this.bankInfoListParam.bankShortName = item.bankShortName;
    },
    async onSearchBankDetail() {
      if (
        this.bankInfoListParam.bankShortName &&
        this.bankInfoListParam.bankDetailName.length >= 2
      ) {
        this.bankParam.searchDetail = true;
        let result = await this.$api.service.bankInfo_list(
          this.bankInfoListParam
        );
        this.bankInfoListResult = result.data.data;
        console.log(`支行列表`, this.bankInfoListResult.records);
      }
    },
    chooseBankDetail(item) {
      this.bankParam.searchDetail = false;
      this.bankInfoListParam.bankDetailName = item.bankDetailName;
      this.submitForm.bankUuid = item.uuid;
      this.userBankUpdateBnakInfoParam.bankUuid = item.uuid;
    },
    async submit() {
      if (this.bankOperate == 1) {
        //设定开户行
        if (!this.userBankUpdateBnakInfoParam.bankUuid) {
          this.$message.warning(
            this.haveBankDetailName ? "请重新选择开户行" : "请选择开户行"
          );
          return;
        }
        let result = await this.$api.service.userBank_updateBnakInfo(
          this.userBankUpdateBnakInfoParam
        );
        if (result.data.code == 200) {
          this.$message.success("设定成功");
          this.dialogVisible = false;
          this.$emit("listen", { result: true });
        } else {
          this.$message.error(result.data.message);
        }
      } else {
        const { bankUuid, bankcard, idcard, name, phoneCode } = this.submitForm;
        //用户未通过验证
        if (this.userInfo.statusVerified != 1) {
          if (!name) {
            this.$message.warning("请输入真实姓名");
            return;
          }
          if (!idcard) {
            this.$message.warning("请输入身份证号");
            return;
          }
        }
        // end
        if (!bankUuid) {
          this.$message.warning("请选择开户行");
          return;
        }
        if (!bankcard) {
          this.$message.warning("请输入银行卡号");
          return;
        }
        if (!phoneCode) {
          this.$message.warning("请输入手机验证码");
          return;
        }
        let str = this.submitForm.bankcard;
        str = str.replace(/\s+/g, "");
        let result = null;
        if (this.userInfo.statusVerified != 1) {
          result = await this.$api.service.userbank_unverified_add(
            this.submitForm
          );
        } else {
          delete this.submitForm.name;
          delete this.submitForm.idcard;
          result = await this.$api.service.userbank_verified_add(
            this.submitForm
          );
        }

        if (result.data.code == 200) {
          if (!result.data.data) {
            this.$message.warning("验证失败");
          } else {
            this.dialogVisible = false;
            this.show_success = true;
            this.$emit("listen", { result: true });
          }
        } else {
          this.$message.warning(result.data.message);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.tip-message {
  color: #ff7a64;
}
.form-line {
  &.flex {
    display: flex;
    justify-content: space-between;
  }
}
.phone-code {
  display: flex;
  align-items: center;
}
.form-btns {
  margin-top: 36px;
}
.success-tip-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999999;
  .content {
    margin-top: 26vh;
    width: 278px;
    height: 173px;
    background: #ffffff;
    border-radius: 8px;
    position: relative;
    top: 0;
    left: 0;
    .title {
      width: 80%;
      display: block;
      margin: -32% auto 0;
    }
    .des {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.7);
      margin-top: 0.38rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      .ui-icon-sign {
        background-image: url("//static.theone.art/pc/mine/icon-bind-bank.png");
        margin:0 10px;
      }
    }
   .ui-btn-group{
     padding-top:30px;
   }
  }
}
</style>
