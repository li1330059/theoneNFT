<template>
  <div class="invite-wrap">
    <div class="detail card">
      <div class="title-box">
        <div class="title size-24">{{ this.userInfo.nickname }}您好</div>
      </div>
      <!-- 新用户 -->
      <div class="bind-info" v-if="userType === 2">
        <p class="size-16"> 当前绑定分享者为：{{ shareUserNickname || '暂无' }} </p>
        <div class="count-down" v-if="countDownText">
          完成任务倒计时：<span class="light">{{ countDownText }}</span>
        </div>
        <div class="record-btn text-blue text-btn" @click="showDialog">活动记录</div>
      </div>
      <!-- 老用户 -->
      <template v-if="userType === 1">
        <div class="invite-info">
          <!-- <img ref="qrcodeBg" src="~@/assets/img/invite-code-bg.png" class="qrcode-bg" /> -->
          <!-- <div id="qrcode-box" ref="qrRef" class="code-img"></div>
          <canvas id="poster-canvas" class="poster-canvas" /> -->
          <!-- <canvas id="qrcode-canvas" class="code-img" />
          <canvas id="poster-canvas" class="poster-canvas" /> -->
          <img :src="posterImg" class="poster-img" />
        </div>
        <div class="download-btn" v-if="posterImg" @click="downLoad">下载海报</div>
        <div class="cur-info">
          <div class="num-box">
            <span class="icon"></span>当前邀请人数<span class="num text-blue">{{
                inviteCount
            }}</span>人
          </div>
          <div class="text-btn text-blue" @click="showDialog">
            邀请记录
          </div>
        </div>
        <div>
          <div class="progress">
            <div class="bar" :style="`width: ${processWidth}%`"></div>
          </div>
          <div class="line-des size-16-24">
            <span style="width: 25%">5人</span>
            <span style="width: 25%">10人</span>
            <span style="width: 25%">20人</span>
          </div>
        </div>
      </template>
    </div>

    <div class="rule card last">
      <div class="title-box">
        <div class="title size-24">活动规则</div>
      </div>
      <div class="text">
        {{ activityRule }}
      </div>
    </div>
    <el-dialog :visible.sync="inviteListShow" append-to-body :show-close="false">
      <div slot="title" class="dialog-title">{{ userType === 2 ? '活动记录' : '邀请记录' }}</div>
      <div class="num" v-if="userType === 1">
        <span class="icon icon-1"></span>
        <span class="title">邀请总用户{{ listInviteCount }}人</span>
        <span class="icon icon-2"></span>
      </div>
      <div class="num" v-if="userType === 2">完成任务{{ listFinishCount }}个</div>
      <img src="~@/assets/1.0/images/close@2x.png" class="close-btn" @click="closeDialog" alt="" />

      <div ref="wrapRef" @scroll="scroll" style="overflow-y: auto" class="content"
        v-if="inviteDataList && inviteDataList.length > 0">
        <div ref="listRef" class="list-wrap">
          <div class="list-title">
            <span class="row">用户昵称</span>
            <span class="row">用户手机号</span>
            <span class="row">是否完成任务</span>
          </div>
          <div v-for="(item, i) in inviteDataList" :key="i" class="list-item">
            <span class="row">{{ item.userNickName }}</span>
            <span class="row">{{ item.userPhone }}</span>
            <span class="row">{{
                Number(item.statusFinish) === 2 ? "是" : "否"
            }}</span>
          </div>
          <!-- <div ref="loadRef" class="ref"></div> -->
          <div class="center" v-if="loading">加载中...</div>
        </div>

      </div>
      <div v-if="(!inviteDataList || (inviteDataList && !inviteDataList.length)) && !loading" class="nodata">
        <img class="logo" src="~@/assets/1.0/images/nodata@2x.png" alt="" />
        <div>暂无记录</div>
      </div>
    </el-dialog>
    <div class="create-img-wrap">
      <canvas id="qrcode-canvas" class="qrcode-canvas" />
      <canvas id="poster-canvas" class="poster-canvas" />
      <img ref="qrcodeBg" src="~@/assets/img/invite-code-bg.png" class="qrcode-bg" />
    </div>
  </div>
