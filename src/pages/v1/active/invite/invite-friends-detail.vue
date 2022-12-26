<template>
  <div class="ui-body">
    <img
      class="logo"
      src="//static.theone.art/pc/invite/body-logo.png"
    />
    <div class="ui-title">
      唯一艺术五月品牌月启航<br />
      邀请好友赢取超级福利！
    </div>
    <div class="ui-active-des">
      <section>
        <div style="font-size: 18px">唯一艺术平台邀新活动时间——</div>
        <div>
          2022年4月17日开启，具体结束时间以官方后续公告为准。<br />
          活动期间内，可在唯一艺术官网（www.theone.art）首页参与活动。
        </div>
      </section>
      <section>
        <div class="ui-rule-title">老用户活动细则</div>

        <div>
          1.活动期间内，老用户通过活动链接，每邀请20个有效新用户，老用户即可获得后期指定IP的1个【优先购买凭证】。
          *有效新用户：在唯一艺术官网（www.theone.art）完成实名认证+银行卡认证，且新用户至少有一次购买完成记录，且新用户账户中至少有2个数字藏品（若原本的有效新用户账户中，数字藏品数量变为2个以下，则有效新用户数减1）。
        </div>
        <div>
          2.活动期间内，指定IP公布优先购买时，平台将对参与邀新的老用户及新用户进行名单快照，此时平台将根据有效的邀新人数对老用户的账户中主动空投【优先购买凭证】。<br />
          （1）*快照时，【优先购买凭证】有效的邀新人数向下取整，如：有效的邀新人数不足20个无法获得优先购买凭证，有效的邀新人数30个可获得1个优先购买凭证，有效的邀新人数50个可获得2个优先购买凭证，以此类推。<br />
          （2）快照时，新用户账户中至少有2个数字藏品，才能成为老用户的有效新用户数量记录。
        </div>
        <div>
          3.每消耗1个【优先购买凭证】，下一个指定IP发售时的快照将减去【优先购买凭证】*20的有效邀新人数。
          *如：本次IP发售时，有效的邀新人数30个，获得1个【优先购买凭证】，下个IP发售时的快照将减去20个有效邀新人数。
        </div>
        <div>
          4.获得【优先购买凭证】的用户，可在发售的数字藏品优先购买时，在唯一艺术官网（www.theone.art）进行购买，一个【优先购买凭证】只能购买一个数字藏品盲盒。具体的优先购买时间可关注后续的发售推文。
        </div>
        <div>
          5.每轮快照后，逾期未消耗【优先购买凭证】则视为主动弃权，下个IP发售时的快照仍将减去优先购买凭证数量*20的有效邀新人数。
        </div>
      </section>
      <section>
        <div class="ui-rule-title">新用户活动细则</div>
        <div>
          通过老用户的活动链接被邀请的新用户，在完成实名认证+银行卡认证之后，可获赠1
          个“小食客”系列数字艺术衍生品盲盒。
        </div>
        <div>
          *“小食客”系列数字艺术衍生品盲盒将在新用户完成实名认证+银行卡认证后的72小时内发放至唯一艺术（www.theone.art）的个人账户中，空投后将开放赠与及寄售。
        </div>
      </section>
      <section>
        <div class="ui-rule-title">邀新排行榜</div>
        <div>
          我们将从4月17日起，统计老用户的邀新数量，并进行排名，排名靠前的用户，将有资格获得包括天蓬/吴刚/月桂树等嫦娥元宇宙数字藏品在内的多项重磅福利。
        </div>
      </section>
      <section>
        <div class="ui-rule-title">其他说明</div>
        <div>
          1.若通过不正当手段获取奖励，经查实，平台有权撤销该用户的活动资格并取消其奖励，情节严重将追究其法律责任。
        </div>
        <div>2.本次活动最终解释权归唯一艺术平台所有。</div>
      </section>
    </div>
    <div class="m-login-info">
      <div class="user-name" v-if="userInfo.userUuid">
        {{
          userInfo.nickname && userInfo.nickname.length > 11
            ? `${userInfo.nickname.slice(0, 11)}...`
            : userInfo.nickname
        }}您好
      </div>
      <div v-else class="down-btn" @click="goLogin">登录获取详情</div>
    </div>
