<template>
  <div class="volume-wrap">
    <m-head :title="`总量记录详情`" />
    <div class="volume-head">
      <div class="cont">
        <div
          class="img"
          :style="`background-image:url(${
            goods.cover || goods.commodity.cover
          })`"
        ></div>
        <div class="info" v-if="isblock">
          <div class="name">{{ goods.commodity.name }}</div>
          <div class="num">
            市场流通量： <span>{{ marketVolume.commodityTotal }}</span>
          </div>
        </div>
        <div class="info" v-else>
          <div class="name">{{ goods.commodityName }}</div>
          <div class="num">
            商品编号：<span>{{ goods.commodityNumber }}</span
            >/<span>{{ goods.maxNumber }}</span>
          </div>
          <div class="num">
            认证标识：<span v-if="!goods.commodity.nftId">上链确认中</span>
            <div v-else class="copydiv">
              <copy :txt="goods.commodity.nftId" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="volume-cont">
      <div class="th">
        <div>时间</div>
        <div class="center">总量记录</div>
      </div>
      <div class="tbody">
        <div
          class="tr"
          v-for="(item, index) in goods.searchCommodityTotalDetail"
          :key="index"
        >
          <div>{{ item.onDate }}</div>
          <div class="center" v-if="item.commodityFlag == 1">
            新增+{{ item.addMinusNumber }}
          </div>
          <div class="center" v-else-if="item.commodityFlag == 2">
            冻结{{ item.addMinusNumber }}
          </div>
          <div class="center" v-else>销毁{{ item.addMinusNumber }}</div>
        </div>
        <div v-if="isblock" class="empty">暂无对应编号</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "volumeList",
  data() {
    return {
      goods: {
        commodity: {},
      },
      marketVolume: {},
    };
  },
  mounted() {
    this.goods = JSON.parse(decodeURIComponent(this.$route.query.item));
    this.getMarketVolume();
    this.isblock = this.$route.query.isblock;
  },
  methods: {
    async getMarketVolume() {
      const res = await this.$api.service.getMarketVolume({
        commodityUuid: this.goods.commodity.id,
      });
      if (res.data.code == 200) {
        this.marketVolume = res.data.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped="">
@import "~@/assets/1.0/scss/volume.scss";
.volume-wrap {
  @media screen and (min-width: 541px) {
    background: #fbfbfb;
    .volume-head {
      height: 388px;
      background-image: url("~@/assets/1.0/images/volume-bg.png");
      width: 100%;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .cont {
        display: flex;
        flex-direction: column;
        align-items: center;
        .img {
          width: 160px;
          height: 160px;
          border-radius: 4px;
          margin-bottom: 24px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .info {
          text-align: center;
          .name {
            font-size: 18px;
            font-weight: bold;
            color: #333333;
          }
          .num {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            margin-top: 8px;
            color: #999999;
            span {
              color: #4d4d4d;
            }
            .copydiv {
              color: #397fe7 !important;
            }
          }
        }
      }
    }
    .volume-cont {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #4d4d4d;
      font-size: 14px;
      background: #fbfbfb;
      width: 1040px;
      margin: 0 auto;
      .th,
      .tr {
        display: flex;
        height: 48px;
        line-height: 48px;
        justify-content: space-around;
        padding-left: 40px;
        width: 100%;
      }
      .th {
        margin-top: -24px;
        background: linear-gradient(180deg, #fdfdff 0%, #ffffff 100%);
        box-shadow: 0px 5px 24px 0px rgba(204, 204, 204, 0.44),
          inset 0px -5px 12px 0px #ffffff,
          inset 0px -2px 6px 0px rgba(255, 255, 255, 0.82);
        border-radius: 4px;
        backdrop-filter: blur(5.600000000000001px);
        div {
          width: 100px;
          text-align: left;
        }
        .set {
          flex: none;
          width: 103px;
        }
      }
      .tbody {
        background-color: #ffffff;
        margin-top: 20px;
        max-height: 500px;
        min-height: 250px;
        overflow: auto;
        margin-bottom: 100px;
        width: 100%;
        .tr {
          div {
            width: 100px;
            text-align: left;
          }
          .set {
            flex: none;
            width: 103px;
            color: #397fe7;
            cursor: pointer;
          }
        }
      }
    }
  }
  @media screen and (max-width: 540px) {
    background: #fafafa;
    .volume-head {
      padding: 0.32rem;
      margin-top: 0.16rem;
      background: #ffffff;
      box-shadow: 0rem 0.04rem 0.12rem 0rem rgba(229, 229, 229, 0.4);
      .cont {
        display: flex;
        .img {
          width: 1.52rem;
          height: 1.52rem;
          border-radius: 0.04rem;
          margin-right: 0.2rem;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .info {
          .name {
            font-size: 0.28rem;
            font-weight: 400;
            color: #4d4d4d;
            margin-bottom: 0.18rem;
            margin-top: 0.06rem;
          }
          .num {
            display: flex;
            align-items: center;
            font-size: 0.24rem;
            color: #999999;
            .copydiv {
              color: #397fe7 !important;
            }
          }
        }
      }
    }
    .volume-cont {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #4d4d4d;
      font-size: 0.24rem;
      background: #ffffff;
      margin-top: 0.16rem;
      .th,
      .tr {
        width: 100%;
        display: flex;
        justify-content: space-around;
        height: 0.76rem;
        line-height: 0.76rem;
        padding-left: 0.4rem;
      }
      .th {
        color: #999999;
        box-shadow: 0rem 0.04rem 0.12rem 0rem rgba(229, 229, 229, 0.4);
        div {
          width: 1.4rem;
          text-align: left;
        }
        .set {
          flex: none;
          width: 1.08rem;
        }
      }
      .tbody {
        width: 100%;
        overflow: auto;
        .tr {
          border-bottom: 1px solid #e5e5e5;
          div {
            width: 1.4rem;
            text-align: left;
          }
          .set {
            flex: none;
            width: 1.08rem;
            color: #397fe7;
            cursor: pointer;
          }
        }
      }
    }
  }
  .center {
    text-align: center !important;
  }
}
</style>
