<template>
  <div class="page-mine-setting-index">
    <div v-if="screenWidth > 540">
      <div class="v1-tabs">
        <ul>
          <li
            v-for="(item, index) in tabList"
            :key="index"
            :class="{ active: tabActive == item.key }"
          >
            <a @click="changeTab(item.key)">{{ item.name }}</a>
          </li>
        </ul>
      </div>
      <div class="v1-form mycenter">
        <div class="setting-con">
          <div v-if="tabActive == 'base'">
            <div class="form-line">
              <h1>我的昵称</h1>
              <div class="input-line">
                <el-input
                  v-model="userAttr.nickname"
                  placeholder="请输入"
                ></el-input>
              </div>
            </div>
            <div class="moreline justify-start">
              <div class="form-line">
                <h1>我的性别</h1>
                <div class="input-line">
                  <el-select placeholder="请选择" v-model="userAttr.sex">
                    <el-option label="男" :value="1"> </el-option>
                    <el-option label="女" :value="2"> </el-option>
                  </el-select>
                </div>
              </div>
              <!--        <div class="form-line">
                <h1>我的生日（一年仅可设置一次）</h1>
                <div class="input-line">
                  <el-date-picker
                    type="date"
                    placeholder="选择生日"
                    v-model="userAttr.birthday"
                  >
                  </el-date-picker>
                </div>
              </div> -->
            </div>
            <div class="form-line">
              <h1>{{ introduce_txt }}</h1>
              <div class="input-line">
                <el-input
                  type="textarea"
                  placeholder="请输入"
                  v-model="userAttr.introduce"
                  maxlength="200"
                  rows="5"
                  show-word-limit
                >
                </el-input>
              </div>
            </div>

            <!--     <div class="form-line">
              <h1>地址</h1>
              <div
                class="addrees"
                v-clipboard:copy="444"
                v-clipboard:success="onCopy"
                v-clipboard:error="onCopyError"
              >
                <div>444</div>
                <span class="icon" />
              </div>
            </div> -->
          </div>
          <div v-if="tabActive == 'security'">
            <div class="form-line">
              <div class="security-bar input-line borderbottom">
                <h1 class="verified-title">
                  实名认证<span
                    class="verified-img"
                    v-if="userAttr.statusVerified == 1"
                  />
                </h1>

                <span
                  @click="onSetting('nameVerified')"
                  v-if="!userAttr.statusVerified"
                  >认证</span
                >
                <span
                  class="realname"
                  v-else-if="userAttr.statusVerified == 1"
                  >{{ userAttr.realname }}</span
                >
                <span
                  v-else-if="userAttr.statusVerified == 2"
                  @click="onSetting('nameVerified')"
                  >认证未通过</span
                >
              </div>
              <div class="line"></div>

              <div class="security-bar input-line borderbottom">
                <h1>设置安全锁密码</h1>
                <span
                  v-if="userAttr.isPayPwd == 1"
                  @click="onSetting('editorPayPassword')"
                  >修改</span
                >
                <span v-else @click="onSetting('setPayPassword')">设置</span>
              </div>
              <div class="input-line"></div>

              <!--          <div class="security-bar input-line borderbottom">
                <h1>设置登录密码</h1>

                <span
                  v-if="userAttr.isPwd == 1"
                  @click="onSetting('loginPassword')"
                  >修改</span
                >

                <span v-else @click="onSetting('initLoginPassword')">设置</span>
              </div> -->
              <div class="input-line"></div>
              <div class="security-bar input-line borderbottom">
                <h1>邮箱</h1>

                <span
                  v-if="userAttr.email && userAttr.email != ''"
                  @click="onSetting('initMailBox')"
                  >修改</span
                >

                <span v-else @click="onSetting('initMailBox')">设置</span>
              </div>
              <div class="input-line"></div>
              <div
                class="security-bar input-line borderbottom"
                :style="{
                  border: isAuth ? '0' : '',
                  marginBottom: isAuth ? '0' : '',
                }"
              >
                <h1>授权管理</h1>
                <div
                  :class="['auth-btn', isAuth ? 'auth-on' : 'auth-off']"
                  @click="isAuth = !isAuth"
                ></div>
              </div>
              <setAuthorizePc v-show="isAuth" />
              <div class="input-line"></div>
            </div>
          </div>

          <div v-if="tabActive == 'privacy'">
            <div class="form-line">
              <h1>主页可见性</h1>
              <div class="input-line borderbottom">
                <el-radio-group
                  v-model="userAttr.viewHomepage"
                  @change="privacySettings"
                >
                  <el-radio :label="0">公开</el-radio>
                  <el-radio :label="1">仅好友可见</el-radio>
                  <el-radio :label="2">不公开</el-radio>
                </el-radio-group>
              </div>
              <h1>个人藏品页可见性</h1>
              <div class="input-line borderbottom">
                <el-radio-group
                  v-model="userAttr.viewAssets"
                  @change="privacySettings"
                >
                  <el-radio :label="0">公开</el-radio>
                  <el-radio :label="1">仅好友可见</el-radio>
                  <el-radio :label="2">不公开</el-radio>
                </el-radio-group>
              </div>
              <!--        <h1>我关注的页签可见性</h1>
              <div class="input-line borderbottom">
                <el-radio-group v-model="tab">
                  <el-radio :label="1">公开</el-radio>
                  <el-radio :label="2">仅好友可见</el-radio>
                  <el-radio :label="3">不公开</el-radio>
                </el-radio-group>
              </div>
              <h1>我喜欢的藏品页签可见性</h1>
              <div class="input-line borderbottom">
                <el-radio-group v-model="collection">
                  <el-radio :label="1">公开</el-radio>
                  <el-radio :label="2">仅好友可见</el-radio>
                  <el-radio :label="3">不公开</el-radio>
                </el-radio-group>
              </div> -->
            </div>
          </div>
          <address-manage v-if="tabActive == 'address'"></address-manage>
        </div>
        <div
          class="form-btns"
          v-if="tabActive == 'base'"
          style="margin-top: 20px"
        >
          <div class="v1-btn mycenter red" @click="userAttrSubmit()">保存</div>
        </div>
      </div>
    </div>

    <!--  手机端-start -->
    <div v-else>
      <m-header :title="'个人设置'" />
      <div class="mc-setting-wrap">
        <div class="title">基本资料</div>
        <div
          class="option"
          @click="
            () => {
              this.$router.push('/mine/setting/personal_information');
            }
          "
        >
          <div class="t">个人信息</div>
          <div class="des">编辑资料<span /></div>
        </div>
        <div class="title">安全设置</div>

        <div
          class="option"
          @click="onSetting('nameVerified')"
          v-if="!userAttr.statusVerified"
        >
          <div class="t">实名认证</div>
          <div class="des">认证<span /></div>
        </div>
        <div class="option" v-else-if="userAttr.statusVerified == 1">
          <div class="t">
            <div class="verified-title">
              实名认证
              <div class="verified-img" v-if="userAttr.statusVerified == 1" />
            </div>
          </div>
          <div class="des" style="padding-right: 0.13rem">
            {{ userAttr.realname }}
          </div>
        </div>
        <div class="option" v-else-if="userAttr.statusVerified == 2">
          <div class="t">实名认证</div>
          <div class="des" @click="onSetting('nameVerified')">
            认证未通过<span />
          </div>
        </div>

        <div class="line" />

        <div
          class="option"
          v-if="userAttr.isPayPwd == 1"
          @click="onSetting('editorPayPassword')"
        >
          <div class="t">设置安全锁密码</div>
          <div class="des">修改<span /></div>
        </div>
        <div class="option" v-else @click="onSetting('setPayPassword')">
          <div class="t">设置安全锁密码</div>
          <div class="des">设置<span /></div>
        </div>

        <div class="line" />

        <!--       <div
          class="option"
          v-if="userAttr.isPwd == 1"
          @click="onSetting('loginPassword')"
        >
          <div class="t">设置登录密码</div>
          <div class="des">修改<span /></div>
        </div>
        <div class="option" v-else @click="onSetting('initLoginPassword')">
          <div class="t">设置登录密码</div>
          <div class="des">设置<span /></div>
        </div>
        <div class="line" /> -->

        <div
          class="option"
          v-if="userAttr.email && userAttr.email != ''"
          @click="onSetting('initMailBox')"
        >
          <div class="t">邮箱</div>
          <div class="des">修改<span /></div>
        </div>
        <div class="option" v-else @click="onSetting('initMailBox')">
          <div class="t">邮箱</div>
          <div class="des">设置<span /></div>
        </div>
        <div class="option" @click="onSetting('setAuthorizeM')">
          <div class="t">授权管理</div>
          <div class="des">管理<span /></div>
        </div>
        <div class="title">隐私设置</div>
        <div class="option" @click="is_show_home_privacy = true">
          <div class="t">{{ home_privacy }}</div>
          <div class="des">修改<span /></div>
        </div>
        <div class="title">地址管理</div>
        <div
          class="option"
          @click="
            () => {
              this.$router.push('/mine/setting/address-manage/address-mobile');
            }
          "
        >
          <div class="t">收货地址</div>
          <div class="des"><span /></div>
        </div>

        <div class="login-out" @click="loginOut">退出登录</div>
      </div>
      <van-popup round v-model="is_show_home_privacy" position="bottom">
        <van-picker
          show-toolbar
          :columns="home_privacy_list"
          value-key="name"
          @confirm="onChangeHomePrivacy"
          @cancel="is_show_home_privacy = false"
        ></van-picker>
      </van-popup>
    </div>
    <!--  手机端-end -->
    <nameVerified ref="nameVerified" @listen="upStatusVerified" />
    <inPayPassword ref="inPayPassword" />

    <setPayPassword
      ref="setPayPassword"
      :userInfo="userAttr"
    /><!-- 设置支付密码 -->
    <editorPayPassword
      ref="editorPayPassword"
      :userInfo="userAttr"
    /><!-- 修改支付密码 -->
    <loginPassword
      ref="loginPassword"
      :userInfo="userAttr"
    /><!-- 修改登录密码  -->
    <initLoginPassword
      ref="initLoginPassword"
      :userInfo="userAttr"
      @upLoginPasswordStatus="upLoginPasswordStatus"
    />
    <!-- 设置登录密码 -->
    <!-- 设置邮箱 -->
    <init-mail-box
      ref="initMailBox"
      :userInfo="userAttr"
      @listen="getUserAttr()"
    />
    <!-- 授权管理 -->
    <setAuthorizeM ref="setAuthorizeM" :userInfo="userAttr" />
  </div>