<!--     <img :src="posterImg" class="preview-poster-wrap responsive-img" />
    <div class="center-wrap">
      <div @click="downLoad" class="down-btn" v-if="userInfo.userUuid">
        下载海报
      </div>
    </div> -->
    <div class="m-content-wrap">
      <div class="m-invite-user-wrap">
        <div class="invite-btn-wrap">
          <div class="m-block-title">
            <span class="icon icon-people"></span>当前邀请有效新用户人数<span
              class="num"
              >{{ inviteInfo.effectiveNum ? inviteInfo.effectiveNum : 0 }}</span
            >人
          </div>
          <div class="invite-btn" @click="onGetUserInviteList">邀请记录</div>
        </div>

        <div class="level-wrap">
          <div class="level-block">
            <div class="content">
              <div class="num">5人</div>
              <div class="des">1 个“新春-追梦人”系列数字艺术衍生品盲盒</div>
            </div>
          </div>
          <div class="level-block">
            <div class="content">
              <div class="num">10人</div>
              <div class="des">2 个“新春-追梦人”系列数字艺术衍生品盲盒</div>
            </div>
          </div>
          <div class="level-block">
            <div class="content">
              <div class="num">20人</div>
              <div class="des">5 个“新春-追梦人”系列数字艺术衍生品盲盒</div>
            </div>
          </div>
        </div>
        <div class="progress">
          <div
            class="bar"
            :style="`width: ${((inviteInfo.effectiveNum || 0) / 20) * 100}%`"
          ></div>
        </div>
        <div class="line-des">
          <span style="width: 25%">5人</span>
          <span style="width: 25%">10人</span>
          <span style="width: 50%">20人</span>
        </div>
      </div>
      <div class="m-block-title m-rank-title">
        <div class="left">
          <span class="icon icon-ranking"></span
          >{{ $common.formatDate(rankTime,"MM月dd日") }} 排行榜 
        </div>
        <div class="tip-warning">每日08:00:00更新昨日榜单</div>
      </div>
      <div class="block-wrap">
        <div class="rank-title">
          <div class="txt" v-if="inviteInfo.rankingNum">
            您当前排名{{
              inviteInfo.rankingNum > 100 ? "100+" : inviteInfo.rankingNum
            }}
          </div>
          <div class="txt" v-else>您当前排名100+</div>
          <img
            src="//static.theone.art/pc/active/invite/rank-title.png"
          />
        </div>
        <div class="m-ranking-list">
          <div class="tr">
            <div class="bar">
              <div class="th count">名次</div>
            </div>
            <div class="bar">
              <div class="th id">ID</div>
            </div>
            <div class="bar new-people">
              <div class="th">有效邀新人数</div>
            </div>
          </div>
          <div class="content-bar-box">
            <div class="tr" v-for="(item, idx) in rankingList" :key="idx">
              <div class="bar">
                <div class="td count">{{ idx + 1 }}</div>
              </div>
              <div class="bar id">
                <div class="td hidden-1">{{ item.nickname }}</div>
              </div>
              <div class="bar new-people">
                <div class="td">{{ item.inviteCountEffective }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--       <div class="m-block-title">
        <span class="icon icon-warning"></span>活动须知
      </div>
      <div class="block-wrap">
        <div class="active-instructions">
          <div>
            为更好服务唯一艺术平台的各位用户，唯一艺术特此公告数字藏品的二次交易细则。鉴于不同属性的数字艺术的二次交易细则各有不同，请各位用户务必审慎阅读并同意相关规则后进行相应操作，以免造成不必要损失。
          </div>
          <div>
            1、依据我国法律要求，特定条件下的数字藏品的二次交易不支持任何形式的变相炒作，我们坚决反对数字藏品炒作、场外交易、欺诈，或以任何其他非法、侵权方式使用的违法违规行为，请大家注意甄别上述涉嫌网络欺诈的行为及其相关风险。
          </div>
          <div>2、数字藏品为虚拟数字商品，购买以及寄售前请先完成实名认证。</div>
          <div>3、本商品一经售出不支持退换。</div>
        </div>
      </div> -->
    <el-dialog
      class="invite-dialog"
      :visible.sync="showInviteList"
      append-to-body
      width="1200px"
    >
      <div slot="title" class="invite-title">
        我的邀请<small>邀请总用户{{ inviteInfo.inviteAllNum }}人</small>
      </div>
      <div
        style="overflow-y: auto"
        class="content"
        v-if="userInviteList && userInviteList.length > 0"
      >
        <div class="table">
          <div class="head">
            <div class="tr">
              <div class="th name">
                <span class="phone-hide">用户</span>昵称
              </div>
              <div class="th phone">手机号</div>
              <div class="th isname1">
                <span class="phone-hide">用户是否</span>实名认证
              </div>
              <div class="th isname2">
                <span class="phone-hide">用户是否</span>绑卡
              </div>
              <div class="th isname1">
                <span class="phone-hide">用户</span>是否购买
              </div>
              <div class="th isname goods">
                <span class="phone-hide">用户是否</span>拥有两件藏品
              </div>
            </div>
          </div>

          <div class="body infinite-list" v-infinite-scroll="load">
            <div class="tr" v-for="(item, idx) in userInviteList" :key="idx">
              <div class="td hidden-1 name">{{ idx }}{{ item.nickname }}</div>
              <div class="td phone">{{ item.phone }}</div>
              <div class="td isname1">
                {{ item.statusVerified == 1 ? "是" : "否" }}
              </div>
              <div class="td isname2">
                {{ item.statusBankVerified == 1 ? "是" : "否" }}
              </div>
              <div class="td isname1">
                {{ item.buyOrderFlag == 1 ? "是" : "否" }}
              </div>
              <div class="td isname goods">
                {{ item.goodFlag == 1 ? "是" : "否" }}
              </div>
            </div>
          </div>
        </div>
        <!--       <div class="page">
          <el-pagination
            :hide-on-single-page="true"
            @size-change="handleCurrentChange"
            @current-change="handleCurrentChange"
            :current-page="inviteListParams.pageCount"
            :page-size="userInviteList.size"
            layout="prev, pager, next, jumper"
            :total="userInviteList.total"
          >
          </el-pagination>
        </div> -->
      </div>
      <div v-else class="des-txt">这里什么都没有</div>
    </el-dialog>
<!--     <div class="create-img-wrap" v-if="show">
      <canvas id="qrcode-canvas" class="qrcode-canvas" />
      <canvas id="poster-canvas" class="poster-canvas" />
      <img ref="qrcodeBg" src="~@/assets/img/qrcode-bg.png" class="qrcode-bg" />
    </div> -->
  </div>
</template>
<script>
import QRCode from "qrcode";
export default {
  data() {
    return {
      show: true,
      qrcodeUrl: "",
      createCodeUrl: "",
      posterImg: "",
      rankingList: [],
      rankTime: "",
      inviteInfo: {},
      showInviteList: false,
      userInviteList: [],
      isLoad: true,
      inviteListParams: {
        pageCount: 1,
        pageSize: 16,
        type: 0,
      },
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    load() {
      if (this.isLoad) {
        this.inviteListParams.pageCount++;
        this.userInviteInviteList();
        console.log("load");
      }
    },
    init() {
      if (this.userInfo.userUuid) {
        const invitation_code = this.userInfo.inviteCode;
        if (invitation_code) {
          const url = `${window.origin}/invite_user_registration/${invitation_code}`;
/*           this.createQrcode(url);
          this.createShareImage(this.qrcodeUrl); */
        } else {
          this.$message.warning("未获取到邀请码");
        }
        this.getUserInviteNum();
      }
      this.getRankingList();
    },
    async handleCurrentChange(val) {
      this.inviteListParams.pageCount = val;
      this.userInviteInviteList();
    },
    onGetUserInviteList() {
      if (this.userInfo.userUuid) {
        this.showInviteList = true;
        this.inviteListParams.pageCount = 1;
        this.userInviteList = [];
        this.userInviteInviteList();
      } else {
        this.goLogin();
      }
    },
    goLogin() {
      window.location.href = `/login?redirect=${encodeURIComponent(
        window.location.href
      )}`;
    },
    async userInviteInviteList() {
      let res = await this.$api.$service.userInvite_inviteList(
        this.inviteListParams
      );
      if (res.code == 200) {
        if (res.data.records.length > 0) {
          this.userInviteList = [...this.userInviteList, ...res.data.records];
          if (res.data.records.length < this.inviteListParams.pageSize) {
            this.isLoad = false;
          } else {
            this.isLoad = true;
          }
        } else {
          this.isLoad = false;
        }
      } else {
        this.isLoad = false;
        this.$message.error(res.message);
      }
    },
    async getUserInviteNum() {
      const res = await this.$api.$service.userInvite_inviteNum();
      if (res.code == 200) {
        this.inviteInfo = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    async getRankingList() {
      const res = await this.$api.$service.userInvite_rankingList({
        pageCount: 1,
        pageSize: 100,
      });
      if (res.code == 200) {
        this.rankingList = res.data.page.records;
        this.rankTime = res.data.day; 
      } else {
        this.$message.error(res.message);
      }
    },
    createQrcode(url) {
      const canvas = document.getElementById("qrcode-canvas");
      QRCode.toCanvas(canvas, url, {
        margin: 0,
      });
      const data = canvas.toDataURL("image/png", 1);
      this.qrcodeUrl = data;
    },
    createShareImage(img) {
      const canvas = (this.canvas = document.getElementById("poster-canvas"));
      canvas.width = 640;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      const bgImg = this.$refs.qrcodeBg;
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        const qrImg = new Image();
        qrImg.src = img;
        qrImg.crossOrigin = "Anonymous";
        qrImg.onload = () => {
          const qrCodeW = 240,
            qrCodeH = 240;
          ctx.drawImage(
            qrImg,
            canvas.width / 2 - qrCodeW / 2,
            canvas.height - qrCodeH - 245,
            qrCodeW,
            qrCodeH
          );
          this.posterImg = canvas.toDataURL("image/png");
          this.show = false;
        };
      };
    },
    createTxt(ctx, text, x, y, maxWidth, lineHeight) {
      ctx.font = "18px bold 黑体";
      ctx.fillStyle = "#ff0";
      /*       ctx.textAlign = "center";
      ctx.fillText("要写的文字", 100, 18);  */
      var context = ctx;
      var canvas = context.canvas;
      if (typeof maxWidth == "undefined") {
        maxWidth = 100;
      }
      if (typeof lineHeight == "undefined") {
        lineHeight =
          (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) ||
          parseInt(window.getComputedStyle(document.body).lineHeight);
      }
      // 字符分隔为数组
      var arrText = text.split("");
      var line = "";
      for (var n = 0; n < arrText.length; n++) {
        var testLine = line + arrText[n];
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = arrText[n];
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, y);
    },
    downLoadImage(url, name) {
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
    },
    downLoad() {
      /*   const url = this.canvas.toDataURL("image/png"); */
      this.downLoadImage(this.posterImg, "唯一艺术邀请海报");
    },
  },
};
</script>
<style lang="scss" scoped>
.invite-dialog {
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  ::v-deep .el-dialog__header {
    display: flex;
  }
  .content {
    padding-bottom: 16px;
  }
  .invite-title {
    font-size: 20px;
    font-weight: bold;
    color: #333333;
    padding: 0 10px;
    small {
      font-size: 16px;
      font-weight: 400;
      color: #666666;
      display: inline-block;
      padding-left: 10px;
    }
  }
  .tr {
    .name {
      text-align: left;
      padding-left: 32px;
    }
    .goods {
      padding-right: 32px;
    }
  }
  @media screen and (max-width: 540px) {
    .content {
      padding-bottom: 16px;
    }
    .invite-title {
      font-size: 0.28rem;
      padding: 0;
      margin-left: -10px;
      small {
        font-size: 0.2rem;
        font-weight: 400;
        color: #666666;
        display: inline-block;
        padding-left: 10px;
      }
    }
    .tr {
      .name {
        text-align: left;
        padding-left: 0.16rem;
      }
      .goods {
        padding-right: 0.16rem;
      }
    }
  }
}
.infinite-list {
  max-height: 40vh;
  overflow-y: auto;
}
.m-rank-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 30px;
  .left {
    display: flex;
    align-items: center;
  }
  .tip-warning {
    font-size: 14px;
    font-weight: 400;
    color: #e54444;
  }
}
.content-bar-box {
  max-height: 600px;
  overflow-y: auto;
  @media screen and (max-width: 540px) {
    max-height: 6rem;
  }
}
.page {
  display: flex;
  justify-content: flex-end;
}
.des-txt {
  color: #717171;
  text-align: center;
  padding-bottom: 30px;
}
.m-content-wrap {
  max-width: 1200px;
  margin: 0 auto;
}
.invite-btn-wrap {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  .invite-btn {
    padding-bottom: 20px;
    color: #e54444;
    text-decoration: underline;
    cursor: pointer;
  }
}
.logo {
  display: block;
  width: 456px;
  margin: 118px auto 111px;
  @media screen and (max-width: 540px) {
    width: 4.56rem;
    margin: 1.18rem auto 1.11rem;
  }
}
.responsive-img {
  display: block;
  width: 100%;
}
.icon {
  width: 30px;
  height: 30px;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  @media screen and (max-width: 540px) {
    width: 0.35rem;
    height: 0.28rem;
  }
}
.block-wrap {
  background: rgba(102, 85, 85, 0.19);
  border-radius: 10px;
  position: relative;
  .rank-title {
    position: absolute;
    top: 0;
    left: 50%;
    max-width: 246px;
    transform: translateX(-50%) translateY(-96%);
    .txt {
      position: absolute;
      top: 8px;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      color: #e54444;
    }
    img {
      display: block;
      width: 100%;
    }
  }
  @media screen and (max-width: 540px) {
    padding: 0.5rem 0.3rem 0.4rem;
    .rank-title {
      .txt {
        top: 0.1rem;
      }
    }
  }
}
.icon-people {
  background-image: url("//static.theone.art/pc/invite/icon-peopel.png");
}
.icon-ranking {
  background-image: url("//static.theone.art/pc/invite/icon-ranking.png");
}
.icon-warning {
  background-image: url("//static.theone.art/pc/invite/icon-warning.png");
}
.down-btn {
  display: inline-block;
  padding: 10px 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 40px;
  color: #fff;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  border-radius: 50px;
  @media screen and (max-width: 540px) {
    padding: 0.19rem 1.27rem;
    background: rgba(216, 216, 216, 0.06);
    border-radius: 46px;
    border: 1px solid #979797;
    font-size: 0.24rem;
  }
}
.center-wrap {
  display: flex;
  justify-content: center;
  margin: 40px 0 108px;
  @media screen and (max-width: 540px) {
    margin: 0.4rem 0;
  }
}
.create-img-wrap,
.qrcode-bg,
.qrcode-canvas {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
.qrcode-bg {
  width: 10px;
  display: block;
}
.preview-poster-wrap {
  max-width: 600px;
  margin: 0 auto;
  @media screen and (max-width: 540px) {
    max-width: inherit;
    width: 62%;
  }
}
.poster-canvas {
  margin: 0 auto;
  display: block;
}
.ui-title {
  font-size: 42px;
  font-weight: bold;
  color: #ffffff;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 110px;
  @media screen and (max-width: 540px) {
    line-height: 0.8rem;
    font-size: 0.42rem;
    margin-bottom: 1.1rem;
    line-height: 1.4;
  }
}
.ui-body {
  background: #201207
    url("//static.theone.art/pc/invite/body-bg.png")
    top center no-repeat;
  background-size: contain;
  color: #fff;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 60px;
  @media screen and (max-width: 540px) {
    padding: 0 0.3rem 2rem;
  }
}
.ui-active-des {
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.6;
  padding: 35px 70px;
  background-color: rgba(255, 255, 255, 0.1);
  max-width: 1080px;
  margin: 0 auto;
  border-radius: 0.2rem;
  section {
    margin-bottom: 50px;
    > div {
      margin-bottom: 14px;
    }
  }
  .ui-rule-title {
    margin-bottom: 17px;
    font-size: 18px;
    font-weight: 600;
  }
  @media screen and (max-width: 540px) {
    font-size: 0.24rem;
    font-weight: 400;
    color: #ffffff;
    line-height: 0.36rem;
    padding: 0.36rem 0.3rem 0.43rem;
    > div {
      margin-bottom: 0.26rem;
    }
  }
}
.m-login-info {
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  padding: 30px 0;
  .user-name {
    color: #fff;
  }
  @media screen and (max-width: 540px) {
    font-size: 0.24rem;
    font-weight: bold;
    color: #ffffff;
    padding: 0.49rem 0 0.2rem;
  }
}
.line-des {
  display: flex;
  justify-content: space-around;
  font-size: 23px;
  font-weight: 800;
  color: #ffffff;
  padding-top: 20px;
  > span {
    display: block;
    text-align: right;
  }
  @media screen and (max-width: 540px) {
    font-size: 0.29rem;
    padding-top: 0.2rem;
  }
}
.progress {
  width: 100%;
  border-radius: 50px;
  background-color: #fff;
  padding: 10px 0;
  margin-top: 40px;
  overflow: hidden;
  .bar {
    height: 19px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #413e3b 100%);
    border-radius: 50px;
  }
  @media screen and (max-width: 540px) {
    padding: 0.1rem 0;
    margin-top: 0.4rem;
    .bar {
      height: 0.19rem;
    }
    .line-des {
      font-size: 0.29rem;
    }
  }
}
.m-invite-user-wrap {
}
.level-wrap {
  display: flex;
  justify-content: space-between;
  border-radius: 11px;
  margin: 0 -10px;
  .level-block {
    width: 33.3%;
    padding: 0 10px;
    .content {
      background: rgba(216, 216, 216, 0.15);
      border-radius: 11px;
      border: 1px solid #979797;
      padding: 20px 36px;
      margin-bottom: 20px;
      text-align: center;
      .des {
        font-size: 14px;
        padding-bottom: 30px;
      }
      .num {
        font-weight: bold;
        font-size: 22px;
        padding: 30px 0 10px;
      }
    }
  }
  @media screen and (max-width: 540px) {
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 -0.1rem;
    .level-block {
      width: 50%;
      padding: 0 0.1rem;
      .content {
        background: rgba(216, 216, 216, 0.15);
        border-radius: 0.11rem;
        border: 1px solid #979797;
        padding: 0.2rem 0.36rem;
        margin-bottom: 0.2rem;
        text-align: center;
        .des {
          font-size: 0.24rem;
        }
        .num {
          font-weight: bold;
          font-size: 0.29rem;
        }
      }
    }
  }
}
.m-ranking-list {
  .tr {
    display: flex;
    padding: 20px 60px;
    .bar:nth-child(2) {
      text-align: center;
    }
    .bar:nth-child(3) {
      text-align: right;
    }
  }
  .tr:nth-child(1) {
    .td {
      color: #fef94b;
    }
  }
  .tr:nth-child(2) {
    .td {
      color: #d9d9d9;
    }
  }
  .tr:nth-child(3) {
    .td {
      color: #db7a54;
    }
  }
  .th {
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    word-break: keep-all;
    white-space: nowrap;
  }
  .new-people {
    width: 100px;
  }
  .td {
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
  }
  .bar {
    flex: 1;
    overflow: hidden;
  }
  .count {
    width: 40px;
  }
  .id {
    flex: 1;
  }
  .new-people {
  }
  @media screen and (max-width: 540px) {
    .th {
      font-size: 0.3rem;
    }
    .td {
      font-size: 0.26rem;
    }
    .tr {
      padding: 0.2rem 0.4rem;
    }
    .count {
      width: 0.8rem;
    }
    .id {
      flex: 1;
    }
    .new-people {
      width: 1rem;
    }
  }
}
.m-block-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  margin-bottom: 13px;
  margin-top: 40px;
  .num {
    color: rgba(229, 68, 68, 1);
  }
  .icon {
    margin-right: 10px;
  }
  @media screen and (max-width: 540px) {
    font-size: 0.32rem;
    margin-bottom: 0.4rem;
    margin-top: 0.4rem;
    .icon {
      margin-right: 0.1rem;
    }
  }
}
.active-instructions {
  line-height: 1.6;
  padding: 30px;
  > div {
    margin-bottom: 16px;
  }
  @media screen and (max-width: 540px) {
    padding: 0.3rem;
  }
}
.table {
  display: block;
  width: 100%;
  .tr {
    font-weight: bold;
    display: flex;
  }
  .th {
    word-break: keep-all;
    background: #fff9f9;
    font-size: 16px;
    font-weight: 400;
    color: #201207;
  }
  .th,
  .td {
    flex: 1;
    padding: 10px;
    text-align: center;
  }
  .td {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    padding: 20px 0;
  }
  .phone {
  }
  @media screen and (max-width: 540px) {
    .th {
      font-size: 0.2rem;
    }
    .td {
      font-size: 0.2rem;
    }
    .th,
    .td {
      padding: 0.1rem 0.05rem;
    }
    .phone {
      width: 1.6rem;
    }
    .isname {
      width: 1rem;
    }
    .name {
      width: 1rem;
    }
    .isname2 {
      width: 0.6rem;
      flex: inherit;
    }
    .isname1 {
      width: 0.9rem;
      flex: inherit;
    }
  }
}
@media screen and (max-width: 540px) {
  .infinite-list {
    max-height: 30vh;
  }
  .phone-hide {
    display: none;
  }
}
</style>