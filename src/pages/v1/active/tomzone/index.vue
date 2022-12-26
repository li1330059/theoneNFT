<template>
  <div class="page-tomzone">
    <div class="page-main">
      <!-- pc -->
      <div class="v1-tomzone-pc">
        <div class="content-bg">
          <img src="https://static.theone.art/pc/tomzone/bg.png">
          <div class="logo"></div>
          <div class="title1">元宇宙端午数字藏品来袭！</div>
          <div class="title2">会说话的汤姆猫家族即将在唯一艺术平台发售汤姆猫家族元·汤数字藏品！</div>
        </div>
        <div class="v1-tomzone-main">
          <div class="content-four">
            <div class="title">
              活动介绍
            </div>
            <div class="content">
              <p>汤姆猫家族元·汤数字藏品联手唯一艺术平台，糅和中国传统节日文化与色彩潮流美学，打造极具视觉冲击力的数字艺术藏品并独家首发神秘赋能元宇宙端午礼盒，上演一场跨时空传统文化重构之旅。</p>
              <p>作品以2022年度潮流色长春花蓝为基调色，它包含了蓝色的肌底，悬空旋转的金属质感造型粽和独特的汤姆猫赛博朋克造型，同时伴随着紫红的基调，展现了灵动与活力，以此激发疫情封锁期间陷入低谷的人们探索未知的无限勇气及创造力。</p>
              <p>汤姆猫家族在唯一与万千莫测的新释义相遇，请查收来自汤姆猫家族的节日限定心意~</p>
            </div>
          </div>
          <div class="content-two">
            <div class="title"
                 v-if="userInfo.userUuid">您好，快来领取你的礼物吧</div>
            <div class="title"
                 v-else>您还未登录，请<span @click="goLogin">先登录>></span></div>
            <div class="content">
              <div class="input-item">
                <h1>领取兑换码</h1>
                <div class="input-block">
                  <input class="text"
                         type="text"
                         placeholder="请输入领取验证码"
                         v-model="dataForm.exchangeCode" />
                </div>
              </div>
              <div class="input-item">
                <h1>领取人手机号</h1>
                <div class="input-block">
                  <input class="text"
                         type="text"
                         placeholder="请输入领取人手机号"
                         v-model="dataForm.phone" />
                </div>
              </div>
              <div class="login-btn"
                   :class="{ 'disabled-btn': !userInfo.userUuid }"
                   @click="beforeSubmit">
                提交
              </div>
            </div>
          </div>
          <div class="content-one">
            <div class="title">
              活动规则
            </div>
            <div class="content">
              <p>成功登陆后，进入领取页面，输入“领取兑换码”及“领取人手机号”，点击确认后，元·汤数字藏品将投放进领取人手机号对应账户（若领取人手机号未注册不影响藏品投放，可注册登录 theone.art 官网，进入个人中心-我的藏品中查收）</p>
              <div class="mt16">
                <p>注意：(1)领取有效时间2022.5.10-2022.6.30，过期无效</p>
                <div class="indent">
                  <span>(2)一个手机号最多领取一次</span>
                </div>
                <div class="indent">
                  <span>(3)一个兑换码最多领取一次</span>
                </div>
                <div class="indent">
                  <span>(4)领取人手机号可以为任何用户手机号</span>
                </div>
                <div class="indent">
                  <span>(5)领取用户若未注册会由平台进行记录，若用户注册则平台发放</span>
                </div>
              </div>
              <p class="mt16">本活动最终解释权归唯一艺术平台所有</p>
            </div>
          </div>
          <div class="content-three">
            <div class="title">唯一艺术平台介绍</div>
            <div class="content">
              <p>唯一艺术是一家数字艺术电商平台，由艺术设计圈资深运营公司和区块链技术团队联袂推出，公司在北京、杭州、深圳和香港等多地设有分公司。</p>
              <p>股东和合规性层面，唯一艺术分别于2021年9月、2022年4月收获1000万元天使轮及数千万元A轮投资，同时获得了多项现有政策下的合规经营资质，是目前国内为数不多的由国有资本参与投资的数字艺术电商平台，拥有行业内相对较全的营业相关资质。</p>
              <p>在品牌影响力层面，2021年8月，唯一艺术发起“全球首届数字艺术创作大赛”，获得了海内外众多艺术家的积极响应，以及业内人士和媒体的一致好评。大赛得到了包括新华社、光明日报、环球网、China Daily在内的多家央媒的关注与报道。目前唯一艺术已成功发售敦煌系列、故宫系列、国家文物局中国文物报、新华社上海证券报、世界大学生运动会、CBA中国篮球协会、上海时装周元宇宙服装等大量知名IP，平台签约艺术家数千名，已形成规模效应及品牌效应。</p>
              <p>在赋能实业层面，2022年3月22日，国家工业设计研究院唯一艺术分院揭牌成立，预示着唯一艺术将携手产业链伙伴，在工业设计领域进行更深入、系统的产学研研究。以数字艺术赋能工业设计，推动中国制造向中国品牌迈进，将数字艺术赋能实业的步伐走稳走远！ </p>
              <p>唯一艺术立足于区块链技术在知识产权领域的应用，精耕数字艺术产业。平台致力于讲述中国故事，传播中国文化，为中国的数字艺术产业做实做强，提供更加坚实的基础设施保障。</p>
            </div>
          </div>
        </div>
      </div>
      <!-- mobile -->
      <div class="v1-tomzone-mobile">
        <div class="content-bg">
          <img src="https://static.theone.art/pc/tomzone/bg-mobile.png">
          <div class="logo"></div>
          <div class="title1">元宇宙端午数字藏品来袭！</div>
          <div class="title2">
            <p>会说话的汤姆猫家族</p>
            <p>即将在唯一艺术平台发售汤姆猫家族元·汤数字藏品！</p>
          </div>
        </div>
        <div class="v1-tomzone-main">
          <div class="content-four">
            <div class="title">
              活动介绍
            </div>
            <div class="content">
              <p>汤姆猫家族元·汤数字藏品联手唯一艺术平台，糅和中国传统节日文化与色彩潮流美学，打造极具视觉冲击力的数字艺术藏品并独家首发神秘赋能元宇宙端午礼盒，上演一场跨时空传统文化重构之旅。</p>
              <p>作品以2022年度潮流色长春花蓝为基调色，它包含了蓝色的肌底，悬空旋转的金属质感造型粽和独特的汤姆猫赛博朋克造型，同时伴随着紫红的基调，展现了灵动与活力，以此激发疫情封锁期间陷入低谷的人们探索未知的无限勇气及创造力。</p>
              <p>汤姆猫家族在唯一与万千莫测的新释义相遇，请查收来自汤姆猫家族的节日限定心意~</p>
            </div>
          </div>
          <div class="content-two">
            <div class="title"
                 v-if="userInfo.userUuid">您好，快来领取你的礼物吧</div>
            <div class="title"
                 v-else>您还未登录，请<span @click="goLogin">先登录>></span></div>
            <div class="content">
              <div class="input-item">
                <h1>领取兑换码</h1>
                <div class="input-block">
                  <input class="text"
                         type="text"
                         placeholder="请输入领取验证码"
                         v-model="dataForm.exchangeCode" />
                </div>
              </div>
              <div class="input-item">
                <h1>领取人手机号</h1>
                <div class="input-block">
                  <input class="text"
                         type="text"
                         placeholder="请输入领取人手机号"
                         v-model="dataForm.phone" />
                </div>
              </div>
              <div class="login-btn"
                   :class="{ 'disabled-btn': !userInfo.userUuid }"
                   @click="beforeSubmit">
                提交
              </div>
            </div>
          </div>
          <div class="content-one">
            <div class="title">
              活动规则
            </div>
            <div class="content">
              <p>成功登陆后，进入领取页面，输入“领取兑换码”及“领取人手机号”，点击确认后，元·汤数字藏品将投放进领取人手机号对应账户（若领取人手机号未注册不影响藏品投放，可注册登录 theone.art 官网，进入个人中心-我的藏品中查收）</p>
              <div class="mt16">
                <p>注意：(1)领取有效时间2022.5.10-2022.6.30，过期无效</p>
                <div class="indent">
                  <span>(2)一个手机号最多领取一次</span>
                </div>
                <div class="indent">
                  <span>(3)一个兑换码最多领取一次</span>
                </div>
                <div class="indent">
                  <span>(4)领取人手机号可以为任何用户手机号</span>
                </div>
                <div class="indent">
                  <span>(5)领取用户若未注册会由平台进行记录，若用户注册则平台发放</span>
                </div>
              </div>
              <p class="mt16">本活动最终解释权归唯一艺术平台所有</p>
            </div>
          </div>
          <div class="content-three">
            <div class="title">唯一艺术平台介绍</div>
            <div class="content">
              <p>唯一艺术是一家数字艺术电商平台，由艺术设计圈资深运营公司和区块链技术团队联袂推出，公司在北京、杭州、深圳和香港等多地设有分公司。</p>
              <p>股东和合规性层面，唯一艺术分别于2021年9月、2022年4月收获1000万元天使轮及数千万元A轮投资，同时获得了多项现有政策下的合规经营资质，是目前国内为数不多的由国有资本参与投资的数字艺术电商平台，拥有行业内相对较全的营业相关资质。</p>
              <p>在品牌影响力层面，2021年8月，唯一艺术发起“全球首届数字艺术创作大赛”，获得了海内外众多艺术家的积极响应，以及业内人士和媒体的一致好评。大赛得到了包括新华社、光明日报、环球网、China Daily在内的多家央媒的关注与报道。目前唯一艺术已成功发售敦煌系列、故宫系列、国家文物局中国文物报、新华社上海证券报、世界大学生运动会、CBA中国篮球协会、上海时装周元宇宙服装等大量知名IP，平台签约艺术家数千名，已形成规模效应及品牌效应。</p>
              <p>在赋能实业层面，2022年3月22日，国家工业设计研究院唯一艺术分院揭牌成立，预示着唯一艺术将携手产业链伙伴，在工业设计领域进行更深入、系统的产学研研究。以数字艺术赋能工业设计，推动中国制造向中国品牌迈进，将数字艺术赋能实业的步伐走稳走远！ </p>
              <p>唯一艺术立足于区块链技术在知识产权领域的应用，精耕数字艺术产业。平台致力于讲述中国故事，传播中国文化，为中国的数字艺术产业做实做强，提供更加坚实的基础设施保障。</p>
            </div>
          </div>
        </div>
      </div>
      <!-- dialog -->
      <div class="dialog"
           v-if="dialogVisible">
        <div class="container">
          <div class="title">提示</div>
          <img src="https://static.theone.art/pc/tomzone/close.png"
               @click="cancel">
          <div class="content">
            {{tips}}
          </div>
          <div class="button">
            <div class="cancel-btn"
                 @click="cancel"
                 v-if="flag">取消</div>
            <div class="submit-btn"
                 @click="submit">确定</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { checkPhoneNumber } from "@/utils/common";