</template>
<script>
import mHeader from "@/components/v1/layout/mobileHeader";
import inPayPassword from "./inPayPassword.vue";
import nameVerified from "./nameVerified.vue";
import setPayPassword from "./setPayPassword.vue";
import loginPassword from "./loginPassword.vue";
import editorPayPassword from "./editorPayPassword.vue";
import initLoginPassword from "./initLoginPassword.vue";
import InitMailBox from "./initMailBox.vue";
import setAuthorizePc from "./setAuthorizePc.vue";
import setAuthorizeM from "./setAuthorizeM.vue";
import AddressManage from "./address-manage/address-pc.vue";
export default {
  data() {
    return {
      is_show_home_privacy: false,
      home_privacy_list: [
        { name: "所有人可见", key: 0 },
        { name: "仅好友可见", key: 1 },
        { name: "不对外公开", key: 2 },
      ],
      userAttr: { nickname: "", isPwd: "" },
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2099, 12, 31),
      tabActive: "base",
      screenWidth: document.body.clientWidth,
      pickerValue: "",
      isShowSex: false,
      isShowBirthday: false,
      sexList: ["男", "女"],
      tabList: [
        { name: "基本资料", key: "base" },
        { name: "安全设置", key: "security" },
        { name: "隐私设置", key: "privacy" },
        { name: "地址管理", key: "address" },
      ],
      payPassWord: {
        idcard: "",
        newPassword: "",
        oldPassword: "",
        phoneCode: "",
        realName: "",
      },
      isAuth: false,
    };
  },
  components: {
    mHeader,
    inPayPassword,
    nameVerified,
    setPayPassword,
    loginPassword,
    editorPayPassword,
    initLoginPassword,
    InitMailBox,
    setAuthorizePc,
    setAuthorizeM,
    AddressManage,
  },
  mounted() {
    this.getUserAttr();
  },
  computed: {
    home_privacy() {
      const val = this.home_privacy_list.find(
        (item) => item.key == this.userAttr.viewHomepage
      );
      return val ? val.name : "";
    },
    introduce_txt() {
      return this.userAttr.isAuthor ? "个人介绍" : "我的个性签名";
    },
  },

  methods: {
    async onChangeHomePrivacy(val) {
      //移动端设置主页权限
      this.userAttr.viewHomepage = val.key;

      const res = await this.$api.service.userattribute_change({
        viewHomepage: val.key,
        nickname: this.userAttr.nickname,
      });
      if (res.data.code == 200 && res.data.data) {
        this.is_show_home_privacy = false;
        this.$message({
          message: "修改成功",
          type: "success",
        });
      } else {
        this.$message({
          message: "修改失败",
          type: "error",
        });
      }
    },
    async privacySettings() {
      const params = {
        viewAssets: this.userAttr.viewAssets,
        viewHomepage: this.userAttr.viewHomepage,
        nickname: this.userAttr.nickname,
      };

      const res = await this.$api.service.userattribute_change(params);
      if (res.data.code && res.data.data) {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.$store.dispatch("getUserInfo");
      } else {
        this.$message({
          message: "修改失败",
          type: "error",
        });
      }
    },

    loginOut() {
      this.$confirm("确定退出登录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(async () => {
        await this.$api.service.auth_logout();
        this.$message({
          message: "已安全退出",
          type: "info",
        });
        localStorage.removeItem("THEONE_MEMBER");
        localStorage.removeItem("authorization");
        localStorage.removeItem("THEONE_USER");

        setTimeout(() => {
          window.location.href = "/";
        }, 600);
      });
    },
    upStatusVerified(res) {
      if (res) {
        this.$message.success("认证成功");
        this.userAttr.statusVerified = 1;
        this.$store.commit("setUserInfo", {
          statusVerified: 1,
        });
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
        this.$message({
          message: "修改成功！",
          type: "success",
        });
        this.userAttr.isPayPwd = 1;
      }
    },
    onSetting(type) {
      switch (type) {
        case "setPayPassword":
        case "editorPayPassword":
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
      //let result = await this.$api.service.userattribute_queryByUserUuid();
      let userAttr = JSON.parse(JSON.stringify(this.$store.state.user_info));
      if (userAttr) {
        this.userAttr = {
          ...userAttr,
          viewAssets: userAttr.viewAssets ? userAttr.viewAssets : 0,
          viewHomepage: userAttr.viewHomepage ? userAttr.viewHomepage : 0,
          sex: userAttr.sex == 0 ? "" : userAttr.sex,
        };
        console.log(`个人信息`, this.userAttr);
      }
    },
    async userAttrSubmit() {
      if (!this.userAttr.sex) {
        this.$message.warning("请设置性别");
        return;
      }
      if (!this.userAttr.nickname) {
        this.$message.warning("请设置昵称");
        return;
      }
      const userAttrParam = {
        introduce: this.userAttr.introduce,
        nickname: this.userAttr.nickname,
        realname: this.userAttr.realname,
        sex: this.userAttr.sex,
      };
      let result = await this.$api.service.userattribute_change(userAttrParam);
      if (result.data.data) {
        this.$message.success("操作成功");
        this.$store.commit("setUserInfo", userAttrParam);
      } else {
        this.$message.error(result.data.message);
      }
    },
    changeTab(key) {
      this.tabActive = key;
    },
    onConfirm(value, type) {
      if (type == 2) {
        this.isShowBirthday = false;
        this.user.birthday = this.$dayjs(value).format("YYYY-MM-DD");
      } else {
        this.isShowSex = false;
        this.user.sex = value;
      }
    },
    onCopy() {
      this.$toast.success("复制成功！");
    },
    onCopyError() {},
  },
};
</script>
<style lang="scss" scoped>
.page-mine-setting-index {
  max-width: 808px;
  .v1-tabs {
    margin-bottom: 21px;
  }
  .setting-con {
    min-height: 400px;
  }
}
.verified-title {
  display: flex;
  align-items: center;
}
.verified-img {
  display: inline-block;
  width: 60px;
  height: 18px;
  background: url("//static.theone.art/pc/icons/icon-certified.png") no-repeat
    center;
  background-size: contain;
  margin-left: 8px;
}
/* security-start */
.security-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 14px;
    font-weight: 500;
    color: #397fe7;
    cursor: pointer;
  }
  .realname {
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.4);
    cursor: inherit;
  }
  .auth-btn {
    width: 28px;
    height: 14px;
    background-size: 14px 14px;
    background-repeat: no-repeat;
    background-position: center;
  }
  .auth-on {
    background-image: url("~@/assets/1.0/images/market-item-show.png");
  }
  .auth-off {
    background-image: url("~@/assets/1.0/images/market-item-hide.png");
  }
}

