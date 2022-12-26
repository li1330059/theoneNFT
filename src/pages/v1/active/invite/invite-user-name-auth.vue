<template>
  <div class="ui-body">
    <img
      class="body-img-title"
      src="
        //static.theone.art/pc/invite/m-title.png
      "
    />
    <div class="section">
      <img
        class="content-title"
        src="
          //static.theone.art/pc/invite/title-user-name.png
        "
      />
      <div class="form">
        <div v-if="showForm">
          <div class="input-box">
            <div class="label">姓名</div>
            <el-input
              v-model="realname"
              placeholder="请输入真实姓名"
              type="text"
            ></el-input>
          </div>
          <div class="input-box">
            <div class="label">身份证</div>
            <el-input
              v-model="idNumber"
              placeholder="请输入身份证"
              type="text"
            ></el-input>
          </div>
          <!--         <div class="input-box">
            <div class="label">验证码</div>
            <div class="code-wrap">
              <el-input
                type="text"
                maxlength="6"
                placeholder="请输入验证码"
                v-model="verification_code"
              />
             <get-phonecode :phone="phone" :type="1" api="login_getAuthCode" /> 
            </div>
          </div> -->
          <div
            class="btn btn-red"
            :class="{ 'btn-disabled': submit_disabled }"
            @click="submit"
          >
            确定
          </div>
        </div>
        <div v-else>
          <div class="content-txt">
            恭喜您注册完成，绑定银行卡即可领取新用户免费盲盒，快去绑定吧～
          </div>
          <div class="btn btn-red" @click="go">马上去绑定</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div>元宇宙时代新的艺术消费选择</div>
      <div>开拓全新的艺术收藏及应用途径</div>
      <div>寻找全新的文化价值承载方式</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      realname: "",
      idNumber: "",
      verification_code: "111111",
      showForm: true,
      submit_disabled: false,
    };
  },
  created() {
    this.invitation_code = this.$route.params.invitation_code;
  },
  mounted() {},
  computed: {},
  methods: {
    init() {},
    go() {
      window.location.href="/mine/wallet/bank"
    },
    async submit() {
      if (!this.realname) {
        this.$message.warning("请填写真实姓名");
        return;
      }
      if (!this.idNumber) {
        this.$message.warning("请填写身份证号");
        return;
      }
      const res = await this.$api.$service.userattribute_verifiedIdcard({
        idNumber: this.idNumber,
        realname: this.realname,
        phoneCode: this.verification_code,
      });
      if (res.code == 200 && res.data) {
        this.showForm = false;
      } else {
        this.$message.error(res.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
.content-txt {
  padding: 0.9rem;
  font-size: 0.26rem;
  font-weight: 400;
  color: #333333;
  line-height: 0.4rem;
  text-align: center;
}
.ui-body {
  background: #201207
    url("//static.theone.art/pc/invite/register-bg.png")
    top center no-repeat;
  background-size: contain;
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  padding-top: 1.73rem;
}
.section {
  position: relative;
  top: 0;
  left: 0;
  .content-title {
    display: block;
    width: 4.27rem;
    margin: 0 auto -0.2rem;
  }
}
.body-img-title {
  width: 5.32rem;
  margin: 0 auto 0.87rem;
  display: block;
}
.input-box {
  margin-bottom: 0.2rem;
  .label {
    font-size: 0.26rem;
    font-weight: 400;
    color: #333333;
    margin-bottom: 0.2rem;
  }
}
.code-wrap {
  display: flex;
  align-items: center;
}
.btn {
  line-height: 0.88rem;
  font-size: 0.26rem;
  font-weight: 400;
  border-radius: 50px;
  width: 100%;
  text-align: center;
}
.btn-red {
  background: linear-gradient(270deg, #e6231d 0%, #ff7863 100%);
  color: #fff;
}
.form {
  background: #ffffff;
  border-radius: 0.2rem;
  width: 90%;
  margin: 0 auto;
  padding: 0.45rem;
  position: relative;
  top: 0;
  left: 0;
  z-index: 2;
  max-width: 800px;
}
.agreement {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #666666;
  font-size: 12px;
  margin-top: 8px;
  cursor: pointer;
  span {
    display: block;
    background: url("//static.theone.art/pc/images/pic-home/icon_weigouxuan%402x.png") no-repeat
      center;
    background-size: contain;
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }
  .read {
    background: url("//static.theone.art/pc/images/pic-home/icon_gouxuan%402x.png") no-repeat center;
    background-size: contain;
  }
  a {
    color: #000000;
    font-size: 0.12rem;
    font-weight: 400;
  }
  @media screen and (max-width: 540px) {
    font-size: 0.24rem;
    margin-top: 0.4rem;
    justify-content: center;

    span {
      width: 0.24rem;
      height: 0.24rem;

      margin-right: 0.04rem;
    }
    a {
      color: #000000;
      font-size: 0.24rem;
      font-weight: 400;
    }
  }
}
.btn-disabled {
  background: #d3d3d3;
}
.footer {
  font-size: .24rem;
  font-weight: 400;
  color: #ffffff;
  line-height: 3;
  text-align: center;
  padding-top:1rem;
}
</style>