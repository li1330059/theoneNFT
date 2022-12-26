/* 我发布的 */
<template>
  <div class="page-mine-release page-min-width">
    <div class="mode-PC">
      <div class="v1-tabs">
        <ul>
          <li
            :class="{ active: releaseListParam.statusSale == item.value }"
            v-for="(item, index) in searchOption.statusSale"
            :key="index"
          >
            <a @click="search('statusSale', item.value)">{{ item.name }}</a>
          </li>
        </ul>
        <div class="v1-font-message">
          历史订单正在搬家赶来的路上，路途遥远请耐心等待哦
        </div>
      </div>
      <div class="loading" v-if="loading">
        <loading></loading>
      </div>
      <empty v-else-if="showEmpty"></empty>
      <div v-else>
        <div class="m-tool">
          <div class="main" v-if="Number(releaseListParam.statusSale) == 1">
            <div>
              <span class="batch-cancel" @click="toggleBatchStatus">{{
                batchStatus ? "退出批量取消" : "批量取消"
              }}</span>
            </div>
            <div>
              <div
                class="batch-btn-wrap"
                @click="onToggleBatch"
                v-if="batchStatus"
              >
                全选<span
                  class="icon-checkbox icon-checkbox-default"
                  :class="{ 'icon-checkbox-selected-bg': batchSelectStatus }"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="v1-trade">
            <div
              class="trade-item"
              :class="{ 'trade-item-selected': item.selected }"
              v-for="(item, index) in releaseListResult.records"
              :key="index"
              @click="select(item, index)"
            >
              <div class="title-line">
                <div class="info">
                  <div class="time">{{ item.createTime }}</div>
                  <div class="title">单据编号：</div>
                  <div @click.stop="() => false">
                    <copy :txt="item.saleRecordNo" />
                  </div>
                </div>
                <div>
                  <span
                    class="icon-checkbox icon-checkbox-default"
                    :class="{ 'icon-checkbox-selected': item.selected }"
                    v-if="batchStatus"
                  ></span>
                </div>
              </div>
              <div class="content-line">
                <div class="goods">
                  <simple-frame :goodsObj="item" />
                  <div class="info">
                    <h1>
                      <div class="txt hidden-1">
                        {{ (item.commodity && item.commodity.name) || "" }}
                      </div>
                      <div class="wsmall">
                        X {{ (item.commodity && item.amount) || "" }}
                      </div>
                    </h1>
                    <!--            <commodity-num
                      class="ui-commodity-num"
                      :treasure="item"
                    ></commodity-num> -->
                    <p class="hidden">
                      {{
                        (item.commodity &&
                          item.author &&
                          item.author.nickname) ||
                        ""
                      }}
                    </p>
                  </div>
                </div>
                <div class="price wsmall">
                  <div class="v1-price">
                    {{ $common.formatMoney(item.price) }}
                  </div>
                </div>
                <div class="list">
                  <div>可用数量：{{ item.amountAvailable }}</div>
                  <div>锁定数量：{{ item.amountLock }}</div>
                  <div>卖出数量：{{ item.amountSold }}</div>
                </div>
                <div class="check wsmall">
                  <div
                    class="icon-warm"
                    v-if="item.approve && item.approve.statusAudit == 2"
                  >
                    审核被拒绝({{ item.approve.auditMessage }})
                  </div>
                  <div v-if="item.statusSale == 0">审核中</div>
                  <div v-else-if="item.statusSale == 1">发布中</div>
                  <div v-else-if="item.statusSale == 2">已售罄</div>
                  <div v-else-if="item.statusSale == 3">已取消</div>
                  <div v-else-if="item.statusSale == 4">被拒绝寄售</div>
                  <div v-else-if="item.statusSale == 5">
                    <span
                      v-if="item.presaleInfo && item.presaleInfo.status == 4"
                      >被锁定 待付定金</span
                    >
                    <span
                      v-else-if="
                        item.presaleInfo && item.presaleInfo.status == 1
                      "
                      >被锁定 待付尾款</span
                    >
                    <span v-else>被锁定</span>
                  </div>
                  <div v-else-if="item.statusSale == 11">
                    <span
                      v-if="item.presaleInfo && item.presaleInfo.status == 3"
                      >已关闭 退款成功</span
                    >
                    <span
                      v-else-if="
                        item.presaleInfo &&
                        item.presaleInfo.status == 1 &&
                        item.presaleInfo.statusCancel == 2
                      "
                      >已关闭 尾款支付超时</span
                    >
                    <span
                      v-else-if="
                        item.presaleInfo &&
                        item.presaleInfo.status == 1 &&
                        item.presaleInfo.statusCancel == 3
                      "
                      >已关闭 主动退款</span
                    >
                    <span
                      v-else-if="
                        item.presaleInfo &&
                        item.presaleInfo.status == 1 &&
                        item.presaleInfo.statusCancel == 4
                      "
                      >已关闭 买家取消</span
                    >
                    <span v-else>已关闭</span>
                  </div>
                </div>
                <div class="operate">
                  <div
                    v-if="item.statusSale == 1"
                    class="v1-btn-link blue"
                    @click.stop="cancel(item)"
                  >
                    取消发布
                  </div>
                  <div
                    v-if="item.statusSale == 0"
                    class="v1-btn-link blue"
                    @click.stop="cancel(item, '')"
                  >
                    取消
                  </div>
                  <div
                    v-if="
                      item.statusSale == 1 ||
                      item.statusSale == 2 ||
                      item.statusSale == 3 ||
                      item.statusSale == 5 ||
                      item.statusSale == 11
                    "
                    class="v1-btn mycenter"
                    @click.stop="seeGoods(item)"
                  >
                    查看作品
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="m-selected-info" v-if="batchStatus">
            <div class="txt">已选择：{{ cancelList.length }}</div>
            <div
              class="btn"
              :class="{ disabled: cancelList.length <= 0 }"
              @click="batchSubmit"
            >
              确定
            </div>
          </div>
          <div class="v1-pagination">
            <g-paging
              :pageChange="handleCurrentChange"
              :list="releaseListResult.records"
              :pageSize="releaseListParam.pageSize"
              :current-page="releaseListResult.current"
            />
            <!--           <div
              class="page-icon"
              :class="{
                selected: prevStatus && releaseListParam.pageCount !== 1,
              }"
              @click="onPrev"
            >
              <span class="icon icon-left" />
              上一页
            </div>
            <div
              class="page-icon"
              :class="{ selected: nextStatus }"
              @click="onNext"
            >
              下一页
              <span class="icon icon-right" />
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <div class="mode-mobile">
      <mRelease
        :orderListResult="releaseListResult"
        :searchOption="searchOption"
        :releaseListParam="releaseListParam"
        :batchStatus="batchStatus"
        :batchSelectStatus="batchSelectStatus"
        :cancelList="cancelList"
        :prevStatus="prevStatus"
        :nextStatus="nextStatus"
        type="statusSale"
      />
    </div>
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
import mRelease from "./v1/release";
const BATCH_KYE = 1;
export default {
  components: { empty, loading, mRelease },
  data() {
    return {
      loading: true,
      showEmpty: false,
      batchSelectStatus: false, //是否全选
      batchStatus: false, //是否开启批量取消
      searchOption: {
        statusSale: [
          { name: "发布中", value: "1" },
          { name: "已售罄", value: "2" },
          { name: "已取消", value: "3" },
          { name: "被锁定", value: "5" },
          { name: "已关闭", value: "11" },
          { name: "全部", value: "" },
        ],
      },
      releaseListParam: {
        pageCount: 1,
        pageSize: 12,
        statusSale: "1",
      },
      releaseListResult: {
        orders: [],
        records: [],
      },
      prevStatus: true,
      nextStatus: true,
    };
  },
  created() {
    this.releaseList();
  },
  computed: {
    cancelList() {
      if (BATCH_KYE == this.releaseListParam.statusSale) {
        if (this.releaseListResult && this.releaseListResult.records) {
          return this.releaseListResult.records.filter((item) => {
            return item.selected;
          });
        }
      }
      return [];
    },
  },
  methods: {
    onPrev() {},
    onNext() {},
    seeGoods(item) {
      if (this.batchStatus) {
        return;
      }
      this.$common.goPage(`/goods/${item.id}?from=release`, "_blank");
      /*      if (item.typeSale == 2) {
        this.$common.goPage(
          `/goods/${item.id}?status=${JSON.stringify({
            statusSale: item.statusSale,
            status: item.presaleInfo.status,
            statusCancel: item.presaleInfo.statusCancel,
          })}`,
          "_blank"
        );
      } else {
        this.$common.goPage(`/goods/${item.id}`, "_blank");
      } */
    },
    onToggleBatch() {
      //是否全选
      this.batchSelectStatus = !this.batchSelectStatus;
      this.releaseListResult.records = this.releaseListResult.records.map(
        (item) => {
          item.selected = this.batchSelectStatus;
          return item;
        }
      );
    },
    toggleBatchStatus() {
      //是否进入批量取消状态
      if (this.batchStatus) {
        //退出
        this.quitBatch();
      } else {
        //进入
        this.batchStatus = true;
      }
    },
    quitBatch() {
      this.releaseListResult.records = this.releaseListResult.records.map(
        (item) => {
          item.selected = false;
          return item;
        }
      );
      this.batchSelectStatus = false;
      this.batchStatus = false;
    },
    select(item, idx) {
      //单选
      if (this.batchStatus) {
        this.releaseListResult.records[idx].selected =
          !this.releaseListResult.records[idx].selected;
        //检查是否已经全选
        const isAllSelected = this.releaseListResult.records.every((item) => {
          return item.selected;
        });
        this.batchSelectStatus = isAllSelected;
      }
    },

    batchSubmit() {
      if (this.cancelList && this.cancelList.length > 0) {
        this.$confirm(
          `当前页已选择 ${this.cancelList.length} 条寄售信息，寄售时已锁定的藏品无法执行取消操作。`,
          "批量取消发布",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          }
        ).then(() => {
          this.batchCancel();
          /*    let result = await this.$api.service.saleRecord_cancel({
            id: item.id,
          });
          if (result && result.data.data && result.data.code == 200) {
            this.$message.success(
              `当前页已选择 2 条寄售信息，是否先 [批量取消发布]`
            );
          
          } else {
            this.$message.error(result.data.message);
          } */
        });
      }
    },
    // 我发布的列表
    async releaseList() {
      this.loading = true;
      let result = await this.$api.service.saleRecord_my_list(
        this.releaseListParam
      );
      /*      let result = {
        data: {
          code: 200,

          message: "成功",

          data: {
            records: [
              {
                saleRecordNo: "SR1589602328648683522",
                price: "232.00",
                amount: 1,
                amountSold: 0,
                amountAvailable: 1,
                amountLock: 0,
                statusSale: 1,
                createTime: "2022-11-07 20:55:03",
                commodity: {
                  name: "惊喜空投R-18",
                  cover:
                    "https://source.theone.art/watermark/98ce2221777449433b7cc6dbf444c86a/5dc4743a1ff38a71890ea5dedb4dafbf-1653651606887.png",
                  actualPicture:
                    "https://source.theone.art/watermark/98ce2221777449433b7cc6dbf444c86a/5dc4743a1ff38a71890ea5dedb4dafbf-1653651606887.png",
                  coverGifVideo: null,
                  coverAppGifVideo: null,
                  chainName: null,
                  chainContract: null,
                  tradeHash: null,
                  contractAddress: null,
                  nftId: null,
                  amountLike: 792,
                  typeMarket: 2,
                  typeCommodity: null,
                  typeFile: 1,
                  label: "",
                  description: "",
                  price: "0.00",
                  amountSku: 93584,
                  statusNumber: 1,
                  sharePic: null,
                  statusGive: null,
                  gifFirstImageUrl: null,
                  seller: null,
                  saleQuantity: null,
                  commodityCategoryUuid: "46dfd47af2a729734d4affe01f07ecbd",
                  statusSale: 1,
                  statusSell: 1,
                  sourcePlatform: null,
                  extendsData: null,
                  id: "3830bfe6e29732f11d55eb40b65a9b64",
                },
                author: {
                  name: "唯一艺术·数字艺术工作室",
                  nickname: "唯一艺术·数字艺术工作室",
                  cover:
                    "https://theoneart-common.oss-cn-qingdao.aliyuncs.com/author/默认头像1631774259563.png",
                  level: 3,
                  description: null,
                  id: "98ce2221777449433b7cc6dbf444c86a",
                },
                approve: {
                  auditMessage: "系统自动通过",
                  statusAudit: 1,
                  id: "39bddeb4ae4569bb36d5d5845d3d91a0",
                },
                number: 14345,
                honorFlag: 0,
                typeSale: 1,
                presaleInfo: null,
                id: "b00944203f8068b18d8e1c8ca29f6e8d",
              },

              {
                saleRecordNo: "SR1588779980433653761",

                price: "1.00",

                amount: 1,

                amountSold: 0,

                amountAvailable: 0,

                amountLock: 1,

                statusSale: 5,

                createTime: "2022-11-05 14:27:20",

                commodity: {
                  name: "用户藏品已寄售已付定金，禁止购买",

                  cover:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/3f9adab5df2c6c3c8ab061254c9a542a-1667629393512.jpg",

                  actualPicture:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/3f9adab5df2c6c3c8ab061254c9a542a-1667629393512.jpg",

                  coverGifVideo: null,

                  coverAppGifVideo: null,

                  chainName: null,

                  chainContract: null,

                  tradeHash: null,

                  contractAddress: null,

                  nftId: null,

                  amountLike: 0,

                  typeMarket: 2,

                  typeCommodity: null,

                  typeFile: 1,

                  label: "",

                  description: "唯一艺术测试商品，请勿购买！",

                  price: "1.00",

                  amountSku: 10,

                  statusNumber: 1,

                  sharePic: "",

                  statusGive: null,

                  gifFirstImageUrl: null,

                  seller: null,

                  saleQuantity: null,

                  commodityCategoryUuid: "f4feb39a2457a8d677e78f7495cc2350",

                  statusSale: 1,

                  statusSell: 0,

                  sourcePlatform: null,

                  extendsData: null,

                  id: "f4fb5f2f282e39524c696f6980f21583",
                },

                author: {
                  name: "【唯一艺术·数字艺术工作室】",

                  nickname: "【唯一艺术·数字艺术工作室】",

                  cover:
                    "https://theoneart-common.oss-cn-qingdao.aliyuncs.com/api/file/2021-12-13/675dd30354f43293975e8723cc76a98a1639364792702.jpeg",

                  level: 3,

                  description:
                    "测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测",

                  id: "98ce2221777449433b7cc6dbf444c86a",
                },

                approve: {
                  auditMessage: "系统自动通过",

                  statusAudit: 1,

                  id: "b92e657a0fee4e106ec49729892fca55",
                },

                number: 1,

                honorFlag: 0,

                typeSale: 2,

                presaleInfo: {
                  depositAmount: "0.20",

                  depositRatio: "20%",

                  balanceAmount: "0.80",

                  depositDay: 10,

                  indemnityAmount: "0.42",

                  indemnityFee: "0.02",

                  status: 1,

                  statusCancel: 0,
                },

                id: "50c80c6450629f9012cb74ae2816ab7d",
              },

              {
                saleRecordNo: "SR1588746005761753089",

                price: "1.00",

                amount: 1,

                amountSold: 0,

                amountAvailable: 0,

                amountLock: 1,

                statusSale: 5,

                createTime: "2022-11-05 12:12:19",

                commodity: {
                  name: "时尚弄潮，禁止购买",

                  cover:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/73636823df3bc121d4166caf419b7626-1667620010455.jpg",

                  actualPicture:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/73636823df3bc121d4166caf419b7626-1667620010455.jpg",

                  coverGifVideo: null,

                  coverAppGifVideo: null,

                  chainName: null,

                  chainContract: null,

                  tradeHash: null,

                  contractAddress: null,

                  nftId: null,

                  amountLike: 0,

                  typeMarket: 1,

                  typeCommodity: null,

                  typeFile: 1,

                  label: "",

                  description: "唯一艺术测试商品，请勿购买！",

                  price: "1.00",

                  amountSku: 1,

                  statusNumber: 1,

                  sharePic: "",

                  statusGive: null,

                  gifFirstImageUrl: null,

                  seller: null,

                  saleQuantity: null,

                  commodityCategoryUuid: "b4c9e3d19971fc0cf7695e159c1982a7",

                  statusSale: 1,

                  statusSell: 0,

                  sourcePlatform: null,

                  extendsData: null,

                  id: "b3bea0432cf651b2b9d0eb6bd3e8a0af",
                },

                author: {
                  name: "【唯一艺术·数字艺术工作室】",

                  nickname: "【唯一艺术·数字艺术工作室】",

                  cover:
                    "https://theoneart-common.oss-cn-qingdao.aliyuncs.com/api/file/2021-12-13/675dd30354f43293975e8723cc76a98a1639364792702.jpeg",

                  level: 3,

                  description:
                    "测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测",

                  id: "98ce2221777449433b7cc6dbf444c86a",
                },

                approve: {
                  auditMessage: "系统自动通过",

                  statusAudit: 1,

                  id: "66f410b22d753c400e56f421c2737e22",
                },

                number: 1,

                honorFlag: 0,

                typeSale: 2,

                presaleInfo: {
                  depositAmount: "0.20",

                  depositRatio: "20%",

                  balanceAmount: "0.80",

                  depositDay: 10,

                  indemnityAmount: "0.42",

                  indemnityFee: "0.02",

                  status: 1,

                  statusCancel: 0,
                },

                id: "8fe0941d9a187e85df88bd2cc15a786c",
              },

              {
                saleRecordNo: "SR1588500287084036097",

                price: "1.00",

                amount: 1,

                amountSold: 0,

                amountAvailable: 0,

                amountLock: 1,

                statusSale: 5,

                createTime: "2022-11-04 19:55:56",

                commodity: {
                  name: "已出售 定金已付 未付尾款，禁止购买",

                  cover:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/55e240f590f4f67288f4c0e2395e96ff-1667558081862.jpg",

                  actualPicture:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/55e240f590f4f67288f4c0e2395e96ff-1667558081862.jpg",

                  coverGifVideo: null,

                  coverAppGifVideo: null,

                  chainName: null,

                  chainContract: null,

                  tradeHash: null,

                  contractAddress: null,

                  nftId: null,

                  amountLike: 0,

                  typeMarket: 2,

                  typeCommodity: null,

                  typeFile: 1,

                  label: "",

                  description: "",

                  price: "1.00",

                  amountSku: 10,

                  statusNumber: 1,

                  sharePic: "",

                  statusGive: null,

                  gifFirstImageUrl: null,

                  seller: null,

                  saleQuantity: null,

                  commodityCategoryUuid: "103f5b16e0b877c33ee5bf80b5f47429",

                  statusSale: 1,

                  statusSell: 0,

                  sourcePlatform: null,

                  extendsData: null,

                  id: "a78785a00a77d0c44f41b952cfb7f6a9",
                },

                author: {
                  name: "【唯一艺术·数字艺术工作室】",

                  nickname: "【唯一艺术·数字艺术工作室】",

                  cover:
                    "https://theoneart-common.oss-cn-qingdao.aliyuncs.com/api/file/2021-12-13/675dd30354f43293975e8723cc76a98a1639364792702.jpeg",

                  level: 3,

                  description:
                    "测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测",

                  id: "98ce2221777449433b7cc6dbf444c86a",
                },

                approve: {
                  auditMessage: "系统自动通过",

                  statusAudit: 1,

                  id: "c8980580fea322182e22db4823e1f01b",
                },

                number: 2,

                honorFlag: 0,

                typeSale: 2,

                presaleInfo: {
                  depositAmount: "0.20",

                  depositRatio: "20%",

                  balanceAmount: "0.80",

                  depositDay: 10,

                  indemnityAmount: "0.42",

                  indemnityFee: "0.02",

                  status: 1,

                  statusCancel: 0,
                },

                id: "c6ed702a3ad2e17047f7f32aa42f793b",
              },

              {
                saleRecordNo: "SR1588481582006534146",

                price: "1.00",

                amount: 1,

                amountSold: 0,

                amountAvailable: 0,

                amountLock: 1,

                statusSale: 5,

                createTime: "2022-11-04 18:41:36",

                commodity: {
                  name: "已出售 定金已付 已付尾款 ，禁止购买",

                  cover:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/5df2e5f9028b93e597fd355d45045e65-1667558130801.jpg",

                  actualPicture:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/5df2e5f9028b93e597fd355d45045e65-1667558130801.jpg",

                  coverGifVideo: null,

                  coverAppGifVideo: null,

                  chainName: null,

                  chainContract: null,

                  tradeHash: null,

                  contractAddress: null,

                  nftId: null,

                  amountLike: 0,

                  typeMarket: 2,

                  typeCommodity: null,

                  typeFile: 1,

                  label: "",

                  description: "唯一艺术测试商品，请勿购买！",

                  price: "1.00",

                  amountSku: 10,

                  statusNumber: 1,

                  sharePic: "",

                  statusGive: null,

                  gifFirstImageUrl: null,

                  seller: null,

                  saleQuantity: null,

                  commodityCategoryUuid: "291e13d820c3e8e1517b2213d22fffef",

                  statusSale: 1,

                  statusSell: 0,

                  sourcePlatform: null,

                  extendsData: null,

                  id: "4b57f60b054036a662e05259b5d87ffb",
                },

                author: {
                  name: "【唯一艺术·数字艺术工作室】",

                  nickname: "【唯一艺术·数字艺术工作室】",

                  cover:
                    "https://theoneart-common.oss-cn-qingdao.aliyuncs.com/api/file/2021-12-13/675dd30354f43293975e8723cc76a98a1639364792702.jpeg",

                  level: 3,

                  description:
                    "测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测",

                  id: "98ce2221777449433b7cc6dbf444c86a",
                },

                approve: {
                  auditMessage: "系统自动通过",

                  statusAudit: 1,

                  id: "20d81fcf0d3c77b9f4576500f7695b17",
                },

                number: 1,

                honorFlag: 0,

                typeSale: 2,

                presaleInfo: {
                  depositAmount: "0.20",

                  depositRatio: "20%",

                  balanceAmount: "0.80",

                  depositDay: 10,

                  indemnityAmount: "0.42",

                  indemnityFee: "0.02",

                  status: 1,

                  statusCancel: 0,
                },

                id: "10e4cfa899c8d22bd140aa0e46df8299",
              },

              {
                saleRecordNo: "SR1588481147078180865",

                price: "1.00",

                amount: 1,

                amountSold: 0,

                amountAvailable: 0,

                amountLock: 1,

                statusSale: 5,

                createTime: "2022-11-04 18:39:52",

                commodity: {
                  name: "已出售 定金已付 未付尾款，禁止购买",

                  cover:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/55e240f590f4f67288f4c0e2395e96ff-1667558081862.jpg",

                  actualPicture:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/55e240f590f4f67288f4c0e2395e96ff-1667558081862.jpg",

                  coverGifVideo: null,

                  coverAppGifVideo: null,

                  chainName: null,

                  chainContract: null,

                  tradeHash: null,

                  contractAddress: null,

                  nftId: null,

                  amountLike: 0,

                  typeMarket: 2,

                  typeCommodity: null,

                  typeFile: 1,

                  label: "",

                  description: "",

                  price: "1.00",

                  amountSku: 10,

                  statusNumber: 1,

                  sharePic: "",

                  statusGive: null,

                  gifFirstImageUrl: null,

                  seller: null,

                  saleQuantity: null,

                  commodityCategoryUuid: "103f5b16e0b877c33ee5bf80b5f47429",

                  statusSale: 1,

                  statusSell: 0,

                  sourcePlatform: null,

                  extendsData: null,

                  id: "a78785a00a77d0c44f41b952cfb7f6a9",
                },

                author: {
                  name: "【唯一艺术·数字艺术工作室】",

                  nickname: "【唯一艺术·数字艺术工作室】",

                  cover:
                    "https://theoneart-common.oss-cn-qingdao.aliyuncs.com/api/file/2021-12-13/675dd30354f43293975e8723cc76a98a1639364792702.jpeg",

                  level: 3,

                  description:
                    "测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测",

                  id: "98ce2221777449433b7cc6dbf444c86a",
                },

                approve: {
                  auditMessage: "系统自动通过",

                  statusAudit: 1,

                  id: "e6c53c7acb5704f48888a1d3590301c4",
                },

                number: 1,

                honorFlag: 0,

                typeSale: 2,

                presaleInfo: {
                  depositAmount: "0.20",

                  depositRatio: "20%",

                  balanceAmount: "0.80",

                  depositDay: 10,

                  indemnityAmount: "0.42",

                  indemnityFee: "0.02",

                  status: 1,

                  statusCancel: 0,
                },

                id: "0ca9ff7d574110c0a303a5aa0561164d",
              },

              {
                saleRecordNo: "SR1588363050715566082",

                price: "1.00",

                amount: 1,

                amountSold: 0,

                amountAvailable: 0,

                amountLock: 1,

                statusSale: 5,

                createTime: "2022-11-04 10:50:36",

                commodity: {
                  name: "荣誉2测试商品，禁止购买",

                  cover:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/42015a14f7c9e0757715f0191bd82012-1663729743597.jpg",

                  actualPicture:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/42015a14f7c9e0757715f0191bd82012-1663729743597.jpg",

                  coverGifVideo: null,

                  coverAppGifVideo: null,

                  chainName: null,

                  chainContract: null,

                  tradeHash: null,

                  contractAddress: null,

                  nftId: null,

                  amountLike: 0,

                  typeMarket: 2,

                  typeCommodity: null,

                  typeFile: 1,

                  label: "",

                  description: "唯一艺术测试商品，请勿购买！",

                  price: "1.00",

                  amountSku: 100,

                  statusNumber: 1,

                  sharePic: "",

                  statusGive: null,

                  gifFirstImageUrl: null,

                  seller: null,

                  saleQuantity: null,

                  commodityCategoryUuid: "f1032a292c7fed3de15ed091d5dd0b7d",

                  statusSale: 1,

                  statusSell: 1,

                  sourcePlatform: null,

                  extendsData: null,

                  id: "5ea9646cce5b2a2b064df8cfdf624af4",
                },

                author: {
                  name: "【唯一艺术·数字艺术工作室】",

                  nickname: "【唯一艺术·数字艺术工作室】",

                  cover:
                    "https://theoneart-common.oss-cn-qingdao.aliyuncs.com/api/file/2021-12-13/675dd30354f43293975e8723cc76a98a1639364792702.jpeg",

                  level: 3,

                  description:
                    "测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测",

                  id: "98ce2221777449433b7cc6dbf444c86a",
                },

                approve: {
                  auditMessage: "系统自动通过",

                  statusAudit: 1,

                  id: "0e257041eefd77110e20b451c7b8c6a7",
                },

                number: 13,

                honorFlag: 0,

                typeSale: 2,

                presaleInfo: {
                  depositAmount: "0.20",

                  depositRatio: "20%",

                  balanceAmount: "0.80",

                  depositDay: 10,

                  indemnityAmount: "0.42",

                  indemnityFee: "0.02",

                  status: 1,

                  statusCancel: 0,
                },

                id: "77c9eb6e848870118f7e25fe5dda590d",
              },

              {
                saleRecordNo: "SR1588103714634321922",

                price: "1.00",

                amount: 1,

                amountSold: 0,

                amountAvailable: 0,

                amountLock: 1,

                statusSale: 5,

                createTime: "2022-11-03 17:40:05",

                commodity: {
                  name: "新7测试商品，禁止购买",

                  cover:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/7f209b0d9340a31a12d58f4070886691-1665646941726.jpg",

                  actualPicture:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/7f209b0d9340a31a12d58f4070886691-1665646941726.jpg",

                  coverGifVideo: null,

                  coverAppGifVideo: null,

                  chainName: null,

                  chainContract: null,

                  tradeHash: null,

                  contractAddress: null,

                  nftId: null,

                  amountLike: 0,

                  typeMarket: 2,

                  typeCommodity: null,

                  typeFile: 1,

                  label: "",

                  description: "",

                  price: "1.00",

                  amountSku: 20,

                  statusNumber: 1,

                  sharePic: "",

                  statusGive: null,

                  gifFirstImageUrl: null,

                  seller: null,

                  saleQuantity: null,

                  commodityCategoryUuid: "f1032a292c7fed3de15ed091d5dd0b7d",

                  statusSale: 1,

                  statusSell: 0,

                  sourcePlatform: null,

                  extendsData: null,

                  id: "48693df0496c9858a482f7e0dfddc9ee",
                },

                author: {
                  name: "【唯一艺术·数字艺术工作室】",

                  nickname: "【唯一艺术·数字艺术工作室】",

                  cover:
                    "https://theoneart-common.oss-cn-qingdao.aliyuncs.com/api/file/2021-12-13/675dd30354f43293975e8723cc76a98a1639364792702.jpeg",

                  level: 3,

                  description:
                    "测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测",

                  id: "98ce2221777449433b7cc6dbf444c86a",
                },

                approve: {
                  auditMessage: "系统自动通过",

                  statusAudit: 1,

                  id: "29ec183b9ebfb891f95c950bb539c0c2",
                },

                number: 13,

                honorFlag: 0,

                typeSale: 2,

                presaleInfo: {
                  depositAmount: "0.20",

                  depositRatio: "20%",

                  balanceAmount: "0.80",

                  depositDay: 10,

                  indemnityAmount: "0.42",

                  indemnityFee: "0.02",

                  status: 1,

                  statusCancel: 0,
                },

                id: "7c451ab39d4e7dd3a21408aaf14c7c4b",
              },

              {
                saleRecordNo: "SR1588079998818844674",

                price: "1.00",

                amount: 1,

                amountSold: 0,

                amountAvailable: 0,

                amountLock: 1,

                statusSale: 5,

                createTime: "2022-11-03 16:05:51",

                commodity: {
                  name: "定金支付成功，禁止购买",

                  cover:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/3c20436b330b21cf8a8cbddadffc8f44-1667462676795.jpg",

                  actualPicture:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/3c20436b330b21cf8a8cbddadffc8f44-1667462676795.jpg",

                  coverGifVideo: null,

                  coverAppGifVideo: null,

                  chainName: null,

                  chainContract: null,

                  tradeHash: null,

                  contractAddress: null,

                  nftId: null,

                  amountLike: 0,

                  typeMarket: 2,

                  typeCommodity: null,

                  typeFile: 1,

                  label: "",

                  description: "唯一艺术测试商品，请勿购买！",

                  price: "1.00",

                  amountSku: 110,

                  statusNumber: 1,

                  sharePic: "",

                  statusGive: null,

                  gifFirstImageUrl: null,

                  seller: null,

                  saleQuantity: null,

                  commodityCategoryUuid: "f1032a292c7fed3de15ed091d5dd0b7d",

                  statusSale: 1,

                  statusSell: 0,

                  sourcePlatform: null,

                  extendsData: null,

                  id: "a11783d8d7bd28e8d6301ce8c927d8a1",
                },

                author: {
                  name: "【唯一艺术·数字艺术工作室】",

                  nickname: "【唯一艺术·数字艺术工作室】",

                  cover:
                    "https://theoneart-common.oss-cn-qingdao.aliyuncs.com/api/file/2021-12-13/675dd30354f43293975e8723cc76a98a1639364792702.jpeg",

                  level: 3,

                  description:
                    "测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测",

                  id: "98ce2221777449433b7cc6dbf444c86a",
                },

                approve: {
                  auditMessage: "系统自动通过",

                  statusAudit: 1,

                  id: "38ec5feecae01c1fa3621cb1772b1f19",
                },

                number: 1,

                honorFlag: 0,

                typeSale: 2,

                presaleInfo: {
                  depositAmount: "0.20",

                  depositRatio: "20%",

                  balanceAmount: "0.80",

                  depositDay: 10,

                  indemnityAmount: "0.42",

                  indemnityFee: "0.02",

                  status: 1,

                  statusCancel: 0,
                },

                id: "8efcd76086ad12a5e2e3cde6e5d24b7e",
              },

              {
                saleRecordNo: "SR1588011162690125826",

                price: "1.00",

                amount: 1,

                amountSold: 0,

                amountAvailable: 0,

                amountLock: 1,

                statusSale: 5,

                createTime: "2022-11-03 11:32:19",

                commodity: {
                  name: "测试荣誉，禁止购买",

                  cover:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermarkResize/98ce2221777449433b7cc6dbf444c86a/e9fdd330358ebf01d2d2ca0557c42311-16639305342310.5.jpg",

                  actualPicture:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/98ce2221777449433b7cc6dbf444c86a/e9fdd330358ebf01d2d2ca0557c42311-1663930534231.jpg",

                  coverGifVideo: null,

                  coverAppGifVideo: null,

                  chainName: null,

                  chainContract: null,

                  tradeHash: null,

                  contractAddress: null,

                  nftId: null,

                  amountLike: 0,

                  typeMarket: 2,

                  typeCommodity: null,

                  typeFile: 1,

                  label: "",

                  description: "",

                  price: "1.00",

                  amountSku: 10,

                  statusNumber: 1,

                  sharePic: "",

                  statusGive: null,

                  gifFirstImageUrl: null,

                  seller: null,

                  saleQuantity: null,

                  commodityCategoryUuid: "f1032a292c7fed3de15ed091d5dd0b7d",

                  statusSale: 1,

                  statusSell: 1,

                  sourcePlatform: null,

                  extendsData: null,

                  id: "3cd13d8c21e21ed6df39d3ba3e220d6f",
                },

                author: {
                  name: "【唯一艺术·数字艺术工作室】",

                  nickname: "【唯一艺术·数字艺术工作室】",

                  cover:
                    "https://theoneart-common.oss-cn-qingdao.aliyuncs.com/api/file/2021-12-13/675dd30354f43293975e8723cc76a98a1639364792702.jpeg",

                  level: 3,

                  description:
                    "测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测试艺术家备注+测",

                  id: "98ce2221777449433b7cc6dbf444c86a",
                },

                approve: {
                  auditMessage: "系统自动通过",

                  statusAudit: 1,

                  id: "5385e6c2a67615814fe47791c591ac61",
                },

                number: 4,

                honorFlag: 1,

                typeSale: 2,

                presaleInfo: {
                  depositAmount: "0.20",

                  depositRatio: "20%",

                  balanceAmount: "0.80",

                  depositDay: 10,

                  indemnityAmount: "0.42",

                  indemnityFee: "0.02",

                  status: 1,

                  statusCancel: 0,
                },

                id: "5bc5f9ab44356bec18d0063defa5e80f",
              },
            ],

            total: 0,

            size: 12,

            current: 1,

            pages: 0,
          },
        },
      }; */
      this.loading = false;
      console.log(result.data.data.records);
      if (result.data.code == 200) {
        if (
          result.data.data.records.length <= 0 ||
          result.data.data.records.length < this.releaseListParam.pageSize
        ) {
          this.nextStatus = false;
        } else {
          this.nextStatus = true;
        }

        if (BATCH_KYE == this.releaseListParam.statusSale) {
          const dataObj = result.data.data;
          dataObj.records = dataObj.records.map((item) => {
            item.selected = false;
            return item;
          });
          this.releaseListResult = dataObj;
          this.batchSelectStatus = false;
        } else {
          this.releaseListResult = result.data.data;
        }

        this.showEmpty = result.data.data.records.length <= 0;
      } else {
        this.nextStatus = false;
        this.showEmpty = true;
        this.$message.error(result.data.message);
      }
    },
    // 翻页
    handleCurrentChange(idx) {
      if (
        this.batchStatus &&
        BATCH_KYE == this.releaseListParam.statusSale &&
        this.cancelList.length > 0
      ) {
        this.$confirm(
          `当前页已选择 ${this.cancelList.length} 条寄售信息，是否先 [批量取消发布]`,
          "批量取消发布",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          }
        ).then(async () => {
          await this.batchCancel();
        });
      } else {
        this.releaseListParam.pageCount = idx;
        this.releaseList();
      }
    },
    // 搜索
    async search(key, value) {
      if (value != 1 && this.batchStatus) {
        this.quitBatch();
      }
      this.releaseListParam.pageCount = 1;
      this.releaseListParam[key] = value;
      await this.releaseList();
    },
    //批量取消发布
    async batchCancel() {
      const res = await this.$api.service.saleRecord_cancelBatch({
        idList: this.cancelList.map((item) => item.id),
      });
      console.log(res);
      if (res.data.code == 200 && res.data.data) {
        this.$message.success(
          `已成功取消${res.data.data.amountSuccess}条${
            res.data.data.amountFail > 1
              ? `，失败：${res.data.data.amountFail}条`
              : ""
          }`
        );
        //最后一页，全部取消，获取上一页数据

        if (
          this.releaseListResult.records.length == res.data.data.amountSuccess
        ) {
          this.releaseListParam.pageCount = this.releaseListParam.pageCount - 1;
        }
        this.releaseList();
      } else {
        this.$message.error(res.data.message);
      }
    },
    // 取消发布
    cancel(item) {
      if (this.batchStatus) {
        return;
      }
      this.$confirm(
        `您将取消发布【${item.commodity.name}】的寄售信息?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      )
        .then(async () => {
          let result = await this.$api.service.saleRecord_cancel({
            id: item.id,
          });
          if (result && result.data.data && result.data.code == 200) {
            this.$message.success(
              `您已成功取消发布对【${item.commodity.name}】的寄售信息！`
            );
            this.releaseList();
          } else {
            this.$message.error(result.data.message);
          }
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.page-icon {
  height: 32px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 0 10px;
  margin-left: 10px;
  cursor: pointer;
  user-select: none;
  color: rgba(0, 0, 0, 0.2);
  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
  .icon-left {
    background-image: url("//static.theone.art/pc/mine/icon-left.png");
  }
  .icon-right {
    background-image: url("//static.theone.art/pc/mine/icon-right.png");
  }
  &.selected {
    color: #397fe7;
    .icon-left {
      background-image: url("//static.theone.art/pc/mine/icon-left-selected.png");
    }
    .icon-right {
      background-image: url("//static.theone.art/pc/mine/icon-right-selected.png");
    }
  }
}
.m-selected-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .txt {
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    padding-right: 16px;
  }
  .btn {
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
  .disabled {
    background: #e5e5e5;
    color: rgba(0, 0, 0, 0.7);
  }
}
.trade-item-selected {
  border: 1px solid #e61f1a !important;
}
.title-line {
  justify-content: space-between;
  .info {
    display: flex;
    align-items: center;
  }
}
.icon-checkbox {
  width: 18px;
  height: 18px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  display: inline-block;
  cursor: pointer;
}
.m-tool {
  padding: 10px 0;
  min-height: 41px;
  .main {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.batch-cancel {
  font-size: 14px;
  font-weight: 500;
  color: #397fe7;
  text-decoration: underline;
  cursor: pointer;
}
input {
  display: block;
  outline: none;
  width: 18px;
  height: 18px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid #397fe7;
  color: #397fe7;
}
.batch-btn-wrap {
  display: flex;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  .icon-checkbox {
    margin-left: 9px;
  }
}
.v1-trade {
  padding-top: 0;
}

.page-mine-release {
  .loading {
    height: 500px;
  }
  .goods {
    min-width: 220px;
    width: 0;
  }
  .info {
    width: 65%;
  }
  .cover {
    min-width: 70px;
    .honor-img {
      background-image: url("~@/assets/1.0/images/honor-icon.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 16px;
      height: 18px;
      position: absolute;
      top: 0;
      left: 2px;
      z-index: 1;
    }
  }
}
.icon-checkbox-default {
  background-image: url("//static.theone.art/pc/icons/checkbox.png");
}
.icon-checkbox-selected {
  background-image: url("//static.theone.art/pc/icons/checkbox-selected.png");
}
.icon-checkbox-selected-bg {
  background-image: url("//static.theone.art/pc/icons/checkbox-selected-bg.png");
}
</style>
