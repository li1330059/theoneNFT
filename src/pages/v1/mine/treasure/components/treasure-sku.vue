<template>
  <div class>
    <div class="mode-mobile">
      <m-header :title="pageTitle" />
    </div>
    <div v-show="page == 1">
      <div class="page-mine-treasure">
        <div class="search">
          <h2 @click="$common.goPage('/mine/treasure')">{{ treasureTitle }}</h2>
          <div class="right">
            <div v-if="isShowGiveBtn" class="give-btn" @click="onShowGive">
              赠与
            </div>
            <div class="choose">
              <el-select
                v-model="treasureSkuListParam.visible"
                @change="onListChange"
                :placeholder="searchOption[0].name"
              >
                <el-option
                  v-for="(option, oindex) in searchOption[0].item"
                  :key="oindex"
                  :label="option.name"
                  :value="option.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="treasureSkuListParam.sort.upOrDown"
                @change="onListChange"
                :placeholder="searchOption[1].name"
              >
                <el-option
                  v-for="(option, oindex) in searchOption[1].item"
                  :key="oindex"
                  :label="option.name"
                  :value="option.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="loading" v-if="loading">
          <loading></loading>
        </div>
        <empty v-else-if="showEmpty"></empty>
        <div v-else>
          <div
            style="
              display: flex;
              justify-content: flex-end;
              padding-right: 0.3rem;
              margin-top: -0.3rem;
              margin-bottom: 0.2rem;
            "
          >
            <div
              v-if="isShowGiveBtn"
              class="give-btn-m give-btn"
              @click="onShowGive"
            >
              赠与
            </div>
          </div>
          <div class="v1-goods-list">
            <div
              class="v1-goods-wrap"
              v-for="(item, index) in treasureSkuListResult.records"
              :key="index"
            >
              <goods-frame
                :goods-info="item"
                :index="index"
                :is-show-preview="false"
                :is-show-like="false"
                :isShowPrepaySign="true"
                @listenCoverClick="goDetail"
              >
                <div slot="content" v-if="!isMobile">
                  <div class="ui-btn-group ui-btn-center editor-btn">
                    <div v-if="isExpire" class="v1-btn mycenter">已过期</div>
                    <div
                      v-else-if="isSell(item)"
                      class="v1-btn mycenter"
                      @click.stop="handleSellAdd(item)"
                    >
                      寄售
                    </div>
                    <div class="v1-btn mycenter" @click.stop="goDetail(item)">
                      查看详情
                    </div>
                  </div>
                </div>

                <div slot="footer">
                  <div class="v1-goods-line">
                    <div></div>
                    <div class="state">
                      <el-popover
                        placement="top"
                        width="160"
                        v-model="item.visible_show"
                      >
                        <div class="select-visible-wrap">
                          <div
                            v-for="v_item in visible_list"
                            :key="v_item.key"
                            :class="{ selected: v_item.key == visible_key }"
                            @click="onChangeStatus(item, index, v_item)"
                          >
                            {{ v_item.name }}
                          </div>
                        </div>

                        <span
                          slot="reference"
                          class="icon"
                          :class="{
                            lock: item.visible == 3,
                            unlock: item.visible == 1,
                            man: item.visible == 2,
                          }"
                          @click.stop="setVisibleStatus(item)"
                        />
                      </el-popover>
                    </div>
                  </div>
                  <div
                    class="v1-goods-line"
                    v-if="item.operationType == 1 || item.operationType == 2"
                  >
                    <div class="v1-goods-line-title">寄售价</div>
                    <div class="v1-price">
                      {{ $common.formatMoney(item.priceSale) }}
                    </div>
                  </div>
                  <div class="v1-goods-line" v-else>
                    <div class="v1-goods-line-title">藏品状态</div>
                    <p>私藏</p>
                  </div>
                  <div class="v1-goods-line" style="margin-bottom: 0">
                    <div class="v1-goods-line-title">获得时间</div>
                    <p>{{ item.createTime }}</p>
                  </div>
                  <div class="gray-btn" v-if="isMobile">
                    <div v-if="isExpire" class="v1-btn mycenter">已过期</div>

                    <div
                      v-else-if="isSell(item)"
                      @click.stop="handleSellAdd(item)"
                    >
                      寄售
                    </div>
                    <div @click.stop="goDetail(item)">查看详情</div>
                  </div>
                </div>
              </goods-frame>
            </div>
          </div>
        </div>
        <div class="v1-pagination">
          <g-paging
            :pageChange="handleCurrentChange"
            :pageSize="treasureSkuListParam.pageSize"
            :list="pagingList"
            :current-page="treasureSkuListResult.current"
          />
        </div>
        <sellAdd ref="sellAdd" @listen="listenSellAdd"></sellAdd>
        <bankSubmit
          v-if="userAttrResult"
          ref="bankSubmit"
          :userInfo="userAttrResult"
          @listen="listenBankSubmit"
        ></bankSubmit>
        <!-- 设置支付密码 -->
        <setPayPassword
          ref="setPayPassword"
          @listen="listenSetPayPassword"
        ></setPayPassword>
        <!--  密码验证 -->
        <verified-pay-pw ref="verifiedPayPw" />
        <!--  赠与密码验证 -->
        <verified-pay-pw
          title="安全锁密码验证"
          warning-txt="提示：藏品赠与成功后不可撤回，请勿进行线下交易，谨防受骗。"
          ref="giftVerifiedPayPw"
        />
        <!-- 发送源文件到邮箱 -->
        <sendEmail
          ref="sendEmail"
          @listen="setEmail"
          :id="downLoadGoodsId"
          :userInfo="userAttrResult"
        />
        <!-- 设置邮箱 -->
        <initMailBox ref="initMailBox" />
      </div>
    </div>
    <give-gift
      ref="giveGiftRef"
      v-show="page == 2"
      :treasureId="treasureSkuListParam.treasureId"
      :selectedArr="selectedArr"
      :config="config"
    ></give-gift>
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
import sellAdd from "./sellAdd";
import mHeader from "@/components/v1/layout/mobileHeader";
import bankSubmit from "../../wallet/bankSubmit";
import setPayPassword from "@/pages/v1/mine/setting/setPayPassword";

