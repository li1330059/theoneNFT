<template>
  <el-dialog
    class="theone-dialog page-login dialogContain dialog-border filter-mask"
    :visible.sync="isShow"
    append-to-body
    width="740px"
    :title="title"
  >
    <status-template
      :list="list"
      api="/om-goods/api/lottery/spin/treasureSkuList"
      :init="getList"
      :isError="false"
    >
      <div class="main">
        <div class="ui-message" v-if="message">{{ message }}</div>
        <div class="m-block" v-for="(item, idx) in list" :key="item.uuid">
          <section class="title-wrap">
            {{ item.name }}
            <span class="num"
              >{{ item.userSelectSku.length }}/{{ item.amount }}</span
            >
          </section>
          <section class="m-block-content scroll-bar">
            <div
              class="m-block-wrap"
              v-for="(goodsItem, idx2) in item.commodityInfoList"
              :key="idx2"
            >
              <section class="goods-list-wrap">
                <div
                  class="goods-wrap hand"
                  :class="{ 'goods-select': goodsItem.select }"
                  @click="goodsChnge(idx, idx2, goodsItem)"
                >
                  <div
                    class="cover bg-img"
                    :style="`background-image:url(${goodsItem.commodity.cover})`"
                  ></div>
                  <div class="info-wrap">
                    <div
                      class="name hidden-one"
                      :title="goodsItem.commodity.name"
                    >
                      {{ goodsItem.commodity.name }}
                    </div>
                    <div class="num">
                      拥有数量：<span>{{
                        goodsItem.treasureSkuList.length
                      }}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section class="list-wrap scroll-bar">
                <section
                  class="list-wrap-content"
                  v-if="goodsItem.treasureSkuList.length > 0"
                >
                  <div
                    class="list-box hand"
                    :class="{ 'sku-select': goodsSkuItem.select }"
                    v-for="(goodsSkuItem, skuIdx) in goodsItem.treasureSkuList"
                    :key="goodsSkuItem.uuid"
                    @click="skuHandle(idx, idx2, skuIdx, goodsSkuItem, item)"
                  >
                    <span class="ui-icon icon-select"></span
                    >{{ goodsNumber(goodsSkuItem)
                    }}{{
                      goodsSkuItem.amountNumber
                        ? `/${goodsSkuItem.amountNumber}`
                        : ""
                    }}
                  </div>
                </section>
                <section v-else style="padding-top: 15px">
                  <empty title="暂无符合条件的商品"></empty>
                </section>
              </section>
            </div>
          </section>
        </div>
        <section class="m-foot">
          <div class="btn btn-border" @click="isShow = false">取消</div>
          <div
            class="btn btn-bg"
            :class="{ disabled: disabled }"
            @click="submit"
          >
            {{ btnTxt }}
          </div>
        </section>
      </div></status-template
    >
  </el-dialog>
