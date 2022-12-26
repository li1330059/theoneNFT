<template>
  <div class="page-body">
    <div class="bg-img">
      <div class="ui-head">
        <div class="img1">
          <img
            src="//static.theone.art/pc/active/digital-rongbao/title.png"
          />
        </div>
      </div>
    </div>

    <div class="box-shadow section bottom1">
      <div class="title">
        大运数字蓉宝运动数字藏品<img
          class="icon"
          src="//static.theone.art/pc/active/digital-rongbao/title-icon.png"
        />
      </div>
      <div class="txt">
        成都第31届世界大学生夏季运动会，是继2001年北京大运会、2011年深圳大运会后，中国大陆第三次举办世界大学生夏季运动会，也是中国西部第一次举办世界性综合运动会。共设篮球、排球、田径、游泳等18个体育项目。
      </div>
      <div class="txt">
        成都大运会吉祥物“蓉宝”原型熊猫“芝麻”，具有“运动天赋高、调皮、能吃”的特点，是一只昂扬向上、性格鲜明、火辣有爱的熊猫，充分反映了成都人热情似火和大学生青春活力的风貌。
      </div>
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
    <div
      class="sign-btn"
      :class="{ 'sign-btn-disabled': signStatus }"
      @click="onSign"
    >
      <!-- 本次活动已结束 -->
      <div class="icon" />
      <span v-if="signStatus">已抽签</span>
      <span v-else>报名</span>
    </div>
    <div class="box-shadow section bottom">
      <div class="section-head">
        <div class="left">
          <div class="t1">盲盒内容</div>
          <div class="t2">Blind Box Content</div>
          <div class="t3">以盲盒形式发售<b>18款数字藏品</b></div>
        </div>
        <div class="right"><span class="num">1</span></div>
      </div>
      <div class="flex-wrap">
        <div class="ui-cover-item">
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p1.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（体操）</div>
          </div>
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p2.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（游泳）</div>
          </div>
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p3.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（羽毛球）</div>
          </div>
        </div>
        <div class="ui-cover-item">
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p4.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（田径）</div>
          </div>
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p5.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（击剑）</div>
          </div>
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p6.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（乒乓球）</div>
          </div>
        </div>
        <div class="ui-cover-item">
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p7.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（篮球）</div>
          </div>
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p8.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（排球）</div>
          </div>
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p9.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（柔道）</div>
          </div>
        </div>
        <div class="ui-cover-item">
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p10.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（赛艇）</div>
          </div>
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p11.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（射击运动）</div>
          </div>
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p12.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（射箭）</div>
          </div>
        </div>
        <div class="ui-cover-item">
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p13.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（水球）</div>
          </div>
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p14.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（跆拳道）</div>
          </div>
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p15.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（跳水）</div>
          </div>
        </div>
        <div class="ui-cover-item">
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p16.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（网球）</div>
          </div>
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p17.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（武术）</div>
          </div>
          <div class="ui-cover">
            <div class="ui-cover-img">
              <img
                src="//static.theone.art/pc/active/digital-rongbao/p18.png"
              />
              <img
                src="//static.theone.art/pc/active/digital-rongbao/ui-cover-icon.png"
              />
            </div>
            <div class="des">大运数字蓉宝（艺术体操）</div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-shadow section bottom">
      <div class="section-head">
        <div class="left">
          <div class="t1">藏品玩法</div>
          <div class="t2">Collection Playrule</div>
          <div class="t3">
            集齐<b>18张不同发售图+4张大运数字会徽</b>可消耗合成<b
              >《大运赛事》</b
            >
          </div>
        </div>
        <div class="right"><span class="num">2</span></div>
      </div>
      <div class="play-wrap">
        <div class="p1">
          <img
            src="//static.theone.art/pc/active/digital-rongbao/play1-1.png"
          />
        </div>
        <div class="p2">
          <img
            src="//static.theone.art/pc/active/digital-rongbao/play-icon.png"
          />
        </div>
        <div class="p3">
          <img
            src="//static.theone.art/pc/active/digital-rongbao/play1-2.png"
          />
          <div class="txt">《大运赛事》</div>
        </div>
      </div>
    </div>
    <div class="box-shadow section bottom">
      <div class="section-head">
        <div class="left">
          <div class="t1">活动须知</div>
          <div class="t2">Activity Guidelines</div>
        </div>
        <div class="right"><span class="num">3</span></div>
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
        <div class="right"><span class="num">4</span></div>
      </div>
      <div class="txt">
        唯一艺术是一家数字艺术电商平台，由艺术设计圈资深运营公司和区块链技术团队联袂推出，公司在北京、杭州、深圳和香港等多地设有分公司。
      </div>

      <div class="txt">
        在股东和合规性层面，唯一艺术2021年9月收获国有资本的投资，同时获得了多项现有政策下的合规经营资质，是目前国内为数不多的由国有资本投资的数字艺术电商平台，拥有行业内相对较全的营业相关资质。
      </div>

      <div class="txt">
        在品牌影响力层面，2021年8月，唯一艺术发起“全球首届数字艺术创作大赛”，获得了海内外众多艺术家的积极响应，以及业内人士和媒体的一致好评。大赛得到了包括新华社、光明日报、环球网、China
        Daily在内的多家央媒的关注与报道。目前唯一艺术已成功发售敦煌系列、故宫系列、国家文物局、新华社上海证券报、世界大学生运动会、CBA中国篮球协会、上海时装周元宇宙服装等大量知名IP，平台签约艺术家数千名，已形成规模效应及品牌效应。
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
const KEY = "5wYRulcb2A65NLFd9Zsz64iRGG1Uv07YiLVfME1CsF10bK9x0Cc7ohWcnvnwBWw3";
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
  watch: {
    userInfo() {
      this.getUserSignStatus();
    },
  },
  methods: {
    goLogin() {
      this.$router.push("/login");
    },
    async getUserSignStatus() {
      console.log(this.userInfo);
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
      this.$common.initGeetest(this.sign);
    },
    async sign() {
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
  justify-content: space-between;
  align-items: center;
  .txt {
    text-align: center;
    color: rgba(34, 22, 6, 0.88);
    padding-top: 10px;
  }
  img {
    display: block;
    max-width: 100%;
    margin: auto;
  }
  .p2 {
    max-width: 48px;
  }
  .p3 {
    position: relative;
    img {
      display: block;
    }
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    display: block;
    .p2 {
      margin: 0.4rem auto;
      transform: rotate(90deg);
    }
    .p3 {
      margin: 0 auto;
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
  max-width: 1440px;
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
.ui-cover-item {
  width: 50%;
  display: flex;
  .ui-cover {
    width: 30%;
    margin-bottom: 20px;
    padding: 0 13px;
    .ui-cover-img {
      position: relative;
      img:nth-child(1) {
        display: block;
        width: 100%;
        height: 115px;
        border-radius: 10px;
      }
      img:nth-child(2) {
        display: block;
        max-width: 43px;
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
    .des {
      font-size: 10px;
      font-weight: 400;
      color: #000000;
      text-align: center;
      margin-top: 14px;
      white-space: nowrap;
    }
    @media screen and (min-width: 0px) and (max-width: 540px) {
      width: 50%;
      .ui-cover-img {
        img:nth-child(1) {
          height: auto;
        }
      }
      .des {
        white-space: normal;
      }
    }
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    width: 100%;
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
  .t3 {
    font-size: 20px;
    font-weight: normal;
    color: #000000;
    margin-top: 10px;
    @media screen and (min-width: 0px) and (max-width: 540px) {
      font-size: 18px;
    }
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
  background: rgba(255, 191, 77, 1);
  box-shadow: 0px 0px 21px 3px rgba(0, 0, 0, 0.03);
  border-radius: 40px;
  margin: 30px auto 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: normal;
  color: rgba(0, 0, 0, 1);
  user-select: none;
  cursor: pointer;
  .icon {
    display: flex;
    width: 22px;
    height: 22px;
    background-image: url("//static.theone.art/pc/active/digital-rongbao/icon-sign.png");
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
  background: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.7);
  .icon {
    background-image: url("//static.theone.art/pc/active/digital-rongbao/icon-sign-white.png");
    opacity: 0.7;
  }
}
.page-body {
  background: #0054a7;
  background-size: cover;
  padding-bottom: 100px;
}
.ui-head {
  img {
    display: block;
    width: 100%;
  }
  .img1 {
    margin: 0 auto;
    width: 100%;
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    padding: 0;
    .img1 {
      max-width: inherit;
      width: 100%;
      margin: 0 auto 1rem;
    }
  }
}

.box-shadow {
  background: linear-gradient(232deg, #f5f4f4, #e3e1e1);
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
      width: 93px;
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
