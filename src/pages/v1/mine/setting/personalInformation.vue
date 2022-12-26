<template>
  <div style="padding-top: 1.4rem">
    <m-header :title="'编辑资料'" />

    <div class="list">
      <div class="title">我的昵称</div>
      <div class="info">
        <input v-model="userAttr.nickname" type="text" />
        <span class="icon" />
      </div>
    </div>
    <div class="list">
      <div class="title">性别</div>
      <div class="info" @click="isShowSex = true">
        <div class="input">{{ sex }}</div>
        <span class="icon" />
      </div>
    </div>
    <van-popup round v-model="isShowSex" position="bottom">
      <van-picker
        show-toolbar
        :columns="sexList"
        value-key="val"
        @confirm="onChangeSex"
        @cancel="isShowSex = false"
      ></van-picker>
    </van-popup>
    <!-- <div class="list">
      <div class="title">生日</div>
      <div class="info" @click="isShowBirthday = true">
        <input type="text" readonly="" v-model="userAttr.birthday" />
        <span class="icon" />
      </div>
      <van-popup round v-model="isShowBirthday" position="bottom">
        <van-datetime-picker
          type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="onChangeBirthday($event)"
          @cancel="isShowBirthday = false"
        />
      </van-popup>
    </div> -->
    <div class="list" @click="show_introduction = true">
      <div class="title">简介</div>
      <div class="info">
        <div class="input" style="line-height: 1.4">
          {{ userAttr.introduce }}
        </div>
        <span class="icon" />
      </div>
    </div>
    <!-- <div
      class="list"
      v-clipboard:copy="444"
      v-clipboard:success="onCopy"
      v-clipboard:error="onCopyError"
    >
      <div class="title">地址</div>
      <div class="info">
        <input v-model="userAttr.nickname" type="text" />
        <span class="icon copy" />
      </div> 
    </div>
    <van-popup round v-model="isShowSex" position="bottom">
      <van-picker
        show-toolbar
        :columns="sexList"
        @confirm="onChangeSex"
        @cancel="isShowSex = false"
      ></van-picker>
    </van-popup> -->

    <div class="introduction-wrap" v-show="show_introduction">
      <div class="head">
        <div class="btn black" @click="show_introduction = false">取消</div>
        <div class="btn red" @click="show_introduction = false">保存</div>
      </div>
      <div class="content">
        <el-input
          class="textarea"
          type="textarea"
          resize="none"
          :autosize="{ minRows: 6, maxRows: 10 }"
          placeholder="介绍一下自己，让大家都认识你～"
          v-model="userAttr.introduce"
        >
        </el-input>
        <div class="letter-num" :class="{ red: letter_num > 200 }">
          {{ letter_num }}/200
        </div>
      </div>
    </div>

    <div class="v1-btn save red" @click="userAttrSubmit">保存</div>
  </div>
</template>
<script>
import mHeader from "@/components/v1/layout/mobileHeader";

