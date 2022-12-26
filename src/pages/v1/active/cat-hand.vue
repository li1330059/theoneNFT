<template>
  <div class="page-body">
    <div class="bg-img">
      <div class="section ui-head">
        <div class="img1">
          <img
            src="//static.theone.art/pc/active/cat-hand/title.png"
          />
        </div>
        <div class="img2">
          <img
            src="//static.theone.art/pc/active/cat-hand/title2.png"
          />
        </div>
      </div>
    </div>

    <div class="box-shadow section bottom1">
      <div class="title">
        《猫先动的手》动画数字藏品盲盒<img
          class="icon"
          src="//static.theone.art/pc/active/cat-hand/title-icon.png"
        />
      </div>
      <div class="txt">
        有一群小猫咪向你扑来！他们中有缅因猫嘤嘤、橘猫大黄、无毛猫毛毛、暹罗猫咔咔和布偶猫小白白。他们有一个秘密：其实他们都是少年变成的！
      </div>
      <div class="txt">
        原创动画《猫先动的手》将携手唯一艺术平台以盲盒形式发售数字藏品，全球限量28000个，每个仅8.8元！
      </div>
      <div class="txt">点击下方报名按钮，即可获得抽签购买资格~</div>
    </div>
    <div class="box-shadow section section2">
      <div class="title">报名抽签购买资格</div>
      <div class="txt" v-if="userInfo.userUuid">
        {{ userInfo.nickname }}，您好
      </div>
      <div class="txt" v-else>
        您还未登录，请去<span @click="goLogin">登录</span>
      </div>
    </div>
    <div class="sign-btn" :class="{ 'sign-btn-disabled': true }">
      本次活动已结束
      <!--    <div class="icon" />
      <span v-if="signStatus">已抽签</span>
      <span v-else>报名</span> -->
    </div>
    <div class="box-shadow section bottom">
      <div class="section-head">
        <div class="left">
          <div class="t1">盲盒内容</div>
          <div class="t2">Blind Box Content</div>
        </div>
        <div class="right"><span class="num">1</span></div>
      </div>
      <div class="flex-wrap">
        <div class="ui-cover">
          <img
            src="//static.theone.art/pc/active/cat-hand/p1.png"
          />
          <div class="des">猫先动的手-白苏头像徽章</div>
        </div>
        <div class="ui-cover">
          <img
            src="//static.theone.art/pc/active/cat-hand/p2.png"
          />
          <div class="des">猫先动的手-浴室白苏徽章</div>
        </div>
        <div class="ui-cover">
          <img
            src="//static.theone.art/pc/active/cat-hand/p3.png"
          />
          <div class="des">猫先动的手-林影头像徽章</div>
        </div>
        <div class="ui-cover">
          <img
            src="//static.theone.art/pc/active/cat-hand/p4.png"
          />
          <div class="des">猫先动的手-浴室林影徽章</div>
        </div>
        <div class="ui-cover">
          <img
            src="//static.theone.art/pc/active/cat-hand/p5.png"
          />
          <div class="des">猫先动的手-乃咔头像徽章</div>
        </div>
        <div class="ui-cover">
          <img
            src="//static.theone.art/pc/active/cat-hand/p6.png"
          />
          <div class="des">猫先动的手-浴室乃咔徽章</div>
        </div>
        <div class="ui-cover">
          <img
            src="//static.theone.art/pc/active/cat-hand/p7.png"
          />
          <div class="des">猫先动的手-毛冰头像徽章</div>
        </div>
        <div class="ui-cover">
          <img
            src="//static.theone.art/pc/active/cat-hand/p8.png"
          />
          <div class="des">猫先动的手-浴室毛冰徽章</div>
        </div>
        <div class="ui-cover">
          <img
            src="//static.theone.art/pc/active/cat-hand/p9.png"
          />
          <div class="des">猫先动的手-黄天头像徽章</div>
        </div>
        <div class="ui-cover">
          <img
            src="//static.theone.art/pc/active/cat-hand/p10.png"
          />
          <div class="des">猫先动的手-浴室黄天徽章</div>
        </div>
      </div>
    </div>
    <div class="box-shadow section bottom">
      <div class="section-head">
        <div class="left">
          <div class="t1">藏品玩法</div>
          <div class="t2">Collection Playrule</div>
        </div>
        <div class="right"><span class="num">2</span></div>
      </div>
      <div class="play-txt" style="display: flex">
        <div>
          玩法一 集齐3张同款人物形象+3张对应Q版形象可以消耗合成该角色单人动态卡
        </div>
      </div>
      <div class="ui-tip-txt">
        <div class="ui-title">单人动态卡</div>
        <div>
          <span>猫先动的手-夜影扶苏</span> <span>猫先动的手-青春剪影</span>
          <span>猫先动的手-咔布奇诺</span> <br /><span
            >猫先动的手-冰山美人</span
          >
          <span>猫先动的手-天下为家</span>
        </div>
      </div>
      <div class="play-wrap">
        <div class="p1">
          <img
            src="//static.theone.art/pc/active/cat-hand/play1-1.png"
          />
        </div>
        <div class="p2">
          <img
            src="//static.theone.art/pc/active/cat-hand/play-icon.png"
          />
        </div>
        <div class="p3">
          <img
            src="//static.theone.art/pc/active/cat-hand/play1-2.png"
          />
        </div>
        <div class="place"></div>
      </div>
    </div>
    <div class="box-shadow section bottom">
      <div class="section-head">
        <div class="left">
          <div class="t1">藏品玩法</div>
          <div class="t2">Collection Playrule</div>
        </div>
        <div class="right"><span class="num">3</span></div>
      </div>
      <div class="play-txt" style="display: flex">
        <div>
          玩法二 集齐2套全部5名角色单人动态卡可以消耗合成全员动图
          <span class="tip-txt">猫先动的手-猫猫贴贴图</span>
        </div>
      </div>
      <div class="play-wrap">
        <div class="p1">
          <img
            src="//static.theone.art/pc/active/cat-hand/play2-1.png"
          />
        </div>
        <div class="p2">
          <img
            src="//static.theone.art/pc/active/cat-hand/play-icon.png"
          />
        </div>
        <div class="p3">
          <img
            src="//static.theone.art/pc/active/cat-hand/play2-2.png"
          />
          <!--   <div class="txt">STIM-1-6</div> -->
        </div>
        <div class="place"></div>
      </div>
    </div>

    <div class="box-shadow section bottom">
      <div class="section-head">
        <div class="left">
          <div class="t1">活动须知</div>
          <div class="t2">Activity Guidelines</div>
        </div>
        <div class="right"><span class="num">4</span></div>
      </div>
      <div class="txt">
        为更好服务唯一艺术平台的各位用户，唯一艺术特此公告数字藏品的二次交易细则。鉴于不同属性的数字艺术的二次交易细则各有不同，请各位用户务必审慎阅读并同意相关规则后进行相应操作，以免造成不必要损失。
      </div>
      <div class="txt">
        1、依据我国法律要求，特定条件下的数字藏品的二次交易不支持任何形式的变相炒作，我们坚决反对数字藏品炒作、场外交易、欺诈，或以任何其他非法、侵权方式使用的违法违规行为，请大家注意甄别上述涉嫌网络欺诈的行为及其相关风险。
      </div>
      <div class="txt">
        2、数字藏品为虚拟数字商品，购买以及寄售前请先完成实名认证。
      </div>
      <div class="txt"><b>3、数字藏品一经售出不支持退换。</b></div>
    </div>

    <div class="box-shadow section">
      <div class="section-head">
        <div class="left">
          <div class="t1">关于唯一艺术</div>
          <div class="t2">About TheOne.Art</div>
        </div>
        <div class="right"><span class="num">5</span></div>
      </div>
      <div class="txt">
        唯一艺术是中国一家数字艺术电商，由艺术设计圈知名公司和区块链技术团队联袂推出，公司在北京、杭州、深圳和香港等多地设有分公司，致力于打造中国较大的数字艺术品交易市场。
      </div>

      <div class="txt">
        在股东和合规性上，2021年9月唯一艺术平台收获国有资本的投资，同时获得了多项现有政策下的合规经营资质。从经营资质、合规性、用户规模、作品数量上公司已成为国内数字艺术平台中的领军企业。
      </div>

      <div class="txt">
        平台于2021年8月发起的“全球首届数字艺术创作大赛”，获得了众多海内外艺术家的积极响应，获得了业内人士和媒体的一致好评。大赛也得到了包括新华社、光明日报、环球网、China
        Daily在内的多家央媒的关注与报道。
      </div>

      <div class="txt">
        唯一艺术平台立足于区块链技术在知识产权领域的应用，立足于数字艺术产业的发展。平台致力于为传播中国文化、增强中国文化影响力，为中国的数字艺术产业做实做强，提供更加坚实的基础设施保障。
      </div>
    </div>
    <div class="ui-footer">
      <div class="code-wrap">
        <img
          src="//static.theone.art/pc/active/cat-hand/img-code.png"
        />
      </div>
      <div class="txt">更多购买细则可以关注 <br />官方公众号“唯一艺术平台”</div>
    </div>
  </div>
