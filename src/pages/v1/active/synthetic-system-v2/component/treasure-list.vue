<template>
  <div class="" v-if="isShow">
    <!--       <status-template
      :list="listData && listData.length"
      api="/goods/api/treasureSku/queryTreasureByCategory"
      :init="getList"
    ></status-template>  -->
    <div class="dialog-content-wrap">
      <div class="mask"></div>

      <div
        class="dialog-content grayscale compose-page synthesis-content-bg-img synthesis-dialog-content-bgcolor"
      >
        <div class="ui-icon icon-close hand" @click="onClose"></div>
        <div v-if="isLoading" class="loading-wrap">
          <loading />
        </div>
        <div v-else-if="listData.length > 0">
          <div class="treasure-list-wrap">
            <div class="t-title">您持有可用于合成的藏品</div>
            <div class="list-content g-padding">
              <div
                class="treasure-bar"
                :class="{ selected: item.selected }"
                @click="onShowSku(item, idx)"
                v-for="(item, idx) in listData"
                :key="idx"
              >
                <div class="treasure-bar-content synthesis-select-border-color">
                  <div
                    class="icon-selected synthesis-select-icon iconfont icon-icon_xuanzhong synthesis-select-icon-color"
                  ></div>
                  <div
                    class="img-view"
                    v-lazy:background-image="item.cover"
                    :key="idx"
                  ></div>
                  <div class="info">
                    <div class="name hidden-1">{{ item.name }}</div>
                    <div class="name">拥有数量：{{ item.amountCurrent }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="v1-pagination">
            <g-paging
              :pageChange="handleCurrentChange"
              :list="listDataInfo.records"
              :pageSize="listParams.pageSize"
              :current-page="listDataInfo.current"
            />
          </div>
          <div class="select-wrap">
            <div class="s-title">
              您已选择的藏品
              <small v-if="typeNumber">（概率{{ sumProbability }}%）</small>
              <small v-else
                >{{ selectedSkuList.length }}/{{ needAmount }}</small
              >
              ：
            </div>
            <div class="list g-padding" v-if="selectedSkuList.length > 0">
              <div
                class="select-bar"
                v-for="(item, idx) in selectedSkuList"
                :key="idx"
              >
                <div class="bar-content" @click="onRemoveSelected(item, idx)">
                  <div class="name hidden-1">
                    {{ item.commoditySku.name }}
                  </div>
                  <div class="number">
                    {{ $numFormat.getNumStr(item) }}
                  </div>
                  <div class="ui-icon icon-bar-close"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="ui-btn-group g-padding">
            <div>
              <div
                class="buy-btn synthesis-number-btn-border-color synthesis-number-btn-font-color"
                @click="goMarket"
              >
                去购买
              </div>
            </div>
            <div>
              <div
                class="compose-btn synthesis-number-btn-bgcolor synthesis-number-btn-color"
                @click="onSubmit"
              >
                去合成
              </div>
            </div>
          </div>
        </div>
        <div v-else style="padding-top: 40px">
          <empty class="custom-empty"> </empty>
          <div
            class="buy-btn empty-buy-btn synthesis-number-btn-border-color synthesis-number-btn-font-color"
            @click="goMarket"
          >
            去购买
          </div>
        </div>
      </div>
    </div>

    <treasure-sku-list
      ref="TreasureSkuListRef"
      @listen="listenUserSelectedSku"
      :userSelectedRule="userSelectedRule"
      :needAmount="needAmount"
      :probability="probability"
      :haveProbability="haveProbability"
    ></treasure-sku-list>
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import Loading from "@/components/v1/loading/loading";
import TreasureSkuList from "./treasure-sku-list";
export default {
  name: "treasure-list",
  components: { TreasureSkuList, empty, Loading },
  data() {
    return {
      pList: [],
      isShow: false,
      isLoading: true,
      listDataInfo: {},
      userSelectedRule: {},
      needAmount: 0,

      listData: [],
      selectedIdx: -1,
      selectedSkuList: [],
      listParams: {
        synthesisDetailId: "",
        pageCount: 1,
        pageSize: 20,
      },
    };
  },
  props: {
    isApp: {
      type: Boolean,
      default: false,
    },
    groupProbability: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  async created() {},
  computed: {
    sumProbability() {
      let probability = this.haveProbability;
      this.selectedSkuList.forEach((item) => {
        probability += item.probability || 0;
      });
      return probability;
    },
    probability() {
      //单个商品概率
      let probability = 0;
      if (this.synthesisDetail && this.synthesisDetail.probability) {
        probability = this.synthesisDetail.probability;
      }
      return probability;
    },
    haveProbability() {
      let num = 0;
      /*      for (let key in this.groupProbability) {
        if (this.synthesisDetailId && key != this.synthesisDetailId) {
          num += this.groupProbability[key];
        }
      } */
      return num;
    },
  },
  watch: {
    selectedSkuList(val) {
      this.checkSelectStatus(val);
    },
  },
  methods: {
    checkSelectStatus(selectedSkuList) {
      const findSelected = (commodityId) => {
        for (let i = 0; i < selectedSkuList.length; i++) {
          if (
            selectedSkuList[i].commoditySku &&
            selectedSkuList[i].commoditySku.commodityId == commodityId
          ) {
            return true;
          }
        }
        return false;
      };

      this.listData = this.listData.map((item) => {
        item.selected = findSelected(item.id);
        return item;
      });
    },
    async init(synthesisDetail, threshold, amount) {
      this.isShow = true;
      this.isLoading = true;
      this.needAmount = amount;
      this.synthesisDetailId = synthesisDetail.id;
      this.threshold = threshold;

      this.synthesisDetail = synthesisDetail;
      /*      if (info && info.uuid) {
      } else {
        this.$message.warning("缺少入参");
        return;
      } */
      this.selectedIdx = -1;
      this.listData = [];
      this.listParams = {
        synthesisDetailId: this.synthesisDetailId,
        pageCount: 1,
        pageSize: 20,
      };
      await this.getList();

      this.selectedSkuList = threshold.userSelect
        ? JSON.parse(JSON.stringify(threshold.userSelect))
        : [];

      /*   this.userSelectedRule = info; */
    },
    goMarket() {
      if (this.isApp) {
        //app内
        this.onClose();
        this.$confirm(`App请前往市场进行购买.`, "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning",
          center: true,
          customClass: "confirm-center",
        }).then(async () => {});
        return;
      }
      window.location.href = "/market?type=copyright";
    },
    onRemoveSelected(info) {
      const list = JSON.parse(JSON.stringify(this.selectedSkuList));

      const idx = list.findIndex((item) => item.id == info.id);
      list.splice(idx, 1);
      this.selectedSkuList = list;
    },
    handleCurrentChange(val) {
      this.listParams.pageCount = val;
      this.getList();
    },
    listenUserSelectedSku(commodity, selectSkuArr, $obj) {
      const commodityId = commodity.id;
      //移除该分类的内容
      this.selectedSkuList = this.selectedSkuList.filter(
        (item) => item.commoditySku.commodityId != commodityId
      );
      const newList = this.$common.uniqueAry(
        [...this.selectedSkuList, ...selectSkuArr],
        "id"
      );
      if (newList.length > this.needAmount && !this.typeNumber) {
        this.$message.warning(
          `您已选择的藏品数量超出合成所需${newList.length - this.needAmount}个`
        );
      } else if (
        this.typeNumber &&
        this.sumProbability + this.probability > 100
      ) {
        if (this.sumProbability == 100) {
          this.$message.warning("您的合成概率已经达到100%，无须再添加。");
        } else {
          this.$message.warning(`${commodity.name}已达最大数量，无法再添加。`);
        }
      } else {
        this.selectedSkuList = newList;
        $obj.isShow = false;
      }
    },
    onClose() {
      this.isShow = false;
    },
    async getList() {
      this.isLoading = true;
      const res = await this.$api.service.treasureSku_queryTreasureByDetail(
        this.listParams
      );
      this.isLoading = false;

      if (res.data.code == 200) {
        this.listDataInfo = res.data.data;
        if (res.data.data.records.length > 0) {
          let probability = 0;
          if (this.synthesisDetail && this.synthesisDetail.probability) {
            probability = this.synthesisDetail.probability;
          }

          this.listData = res.data.data.records.map((item) => {
            item.selected = false;
            item.probability = probability;
            return item;
          });
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    onShowSku(info, idx) {
      if (this.needAmount == this.selectedSkuList.length && !this.typeNumber) {
        this.$message.warning("您已选择足够的藏品数量，请点击合成");
      } else if (
        this.typeNumber &&
        this.sumProbability + this.probability > 100
      ) {
        if (this.sumProbability == 100) {
          this.$message.warning("您的合成概率已经达到100%，无须再添加。");
        } else {
          this.$message.warning(
            `${
              info.commodity.name || info.commoditySku.name
            }已达最大数量，无法再添加。`
          );
        }
      } else {
        this.selectedIdx = idx;
        this.$refs.TreasureSkuListRef.init(
          info,
          this.selectedSkuList,
          this.threshold
        );
      }
    },
    onSubmit() {
      if (this.selectedSkuList.length > 0) {
        this.$emit("listen", {
          selectedSkuList: this.selectedSkuList.map((item, idx) => {
            if (!item.synthesisDetailId) {
              item.synthesisDetailId = this.synthesisDetailId;
            }
            return item;
          }),
          synthesisDetailId: this.synthesisDetailId,
        });
        this.isShow = false;
      } else {
        this.$message.warning("请先选择材料");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-empty {
}
.icon-selected {
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.g-padding {
  padding: 0 80px;
}
.empty-buy-btn {
  max-width: 460px;
  margin: 0 auto;
}
.ui-btn-group {
  justify-content: space-between;
  margin: 42px -40px 0;

  > div {
    padding: 0 40px;
    flex: 1;
  }
}
.loading-wrap {
  min-height: 30vh;
  padding-top: 15vh;
}
.buy-btn {
  width: 100%;
  line-height: 50px;
  border-radius: 25px;
  border: 1px solid;
  font-size: 14px;
  font-weight: 400;

  text-align: center;
}
.compose-btn {
  width: 100%;
  max-width: 500px;
  line-height: 50px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 400;
  text-align: center;

  cursor: pointer;
  user-select: none;
}
.dialog-content-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999999;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
  }
  .dialog-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    /*     background: #e5e3e3; */
    border-radius: 10px;
    width: 100%;
    max-width: 1100px;
    padding: 40px 30px 48px;
    .icon-close {
      background-image: url("//static.theone.art/pc/compose/icon-close.png");
      position: absolute;
      top: 22px;
      right: 28px;
      width: 40px;
      height: 40px;
    }

    .select-wrap {
      .s-title {
        font-size: 14px;
        font-weight: 600;
        color: #333333;
        margin-bottom: 6px;
        text-align: left;
        small {
          font-weight: normal;
          font-size: 12px;
        }
      }
      .list {
        display: flex;
        flex-wrap: wrap;
        margin: 0 -16px;
        max-height: 100px;
        overflow-y: auto;
        .select-bar {
          width: 33.33%;
          padding: 9px 16px;
          .bar-content {
            display: flex;
            align-items: center;
            overflow: hidden;
            border-radius: 100px;
            padding: 5px 13px 6px;
            background: #ffffff;
            cursor: pointer;

            .name {
              font-size: 12px;
              font-weight: 400;
              color: #333333;
              flex: 1;
            }
            .number {
              font-size: 12px;
              font-weight: 400;
              color: #333333;
            }
            .icon-bar-close {
              width: 19px;
              height: 19px;
              background-image: url("//static.theone.art/pc/compose/icon-close.png");
            }
          }
        }
      }
    }
    .treasure-list-wrap {
      margin: 0 -8px;
      .t-title {
        text-align: left;
        padding: 8px 8px 50px;
        font-size: 14px;
        font-weight: 600;
        color: #333333;
      }
      .list-content {
        display: flex;
        flex-wrap: wrap;
        max-height: 50vh;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .treasure-bar {
        width: 25%;
        padding: 8px;

        .treasure-bar-content {
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          top: 0;
          left: 0;
          .icon-selected {
            display: none;
            position: absolute;
            bottom: 0;
            right: 0;
            font-size: 26px;
          }
          .img-view {
            width: 100%;
            padding-bottom: 100%;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
          .info {
            font-size: 12px;
            font-weight: 600;
            color: #453524;
            padding: 20px 8px;
            .name {
              margin-bottom: 6px;
            }
          }
        }
        &.selected {
          .treasure-bar-content {
            border: 1px solid;
            .icon-selected {
              display: inline-block;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 540px) {
  .g-padding {
    padding: 0;
  }
  .v1-pagination {
    padding: 0.3rem 0 0.3rem;
  }
  .ui-btn-group {
    margin: 0.42rem -0.2rem 0;

    > div {
      padding: 0 0.2rem;
      flex: 1;
    }
  }
  .buy-btn {
    line-height: 0.88rem;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
  }
  .compose-btn {
    width: 100%;
    max-width: 500px;
    line-height: 0.88rem;

    border-radius: 100px;
    font-size: 14px;
    font-weight: 400;

    text-align: center;

    cursor: pointer;
    user-select: none;
  }
  .dialog-content-wrap {
    padding: 0 15px;
    .mask {
    }
    .dialog-content {
      width: 95%;
      padding: 0.6rem 0.3rem;
      .icon-close {
      }

      .select-wrap {
        .s-title {
        }
        .list {
          height: 15vh;
          margin: 0 -0.06rem;
          .select-bar {
            width: 100%;
            padding: 0.06rem;
            overflow: hidden;
            .bar-content {
              overflow: hidden;
              .name {
                text-align: left;
              }
              .number {
              }
              .icon-bar-close {
              }
            }
          }
        }
      }
      .treasure-list-wrap {
        margin: 0 -0.06rem;

        max-height: inherit;
        .t-title {
          padding: 8px;
        }
        .list-content {
        }
        .treasure-bar {
          width: 50%;
          padding: 0.06rem;
          .treasure-bar-content {
            .img-view {
            }
            .info {
              overflow: hidden;
              .name {
                text-align: left;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.compose-page .page-icon {
  background: #e5e3e3;
}
.compose-page {
}
</style>