</template>
<script>
import empty from "./empty.vue";
export default {
  components: { empty },
  props: {
    activeId: {
      type: String,
      default: "",
    },
    activeObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      isShow: false,
      list: [],
      drawType: "",
      top: "15vh",
      btnDisable: false,
    };
  },
  computed: {
    title() {
      return this.activeObj.luckySpinType == "LOTTERY" ? "提示" : "请选择";
    },
    message() {
      return this.activeObj.luckySpinType == "LOTTERY"
        ? "符合消耗条件，且您持有可用于抽奖的藏品"
        : "";
    },
    disabled() {
      const isSelectOver = this.list.every((item) => {
        return item.userSelectSku.length >= item.amount;
      });
      return !isSelectOver;
    },
    btnTxt() {
      if (this.activeObj.luckySpinType == "CUSTOMIZATION") {
        return "去放飞";
      }
      return "去抽奖";
    },
  },

  created() {
    this.top = this.$common.isMobile() ? "4vh" : "100px";
  },
  methods: {
    goodsNumber(goodsSkuItem) {
      if (goodsSkuItem.amountNumber) {
        return goodsSkuItem.number ? goodsSkuItem.number : "-";
      } else {
        return `序号${goodsSkuItem.number ? goodsSkuItem.number : "-"}`;
      }
    },
    show(drawType, userSelectBlock) {
      this.btnDisable = false;
      this.isShow = true;
      this.drawType = drawType;
      this.consumeList = userSelectBlock.map((item) => {
        return {
          consumeUuid: item.uuid,
          commodityUuidList: item.treasureInfoList.map(
            (item) => item.commodityUuid
          ),
        };
      });

      this.getList();
    },
    submit() {
      if (this.btnDisable) {
        return;
      }
      if (this.disabled) {
        return;
      }
      this.btnDisable = true;
      setTimeout(() => {
        this.btnDisable = false;
      }, 3000);
      this.$emit(
        "listen",
        this.list.map((item) => {
          return {
            consumeUuid: item.uuid,
            treasureSkuList: item.userSelectSku.map((item) => {
              return item.uuid;
            }),
          };
        })
      );
    },
    hide() {
      this.isShow = false;
    },
    async getList() {
      const res = await this.$api.service.lottery_spin_treasureSkuList({
        uuid: this.activeId,
        openType: this.drawType,
        consumeList: this.consumeList,
      });
      if (res.data.code == 200) {
        let isEnough = true;
        this.list = res.data.data.consumeInfoList.map((item1) => {
          item1.userSelectSku = [];
          let skuAmount = 0;
          item1.commodityInfoList = item1.commodityInfoList.map((item) => {
            item.select = false;

            skuAmount += item.treasureSkuList.length;
            item.treasureSkuList = item.treasureSkuList.map((item) => {
              item.select = false;

              return item;
            });

            return item;
          });
          item1.isEnough = skuAmount >= item1.amount;
          if (!item1.isEnough) {
            isEnough = false;
          }
          return item1;
        });
        if (!isEnough) {
          this.$message.warning("消耗数量不足，请确认");
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    skuHandle(idx1, idx2, idx3, goodsSkuItem) {
      let listArr = JSON.parse(JSON.stringify(this.list));
      if (goodsSkuItem.select) {
        listArr[idx1].commodityInfoList[idx2].treasureSkuList[
          idx3
        ].select = false;
      } else {
        if (listArr[idx1].userSelectSku.length < listArr[idx1].amount) {
          if (!listArr[idx1].statusRepeat) {
            //false,最多选一个
            if (this.drawType == 1) {
              if (listArr[idx1].commodityInfoList[idx2].select) {
                //相同的
                this.$message.warning(
                  "抽奖1次消耗商品仅可对应选择1个编号，请确认"
                );
                return;
              }
            }
            if (this.drawType == 2) {
              console.log(listArr[idx1]);
              if (
                listArr[idx1].commodityInfoList[idx2].treasureSkuList.filter(
                  (item) => item.select
                ).length >= 10
              ) {
                //相同的
                this.$message.warning(
                  "抽奖1次消耗商品仅可对应选择10个编号，请确认"
                );
                return;
              }
            }
          }
          if (this.findUserSelected(goodsSkuItem.uuid)) {
            this.$message.warning("不可重复选择");
            return;
          } else {
            listArr[idx1].commodityInfoList[idx2].treasureSkuList[
              idx3
            ].select = true;
          }
        } else {
          this.$message.warning("已满足条件");
        }
      }
      this.list = this.sumUserselect(listArr);
      console.log(this.list);
    },
    sumUserselect(arr) {
      //计算用户选择数量
      return arr.map((item) => {
        let arr = [];
        item.commodityInfoList.forEach((element) => {
          const selectSku = element.treasureSkuList.filter((item) => {
            return item.select;
          });
          arr = [...arr, ...selectSku];
          element.select = selectSku.length > 0;
        });
        item.userSelectSku = arr;
        return item;
      });
    },
    findUserSelected(uuid) {
      for (let i = 0; i < this.list.length; i++) {
        const info = this.list[i].userSelectSku.find(
          (item) => item.uuid == uuid
        );
        if (info) {
          return true;
        }
      }
      return false;
    },
    goodsChnge(idx1, idx2) {
      /*       let listArr = JSON.parse(JSON.stringify(this.list));
      listArr[idx1].commodityInfoList[idx2].select =
        !listArr[idx1].commodityInfoList[idx2].select;
      this.list = listArr; */
    },
  },
};
</script>
<style lang="scss" scoped>
$pc-height: 204px;
$pc-height-m: 3.1rem;

@media screen and (min-width: 540px) {
  .scroll-bar::-webkit-scrollbar {
    width: 6px;
  }
  .scroll-bar::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #e4e4e4;
  }
  .scroll-bar::-webkit-scrollbar-track {
    border-radius: 0;

    background: #f8f8f8;
  }
}
.ui-message {
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  margin-bottom: 7px;
  margin-top: -20px;
}
.m-block {
  background: #efefef;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;

  .m-block-content {
    max-height: 260px;
    min-height: $pc-height;
    overflow-y: auto;
  }
  .m-block-wrap {
    display: flex;
    margin-bottom: 10px;

    .goods-list-wrap {
      padding-right: 9px;
      width: 153px;
      .goods-wrap {
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid transparent;
        height: $pc-height;
        .cover {
          padding-bottom: 100%;
        }
        .info-wrap {
          padding: 8px;
        }
        .name {
          font-size: 14px;
          font-weight: 600;
          color: #333333;
        }
        .num {
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          margin-top: 2px;
        }
        &.goods-select {
          border: 1px solid #ff5a4a;
        }
      }
    }
    .list-wrap {
      flex: 1;
      background: #ffffff;
      border-radius: 10px;
      padding: 10px 8px;
      height: $pc-height;
      overflow-y: auto;
      .list-wrap-content {
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 24px;
      }
    }
  }
  @media screen and (max-width: 540px) {
    margin-bottom: 0.16rem;
    .m-block-content {
      min-height: $pc-height-m;
    }
    .m-block-wrap {
      display: flex;
      .goods-list-wrap {
        padding-right: 9px;
        flex: initial;
        width: 2.24rem;
        max-height: 180px;
        .goods-wrap {
          background-color: #fff;
          height: $pc-height-m;
          /*           border-radius: .1rem; */
          .cover {
            height: 2rem;
            padding-bottom: initial;
            background-color: #ff5a4a;
          }
          .info-wrap {
            padding: 8px;
          }
          .name {
            font-size: 0.22rem;
            font-weight: 600;
            color: #333333;
          }
          .num {
            font-size: 0.22rem;
            font-weight: 400;
            color: #666666;
            margin-top: 0.06rem;
          }
        }
      }
      .list-wrap {
        flex: 1;
        background: #ffffff;
        border-radius: 10px;
        padding: 0.09rem 0.11rem;
        height: $pc-height-m;
      }
    }
  }
}
.title-wrap {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .num {
    display: inline-block;
    padding-left: 16px;
    color: #666666;
  }
}
.list-wrap {
}
.list-box {
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  padding: 14px 16px;
  width: 33.33%;
  .icon-select {
    position: relative;
    top: 3px;
    margin-right: 6px;
    width: 18px;
    height: 18px;
    background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/icon-select-default.png");
  }
  &.sku-select {
    color: #ff5a4a;
    .icon-select {
      background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/icon-select.png");
    }
  }
  @media screen and (max-width: 540px) {
    font-size: 0.28rem;
    width: 100%;
    padding: 0.16rem;
  }
}
.m-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  .btn {
    width: 47%;
    line-height: 50px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    user-select: none;
    cursor: pointer;
  }
  .btn-border {
    color: #333333;
    background: #ffffff;
    border: 1px solid #333333;
  }
  .btn-bg {
    background: #ff5a4a;
    color: #fff;
    border: 1px solid #ff5a4a;
  }
  .disabled {
    background: #cccccc;
    color: #666666;
    border: 1px solid #cccccc;
  }
  @media screen and (max-width: 540px) {
    padding-top: 0.14rem;
    .btn {
      width: 47%;
      line-height: 0.72rem;
      font-size: 0.28rem;
      font-weight: 400;
      text-align: center;
      user-select: none;
      cursor: pointer;
    }
  }
}
@media screen and (max-width: 540px) {
  .theone-dialog {
    ::v-deep .el-dialog__body {
      padding-bottom: 0.3rem;
    }
  }
}
</style>