</template>
<script>
const KEY = "4Sbk57o6VLmXgnGqJzy8q20e3HD8zttAatre1Z7JlJwZa7h0UGd1ixemS8c1RBXV";
export default {
  components: {},
  data() {
    return {
      signStatus: false,
    };
  },
  mounted() {
    this.getUserSignStatus();
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    goLogin() {
      this.$router.push("/login");
    },
    async getUserSignStatus() {
      if (this.userInfo.userUuid) {
        const res = await this.$api.service.activity_getResult({ actKey: KEY });
        if (res.data.code == 200 && res.data.data) {
          this.signStatus = res.data.data;
        } else {
        }
      }
    },
    async onSign() {
      if (this.signStatus) {
        this.$message.warning("您已报名！");
        return;
      }
      const res = await this.$api.service.activity_signUp({ actKey: KEY });
      if (res.data.code == 200 && res.data.data) {
        this.getUserSignStatus();
        this.$message.success("报名成功");
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.ui-tip-txt {
  display: flex;
  font-size: 21px;
  color: rgba(151, 97, 36, 0.88);
  span {
    display: inline-block;
    padding: 0 10px;
  }
  .ui-title {
    min-width: 110px;
  }
}
.ui-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 58px;
  img {
    width: 120px;
    display: block;
  }
  .txt {
    font-size: 18px;
    font-weight: 400;
    color: #000000;
    line-height: 36px;
    padding-left: 30px;
  }
}
.play-txt {
  font-size: 20px;
  color: rgba(0, 0, 0, 0.88);
  margin: -40px 0 10px;
  .tip-txt {
    color: rgba(151, 97, 36, 0.88);
  }
}
.play-wrap {
  display: flex;
  align-items: center;
  .txt {
    text-align: center;
    color: rgba(34, 22, 6, 0.88);
    padding-top: 10px;
  }
  img {
    display: block;
    max-width: 100%;
  }
  .place {
    width: 20%;
  }
  .p2 {
    max-width: 100px;
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    display: block;
    .p2 {
      margin: 0.4rem auto;
      transform: rotate(90deg);
    }
  }
}
.a {
  color: royalblue;
}
.bg-img {
  background-repeat: no-repeat;
  background-position: center right;
  background-size: contain;
  background-image: url("//static.theone.art/pc/active/cat-hand/bg.png");
  margin: 0 auto;
  @media screen and (min-width: 0px) and (max-width: 540px) {
    background-image: inherit;
  }
}
.wrap-3 {
  display: flex;
  justify-content: flex-end;
  margin-top: 33px;
  > div {
    color: rgba(34, 22, 6, 0.88);
    font-size: 20px;
    width: 46%;
    text-align: center;
    img {
      display: block;
      width: 100%;
      margin-bottom: 14px;
    }
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    display: block;
    > div {
      width: 90%;
      margin: 0 auto;
    }
  }
}
.wrap-2 {
  display: flex;
  align-items: flex-end;
  .txt {
    flex: 2;
  }
  .img {
    flex: 3;
    img {
      display: block;
      width: 90%;
      margin: 0 auto;
    }
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    display: block;
  }
}
.ui-cover {
  width: 20%;
  margin-bottom: 20px;
  padding: 0 13px;
  img {
    display: block;
    width: 100%;
  }
  .des {
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    text-align: center;
    margin-top: 14px;
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    width: 50%;
  }
}
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -13px;
}
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 55px;
  .t1 {
    font-size: 26px;
    font-weight: normal;
    color: #221606;
  }
  .t2 {
    font-size: 20px;
    font-weight: normal;
    color: #221606;
  }
}
.num {
  font-size: 90px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.07);
}
.sign-btn {
  width: 600px;
  line-height: 60px;
  text-align: center;
  background: linear-gradient(232deg, #252019, #3b3123);
  box-shadow: 0px 0px 21px 3px rgba(0, 0, 0, 0.03);
  border-radius: 40px;
  margin: 30px auto 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: normal;
  color: rgba(236, 190, 133, 1);
  user-select: none;
  cursor: pointer;
  .icon {
    display: flex;
    width: 22px;
    height: 22px;
    background-image: url("//static.theone.art/pc/active/cat-hand/icon-sign.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    margin-right: 6px;
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    width: 90%;
    margin: 0.3rem auto 1.6rem;
  }
}
.sign-btn-disabled {
  background: rgba(97, 97, 97, 0.4);
}
.page-body {
  background: rgba(239, 202, 115, 1);
  padding-bottom: 100px;
}
.ui-head {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 140px 0 200px;
  img {
    display: block;
    width: 100%;
  }
  .img1 {
    max-width: 455px;
    width: 60%;
  }
  .img2 {
    width: 30%;
    max-width: 455px;
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    padding: 1rem 0 1.6rem;
    display: block;
    .img1 {
      max-width: inherit;
      width: 86%;
      margin: 0 auto 1rem;
    }
    .img2 {
      width: 70%;
      margin: 0.4rem auto;
    }
  }
}

.box-shadow {
  background: linear-gradient(232deg, #e9b060, #eec670);
  box-shadow: 0px 0px 21px 3px rgba(0, 0, 0, 0.03);
  border-radius: 5px;
  padding: 57px 54px 88px;
  .title {
    font-size: 26px;
    font-weight: normal;
    color: #221606;
    display: flex;
    align-items: center;
    margin-bottom: 43px;
    .icon {
      width: 67px;
      margin-left: 20px;
    }
  }
  .txt {
    font-size: 16px;
    font-weight: normal;
    color: rgba(34, 22, 6, 0.88);
    margin-bottom: 30px;
    line-height: 25px;
  }
}
.section {
  max-width: 1066px;
  margin: 0 auto;
}
.bottom1 {
  margin-bottom: 30px;
}
.section2 {
  padding-bottom: 37px;
}
.bottom {
  margin-bottom: 200px;
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .box-shadow {
    padding: 0.5rem 0.3rem 0.8rem;
    margin-right: 0.3rem;
    margin-left: 0.3rem;
  }
}
</style>
