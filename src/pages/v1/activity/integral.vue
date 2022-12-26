<template>
  <div class="page-activity-index">
    <div class="v1-activity-pc">
      <div class="v1-activity-main">
        <!-- left -->
        <div class="v1-activity-left">
          <div class="v1-activity-img"></div>
          <div class="v1-activity-logo"></div>
          <div class="v1-activity-divider"></div>
          <div class="v1-activity-info">
            <p>唯一艺术大收藏家积分<br>活动火爆来袭！</p>
          </div>
          <div class="dialog">
            <h1>活动规则</h1>
            <p>每持有1个任意前五立馆IP的最终合成款，可获得2个积分，持有多个或多款，积分可叠加。</p>
            <p>每持有1个任意非前五立馆IP的最终合成款，可获得1个积分，持有多个或多款，积分可叠加。</p>
            <p>更多活动详情见</p>
            <p><a href="https://mp.weixin.qq.com/s/Ya9G6XDEsdYgSQuresOP1w"
                 target="_blank">https://mp.weixin.qq.com/s/Ya9G6XDEsdYgSQuresOP1w</a></p>
            <h1 class="mt10">注意事项</h1>
            <p>1.活动截止时间为2022年5月27日12:00。</p>
            <p>2.积分榜单每半小时整更新一次，并非实时更新。更新频率如9：00、9:30、10:00，以此类推。</p>
            <p>3.本次积分活动仅包含推文已公布的最终合成款，大运数字蓉宝全员动图及宫廷宝贝天降祥瑞宫猫集锦-脊兽送福不包含在内。</p>
          </div>
        </div>
        <!-- right -->
        <div class="v1-activity-right">
          <div class="v1-activity-title">
            <img src="https://static.theone.art/activity/top/pc/right_top_icon.png"
                 class="topIcon" />
            <p>积分排行榜</p>
            <img src="https://static.theone.art/activity/top/pc/right_top_icon.png"
                 class="topIcon" />
          </div>
          <div class="v1-activity-list">
            <div class="v1-activity-list-divider"></div>
            <div class="loading"
                 v-if="loading">
              <loading></loading>
            </div>
            <empty v-else-if="!loading && empty"></empty>
            <ul v-else>
              <li v-for="(item, index) in listResults"
                  :key="index">
                <div v-if="item.rankNumber == 1"
                     class="first"></div>
                <div v-else-if="item.rankNumber == 2"
                     class="second"></div>
                <div v-else-if="item.rankNumber == 3"
                     class="third"></div>
                <div class="one"
                     v-else>{{ item.rankNumber }}</div>
                <div class="avatarsClass"
                     :style="`background-image:url('https://static.theone.art/pc/avatars${(arr[Math.floor(Math.random()*3)])}.png')`"
                     :class="{activeAvatars : item.rankNumber == 1 || item.rankNumber == 2 || item.rankNumber == 3,normalAvatars:item.rankNumber > 3}"></div>
                <div class="three">{{ item.userPhone }}</div>
                <div class="four"
                     :class="{activeText : item.rankNumber == 1 || item.rankNumber == 2 || item.rankNumber == 3}">
                  <div v-if="item.rankNumber == 1 || item.rankNumber == 2 || item.rankNumber == 3"
                       class="activeIcon"></div>
                  <span>积分</span>
                  <span>{{ item.rankScore }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="v1-activity-phone">
      <!-- top -->
      <div class="v1-activity-img-left">
        <div class="v1-activity-img-left-crown"></div>
        <div class="v1-activity-img-right">
          <div class="logo"></div>
          <div class="divider"></div>
          <div class="title">积分排行榜</div>
        </div>
      </div>
      <!-- list -->
      <div class="v1-activity-list-right">
        <div class="v1-activity-title">
          <img src="https://static.theone.art/activity/top/h5/right_top_icon.png"
               class="topIcon" />
          <p>积分排行榜</p>
          <img src="https://static.theone.art/activity/top/h5/right_top_icon.png"
               class="topIcon" />
        </div>
        <div class="v1-activity-list">
          <div class="v1-activity-list-divider"></div>
          <div class="loading"
               v-if="loading">
            <loading></loading>
          </div>
          <empty v-else-if="!loading && empty"></empty>
          <ul v-else>
            <li v-for="(item, index) in listResults"
                :key="index">
              <div v-if="item.rankNumber == 1"
                   class="first"></div>
              <div v-else-if="item.rankNumber == 2"
                   class="second"></div>
              <div v-else-if="item.rankNumber == 3"
                   class="third"></div>
              <div class="one"
                   v-else>{{ item.rankNumber }}</div>
              <div class="avatarsClass"
                   :style="`background-image:url('https://static.theone.art/pc/avatars${(arr[Math.floor(Math.random()*3)])}.png')`"
                   :class="{activeAvatars : item.rankNumber == 1 || item.rankNumber == 2 || item.rankNumber == 3,normalAvatars:item.rankNumber > 3}"></div>
              <div class="three">{{ item.userPhone }}</div>
              <div class="four"
                   :class="{activeText : item.rankNumber == 1 || item.rankNumber == 2 || item.rankNumber == 3}">
                <div v-if="item.rankNumber == 1 || item.rankNumber == 2 || item.rankNumber == 3"
                     class="activeIcon"></div>
                <span>积分</span>
                <span>{{ item.rankScore }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- dialog -->
      <div class="dialog">
        <h1>活动规则</h1>
        <p>每持有1个任意前五立馆IP的最终合成款，可获得2个积分，持有多个或多款，积分可叠加。</p>
        <p>每持有1个任意非前五立馆IP的最终合成款，可获得1个积分，持有多个或多款，积分可叠加。</p>
        <p>更多活动详情见</p>
        <p><a href="https://mp.weixin.qq.com/s/Ya9G6XDEsdYgSQuresOP1w"
             target="_blank">https://mp.weixin.qq.com/s/Ya9G6XDEsdYgSQuresOP1w</a></p>
        <h1 class="mt20">注意事项</h1>
        <p>1.活动截止时间为2022年5月27日12:00。</p>
        <p>2.积分榜单每半小时整更新一次，并非实时更新。更新频率如9：00、9:30、10:00，以此类推。</p>
        <p>3.本次积分活动仅包含推文已公布的最终合成款，大运数字蓉宝全员动图及宫廷宝贝天降祥瑞宫猫集锦-脊兽送福不包含在内。</p>
      </div>
    </div>
  </div>
</template>
<script>
import empty from "@/components/v1/empty.vue";
import loading from "@/components/v1/loading/loading.vue";
export default {
  components: { empty, loading },
  data () {
    return {
      loading: false,
      empty: true,
      listResults: [],
      arr: [1, 2, 3]
    };
  },
  mounted () {
    this.getActivityList();
  },
  methods: {
    async getActivityList () {
      this.loading = true;
      let result = await this.$api.service.rankingCurrentGlobalRanking();
      this.listResults = result.data.data;
      if (this.listResults.length == 0) {
        this.empty = true;
      } else {
        this.empty = false;
        let prescore = 0; //初始数量
        let rankNumber = 0; //初始排名
        let same = 0; //是否相同
        this.listResults.forEach((item, index) => {
          if (item.rankScore == prescore) {
            item.rankNumber = rankNumber;
            same++;
          } else {
            rankNumber = rankNumber + same;
            rankNumber++;
            prescore = item.rankScore;
            same = 0;
            item.rankNumber = rankNumber;
          }
        });
      }
      this.loading = false;
    },
  },
};
</script>



<style lang="scss" scoped>
@import url("./font.css");
.v1-activity-pc {
  width: 100%;
  height: 100vh;
  background: url("https://static.theone.art/activity/top/pc/bg.png")
    no-repeat 50%;
  background-size: cover;
  position: relative;
  display: block;
  justify-content: space-between;
  .v1-activity-main {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    position: relative;
    height: 100%;
    .v1-activity-left {
      width: 560px;
      position: absolute;
      top: 51px;
      left: 0px;
      text-align: center;
      .v1-activity-img {
        width: 390px;
        height: 251px;
        background: url("https://static.theone.art/activity/top/pc/left_crown.png")
          no-repeat center center;
        background-size: cover;
        margin: 0 auto;
      }
      .v1-activity-logo {
        width: 279px;
        height: 30px;
        background: url("https://static.theone.art/activity/top/pc/left_logo.png")
          no-repeat center center;
        margin: 0 auto;
        margin-top: 10px;
      }
      .v1-activity-divider {
        width: 101px;
        height: 4px;
        background: #e7141b;
        border-radius: 2px;
        margin: 0px auto;
        margin-top: 10px;
      }
      .v1-activity-info {
        color: #ffffff;
        line-height: 42px;
        letter-spacing: 5px;
        font-size: 30px;
        font-family: MicrosoftYaHei;
        font-weight: bold;
        text-align: center;
        margin-top: 12px;
      }
      .dialog {
        width: 560px;
        height: 335px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        border: 1px solid #d9d9d9;
        backdrop-filter: blur(3px);
        margin-top: 34px;
        padding: 21px;
        h1 {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          font-weight: bold;
          color: #ffffff;
          line-height: 21px;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        .mt10 {
          margin-top: 10px;
        }
        p {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #ffffff;
          line-height: 18px;
          letter-spacing: 1px;
          text-align: left;
          a {
            color: rgba(255, 197, 111, 1);
            text-decoration: underline;
          }
        }
      }
      // @media screen and (max-width: 1366px) {
      //   top: 134px;
      // }
      // @media screen and (min-width: 1366px) {
      //   top: 50%;
      //   transform: translate(0, -50%);
      // }
    }
    .v1-activity-right {
      width: 500px;
      height: 736px;
      position: absolute;
      top: 88px;
      right: 0px;
      display: flex;
      flex-direction: column;
      overflow: auto;
      background: #ffffff;
      border-radius: 15px;
      flex: 1;
      .v1-activity-title {
        display: flex;
        justify-content: center;
        align-items: center;
        .topIcon {
          width: 18px;
          height: 18px;
        }
        p {
          font-size: 20px;
          font-family: MicrosoftYaHei;
          font-weight: bold;
          color: #ffa635;
          line-height: 26px;
          margin: 20px;
        }
      }
      .v1-activity-list {
        overflow: auto;
        background: #ffffff;
        border-radius: 15px;
        text-align: center;
        flex: 1;
        .v1-activity-list-divider {
          width: 460px;
          border: 1px solid rgba(229, 229, 229, 0.5);
          margin: 0px auto;
        }
        ul {
          display: flex;
          flex-direction: column;
          li {
            height: 79px;
            margin: 0px 20px;
            border-bottom: 1px solid rgba(229, 229, 229, 0.5);
            display: flex;
            align-items: center;
            font-size: 18px;
            font-family: MicrosoftYaHei;
            .one {
              width: 36px;
              margin-right: 14px;
            }
            .three {
              width: 104px;
            }
            .four {
              display: flex;
              align-items: center;
              margin-left: 79px;
              white-space: nowrap;
            }
            .first {
              width: 36px !important;
              height: 45px;
              background: url("https://static.theone.art/activity/top/pc/right_list_first.png")
                no-repeat center center;
              background-size: cover;
              margin-right: 14px;
            }
            .second {
              width: 36px !important;
              height: 45px;
              background: url("https://static.theone.art/activity/top/pc/right_list_second.png")
                no-repeat center center;
              background-size: cover;
              margin-right: 14px;
            }
            .third {
              width: 36px !important;
              height: 45px;
              background: url("https://static.theone.art/activity/top/pc/right_list_third.png")
                no-repeat center center;
              background-size: cover;
              margin-right: 14px;
            }
            .avatarsClass {
              width: 50px;
              height: 50px;
              background-size: cover;
              border-radius: 50%;
              margin-right: 53px;
            }
            .activeAvatars {
              width: 56px;
              height: 56px;
              margin-right: 50px;
            }
            .normalAvatars {
              margin-left: 3px;
            }
            .activeIcon {
              width: 20px;
              height: 20px;
              background: url("https://static.theone.art/activity/top/pc/right_list_fire.png")
                no-repeat center center;
              background-size: cover;
            }
            .activeText {
              color: #ffa635;
              margin-left: 61px;
            }
          }
        }
      }
      // @media screen and (max-width: 1366px) {
      //   height: 569px;
      // }
      // @media screen and (min-width: 1366px) {
      //   top: 50%;
      //   transform: translate(0, -50%);
      // }
    }
  }
  @media screen and (min-width: 1366px) and (max-width: 1920px) {
    height: 900px;
  }
}
.v1-activity-phone {
  display: none;
}
.loading {
  margin-top: 50%;
}
</style>




<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  .v1-activity-phone {
    display: block;
    width: 100%;
    height: 23.31rem;
    background: url("https://static.theone.art/activity/top/h5/bg.png")
      no-repeat 50% 0%;
    background-size: cover;
    .v1-activity-img-left {
      position: relative;
      .v1-activity-img-left-crown {
        width: 3.89rem;
        height: 2.51rem;
        background: url("https://static.theone.art/activity/top/h5/left_crown.png")
          no-repeat center center;
        background-size: cover;
        position: absolute;
        top: 0.47rem;
        left: 0.31rem;
      }
      .v1-activity-img-right {
        position: absolute;
        top: 1.23rem;
        right: 0.46rem;
        display: flex;
        flex-direction: column;
        .logo {
          width: 2.79rem;
          height: 0.3rem;
          background: url("https://static.theone.art/activity/top/h5/left_logo.png")
            no-repeat center center;
          background-size: cover;
        }
        .divider {
          width: 1.01rem;
          height: 0.04rem;
          background: #e7141b;
          border-radius: 0.02rem;
          margin: 0.24rem auto;
        }
        .title {
          font-size: 0.32rem;
          font-family: MicrosoftYaHei;
          font-weight: bold;
          color: #ffffff;
          letter-spacing: 3px;
          margin: 0 auto;
        }
      }
    }
    .v1-activity-list-right {
      width: 6.9rem;
      height: 11.28rem;
      position: absolute;
      top: 3.33rem;
      left: 50%;
      transform: translate(-50%, 0);
      display: flex;
      flex-direction: column;

      overflow: auto;
      background: #fff4f3;
      border-radius: 0.14rem;
      flex: 1;
      .v1-activity-title {
        display: flex;
        justify-content: center;
        align-items: center;
        .topIcon {
          width: 0.22rem;
          height: 0.22rem;
        }
        p {
          font-size: 0.32rem;
          font-family: MicrosoftYaHei;
          font-weight: bold;
          color: #ffa635;
          margin: 0.36rem 0.24rem;
        }
      }
      .v1-activity-list {
        overflow: auto;
        flex: 1;
        .v1-activity-list-divider {
          width: 6.18rem;
          border: 0.01rem solid rgba(229, 229, 229, 0.5);
          margin: 0px auto;
        }
        ul {
          display: flex;
          flex-direction: column;
          li {
            height: 0.9rem;
            margin: 0 0.36rem;
            border-bottom: 0.01rem solid rgba(229, 229, 229, 0.5);
            display: flex;
            align-items: center;
            font-size: 0.24rem;
            .one {
              width: 0.49rem;
              margin-right: 0.18rem;
              text-align: center;
              // font-size: 0.14rem;
            }
            .three {
              width: 1.39rem;
            }
            .four {
              display: flex;
              align-items: center;
              margin-left: 1.21rem;
              white-space: nowrap;
            }
            .first {
              width: 0.49rem !important;
              height: 0.6rem;
              background: url("https://static.theone.art/activity/top/h5/right_list_first.png")
                no-repeat center center;
              background-size: cover;
              margin-right: 0.14rem;
            }
            .second {
              width: 0.49rem !important;
              height: 0.6rem;
              background: url("https://static.theone.art/activity/top/h5/right_list_second.png")
                no-repeat center center;
              background-size: cover;
              margin-right: 0.14rem;
            }
            .third {
              width: 0.49rem !important;
              height: 0.6rem;
              background: url("https://static.theone.art/activity/top/h5/right_list_third.png")
                no-repeat center center;
              background-size: cover;
              margin-right: 0.14rem;
            }
            .avatarsClass {
              width: 0.5rem;
              height: 0.5rem;
              background-size: cover;
              border-radius: 50%;
              margin-right: 1.05rem;
            }
            .activeAvatars {
              width: 0.58rem;
              height: 0.58rem;
            }
            .activeIcon {
              width: 0.24rem;
              height: 0.25rem;
              background: url("https://static.theone.art/activity/top/h5/right_list_fire.png")
                no-repeat center center;
              background-size: cover;
            }
            .normalAvatars {
              margin-left: 0.04rem;
            }
            .activeText {
              color: #ffa635;
              margin-left: 1.05rem;
            }
          }
        }
      }
    }
    .dialog {
      width: 6.9rem;
      height: 6.27rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      border: 1px solid #d9d9d9;
      backdrop-filter: blur(3px);
      position: absolute;
      top: 14.91rem;
      left: 50%;
      transform: translate(-50%, 0);
      padding: 0.3rem 0.13rem;
      h1 {
        font-size: 0.28rem;
        font-family: MicrosoftYaHei;
        font-weight: bold;
        color: #ffffff;
        line-height: 0.37rem;
        letter-spacing: 4px;
        text-align: center;
        margin-bottom: 0.2rem;
      }
      .mt20 {
        margin-top: 0.2rem;
      }
      p {
        font-size: 0.24rem;
        font-family: MicrosoftYaHei;
        color: #ffffff;
        line-height: 0.36rem;
        a {
          color: rgba(255, 197, 111, 1);
          text-decoration: underline;
        }
      }
    }
    // @media screen and (max-height: 635px) {
    //   height: calc(100vh + 1.68rem);
    // }
  }
  .v1-activity-pc {
    display: none;
  }
}
</style>