import sendEmail from "./sendEmail.vue";
import initMailBox from "../../setting/initMailBox.vue";
import axios from "axios";
import fileDownload from "js-file-download";
import GiveGift from "./give-gift.vue";

export default {
  components: {
    empty,
    loading,
    sellAdd,
    mHeader,
    bankSubmit,
    setPayPassword,
    sendEmail,
    initMailBox,
    GiveGift,
  },
  data() {
    return {
      isExpire: false,
      discountStatus: 0,
      pagingList: [],
      pageTitle: "我的藏品",
      page: 1,
      loading: true,
      showEmpty: false,
      visible_list: [
        { name: "全部可见", key: 1 },
        { name: "好友可见", key: 2 },
        { name: "全部不可见", key: 3 },
      ],
      visible_key: 1,

      searchOption: [
        {
          key: "visible",
          name: "可见状态",
          item: [
            {
              name: "全部可见",
              value: "1",
            },
            {
              name: "好友可见",
              value: "2",
            },
            {
              name: "全部不可见",
              value: "3",
            },
          ],
        },
        {
          key: "typeMarket",
          name: "购买价格",
          item: [
            {
              name: "高到低",
              value: "2",
            },
            {
              name: "低到高",
              value: "1",
            },
          ],
        },
      ],
      treasureSkuListParam: {
        pageCount: 1,
        pageSize: 12,
        sort: {
          field: 1, //购买价格
          upOrDown: "",
        },
        treasureId: "",
        visible: "",
      },
      treasureSkuListResult: {},
      treasureTitle: "",
      downLoadGoodsId: null,
      chooseTreasureSku: null,
      config: {},
    };
  },

  created() {
    this.treasureSkuListParam.treasureId = this.$route.params.id;
    this.commodityId = this.$route.query.commodity_id;
    this.getTreasureSkuList();
  },
  computed: {
    isMobile() {
      return this.$common.isMobile();
    },
    userAttrResult() {
      return this.$store.state.user_info;
    },
    isShowGiveBtn() {
      /*     return (
        this.treasureSkuListResult.records &&
        this.treasureSkuListResult.records.length > 0
      ); */

      if (this.treasureSkuListResult.records) {
        const res = this.treasureSkuListResult.records.filter((item) => {
          if (item.commodity.statusGive == 1) {
            return (
              (item.statusAvailable == 1 && item.operationType == 0) ||
              (item.statusAvailable == 0 && item.operationType == 12)
            );
          }
          return false;
        });
        return res.length > 0;
      }
      return false;
    },
    selectedArr() {
      if (
        this.treasureSkuListResult &&
        this.treasureSkuListResult.records &&
        this.treasureSkuListResult.records.length > 0
      ) {
        return this.treasureSkuListResult.records.filter(
          (item) => item.selected
        );
      }
      return [];
    },
  },
  methods: {
    isSell(item) {
      return item.commodity.statusSale == 1 && item.operationType == 0;
      if (this.userAttrResult.isAuthor) {
        return item.commodity.statusSell == 1 && item.operationType == 0;
      } else {
        return item.commodity.statusSale == 1 && item.operationType == 0;
      }
    },
    async getDiscountStatus(info) {
      if (info.commodity.typeCommodity == 6) {
        const res = await this.$api.service.discountCommodityDiscountInfo({
          commodityUuid: this.commodityId,
        });
        this.isExpire = false;
        if (res.data.code == 200) {
          this.discountStatus = res.data.data.discountStatus;
          if (res.data.data.discountStatus == 3) {
            this.isExpire = true;
          }
        }
      }
    },
    goDetail(info) {
      console.log(info);
      this.$router.push(`/treasuresku_info/${info.id}`);
    },
    async getConfig(info) {
      if (info) {
        const res = await this.$api.service.giveConfig_detail({
          commodityId: info.commodity.id,
        });
        if (res.data.code == 200) {
          this.config = res.data.data;
        }
      }
    },
    onShowGive() {
      this.$refs.giftVerifiedPayPw.init((passwowrd) => {
        console.log(passwowrd);
        const res = this.treasureSkuListResult.records.filter((item) => {
          if (item.commodity.statusGive == 1) {
            return (
              (item.statusAvailable == 1 && item.operationType == 0) ||
              (item.statusAvailable == 0 && item.operationType == 12)
            );
          }
          return false;
        });
        if (res.length > 0) {
          this.page = 2;
          this.$refs.giveGiftRef.init(this.treasureSkuListResult, passwowrd);
        } else {
          this.$message.warning("该藏品不可赠与");
        }
      });
    },
    changePage(page) {
      this.page = page;
    },
    goConsignment() {
      this.$refs.sellAdd.consignment();
    },
    hideSellAdd() {
      this.$refs.sellAdd.hide();
    },

    onListChange() {
      this.treasureSkuListParam.pageCount = 1;
      this.getTreasureSkuList();
    },
    setVisibleStatus(item) {
      this.visible_key = item.visible;
    },
    async onChangeStatus(item, idx, visible_info) {
      this.visible_key = visible_info.key;

      const params = {
        visible: visible_info.key,
        treasureSkuId: item.id,
        type: 1,
      };

      const result = await this.$api.service.treasureSku_operation(params);
      if (result && result.data.code == 200) {
        this.$message.success("操作成功");
        this.treasureSkuListResult.records[idx].visible = params.visible;
        this.treasureSkuListResult.records[idx].visible_show = false;
      } else {
        this.$message.error("操作失败请重试");
      }
    },
    async getUserAttr() {
      let result = await this.$api.service.userattribute_queryByUserUuid();
      this.userAttrResult = result.data.data;
    },
    //出售
    handleSellAdd(item) {
      if (item.statusAvailable == 1 && this.discountStatus == 0) {
        const self = this;
        this.chooseTreasureSku = item;
        console.log(`银行卡验证`, this.userAttrResult.statusBankVerified);

        if (this.userAttrResult.statusBankVerified != 1) {
          this.$refs.bankSubmit.init();
        } else if (this.userAttrResult.isPayPwd == 0) {
          this.$refs.setPayPassword.init();
        } else {
          this.$refs.verifiedPayPw.init((passwowrd) => {
            //支付密码校验
            self.$refs.sellAdd.init(item, passwowrd);
          });
        }
      }
    },
    showBindBank() {
      this.$refs.bankSubmit.init();
    },
    // 出售回调
    listenSellAdd(result) {
      if (result.result) {
        //出售成功回调
        this.getTreasureSkuList();
      }
    },
    //绑定银行卡
    listenBankSubmit(result) {
      if (result.result) {
        this.$store.commit("setUserInfo", {
          ...this.userAttrResult,
          statusBankVerified: 1,
        });
        if (this.userAttrResult.isPayPwd == 0) {
          this.$refs.setPayPassword.init();
        } else {
          this.$refs.verifiedPayPw.init((passwowrd) => {
            this.$refs.sellAdd.init(this.chooseTreasureSku, passwowrd);
          });
        }
      }
    },
    // 设置支付密码
    listenSetPayPassword(result) {
      if (result.result) {
        this.$store.commit("setUserInfo", {
          ...this.userAttrResult,
          isPayPwd: 1,
        });
        this.$refs.sellAdd.init(this.chooseTreasureSku, result.result);
      }
    },
    searchOrder() {},
    //我的资产列表
    async getTreasureSkuList() {
      this.loading = true;
      this.showEmpty = false;
      const params = JSON.parse(JSON.stringify(this.treasureSkuListParam));
      if (!params.sort.upOrDown) {
        params.sort.upOrDown = 1;
      }

      let result = await this.$api.service.treasureSku_list(params);
      if (result.data.code == 200) {
        this.pagingList = result.data.data.records || [];
        if (result.data.data.records && result.data.data.records.length > 0) {
          this.treasureSkuListResult = result.data.data;
          this.getConfig(this.treasureSkuListResult.records[0]);
          this.initRecords(false);
          this.treasureTitle =
            this.treasureSkuListResult.records[0].commoditySku.name;
        } else {
          this.showEmpty = true;
        }
        this.loading = false;
        this.getDiscountStatus(this.treasureSkuListResult.records[0]);
      } else {
        this.$message.error(result.data.message);
      }
    },
    initRecords(selected) {
      this.treasureSkuListResult.records =
        this.treasureSkuListResult.records.map((item) => {
          item.selected = selected;
          return item;
        });
    },
    // 我的资产分页
    async handleCurrentChange(val) {
      this.treasureSkuListParam.pageCount = val;
      this.getTreasureSkuList();
    },
    changeRecordsSelected(selected, idx) {
      let arr = JSON.parse(JSON.stringify(this.treasureSkuListResult.records));
      arr[idx].selected = selected;
      this.treasureSkuListResult.records = arr;
    },
    //下载源文件到邮箱
    handleSendEmail(item) {
      const BASE_URL = process.env.VUE_APP_API_BASE_URL;

      if (item.commodity.typeFile == 3) {
        axios.defaults.headers["authorization"] =
          localStorage.getItem("authorization");
        axios
          .get(
            `${BASE_URL}/goods/api/commodityDownload/commodityDownloadVideo?id=${item.commodity.id}`,
            { responseType: "blob" }
          )
          .then((res) => {
            if (res && res.data) {
              fileDownload(res.data, `${item.commodity.name}.mp4`);
            }
          });

        return;
        this.$api.service
          .commodityDownload_commodityDownloadVideo(
            {
              id: item.commodity.id,
            },
            {
              responseType: "blob",
            }
          )
          .then((res) => {
            console.log(res.data);
            fileDownload(res.data, "test.mp4");
          });
      } else {
        this.downLoadGoodsId = item.commodity.id;
        this.$refs.sendEmail.init();
      }
    },
    setEmail() {
      this.$refs.initMailBox.init();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/treasure.scss";
.v1-goods-line {
  margin-top: 8px;
  margin-bottom: 8px;
  p{
    text-align: right;
  }
}
.v1-goods-wrap {
  padding: 12px;
}
.give-btn-m {
  display: none;
}
.editor-btn {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  .v1-btn {
    margin: 0 8px;
  }
}

.give-btn {
  width: 96px;
  line-height: 30px;
  background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
}
.page-mine-treasure {
  .loading {
    height: 500px;
  }
  .search {
    margin-bottom: 30px;
    border-bottom: 1px solid rgba($color: #979797, $alpha: 0.2);
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .right {
      display: flex;
      align-items: center;
    }
    h2 {
      font-size: 12px;
      background: url("//static.theone.art/pc/images/back.png") no-repeat left
        center;
      background-size: 14px 14px;
      padding-left: 20px;
      cursor: pointer;
    }
    .choose {
      display: flex;
      ::v-deep .el-select {
        width: 116px;
        margin-left: 16px;
      }
    }
  }
}
.icon {
  display: inline-block;
  width: 18px;
  height: 18px;
}
.unlock {
  background: url("//static.theone.art/pc/images/unlock.png") no-repeat right
    center;
  background-size: contain;
}
.lock {
  background: url("//static.theone.art/pc/images/pic-home/lock%402x.png")
    no-repeat right center;
  background-size: contain;
}
.man {
  background: url("//static.theone.art/pc/images/pic-home/friendsee.png")
    no-repeat right center;
  background-size: contain;
}
.select-visible-wrap {
  margin: -12px;
  background: #fff;
  > div {
    width: 100%;
    line-height: 34px;

    border-radius: 0px 0px 2px 2px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    padding: 0 16px;
  }
  .selected {
    background-color: #f4f4f4;
  }
}
.goods-btns {
  .v1-btn {
    margin: 0 5px;
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .give-btn {
    display: none;
  }
  .give-btn-m {
    display: block;
  }
  .v1-pagination {
    padding-bottom: 1.2rem;
  }
  .page-mine-treasure {
    padding-top: 1.1rem;
    background: #fafafa;
    .loading {
      height: 8rem;
    }
    .search {
      margin-top: 0.2rem;
    }
    .v1-search.mycenter .v1-search-title {
      padding: 0.32rem;
    }

    .v1-search-title .search-more {
      width: 1.92rem;
      height: 0.6rem;
      font-size: 0.28rem;
      font-weight: 400;
      color: rgba($color: #000000, $alpha: 0.4);
      background-size: 0.36rem 0.36rem;
      padding-left: 0.46rem;
      background-position-x: 1.2rem;
    }

    .v1-search.mycenter .search-order span {
      font-size: 0.28rem;
      font-weight: 400;
      color: rgba($color: #000000, $alpha: 0.4);
    }

    .v1-search {
      margin-bottom: 0;
    }

    .gray-line {
      padding-top: 0.14rem;
      border-bottom: 0.01rem solid rgba($color: #000000, $alpha: 0.1);
    }

    .gray-btn {
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      margin-top: 0.46rem;
      div {
        width: 2.92rem;
        height: 0.72rem;
        background: #e5e5e5;
        border-radius: 0.36rem;
        justify-content: center;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        font-size: 0.28rem;
        font-weight: 500;
        color: rgba($color: #000000, $alpha: 0.7);
        margin: 0 0.1rem;
      }
    }

    .v1-goods-line h1 {
      font-size: 0.32rem;
      font-weight: bold;
      color: #000000;
    }
    .v1-goods-line-title {
      font-size: 0.24rem;
    }
    .v1-goods-line-people {
      font-size: 0.28rem;
      font-weight: 400;
      color: rgba($color: #000000, $alpha: 0.7);
    }
  }
  .goods-btns {
    .v1-btn {
      display: none;
    }
  }
}
.v1-goods-cover {
  .ui-preview-wrap {
    position: absolute;
    ::v-deep .icon-preview-wrap {
      z-index: 999;
    }
  }
}
</style>