export default {
  data() {
    return {
      show_introduction: false,
      userAttr: { nickname: "", isPwd: "" },
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2099, 12, 31),
      tabActive: "base",
      screenWidth: document.body.clientWidth,
      pickerValue: "",
      isShowSex: false,
      isShowBirthday: false,
      sexList: [
        { key: 1, val: "男" },
        { key: 2, val: "女" },
      ],
      tabList: [
        { name: "基本资料", key: "base" },
        { name: "安全设置", key: "security" },
        { name: "隐私设置", key: "privacy" },
      ],
      payPassWord: {
        idcard: "",
        newPassword: "",
        oldPassword: "",
        phoneCode: "",
        realName: "",
      },
    };
  },
  computed: {
    sex: function () {
      const info = this.sexList.find((item) => {
        return item.key == this.userAttr.sex;
      });
      return info ? info.val : "未设置";
    },
    letter_num: function () {
      return this.userAttr.introduce ? this.userAttr.introduce.length : 0;
    },
    introduce_txt() {
      return this.userAttr.isAuthor ? "个人介绍" : "我的个性签名";
    },
  },
  components: {
    mHeader,
  },
  mounted() {
    this.getUserAttr();
  },
  methods: {
    upStatusVerified(res) {
      if (res) {
        this.userAttr.statusVerified = 1;
      }
    },
    upLoginPasswordStatus(res) {
      this.userAttr.isPwd = 1;
      this.$message({
        message: "修改成功",
        type: "success",
      });
    },
    upPayPwd(res) {
      if (res) {
        this.userAttr.isPayPwd = 1;
      }
    },
    onSetting(type) {
      switch (type) {
        case "setPayPassword":
          //设置支付密码
          if (this.userAttr.statusVerified == 1) {
            this.$refs[type].init();
          } else {
            this.$message({
              message: "请先进行实名认证",
              type: "warning",
            });
          }
          break;
        default:
          this.$refs[type].init();

          break;
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    async getUserAttr() {
      this.userAttr = JSON.parse(JSON.stringify(this.$store.state.user_info));
    },
    async userAttrSubmit() {
      if (!this.userAttr.nickname) {
        this.$message.warning("请设置昵称");
        return;
      }
      if (this.userAttr.sex == 1 || this.userAttr.sex == 2) {
        let userAttrParam = {
          introduce: this.userAttr.introduce,
          nickname: this.userAttr.nickname,
          sex: this.userAttr.sex,
        };
        let result = await this.$api.service.userattribute_change(
          userAttrParam
        );
        if (result.data.data) {
          this.$message.success("操作成功");
          this.$store.commit("setUserInfo", userAttrParam);
        } else {
          this.$message.error(result.data.message);
        }
      } else {
        this.$message.warning("请设置性别");
      }
    },
    changeTab(key) {
      this.tabActive = key;
    },
    onChangeBirthday(value) {
      this.isShowBirthday = false;
      this.userAttr.birthday = this.$dayjs(value).format("YYYY-MM-DD");
    },
    onChangeSex(info) {
      this.userAttr.sex = info.key;
      this.isShowSex = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.textarea {
}
.list {
  display: flex;
  line-height: 1rem;
  padding: 0 0.16rem 0 0.32rem;
  background-color: #fff;
  justify-content: space-between;
  input,
  .input {
    border: none;
    outline: none;
    background-color: transparent;
    text-align: right;
    padding-right: 0.15rem;
    color: rgba(0, 0, 0, 0.4);
    flex: 1;
  }
  border-bottom: 0.01rem solid rgba(0, 0, 0, 0.1);
  .info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    span {
      display: block;
      width: 0.48rem;
      height: 0.48rem;
      background: url("//static.theone.art/pc/images/pic-home/arrowright2%402x.png")
        no-repeat;
      background-size: contain;
    }
    .copy {
      background: url("//static.theone.art/pc/images/pic-home/copy-icon.png")
        no-repeat center;
      width: 0.28rem;
      height: 0.28rem;
      background-size: contain;
      margin-right: 0.12rem;
      margin-left: 0.07rem;
    }
  }
}
.save {
  margin: 5rem 0.32rem 0;
}
.introduction-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 1);
  background-color: #fafafa;
  .content {
    background-color: #fff;
    ::v-deep .el-textarea {
      textarea {
        border: none;
      }
    }
    .letter-num {
      text-align: right;
      padding: 0.28rem 0.32rem;
      color: rgba(0, 0, 0, 0.4);
    }
    .red {
      color: #e61f1a;
    }
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.4rem;
    padding: 0 0.32rem;
    margin-bottom: 0.32rem;
    .btn {
      font-size: 0.28rem;
      font-weight: 500;
      font-size: 0.24rem;
      font-weight: 400;
      color: #000000;
    }
    .red {
      color: #e61f1a;
    }
  }
}
</style>