export default {
  data () {
    return {
      dialogVisible: false,
      dataForm: {
        exchangeCode: null,
        phone: null,
      },
      tips: null,
      flag: false,
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user_info;
    },
  },
  methods: {
    beforeSubmit () {
      if (this.userInfo.userUuid) {
        if (this.dataForm.exchangeCode) {
          if (this.dataForm.exchangeCode.length != 18) {
            this.$message({
              message: "当前格式不正确，请输入18位兑换码",
              type: "warning",
            });
            return;
          }
        } else {
          this.$message({
            message: "请输入领取验证码",
            type: "warning",
          });
          return;
        };
        if (this.dataForm.phone && checkPhoneNumber(this.dataForm.phone)) {
          console.log('手机号校验通过~');
        } else {
          this.$message({
            message: "请填写正确的国内手机号",
            type: "warning",
          });
          return;
        };
        this.exchangeActivityCheck();
      } else {
        this.goLogin();
      };
    },
    submit () {
      if (this.flag) {
        this.$api.service.exchangeActivity_exchange(this.dataForm).then(res => {
          if (res.data.code == 200) {
            this.cancel();
            this.dataForm = {
              exchangeCode: null,
              phone: null,
            };
            this.$message.success("兑换成功");
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        this.dialogVisible = false;
      }
    },
    cancel () {
      this.dialogVisible = false;
      this.tips = null;
      this.flag = false;
    },
    // 校验兑换码是否被用过
    exchangeActivityCheck () {
      this.$api.service.exchangeActivity_check(this.dataForm).then(res => {
        if (res.data.code == 200 && res.data.data) {
          this.dialogVisible = true;
          this.flag = true;
          this.tips = "您确定" + this.dataForm.phone + "用户领取礼物吗？"
        } else {
          this.tips = res.data.message;
        };
        this.dialogVisible = true;
      });
    },
    // 6.登录
    goLogin () {
      // this.$router.push("/login");
      const redirect = `${window.location.href}`;
      this.$router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
    },
  }
}
</script>
<style lang="scss" scoped>
@import url("./font.css");
.page-tomzone {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(97, 226, 249, 0.38) 0%,
    #f6feff 100%
  );
  .page-main {
    padding-bottom: 202px;
    @media screen and (min-width: 0px) and (max-width: 540px) {
      padding-bottom: 1.7rem;
    }
    .v1-tomzone-pc {
      display: block;
      @media screen and (min-width: 0px) and (max-width: 540px) {
        display: none;
      }
      .content-bg {
        width: 100%;
        position: relative;
        img {
          width: 100%;
          height: auto;
          image-rendering: -moz-crisp-edges; /* Firefox */
          image-rendering: -o-crisp-edges; /* Opera */
          image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
          image-rendering: crisp-edges;
          -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
        }
        .logo {
          width: 307px;
          height: 34px;
          background: url("https://static.theone.art/pc/tomzone/logo.png")
            no-repeat center center;
          background-size: cover;
          position: absolute;
          top: 100px;
          left: 50%;
          transform: translate(-50%);
        }
        .title1 {
          font-size: 42px;
          font-family: "微软雅黑粗体";
          font-weight: normal;
          color: #ffffff;
          line-height: 48px;
          white-space: nowrap;
          position: absolute;
          top: 223px;
          left: 50%;
          transform: translate(-50%);
        }
        .title2 {
          font-size: 28px;
          font-family: "微软雅黑粗体";
          font-weight: normal;
          color: #ffffff;
          line-height: 32px;
          white-space: nowrap;
          position: absolute;
          top: 290px;
          left: 50%;
          transform: translate(-50%);
        }
      }
      .v1-tomzone-main {
        max-width: 1400px;
        margin: 0 auto;
        .content-four {
          width: 1092px;
          height: 391px;
          background: url("https://static.theone.art/pc/tomzone/four-content.png")
            no-repeat center center;
          background-size: cover;
          margin: 0 auto;
          margin-top: 68px;
          position: relative;
          .title {
            position: absolute;
            top: 54px;
            left: 99px;
            font-size: 24px;
            font-family: "微软雅黑粗体";
            font-weight: bold;
            color: #3653b4;
            line-height: 31px;
          }
          .content {
            position: absolute;
            top: 164px;
            left: 78px;
            right: 78px;
            p {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              margin-bottom: 16px;
            }
          }
        }
        .content-one {
          width: 1092px;
          height: 412px;
          background: url("https://static.theone.art/pc/tomzone/one-content.png")
            no-repeat center center;
          background-size: cover;
          margin: 0 auto;
          position: relative;
          .title {
            position: absolute;
            top: 54px;
            left: 100px;
            font-size: 24px;
            font-family: "微软雅黑粗体";
            font-weight: normal;
            color: #3653b4;
            line-height: 37px;
          }
          .content {
            position: absolute;
            top: 143px;
            left: 78px;
            right: 78px;
            p {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
            }
            p:nth-child(2) {
              margin-top: 16px;
            }
            .indent {
              text-indent: 3em;
              margin-bottom: 0px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
            }
          }
        }
        .content-two {
          width: 1092px;
          height: 549px;
          background: url("https://static.theone.art/pc/tomzone/two-content.png")
            no-repeat center center;
          background-size: cover;
          position: relative;
          margin: 0 auto;
          .title {
            position: absolute;
            top: 62px;
            left: 99px;
            font-size: 24px;
            font-family: "微软雅黑粗体";
            font-weight: normal;
            color: #333333;
            line-height: 27px;
            span {
              color: rgba(54, 83, 180, 1);
              cursor: pointer;
            }
          }
          .content {
            position: absolute;
            top: 169px;
            left: 50%;
            transform: translate(-50%);
            .input-item {
              margin-bottom: 32px;
              h1 {
                font-size: 16px;
                font-family: FZDHTJW--GB1-0, FZDHTJW--GB1;
                font-weight: normal;
                color: #333333;
                line-height: 18px;
                margin-bottom: 12px;
              }
              .input-block {
                width: 400px;
                height: 40px;
                background: #ffffff;
                border-radius: 6px;
                border: 1px solid #d5d5d5;
                backdrop-filter: blur(7px);
                align-items: center;
                display: flex;
                input {
                  flex: 1;
                  line-height: 34px;
                }
                .text {
                  font-size: 12px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #999999;
                  margin-left: 10px;
                }
              }
              p {
                margin-top: 4px;
              }
            }
            .login-btn {
              width: 400px;
              height: 40px;
              background: linear-gradient(180deg, #bf79e5 0%, #719ef7 100%);
              box-shadow: 0px 4px 6px 0px rgba(191, 121, 229, 0.36),
                inset 0px 12px 22px 0px rgba(255, 255, 255, 0.5),
                inset 0px -12px 12px 0px #be7ae5;
              border-radius: 6px;
              text-align: center;
              font-size: 16px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #ffffff;
              line-height: 40px;
              margin-bottom: 10px;
              cursor: pointer;
            }
            .disabled-btn {
              background: #dddddd;
              box-shadow: none;
            }
            .tips-text {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ff4b53;
            }
          }
        }
        .content-three {
          width: 1092px;
          height: 525px;
          background: url("https://static.theone.art/pc/tomzone/three-content.png")
            no-repeat center center;
          background-size: cover;
          position: relative;
          margin: 0 auto;
          .title {
            position: absolute;
            top: 54px;
            left: 99px;
            font-size: 24px;
            font-family: "微软雅黑粗体";
            font-weight: normal;
            color: #3653b4;
            line-height: 37px;
          }
          .content {
            position: absolute;
            top: 164px;
            left: 78px;
            right: 78px;
            p {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              margin-bottom: 16px;
            }
          }
        }
      }
    }
    .v1-tomzone-mobile {
      display: none;
      @media screen and (min-width: 0px) and (max-width: 540px) {
        display: block;
      }
      .content-bg {
        width: 100%;
        position: relative;
        img {
          width: 100%;
          height: 182px;
          image-rendering: -moz-crisp-edges; /* Firefox */
          image-rendering: -o-crisp-edges; /* Opera */
          image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
          image-rendering: crisp-edges;
          -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
        }
        .logo {
          width: 154px;
          height: 17px;
          background: url("https://static.theone.art/pc/tomzone/logo-mobile.png")
            no-repeat center center;
          background-size: cover;
          position: absolute;
          top: 30px;
          left: 50%;
          transform: translate(-50%);
        }
        .title1 {
          font-size: 20px;
          font-family: "微软雅黑粗体";
          font-weight: normal;
          color: #ffffff;
          white-space: nowrap;
          position: absolute;
          top: 62px;
          left: 50%;
          transform: translate(-50%);
        }
        .title2 {
          font-size: 12px;
          font-family: "微软雅黑粗体";
          font-weight: normal;
          color: #ffffff;
          line-height: 14px;
          position: absolute;
          top: 93px;
          left: 50%;
          transform: translate(-50%);
          text-align: center;
          p {
            white-space: nowrap;
          }
        }
      }
      .v1-tomzone-main {
        .content-four {
          width: 100%;
          height: 8rem;
          background: url("https://static.theone.art/pc/tomzone/four-content-mobile.png")
            no-repeat center center;
          background-size: cover;
          position: relative;
          margin: 0 auto;
          margin-top: 15px;
          .title {
            position: absolute;
            top: 0.94rem;
            left: 1.4rem;
            font-size: 16px;
            font-family: "微软雅黑粗体";
            font-weight: normal;
            color: #3653b4;
            line-height: 18px;
          }
          .content {
            position: absolute;
            top: 123px;
            left: 40px;
            right: 40px;
            p {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 17px;
              margin-bottom: 16px;
            }
          }
        }
        .content-one {
          width: 100%;
          // height: 432px;
          height: 8.64rem;
          background: url("https://static.theone.art/pc/tomzone/one-content-mobile.png")
            no-repeat center center;
          background-size: cover;
          margin: 0 auto;
          position: relative;
          .title {
            position: absolute;
            // top: 29px;
            // left: 79px;
            top: 0.88rem;
            left: 1.4rem;
            font-size: 16px;
            font-family: "微软雅黑粗体";
            font-weight: normal;
            color: #3653b4;
          }
          .content {
            position: absolute;
            top: 123px;
            left: 40px;
            right: 40px;
            p {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 17px;
            }
            p:nth-child(2) {
              margin-top: 16px;
            }
            .indent {
              padding-left: 50px;
              text-indent: -14px;

              margin-bottom: 0px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 17px;
            }
          }
        }
        .content-two {
          width: 100%;
          // height: 483px;
          height: 9.66rem;
          background: url("https://static.theone.art/pc/tomzone/two-content-mobile.png")
            no-repeat center center;
          background-size: cover;
          position: relative;
          margin: 0 auto;
          .title {
            position: absolute;
            // top: 31px;
            // left: 79px;
            top: 0.98rem;
            left: 1.4rem;
            font-size: 16px;
            font-family: "微软雅黑粗体";
            font-weight: normal;
            color: #333333;
            line-height: 18px;
            span {
              color: rgba(54, 83, 180, 1);
              cursor: pointer;
            }
          }
          .content {
            position: absolute;
            top: 130px;
            left: 50%;
            transform: translate(-50%);
            .input-item {
              margin-bottom: 35px;
              h1 {
                font-size: 14px;
                font-family: FZDHTJW--GB1-0, FZDHTJW--GB1;
                font-weight: normal;
                color: #333333;
                line-height: 16px;
                margin-bottom: 12px;
              }
              .input-block {
                width: 275px;
                height: 40px;
                background: #ffffff;
                border-radius: 6px;
                border: 1px solid #d5d5d5;
                backdrop-filter: blur(7px);
                align-items: center;
                display: flex;
                input {
                  flex: 1;
                  line-height: 34px;
                }
                .text {
                  font-size: 12px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #999999;
                  margin-left: 10px;
                }
              }
              p {
                margin-top: 4px;
              }
            }
            .login-btn {
              width: 275px;
              height: 40px;
              background: linear-gradient(180deg, #bf79e5 0%, #719ef7 100%);
              box-shadow: 0px 4px 6px 0px rgba(191, 121, 229, 0.36),
                inset 0px 12px 22px 0px rgba(255, 255, 255, 0.5),
                inset 0px -12px 12px 0px #be7ae5;
              border-radius: 6px;
              text-align: center;
              font-size: 16px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #ffffff;
              line-height: 40px;
              margin-bottom: 10px;
              cursor: pointer;
            }
            .disabled-btn {
              background: #dddddd;
              box-shadow: none;
            }
            .tips-text {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ff4b53;
            }
          }
        }
        .content-three {
          width: 100%;
          // height: 596px;
          height: 13.82rem;
          background: url("https://static.theone.art/pc/tomzone/three-content-mobile.png")
            no-repeat center center;
          background-size: cover;
          position: relative;
          margin: 0 auto;
          .title {
            position: absolute;
            top: 0.9rem;
            left: 1.4rem;
            font-size: 16px;
            font-family: "微软雅黑粗体";
            font-weight: normal;
            color: #3653b4;
            line-height: 18px;
          }
          .content {
            position: absolute;
            top: 120px;
            left: 40px;
            right: 40px;
            p {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 17px;
              margin-bottom: 16px;
            }
          }
        }
      }
    }
    .dialog {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 9999;
      .container {
        width: 480px;
        height: 216px;
        background: #ffffff;
        border-radius: 6px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .title {
          position: absolute;
          top: 20px;
          left: 20px;
          font-size: 20px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #2d2f33;
        }
        .content {
          position: absolute;
          top: 78px;
          left: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #45494d;
          line-height: 24px;
        }
        img {
          width: 14px;
          height: 14px;
          position: absolute;
          top: 27px;
          right: 20px;
          cursor: pointer;
        }
        .button {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          line-height: 36px;
          text-align: center;
          .cancel-btn {
            width: 90px;
            height: 36px;
            background: #ffffff;
            border-radius: 6px;
            border: 1px solid #e1e6ed;
            position: absolute;
            right: 126px;
            bottom: 20px;
            color: #3d3e40;
            cursor: pointer;
          }
          .submit-btn {
            width: 90px;
            height: 36px;
            background: linear-gradient(180deg, #bf79e5 0%, #719ef7 100%);
            box-shadow: 0px 4px 6px 0px rgba(191, 121, 229, 0.36),
              inset 0px 12px 22px 0px rgba(255, 255, 255, 0.5),
              inset 0px -12px 12px 0px #be7ae5;
            border-radius: 6px;
            position: absolute;
            right: 20px;
            bottom: 20px;
            color: #ffffff;
            cursor: pointer;
          }
        }
        @media screen and (min-width: 0px) and (max-width: 540px) {
          width: 343px;
        }
      }
    }
    .mt16 {
      margin-top: 16px;
    }
  }
}
</style>