/* security-end */

.addrees {
  background: rgba(229, 229, 229, 0.2);
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  padding: 0 16px;
  line-height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 30px;
  .icon {
    background: url("//static.theone.art/pc/images/pic-home/copy-icon.png")
      no-repeat center;
    background-size: contain;
    width: 14px;
    height: 14px;
    display: block;
  }
}

@media screen and (min-width: 0px) and (max-width: 540px) {
  /* 个人设置-start */

  .mc-setting-wrap {
    background-color: #fafafa;
    .line {
      height: 0.02rem;
      background-color: rgba(0, 0, 0, 0.05);
    }
    .title {
      font-size: 0.28rem;
      font-weight: 500;
      color: #000000;
      padding: 0.32rem;
    }
    .option {
      line-height: 1rem;
      background: #ffffff;
      padding: 0 0.32rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        display: block;
        width: 0.48rem;
        height: 0.48rem;
        background: url("//static.theone.art/pc/images/arrowright2%402x.png")
          no-repeat;
        background-size: contain;
      }
      .des {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: rgba(0, 0, 0, 0.4);
      }
    }
    .login-out {
      line-height: 1rem;
      background: #ffffff;
      text-align: center;
      margin-top: 0.32rem;
      font-size: 0.28rem;
      font-weight: 400;
    }
  }
  /* 个人设置-end */
  .page-mine-setting-index {
    padding-top: 1.08rem;
    padding-bottom: 1rem;

    .list {
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
      display: flex;
      align-items: center;
      height: 60px;
      padding: 0 0.32rem;
      background: #fff;
      &:last-child {
        border-bottom: none;
      }
      .title {
        width: 2rem;
        font-size: 0.28rem;
        color: rgba($color: #000000, $alpha: 1);
        font-weight: 400;
      }
      .content {
        flex: 1;
        color: rgba($color: #000000, $alpha: 0.6);
        span {
          margin-right: 0.32rem;
        }
        ::v-deep .el-input__inner,
        ::v-deep .el-textarea__inner {
          border: none;
          padding: 0;
          resize: none;
          color: rgba($color: #000000, $alpha: 0.6);
          font-size: 0.28rem;
        }
      }

      .v1-btn-link {
        background: url("//static.theone.art/pc/images/pic-home/arrowright2%402x.png")
          no-repeat;
        width: 0.48rem;
        height: 0.48rem;
        background-size: 0.48rem 0.48rem;
        &.copy {
          background: url("//static.theone.art/pc/images/pic-home/copy2.png")
            center center no-repeat;
          background-size: 0.28rem 0.28rem;
        }
      }
    }

    .v1-card-title-mycenter {
      padding: 0.32rem;
      border-bottom: none;
      h1 {
        font-size: 0.28rem;
        font-weight: 500;
        color: #000000;
      }
    }

    .v1-card-title-right {
      display: flex;
      justify-content: center;
      margin-top: 2.1rem;
      .v1-btn.mycenter {
        width: 6.86rem;
        height: 0.72rem;
        line-height: 0.72rem;
        border-radius: 0.36rem;
        font-size: 0.28rem;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }
}
</style>
