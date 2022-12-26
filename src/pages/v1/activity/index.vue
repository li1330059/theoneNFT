<template>
  <div class="page-activity-index">
    <div class="v1-activity-pc">
      <div class="v1-activity-main">
        <div class="v1-activity-left">
          <div class="v1-activity-img"></div>
          <div class="v1-activity-logo"></div>
          <div class="v1-activity-divider"></div>
          <div class="v1-activity-info">
            <p>艺术收藏家</p>
            <p>属你最牛</p>
          </div>
        </div>
        <div class="v1-activity-right">
          <div class="v1-activity-tips">
            <p>30万奖金池等你来瓜分</p>
          </div>
          <div class="v1-activity-list">
            <p>排行榜</p>
            <div class="v1-activity-list-divider"></div>
            <div class="loading"
                 v-if="loading">
              <loading></loading>
            </div>
            <empty v-else-if="!loading && empty"></empty>
            <ul v-else>
              <li v-for="(item, index) in listResults"
                  :key="index">
                <div>{{ index + 1 }}</div>
                <div :class="`avatar-class1`"
                     :style="`background-image:url(${item.avatar})`">
                  <div v-if="index == 0"
                       class="first"></div>
                  <div v-if="index == 1"
                       class="second"></div>
                  <div v-if="index == 2"
                       class="third"></div>
                </div>
                <!-- <div>{{ $common.formatAddressByLengthRange(item.phone,4,2) }}</div> -->
                <div>{{ item.phone }}</div>
                <div>
                  <span></span>
                  <span>{{ $common.formatMoney(item.price) }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="v1-activity-phone">
      <div class="v1-activity-img-left">
        <div class="v1-activity-img-left-crown"></div>
        <div class="v1-activity-img-left-avatars"></div>
      </div>
      <div class="v1-activity-img-center">
        <div class="v1-activity-img-center-crown"></div>
        <div class="v1-activity-img-center-avatars"></div>
      </div>
      <div class="v1-activity-img-right">
        <div class="v1-activity-img-right-crown"></div>
        <div class="v1-activity-img-right-avatars"></div>
      </div>
      <div class="v1-activity-logo-info">
        <div class="logo"></div>
        <div class="divider"></div>
        <div class="info">
          <p>艺术收藏家</p>
          <p>属你最牛</p>
        </div>
      </div>
      <div class="v1-activity-tips">
        <p>30万奖金池等你来瓜分</p>
      </div>
      <div class="v1-activity-list">
        <p>排行榜</p>
        <div class="v1-activity-list-divider"></div>
        <div class="loading"
             v-if="loading">
          <loading></loading>
        </div>
        <empty v-else-if="!loading && empty"></empty>
        <ul v-else>
          <li v-for="(item, index) in listResults"
              :key="index">
            <div>{{ index + 1 }}</div>
            <div :class="`avatar-class1`"
                 :style="`background-image:url(${item.avatar})`">
              <div v-if="index == 0"
                   class="first"></div>
              <div v-if="index == 1"
                   class="second"></div>
              <div v-if="index == 2"
                   class="third"></div>
            </div>
            <div>{{ item.phone }}</div>
            <div>
              <span></span>
              <span>{{ $common.formatMoney(item.price) }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- phone -->
    <!-- <div class="v1-activity-phone">
            <div class="v1-activity-main">
                <div class="v1-activity-left">
                    <div class="v1-activity-img"></div>
                    <div class="v1-activity-logo"></div>
                    <div class="v1-activity-divider"></div>
                    <div class="v1-activity-info">
                        <p>艺术收藏家</p>
                        <p>属你最牛</p>
                    </div>
                </div>
                <div class="v1-activity-right">
                    <div class="v1-activity-tips">
                        <p>30万奖金池等你来瓜分</p>
                    </div>
                    <div class="v1-activity-list">
                        <p>排行榜</p>
                        <div class="v1-activity-list-divider"></div>
                        <div class="loading" v-if="loading">
                            <loading></loading>
                        </div>
                        <empty v-else-if="!loading && empty"></empty>
                        <ul v-else>
                            <li
                                v-for="(item,index) in listResults"
                                :key="index">
                                <div>{{index+1}}</div>
                                <div>
                                    <div v-if="index == 0" class="first"></div>
                                    <div v-if="index == 1" class="second"></div>
                                    <div v-if="index == 2" class="third"></div>
                                </div>
                                <div>{{item.phone}}</div>
                                <div>
                                    <span>￥</span>
                                    <span>{{$common.formatMoneyWithOutPrefix(item.price)}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div> -->
  </div>
</template>
<script>
// import empty from "@/components/empty";
// import loading from "@/components/loading/loading";

import empty from "@/components/v1/empty.vue";
import loading from "@/components/v1/loading/loading.vue";

export default {
  components: { empty, loading },
  data () {
    return {
      loading: false,
      empty: true,
      listResults: [],
    };
  },
  mounted () {
    this.getActivityList();
  },
  methods: {
    async getActivityList () {
      this.loading = true;
      let result = await this.$api.service.orderBuy_statisticsPrice();
      this.listResults = result.data.data;
      if (this.listResults.length == 0) {
        this.empty = true;
      } else {
        this.empty = false;
      }
      this.loading = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.v1-activity-pc {
  width: 100%;
  height: 100vh;
  background: url("//static.theone.art/pc/images/activity_bg.png")
    no-repeat center center;
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
      text-align: center;
      .v1-activity-img {
        width: 393px;
        height: 236px;
        background: url("//static.theone.art/pc/images/activity_img.png")
          no-repeat center center;
        background-size: cover;
        margin-top: 50%;
      }
      .v1-activity-logo {
        width: 279px;
        height: 30px;
        background: url("//static.theone.art/pc/images/activity_logo.png")
          no-repeat center center;
        margin: 38px auto;
      }
      .v1-activity-divider {
        width: 221px;
        height: 4px;
        background: #e7141b;
        margin: 0px auto;
      }
      .v1-activity-info {
        color: #ffffff;
        line-height: 55px;
        letter-spacing: 5px;
        font-size: 42px;
        font-weight: bold;
        text-align: center;
        margin-top: 16px;
      }
    }
    .v1-activity-right {
      text-align: center;
      position: absolute;
      top: 100px;
      right: 0px;
      bottom: 200px;
      display: flex;
      flex-direction: column;
      .v1-activity-tips {
        font-size: 18px;
        font-weight: bold;
        color: #ffffff;
        line-height: 24px;
        letter-spacing: 2px;
      }
      .v1-activity-list {
        overflow: auto;
        margin-top: 0.2rem;
        background: #ffffff;
        border-radius: 15px;
        text-align: center;
        flex: 1;
        p {
          font-size: 21px;
          font-weight: 600;
          color: #333333;
          line-height: 29px;
          letter-spacing: 7px;
          margin: 18px 0px;
        }
        .v1-activity-list-divider {
          width: 438px;
          height: 1px;
          border: 2px solid #979797;
          margin: 0px auto;
        }
        ul {
          display: flex;
          flex-direction: column;
          li:nth-child(1),
          li:nth-child(2),
          li:nth-child(3) {
            div:nth-child(1) {
              font-size: 18px;
            }
            div:nth-child(2) {
              width: 56px;
              height: 56px;
              margin-left: 18px;
              position: relative;
            }
            div:nth-child(3) {
              font-size: 18px;
            }
            div:nth-child(4) {
              margin-left: 60px;
              span:nth-child(1) {
                font-size: 21px;
              }
              span:nth-child(2) {
                font-size: 18px;
              }
            }
          }
          li:nth-child(1) {
            div:nth-child(2) {
              background: url("~@/assets/img/avatars/avatar5.png") no-repeat
                center center;
              background-size: cover;
            }
          }
          li:nth-child(2) {
            div:nth-child(2) {
              background: url("~@/assets/img/avatars/avatar9.png") no-repeat
                center center;
              background-size: cover;
            }
          }
          li:nth-child(3) {
            div:nth-child(2) {
              background: url("~@/assets/img/avatars/avatar3.png") no-repeat
                center center;
              background-size: cover;
            }
          }
          li {
            height: 79px;
            margin: 0px 25px 0px 24px;
            border-bottom: 1px solid #dddddd;
            display: flex;
            align-items: center;
            .first {
              width: 47px !important;
              height: 39px;
              background: url("//static.theone.art/pc/images/activity_img_list_first_crown.png")
                no-repeat center center;
              background-size: cover;
              position: absolute;
              top: -18px;
              right: -12px;
            }
            .second {
              width: 35px !important;
              height: 30px;
              background: url("~@/assets/img/activity_img_list_second_crown.png")
                no-repeat center center;
              background-size: cover;
              position: absolute;
              top: -14px;
              right: -5px;
            }
            .third {
              width: 37px !important;
              height: 34px;
              background: url("//static.theone.art/pc/images/activity_img_list_third_crown.png")
                no-repeat center center;
              background-size: cover;
              position: absolute;
              top: -14px;
              right: -9px;
            }

            @for $i from 0 through 9 {
              .avatar-class#{$i} {
                background: url("~@/assets/img/avatars/avatar#{$i}.png")
                  no-repeat
                  center
                  center;
                border-radius: 50%;
              }
            }
            div:nth-child(1) {
              font-size: 18px;
              font-weight: bold;
              color: #333333;
              line-height: 24px;
              width: 30px;
              text-align: center;
            }
            div:nth-child(2) {
              width: 50px;
              height: 50px;
              // background: url('~@/assets/img/avatars/1.png') no-repeat center center;
              background-size: cover;
              margin-left: 24px;
            }
            div:nth-child(3) {
              font-size: 14px;
              color: #333333;
              line-height: 24px;
              padding-left: 40px;
              text-align: left;
              flex: 1;
            }
            div:nth-child(4) {
              // width: 113px;
              height: 35px;
              background: #ffe558;
              border-radius: 4px;
              align-items: center;
              text-align: center;
              display: flex;
              box-shadow: 3px 2px 0px 0px rgba(0, 0, 0, 0.2);
              span:nth-child(1) {
                color: #ee9e1c;
                margin-left: 16px;
                font-size: 16px;
              }
              span:nth-child(2) {
                font-size: 16px;
                font-weight: 600;
                color: #333333;
                margin-left: 4px;
                margin-right: 20px;
              }
            }
          }
        }
      }
    }
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
    background: url("//static.theone.art/pc/images/activity_bg.png")
      no-repeat 50% 0%;
    background-size: cover;
    position: fixed;
    top: 0rem;
    bottom: 1rem;
    .v1-activity-img-left {
      .v1-activity-img-left-crown {
        width: 0.75rem;
        height: 0.66rem;
        background: url("//static.theone.art/pc/images/activity_img_left_crown_small.png")
          no-repeat center center;
        background-size: cover;
        position: absolute;
        top: 2rem;
        left: 0.62rem;
        z-index: 3;
      }
      .v1-activity-img-left-avatars {
        width: 1rem;
        height: 1rem;
        background: url("//static.theone.art/pc/images/activity_img_left_avatars.png")
          no-repeat center center;
        background-size: cover;
        position: absolute;
        top: 2.29rem;
        left: 0.84rem;
        z-index: 1;
      }
    }
    .v1-activity-img-center {
      .v1-activity-img-center-crown {
        width: 1.13rem;
        height: 0.93rem;
        background: url("//static.theone.art/pc/images/activity_img_center_crown_small.png");
        background-size: cover;
        position: absolute;
        top: 1.39rem;
        left: 2.1rem;
        z-index: 3;
      }
      .v1-activity-img-center-avatars {
        width: 1.43rem;
        height: 1.43rem;
        background: url("//static.theone.art/pc/images/activity_img_center_avatars.png")
          no-repeat center center;
        background-size: cover;
        position: absolute;
        top: 1.85rem;
        left: 1.55rem;
        z-index: 2;
      }
    }
    .v1-activity-img-right {
      .v1-activity-img-right-crown {
        width: 0.78rem;
        height: 0.69rem;
        background: url("//static.theone.art/pc/images/activity_img_right_crown_small.png")
          no-repeat center center;
        background-size: cover;
        position: absolute;
        top: 1.9rem;
        left: 3.2rem;
        z-index: 2;
      }
      .v1-activity-img-right-avatars {
        width: 1.05rem;
        height: 1.05rem;
        background: url("//static.theone.art/pc/images/activity_img_right_avatars.png")
          no-repeat center center;
        background-size: cover;
        position: absolute;
        top: 2.21rem;
        left: 2.74rem;
        z-index: 1;
      }
    }
    .v1-activity-logo-info {
      width: 2.55rem;
      height: 2.04rem;
      background: #000000;
      position: absolute;
      top: 1.41rem;
      right: 0.4rem;
      display: flex;
      flex-direction: column;
      text-align: center;
      margin-left: 0.18rem;
      .logo {
        width: 1.94rem;
        height: 0.22rem;
        background: url("//static.theone.art/pc/images/activity_logo_small.png")
          no-repeat center center;
        background-size: cover;
        margin-top: 0.19rem;
        margin-left: 0.31rem;
      }
      .divider {
        width: 1.59rem;
        height: 0.02rem;
        background: #e7141b;
        border-radius: 0.01rem;
        margin: 0.16rem 0.48rem;
      }
      .info {
        font-size: 21px;
        font-weight: 800;
        color: #ffffff;
      }
    }
    .v1-activity-tips {
      margin-top: 0.48rem;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      position: absolute;
      top: 3.3rem;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .v1-activity-list {
      overflow: scroll;
      background: #ffffff;
      border-radius: 15px;
      text-align: center;
      position: absolute;
      top: 4.24rem;
      left: 5%;
      right: 5%;
      bottom: 0.5rem;
      p {
        font-size: 14px;
        font-weight: 600;
        color: #333333;
        line-height: 0.29rem;
        letter-spacing: 0.07rem;
        margin: 0.18rem 0rem;
      }
      .v1-activity-list-divider {
        width: 5.3rem;
        height: 1px;
        border: 2px solid #979797;
        margin: 0px auto;
      }
      ul {
        display: flex;
        flex-direction: column;
        li:nth-child(1),
        li:nth-child(2),
        li:nth-child(3) {
          div:nth-child(1) {
            font-size: 14px;
            font-weight: bold;
            color: #000000;
          }
          div:nth-child(2) {
            width: 0.76rem;
            height: 0.76rem;
            margin-left: 0.14rem;
          }
          div:nth-child(3) {
            font-size: 14px;
            color: #010100;
            flex: 1;
            text-align: center;
          }
          div:nth-child(4) {
            font-size: 14px;
            font-weight: 400;
            color: #413419;
          }
        }
        li:nth-child(1) {
          div:nth-child(2) {
            background: url("~@/assets/img/avatars/avatar5.png") no-repeat
              center center;
            background-size: cover;
          }
        }
        li:nth-child(2) {
          div:nth-child(2) {
            background: url("~@/assets/img/avatars/avatar9.png") no-repeat
              center center;
            background-size: cover;
          }
        }
        li:nth-child(3) {
          div:nth-child(2) {
            background: url("~@/assets/img/avatars/avatar3.png") no-repeat
              center center;
            background-size: cover;
          }
        }
        li {
          height: 1rem;
          padding: 0rem 0.52rem 0rem 0.28rem;
          border-bottom: 1px solid #dddddd;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .first {
            width: 0.47rem;
            height: 0.39rem;
            background: url("//static.theone.art/pc/images/activity_img_list_first_crown.png")
              no-repeat center center;
            background-size: cover;
            position: absolute;
            top: -0.18rem;
            right: -0.12rem;
          }
          .second {
            width: 0.35rem !important;
            height: 0.3rem;
            background: url("~@/assets/img/activity_img_list_second_crown.png")
              no-repeat center center;
            background-size: cover;
            position: absolute;
            top: -0.14rem;
            right: 0rem;
          }
          .third {
            width: 0.37rem !important;
            height: 0.34rem;
            background: url("//static.theone.art/pc/images/activity_img_list_third_crown.png")
              no-repeat center center;
            background-size: cover;
            position: absolute;
            top: -0.14rem;
            right: 0rem;
          }
          @for $i from 0 through 9 {
            .avatar-class#{$i} {
              background: url("~@/assets/img/avatars/avatar#{$i}.png")
                no-repeat
                center
                center;
              border-radius: 50%;
              background-size: cover;
              position: relative;
            }
          }
          div:nth-child(1) {
            width: 30px;
            font-size: 12px;
            color: #646464;
            line-height: 24px;
            text-align: center;
          }
          div:nth-child(2) {
            width: 0.58rem;
            height: 0.58rem;
            margin-left: 0.24rem;
          }
          div:nth-child(3) {
            font-size: 12px;
            color: #010100;
            flex: 1;
          }
          div:nth-child(4) {
            background: #ffe558;
            border-radius: 4px;
            align-items: center;
            text-align: center;
            display: flex;
            box-shadow: 3px 2px 0px 0px rgba(0, 0, 0, 0.2);
            padding: 0.05rem 0.1rem;
            span:nth-child(1) {
              color: #ee9e1c;
            }
            span:nth-child(2) {
              font-size: 12px;
              margin-left: 0.05rem;
              color: #413419;
            }
          }
        }
      }
    }
  }
  .v1-activity-pc {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.html-activity-index {
  body {
    overflow: hidden;
  }
  .page-footer {
    display: none;
  }
}
</style>
