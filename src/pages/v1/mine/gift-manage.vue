<template>
  <div>
    <div class="manage-section" v-show="isShow">
      <div class="mode-mobile">
        <m-header title="赠与管理" />
      </div>
      <div class="body-head">
        <div class="m-tab">
          <div
            class="bar"
            @click="onTabChange(item)"
            :class="{ selected: gaveListParams.typeData == item.typeData }"
            v-for="item in tabs"
            :key="item.typeData"
          >
            {{ item.name }}
            <span class="line"></span>
          </div>
        </div>
      </div>
      <status-template
        :list="giveList.records"
        api="/goods/api/treasureGive/list"
        :init="getGiveList"
        class="ui-gift-manage-wrap"
      >
        <div>
          <div class="pc-wrap">
            <div
              class="goods-bar"
              v-for="item in giveList.records"
              :key="item.id"
            >
              <div class="head">
                <div class="main">
                  <div class="time" v-if="item.typeData == 2">
                    {{ item.statusTime }}
                  </div>
                  <div class="time" v-if="item.typeData == 1">
                    {{ item.giveTime }}
                  </div>
                  <div class="j-pc-show">单号：{{ item.orderNo }}</div>
                  <div class="j-phone-show phone-status">
                    <div class="status" v-if="item.typeData == 1">我的赠与</div>
                    <div class="status" v-if="item.typeData == 2">收到赠与</div>
                  </div>
                </div>
              </div>
              <div class="list">
                <div class="block border-top flex-start">
                  <div class="goods-info-wrap">
                    <div class="cover">
                      <preview-img
                        v-if="item.commodity"
                        class="cover-wrap"
                        :cover="
                          (item.commodity && item.commodity.cover) || item.cover
                        "
                        :picture="
                          (item.commodity && item.commodity.actualPicture) ||
                          item.actualPicture
                        "
                        :info="item"
                        :isShowPreview="false"
                      ></preview-img>
                    </div>

                    <div class="info">
                      <div class="title hidden-1">
                        {{ item.commodity.name }}
                      </div>
                      <!--      <commodity-num :treasure="item"></commodity-num> -->
                      <div class="j-phone-show phone-no">
                        单号：{{ item.orderNo }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="right border-top">
                  <div class="block">
                    <div class="j-pc-show">
                      <div class="status" v-if="item.typeData == 1">
                        我的赠与
                      </div>
                      <div class="status" v-if="item.typeData == 2">
                        收到赠与
                      </div>
                    </div>
                  </div>
                  <div class="block">
                    <div class="name" v-if="item.amountTimeOut">
                      超时<!-- ：x{{ item.amountTimeOut }} -->
                    </div>
                    <div class="name" v-if="item.amountGiveLock">
                      待接收<!-- ：x{{ item.amountGiveLock }} -->
                    </div>
                    <div class="name" v-if="item.amountGive">
                      已接收x{{ item.amountGive }}
                    </div>
                    <div class="name" v-if="item.amountGiveReturn">
                      退回<!-- ：x{{ item.amountGiveReturn }} -->
                    </div>
                  </div>
                </div>
                <div class="block btns">
                  <div class="main">
                    <div
                      class="ui-btn ui-btn-default"
                      @click="showDetail(item)"
                    >
                      赠与详情
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="v1-pagination">
            <g-paging
              :pageChange="handleCurrentChange"
              :list="giveList.records"
              :pageSize="gaveListParams.pageSize"
              :current-page="giveList.current"
            />
          </div>
        </div>
      </status-template>
    </div>
    <div class="manage-info-section">
      <gift-detail ref="GiftDetailRef"></gift-detail>
    </div>
  </div>
</template>
<script>
import mHeader from "@/components/v1/layout/mobileHeader";
import GiftDetail from "./gift-detail.vue";
export default {
  components: { mHeader, GiftDetail },
  data() {
    return {
      isShow: true,
      giveList: {
        records: [],
      },
      tabs: [
        {
          typeData: "",
          name: "全部",
        },
        {
          typeData: 1,
          name: "我的赠与",
        },
        {
          typeData: 2,
          name: "收到赠与",
        },
      ],
      /*      statusState: [
        {
          key: 1,
          name: "进行中",
        },
        {
          key: 2,
          name: "已结束",
        },
      ], */
      gaveListParams: {
        pageCount: 1,
        pageSize: 12,
        statusState: "", //状态 1进行中 2已结束
        typeData: "", //数据类型 1赠与 2收到
        typeGive: "", //赠与类型 1定向 2分享
      },
    };
  },
  created() {
    this.getGiveList();
  },
  computed: {
    userAttrResult() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    showDetail(info) {
      this.$refs.GiftDetailRef.init(info);
      this.isShow = false;
    },
    onTabChange(item) {
      this.gaveListParams.typeData = item.typeData;
      this.getGiveList();
    },
    onStatusStateChange() {
      this.handleCurrentChange(1);
    },
    handleCurrentChange(val) {
      this.gaveListParams.pageCount = val;
      this.getGiveList();
    },
    async getGiveList() {
      //我的赠与
      const res = await this.$api.service.treasureGive_list(
        this.gaveListParams
      );
      if (res.data.code == 200) {
        this.giveList = res.data.data;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.j-phone-show {
  display: none;
}
.m-tab {
  display: flex;
  margin-left: -16px;
  .bar {
    padding: 0 16px;
    cursor: pointer;
    color: #b1b1b1;

    margin-bottom: 8px;
    position: relative;
    top: 0;
    left: 0;
    .line {
      display: inline-block;
      width: 1px;
      height: 13px;
      background-color: #e5e5e5;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0;
    }
    &.bar:last-child {
      .line {
        display: none;
      }
    }
  }
  .selected {
    color: #333;
  }
}
.body-head {
  display: flex;
  padding: 0;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 33px;
  @media screen and (min-width: 0px) and (max-width: 540px) {
    padding: 70px 0 10px;
    background-color: #fff;
    border-bottom: none;
    display: block;
    .el-select {
      margin-left: 15px;
    }
  }
}
.v1-goods {
  .name {
    margin-bottom: 4px;
  }
  .time {
    color: rgba(0, 0, 0, 0.4);
  }
}
.v1-pagination {
  padding-bottom: 100px;
}
.ui-gift-manage-wrap {
  ::v-deep .section {
    background-color: transparent;
    padding-top: 15vh;
    @media screen and (min-width: 0px) and (max-width: 540px) {
      padding-top: 32vh;
    }
  }
}
.goods-bar {
  background-color: #fff;
  border: 1px solid #e5e5e5;
  margin-bottom: 17px;
  .head {
    padding: 0 15px;
    background: #f4f4f4;
    .time {
      padding-right: 30px;
    }
    .main {
      display: flex;
      align-items: center;
      height: 48px;

      font-size: 12px;
      color: #999999;
    }
  }
  .list {
    display: flex;
    .right {
      display: flex;
      flex: 2;
    }

    .block {
      flex: 1;
      border-right: 1px solid #e5e5e5;
      padding: 20px 23px;
      display: flex;
      align-items: center;
      justify-content: center;
      .status {
        color: #999999;
        font-size: 12px;
      }
      .name {
        font-size: 12px;
        color: #4d4d4d;
      }
    }
    .flex-start {
      justify-content: flex-start;
    }
    .block:last-child {
    }
    .goods-info-wrap {
      display: flex;
      .cover {
        width: 70px;
        height: 70px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
      .info {
        flex: 1;
        padding-left: 16px;
        overflow: hidden;
      }

      .title {
        font-size: 14px;
        color: #4d4d4d;
        margin-bottom: 4px;
      }
    }
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .j-pc-show {
    display: none !important;
  }
  .phone-no {
    font-size: 12px;
    color: #999999;
  }
  .j-phone-show {
    display: block;
  }
  .phone-status {
  }
  .m-tab {
    display: flex;
    justify-content: space-around;
    margin-left: 0;
    .bar {
      padding: 0 16px;
      margin-bottom: 8px;
      position: relative;
      top: 0;
      left: 0;
      .line {
        display: none;
      }
      &.bar:last-child {
        .line {
          display: none;
        }
      }
    }
    .selected {
      color: #333;
    }
  }
  .goods-bar {
    border: none;
    margin-bottom: 17px;
    .head {
      background-color: transparent;
      .time {
        padding-right: 0;
      }
      .main {
        justify-content: space-between;

        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
    }
    .list {
      flex-wrap: wrap;
      align-items: center;

      .block {
        flex: 1;
        padding: 0.2rem 0.3rem 0.1rem;
        border: none;
        display: block;
        .status {
          color: #999999;
          font-size: 12px;
        }
        .name {
          font-size: 12px;
        }
      }

      .btns {
        width: 100%;
        padding-top: 0;
        padding-bottom: 0.3rem;
        .main {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          padding-top: 0.32rem;
        }
      }
      .right {
        display: block;
        flex: inherit;
        padding-top: 0;
        padding-right: 15px;
        .block {
          padding: 0;
          font-size: 12px;
          font-weight: 400;
          color: #999999;
          flex: inherit;
          text-align: right;
          display: block;
        }
        .status {
          margin-bottom: 6px;
        }
        .name {
          color: #999999;
        }
      }
      .goods-info-wrap {
        display: flex;
        .cover {
          width: 70px;
          height: 70px;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }
        .info {
          flex: 1;
          padding-left: 8px;
        }

        .title {
          margin-top: 0.1rem;
          font-size: 14px;
          color: #4d4d4d;
          margin-bottom: 6px;
        }
      }
    }
  }
}
</style>