</template>
<script>
// import QRCode from "qrcodejs2";
import QRCode from "qrcode";
import App from "@/utils/app/index";

export default {
  data() {
    return {
      afterInit: false,
      activityUuid: this.$route.query.activityUuid,
      userType: 0, // 1老用户2新用户
      inviteCode: '', // 邀请码
      activityRule: "", // 活动规则
      shareUserNickname: '', // 当前绑定分享者
      inviteCount: 0, // 完成邀请人数
      listFinishCount: 0, // 完成任务总数
      listInviteCount: 0, // 邀请人数
      noMoreData: false,
      loading: false,
      qrcodeUrl: '',
      posterImg: "",
      restTime: 0,
      pageSize: 10,
      pageCount: 1,
      inviteListShow: false,
      countDownText: "",
      inviteDataList: [],
      loadImg: false
    };
  },
  watch: {
    inviteListShow() {
      if (this.inviteListShow === false) {
        this.noMoreData = false
        this.inviteDataList = []
        this.pageCount = 1
        this.getDetail();
      }
    }
  },

  async mounted() {

    await this.getDetail();
    this.getSimpleDetail();
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
    processWidth() {
      let num = this.inviteCount || 0;
      let res = 0;
      if (num <= 5) {
        res = (num / 30) * 100;
      } else if (num <= 10) {
        res = (0.167 + (num - 5) / 15) * 100;
      } else if (num <= 19) {
        res = (0.5 + (num - 10) / 30) * 100;
      } else if (num === 20) {
        res = 84;
      } else {
        res = 100;
      }

      return res;
    },
  },
  methods: {
    closeDialog() {
      this.inviteListShow = false
    },
    showDialog() {
      this.inviteListShow = true
      this.getInviteList();
    },
    async getInviteList() {
      if (this.noMoreData || this.loading) return
      this.loading = true
      let params = {
        activityUuid: this.activityUuid,
        pageCount: this.pageCount,
        pageSize: this.pageSize,
      };
      try {
        const res = await this.$api.$service.invite_pageRecord(params);
        if (res?.data?.data?.records) {
          const list = res?.data?.data?.records
          if (!list || list?.length === 0) {
            this.noMoreData = true
          }
          if (this.pageCount === 1) {
            this.inviteDataList = list
          } else {
            this.inviteDataList = [...this.inviteDataList, ...list]
          }
          this.listInviteCount = res.data.inviteCount
          this.listFinishCount = res.data.finishCount
          this.pageCount += 1
        }
      } finally {
        this.loading = false
      }
      // this.inviteDataList = [
      //   {
      //     userNickName: 'userNickName',
      //     userPhone: 'userPhone'
      //   },
      // ]
    },
    scroll(e) {
      this.$nextTick(() => {
        if (e.target.scrollTop + 10 >= this.$refs.listRef.clientHeight - this.$refs.wrapRef.clientHeight) {
          this.getInviteList();
        }
      })

    },
    async getSimpleDetail() {
      // this.createQrcode('111');
      let params = {
        uuid: this.activityUuid,
      };
      const res = await this.$api.$service.invite_simpleDetail(params);
      if (res?.data && res.code === 200) {
        const { inviteCode, url, activityRule } = res.data
        this.activityRule = activityRule
        if (this.userType === 1) {
          let inviteUrl = ''
          if (url && url.indexOf('?') !== -1) {
            inviteUrl = url + '&inviteCode=' + inviteCode
          } else {
            inviteUrl = url + '?inviteCode=' + inviteCode
          }

          this.createQrcode(inviteUrl);
        }
      } else {
        this.$toast(res.message)
      }
    },
    getDetail() {
      return new Promise(async (resolve, reject) => {
        try {
          let params = {
            uuid: this.activityUuid,
          };
          const res = await this.$api.$service.invite_detail(params);
          if (res?.data) {
            const { inviteCount, shareUserNickname, restTime } = res.data
            this.inviteCount = inviteCount
            this.shareUserNickname = shareUserNickname

            this.userType = Number(res?.data?.userType)
            if (!this.afterInit && restTime) {
              this.getTime(restTime / 1000);
            }
            this.afterInit = true
          }
          resolve()
        } catch (error) {
          reject()
        }

      })

    },
    createQrcode(url) {
      const canvas = document.getElementById("qrcode-canvas");
      QRCode.toCanvas(canvas, url, {
        margin: 0,
      });
      const data = canvas.toDataURL("image/png");
      this.qrcodeUrl = data;
      this.setBgimg()
    },
    setBgimg() {
      const canvas = document.getElementById("poster-canvas")
      const ctx = canvas.getContext("2d");
      const bgImg = this.$refs.qrcodeBg;

      canvas.width = 497;
      canvas.height = 649;
      let isLoaded = bgImg.complete && bgImg.naturalHeight !== 0;
      console.log('isLoaded', isLoaded);
      if (isLoaded) {
        this.setPoster(ctx, canvas)
      } else {
        bgImg.onload = () => {
          this.setPoster(ctx, canvas)
        };
      }
    },

    setPoster(ctx, canvas) {
      const bgImg = this.$refs.qrcodeBg;

      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      const qrImg = new Image();
      qrImg.crossOrigin = "Anonymous";
      const qrCodeW = 210;
      const qrCodeH = 210;
      let isLoaded = qrImg.complete && qrImg.naturalHeight !== 0;
      if (isLoaded) {
        ctx.drawImage(
          qrImg,
          canvas.width / 2 - qrCodeW / 2,
          canvas.height - qrCodeH - 137,
          qrCodeW,
          qrCodeH
        );
        const imgurl = canvas.toDataURL('image/png')
        this.posterImg = imgurl
      } else {
        qrImg.onload = () => {
          ctx.drawImage(
            qrImg,
            canvas.width / 2 - qrCodeW / 2,
            canvas.height - qrCodeH - 137,
            qrCodeW,
            qrCodeH
          );
          const imgurl = canvas.toDataURL('image/png')
          this.posterImg = imgurl
        };
      }
      qrImg.src = this.qrcodeUrl
    },
    downLoad() {
      if (App.browser.theone.isTheOne) {
        App.$methods.saveImage({
          url: this.posterImg
        });
      } else {
        const a = document.createElement('a')
        a.href = this.posterImg
        a.download = '唯一艺术邀请海报' // 图片名称
        a.click()
      }
    },
    durationFormatter(time) {
      if (!time) return { ss: 0 };
      let t = time;
      const ss = t % 60;
      t = (t - ss) / 60;
      if (t < 1) return { ss };
      const mm = t % 60;
      t = (t - mm) / 60;
      if (t < 1) return { mm, ss };
      const hh = t;
      return { hh, mm, ss };
    },
    getTime(duration) {
      this.timer && clearTimeout(this.timer);
      if (duration < 0) {
        this.countDownText = ''
        return;
      }
      const { hh, mm, ss } = this.durationFormatter(duration);
      let text = "";
      if (hh) {
        text += hh + "小时";
      }
      if (mm) {
        text += mm + "分钟";
      }
      if (ss) {
        text += ss + "秒";
      }
      this.countDownText = text;

      this.timer = setTimeout(() => {
        this.getTime(duration - 1);
      }, 1000);
    },
  },
};
</script>
<style lang="scss" scoped>
.poster-img {
  width: 100%;
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

::v-deep .el-dialog {
  width: 698px;
  border-radius: 8px;

  .center {
    text-align: center;
  }

  .ref {
    height: 1px;
  }

  .content {
    max-height: 396px;

    @media screen and (max-width: 540px) {
      max-height: 4.68rem;
    }
  }

  @media screen and (max-width: 540px) {
    width: 6.54rem;
  }

  .dialog-title {
    color: #333333;
    font-size: 16px;
    font-weight: 600;

    @media screen and (max-width: 540px) {
      font-size: 0.28rem;
    }
  }

  .el-dialog__header {
    padding: 24px 24px 0 24px;

    @media screen and (max-width: 540px) {
      padding: 0.25rem 0.32rem 0 0.32rem;
    }
  }

  .el-dialog__body {
    padding: 24px;

    @media screen and (max-width: 540px) {
      padding: 0.32rem;
    }
  }

  .el-dialog__headerbtn {
    top: 21px;
    right: 24px;
  }

  .num {
    height: 48px;
    background: #fff8ea;
    border-radius: 8px;
    text-align: center;
    line-height: 48px;
    margin-bottom: 24px;
    color: #794400;
    font-size: 16px;
    font-weight: 500;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    @media screen and (max-width: 540px) {
      height: 0.65rem;
      line-height: 0.65rem;
      font-size: 0.24rem;
      border-radius: 0.1rem;
    }

    .title {
      display: inline-block;
      margin: 0 12px;

      @media screen and (max-width: 540px) {
        margin: 0 0.16rem;
      }
    }

    .icon {
      display: inline-block;
      width: 19px;
      height: 6px;
      background: linear-gradient(270deg,
          #ffd49d 0%,
          rgba(255, 237, 207, 0) 100%);

      @media screen and (max-width: 540px) {
        width: 0.3rem;
        height: 0.09rem;
      }
    }

    .icon-2 {
      transform: rotate(180deg);
    }
  }

  .close-btn {
    width: 28px;
    height: 28px;
    position: absolute;
    top: 21px;
    right: 24px;
    cursor: pointer;

    @media screen and (max-width: 540px) {
      top: 0.29rem;
      right: 0.32rem;
      width: 0.36rem;
      height: 0.36rem;
    }
  }

  .list-wrap {
    position: relative;
  }

  .list-title {
    color: #333333;
    position: sticky;
    background-color: #fff;
    top: 0;
    left: 0;

    @media screen and (max-width: 540px) {
      margin-bottom: 0.08rem;
    }

    .row {
      margin-bottom: 10px;
      font-size: 14px;
      display: inline-block;
      width: 33.3%;
      text-align: center;
    }
  }

  .list-item {
    margin-bottom: 20px;

    @media screen and (max-width: 540px) {
      margin-bottom: 0.16rem;
    }

    .row {
      color: #4d4d4d;
      font-size: 14px;
      display: inline-block;
      width: 33.3%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      @media screen and (max-width: 540px) {
        font-size: 0.24rem;
      }
    }
  }

  .nodata {
    font-size: 14px;
    color: #999999;
    text-align: center;
    margin-top: 67px;
    margin-bottom: 48px;

    @media screen and (max-width: 540px) {
      margin-top: 0.5rem;
      margin-bottom: 0.26rem;
    }

    img {
      width: 128px;
      height: 87px;
      margin: 0 auto;
      margin-bottom: 8px;
    }
  }
}


.invite-wrap {
  background: #dfe8ff url("~@/assets/img/invite-bg@2x.png") top center no-repeat;
  background-size: contain;
  padding-top: 536px;
  padding-bottom: 100px;
  font-size: 14px;
  min-height: 100vh;



  @media screen and (max-width: 540px) {
    padding: 4.5rem 0.32rem 0.7rem 0.32rem;
    font-size: 0.26rem;
    background: #dfe8ff url("~@/assets/img/invite-bg-m@2x.png") top center no-repeat;
    background-size: contain;
  }

  .size-16 {
    font-size: 16px;

    @media screen and (max-width: 540px) {
      font-size: 0.26rem;
    }
  }

  .size-16-24 {
    font-size: 16px;

    @media screen and (max-width: 540px) {
      font-size: 0.24rem;
    }
  }

  .size-18-26 {
    font-size: 18px;

    @media screen and (max-width: 540px) {
      font-size: 0.26rem;
    }
  }

  .size-24 {
    font-size: 24px;

    @media screen and (max-width: 540px) {
      font-size: 0.32rem;
    }
  }

  .title-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;

    @media screen and (max-width: 540px) {
      font-size: 0.32rem;
      margin-bottom: 0.4rem;
    }

    .title {
      color: #3e7cf3;
      font-weight: 600;
      width: fit-content;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      &::after,
      &::before {
        display: block;
        content: "";
        width: 28px;
        height: 16px;
        background: url("~@/assets/1.0/images/icon-dots@2x.png");
        background-size: 100% 100%;
        position: absolute;

        @media screen and (max-width: 540px) {
          width: 0.37rem;
          height: 0.21rem;
        }
      }

      &::after {
        right: -48px;
        transform: rotate(180deg);

        @media screen and (max-width: 540px) {
          right: -0.47rem;
        }
      }

      &::before {
        left: -48px;

        @media screen and (max-width: 540px) {
          left: -0.47rem;
        }
      }
    }
  }

  .text-blue {
    color: #4e94fe;
  }

  .text-btn {
    text-decoration: underline;
    cursor: pointer;
  }

  .text {
    font-weight: 400;
    color: #666666;
    line-height: 36px;

    @media screen and (max-width: 540px) {
      line-height: 0.37rem;
    }
  }

  .card {
    width: 926px;
    background: #f0f4fd;
    border-radius: 10px;
    margin: 0 auto;
    padding: 40px;
    // margin-bottom: 40px;

    @media screen and (max-width: 540px) {
      width: 100%;
      padding: 0.4rem 0.24rem;
    }

    &:not(:last-child) {
      margin-bottom: 40px;

      @media screen and (max-width: 540px) {
        margin-bottom: 0.4rem;

      }
    }
  }

  .last {
    margin-bottom: 0 !important;
  }

  .detail {
    .bind-info {
      background: #ffffff;
      border-radius: 10px;
      text-align: center;
      padding: 24px 0;
      border: 1px dashed #dae9ff;

      @media screen and (max-width: 540px) {
        width: 100%;
        padding: 0.32rem 0;
      }

      .record-btn {
        margin-top: 16px;

        @media screen and (max-width: 540px) {
          margin-top: 0.24rem;
        }
      }

      .count-down {
        color: #666666;
        margin-top: 4px;

        @media screen and (max-width: 540px) {
          margin-top: 0.08rem;
        }

        .light {
          color: #fda760;
        }
      }
    }

    .invite-info {
      text-align: center;
      position: relative;
      margin: 0 auto;
      width: 446px;
      height: 582px;
      position: relative;
      background: linear-gradient(180deg,
          rgba(218, 226, 253, 0) 0%,
          #b8d4ff 26%,
          #dfe8ff 100%);

      @media screen and (max-width: 540px) {
        width: 5.18rem;
        height: 6.53rem;
      }

      .qrcode-bg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }

      // .poster-canvas {
      //   width: 100px;
      //   height: 100px;
      // }

      // .code-img {
      //   position: absolute;
      //   bottom: 122px;
      //   left: 50%;
      //   transform: translateX(-50%);
      //   width: 190px !important;
      //   height: 190px !important;

      //   img {
      //     width: 100% !important;
      //     ;
      //     height: 100% !important;
      //     ;
      //   }

      //   @media screen and (max-width: 540px) {
      //     bottom: 1.328rem;
      //     width: 2.2rem !important;
      //     height: 2.2rem !important;
      //     border-radius: 0.09rem;
      //   }
      // }

      .logo {
        margin: 0 auto;
        display: block;
        width: 176px;
        height: auto;
        position: absolute;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);

        @media screen and (max-width: 540px) {
          width: 2.05rem;
          height: auto;
          bottom: 0.27rem;
        }
      }
    }
  }

  .download-btn {
    cursor: pointer;
    margin: 0 auto;
    width: 200px;
    height: 40px;
    background: linear-gradient(270deg, #5ba6ff 0%, #2473ff 100%);
    border-radius: 40px;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 35px;
    margin-bottom: 32px;

    @media screen and (max-width: 540px) {
      margin-top: 0.4rem;
      margin-bottom: 0.68rem;
      width: 3.26rem;
      height: 0.8rem;
      border-radius: 0.4rem;
    }
  }

  .rule {}

  .cur-info {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .progress {
    width: 100%;
    border-radius: 50px;
    background-color: #fff;
    padding: 5px 0;
    margin-top: 33px;
    overflow: hidden;

    .bar {
      height: 10px;
      background: linear-gradient(90deg,
          rgba(195, 225, 251, 0) 0%,
          #4594f7 100%);
      border-radius: 50px;
    }

    @media screen and (max-width: 540px) {
      padding: 0.05rem 0;
      margin-top: 0.4rem;

      .bar {
        height: 0.21rem;
        border-radius: 0.11rem;
      }
    }
  }

  .line-des {
    display: flex;
    justify-content: space-around;
    color: #666666;
    padding-top: 20px;

    >span {
      display: block;
      text-align: right;
      text-align: center;
    }

    @media screen and (max-width: 540px) {
      padding-top: 0.2rem;
    }
  }
}
</style>
