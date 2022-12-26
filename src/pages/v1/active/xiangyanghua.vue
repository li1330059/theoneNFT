<template>
  <div class="page-body">
    <div class="bg-img">
      <div class="section ui-head">
        <div class="img1">
          <img src="//static.theone.art/pc/active/xiangyanghua/title1.png" />
        </div>
        <div class="img2">
          <img src="//static.theone.art/pc/active/xiangyanghua/title2.png" />
        </div>
      </div>
    </div>

    <div class="box-shadow section bottom1">
      <div class="title">
        越窑青瓷-百朵向阳花开数字藏品<img class="icon"
             src="//static.theone.art/pc/active/xiangyanghua/title-icon.png" />
      </div>
      <div class="txt">
        越窑是中国古代最著名的青瓷窑系。东汉时，中国最早的瓷器在越窑的龙窑里烧制成功，因此，越窑青瓷被称为“母亲瓷”。越窑持续烧制了1000多年，于北宋末、南宋初停烧，是中国持续时间最长、影响范围最广的窑系。
      </div>
      <div class="txt">
        百朵向阳花开是嵇锡贵老师结合新时代精神与传统工艺的最新力作，多次在各类展览中展出，广受好评。
      </div>
      <div class="txt">
        本次数字藏品由杭州文化产权交易所提供，是杭州文交所对科技赋能非遗文化领域的新尝试，旨在通过数字形式、多角度、新方式传承越窑文化的历史记忆和民族情怀，乘着国家科技应用大发展的浪潮，传播非遗文化和中华优秀传统文化。
      </div>
    </div>
    <div class="box-shadow section section2">
      <div class="title">报名抽签购买资格</div>
      <div class="txt"
           v-if="userInfo.userUuid">
        {{ userInfo.nickname }}，您好
      </div>
      <div class="txt"
           v-else>
        您还未登录，请去<span @click="goLogin">登录</span>
      </div>
    </div>
    <div class="sign-btn"
         :class="{ 'sign-btn-disabled': signStatus }"
         @click="onSign">
      <!-- 本次活动已结束 -->
      <div class="icon" />
      <span v-if="signStatus">已抽签</span>
      <span v-else>报名</span>
    </div>
    <div class="box-shadow section bottom">
      <div class="section-head">
        <div class="left">
          <div class="t1">藏品内容</div>
          <div class="t2">Collection Content</div>
        </div>
        <div class="right"><span class="num">1</span></div>
      </div>
      <div class="flex-wrap">
        <div class="ui-cover">
          <img src="//static.theone.art/pc/active/xiangyanghua/p1.png" />
          <div class="des">越窑青瓷-百朵向阳花开</div>
        </div>
      </div>
    </div>
    <div class="box-shadow section bottom">
      <div class="section-head">
        <div class="left">
          <div class="t1">活动须知</div>
          <div class="t2">Activity Guidelines</div>
        </div>
        <div class="right"><span class="num">2</span></div>
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
      <div class="txt">
        <b>3、未满18周岁用户禁止参与。</b>
      </div>
      <div class="txt"><b>4、数字藏品一经售出不支持退换。</b></div>
    </div>

    <div class="box-shadow section">
      <div class="section-head">
        <div class="left">
          <div class="t1">关于唯一艺术</div>
          <div class="t2">About TheOne.Art</div>
        </div>
        <div class="right"><span class="num">3</span></div>
      </div>
      <div class="txt">
        唯一艺术是一家数字艺术电商平台，由艺术设计圈资深运营公司和区块链技术团队联袂推出，公司在北京、杭州、深圳和香港等多地设有分公司。
      </div>

      <div class="txt">
        在股东和合规性层面，唯一艺术2021年9月收获国有资本的投资，同时获得了多项现有政策下的合规经营资质，是目前国内为数不多的由国有资本投资的数字艺术电商平台，拥有行业内相对较全的营业相关资质。
      </div>

      <div class="txt">
        在品牌影响力层面，2021年8月，唯一艺术发起“全球首届数字艺术创作大赛”，获得了海内外众多艺术家的积极响应，以及业内人士和媒体的一致好评。大赛得到了包括新华社、光明日报、环球网、China Daily在内的多家央媒的关注与报道。目前唯一艺术已成功发售敦煌系列、故宫系列、国家文物局、新华社上海证券报、世界大学生运动会、CBA中国篮球协会、上海时装周元宇宙服装等大量知名IP，平台签约艺术家数千名，已形成规模效应及品牌效应。
      </div>

      <div class="txt">
        在赋能实业层面，2022年3月22日，国家工业设计研究院唯一艺术分院揭牌成立，预示着唯一艺术将携手产业链伙伴，在工业设计领域进行更深入、系统的产学研研究。以数字艺术赋能工业设计，推动中国制造向中国品牌迈进，将数字艺术赋能实业的步伐走稳走远！
      </div>

      <div class="txt">
        唯一艺术立足于区块链技术在知识产权领域的应用，精耕数字艺术产业。平台致力于讲述中国故事，传播中国文化，为中国的数字艺术产业做实做强，提供更加坚实的基础设施保障。
      </div>
    </div>
  </div>
</template>
<script>
const KEY = "ZC77NKcIAGYLNoV4lvloRS8T5zdQkVzmaY0arj7w9VOq2Gc2VaTnd2RayMGBtxcS"
export default {
  components: {},
  data () {
    return {
      signStatus: false,
    };
  },
  mounted () {
    this.getUserSignStatus();
  },
  computed: {
    userInfo () {
      return this.$store.state.user_info;
    },
  },
  watch: {
    userInfo () {
      this.getUserSignStatus();
    },
  },
  methods: {
    goLogin () {
      this.$router.push("/login");
    },
    async getUserSignStatus () {
      console.log(this.userInfo);
      if (this.userInfo.userUuid) {
        const res = await this.$api.service.activity_getResult({ actKey: KEY });
        if (res.data.code == 200 && res.data.data) {
          this.signStatus = res.data.data;
        } else {
        }
      }
    },
    async onSign () {
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
.play-txt {
  font-size: 20px;
  color: rgba(0, 0, 0, 0.88);
  margin: -40px 0 10px;
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
  width: 50%;
  margin: 0 auto;
  margin-bottom: 20px;
  padding: 0 13px;
  img {
    display: block;
    width: 100%;
  }
  .des {
    font-size: 23px;
    font-weight: 400;
    color: #000000;
    text-align: center;
    margin-top: 14px;
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    width: 60%;
    .des {
      font-size: 16px;
    }
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
  background: linear-gradient(232deg, #0071e3, #1684f3);
  box-shadow: 0px 0px 21px 3px rgba(0, 0, 0, 0.03);
  border-radius: 40px;
  margin: 30px auto 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: normal;
  color: #ffffff;
  user-select: none;
  cursor: pointer;
  .icon {
    display: flex;
    width: 22px;
    height: 22px;
    background-image: url("//static.theone.art/pc/active/icon-sign.png");
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
  background-image: url("//static.theone.art/pc/active/xiangyanghua/bg.png");
  background-size: cover;
  padding-bottom: 100px;
}
.ui-head {
  display: flex;
  justify-content: space-around;
  padding: 100px 0 200px;
  img {
    display: block;
    width: 100%;
  }
  .img1 {
    max-width: 490px;
    width: 30%;
    margin-top: 20px;
  }
  .img2 {
    width: 60%;
    max-width: 260px;
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
  background: linear-gradient(232deg, #f7f7f7, #e5e4e4);
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
      width: 53px;
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
    padding: 0.5rem 0.6rem 0.8rem;
  }
}
</style>
