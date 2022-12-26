<template>
  <div class="goods-info-body">
    <div class="good-info-wrap section">
      <section class="goods-title-wrap">
        <div class="goods-name">
          <div>
            {{ goodsInfo.commodity && goodsInfo.commodity.name }}
          </div>

          <commodity-num :treasure="goodsInfo"></commodity-num>
        </div>
        <div class="goods-status">
          <span class="status c1" v-if="goodsInfo.operationType == 1"
            >在售</span
          >
          <span class="status c2" v-if="goodsInfo.operationType == 0"
            >私藏</span
          >
          <span class="status c3" v-if="goodsInfo.operationType == 8"
            >赠与中</span
          >
        </div>
      </section>
      <section class="goods-attr-wrap">
        <div class="block">
          <div class="key">权益属性</div>
          <div class="val">
            <span
              v-if="goodsInfo.commodity && goodsInfo.commodity.typeMarket == 1"
              >版权品</span
            >
            <span
              v-if="goodsInfo.commodity && goodsInfo.commodity.typeMarket == 2"
              >衍生品</span
            >
            <span
              v-if="goodsInfo.commodity && goodsInfo.commodity.typeMarket == 3"
              >数字身份标识艺术品</span
            >
          </div>
        </div>
        <div class="line" v-if="goodsInfo.author"></div>
        <div class="block" v-if="goodsInfo.author">
          <div class="key">艺术家：</div>
          <div class="val ui-flex">
            <span class="ui-icon icon-face"></span>
            <div class="hidden-1">{{ goodsInfo.author.nickname }}</div>
          </div>
        </div>
        <!-- TODO 作者 -->
        <div
          class="line"
          v-if="!goodsInfo.author && goodsInfo.authorName"
        ></div>
        <div class="block" v-if="!goodsInfo.author && goodsInfo.authorName">
          <div class="key">作者：</div>
          <div class="val ui-flex">
            <span class="ui-icon icon-face"></span>
            <div class="hidden-1">{{ goodsInfo.authorName }}</div>
          </div>
        </div>
        <div
          class="line"
          v-if="
            goodsInfo.commodity &&
            goodsInfo.commodity.extendsData &&
            goodsInfo.commodity.extendsData.creator
          "
        ></div>
        <div
          class="block"
          v-if="
            goodsInfo.commodity &&
            goodsInfo.commodity.extendsData &&
            goodsInfo.commodity.extendsData.creator
          "
        >
          <div class="key">创作者：</div>
          <div class="val ui-flex">
            <span class="ui-icon icon-face"></span>
            <div class="hidden-1">
              {{
                goodsInfo.commodity &&
                goodsInfo.commodity.extendsData &&
                goodsInfo.commodity.extendsData.creator
              }}
            </div>
          </div>
        </div>
        <div class="line" v-if="marketVolume.commodityTotalFlag"></div>
        <div
          class="block hand"
          v-if="marketVolume.commodityTotalFlag"
          @click="showTxt(marketVolumeTip)"
        >
          <div class="key flex-y-center flex">
            市场流通量<span class="ui-icon v1-icon-question"></span>
          </div>
          <div class="val ui-flex volume-num">
            <div class="hidden-1">{{ marketVolume.commodityTotal }}</div>
            <!-- <span @click="goVolume()">查看</span> -->
          </div>
        </div>
        <div class="line" v-if="marketVolume.commodityTotalFlag"></div>
        <div class="block" v-if="marketVolume.commodityTotalFlag">
          <div class="key">市场总量：</div>
          <div class="val ui-flex volume-num">
            <div class="hidden-1">{{ marketVolume.commodityTotal }}</div>
            <!-- <span @click="goVolume()">查看</span> -->
          </div>
        </div>
        <!-- TODO 铸造者、发行方 -->
        <div class="line" v-if="goodsInfo.caster"></div>
        <div class="block" v-if="goodsInfo.caster">
          <div class="key">铸造者：</div>
          <div class="val ui-flex">
            <span class="ui-icon icon-face"></span>
            <div class="hidden-1">{{ goodsInfo.caster }}</div>
          </div>
        </div>
        <div class="line" v-if="goodsInfo.issuer"></div>
        <div class="block" v-if="goodsInfo.issuer">
          <div class="key">发行方：</div>
          <div class="val ui-flex">
            <span class="ui-icon icon-face"></span>
            <div class="hidden-1">{{ goodsInfo.issuer }}</div>
          </div>
        </div>
      </section>

      <section class="goods-border-wrap pc-hide flex-between">
        <div class="block">
          <div class="key">权益属性：</div>
          <div class="val">
            <span
              v-if="goodsInfo.commodity && goodsInfo.commodity.typeMarket == 1"
              >版权品</span
            >
            <span
              v-if="goodsInfo.commodity && goodsInfo.commodity.typeMarket == 2"
              >衍生品</span
            >
            <span
              v-if="goodsInfo.commodity && goodsInfo.commodity.typeMarket == 3"
              >数字身份标识艺术品</span
            >
          </div>
        </div>
        <div class="block" v-if="goodsInfo.author">
          <div class="key">艺术家：</div>
          <div class="val ui-flex">
            <span class="ui-icon icon-face"></span>
            <div class="hidden-1">{{ goodsInfo.author.nickname }}</div>
          </div>
        </div>
        <!-- TODO 作者 -->
        <div class="block" v-if="!goodsInfo.author && goodsInfo.authorName">
          <div class="key">作者：</div>
          <div class="val ui-flex">
            <span class="ui-icon icon-face"></span>
            <div class="hidden-1">{{ goodsInfo.authorName }}</div>
          </div>
        </div>
        <div
          class="block"
          v-if="
            goodsInfo.commodity &&
            goodsInfo.commodity.extendsData &&
            goodsInfo.commodity.extendsData.creator
          "
        >
          <div class="key">创作者：</div>
          <div class="val ui-flex">
            <span class="ui-icon icon-face"></span>
            <div class="hidden-1">
              {{
                goodsInfo.commodity &&
                goodsInfo.commodity.extendsData &&
                goodsInfo.commodity.extendsData.creator
              }}
            </div>
          </div>
        </div>
        <!-- TODO 铸造者、发行方 -->
        <div class="block" v-if="goodsInfo.caster">
          <div class="key">铸造者：</div>
          <div class="val ui-flex">
            <span class="ui-icon icon-face"></span>
            <div class="hidden-1">
              {{ goodsInfo.caster }}
            </div>
          </div>
        </div>
        <div class="block" v-if="goodsInfo.issuer">
          <div class="key">发行方：</div>
          <div class="val ui-flex">
            <span class="ui-icon icon-face"></span>
            <div class="hidden-1">
              {{ goodsInfo.issuer }}
            </div>
          </div>
        </div>
      </section>
      <section
        class="goods-border-wrap pc-hide flex-between"
        v-if="marketVolume.commodityTotalFlag"
        @click="showTxt(marketVolumeTip)"
      >
        <div class="block hand">
          <div class="key flex-y-center flex">
            市场流通量<span class="ui-icon v1-icon-question"></span> ：
          </div>
          <div class="val volume-num">
            {{ marketVolume.commodityTotal }}
            <!-- <div class="go-volume" @click="goVolume()"></div> -->
          </div>
        </div>
      </section>

      <section class="goods-border-wrap flex-between">
        <div class="block">
          <div class="key">首发方：</div>
          <div class="val">{{ artist }}</div>
        </div>
        <div class="block">
          <div class="key">拥有者：</div>
          <div class="val">{{ goodsInfo.user && goodsInfo.user.nickname }}</div>
        </div>
        <div class="block">
          <div class="key">获得时间：</div>
          <div class="val">
            {{
              $common.formatDate(goodsInfo.createTime, "yyyy-MM-dd HH:mm:ss")
            }}
          </div>
        </div>
        <!-- TODO 新增到期时间 -->
        <div class="block" v-if="goodsInfo.expireTime">
          <div class="key">到期时间：</div>
          <div class="val">
            {{
              $common.formatDate(goodsInfo.expireTime, "yyyy-MM-dd HH:mm:ss")
            }}
          </div>
        </div>
        <div class="block">
          <div class="key">所属分类：</div>
          <div class="val flex flex-center category">
            <div class="item" v-for="(item, idx) in category" :key="idx">
              {{ item.name }}<span v-if="idx < category.length - 1"> ></span>
            </div>
          </div>
        </div>
        <!--       <div
          class="block"
          v-if="goodsInfo.seriesWorks && goodsInfo.seriesWorks.name"
        >
          <div class="key">系列：</div>
          <div class="val">
            {{ goodsInfo.seriesWorks.name }}
          </div>
        </div> -->
      </section>
      <div class="t1">认证信息</div>
      <section class="goods-border-wrap flex-between">
        <div class="block">
          <div class="key">
            <el-popover
              placement="top-start"
              title
              width="260"
              trigger="hover"
              content=" 智能合约是存储在区块链网络中的一段代码，它界定了各方使用合同的条件。
                      所以如果需要的条件被满足，就被自动执行。合约地址是指该智能合约的合同编号（ID）"
            >
              <div slot="reference">
                <div class="v1-icon-question">合约地址</div>
              </div>
            </el-popover>
          </div>
          <div class="val">
            <copy
              v-if="$authInfomation.contractAddress(goodsInfo)"
              class="m-copy-blue"
              @listen="
                $authInfomation.goContractAddress(
                  $authInfomation.getChainName(goodsInfo),
                  $authInfomation.contractAddress(goodsInfo),
                  $authInfomation.getChainContract(goodsInfo)
                )
              "
              :is-full="false"
              :short="6"
              :txt="$authInfomation.contractAddress(goodsInfo)"
            />
            <div v-else>上链确认中</div>
          </div>
        </div>
        <div class="block">
          <div class="key">
            <el-popover
              placement="top-start"
              title
              width="260"
              trigger="hover"
              content="数字艺术品在链上的唯一序号。"
            >
              <div slot="reference">
                <div class="v1-icon-question">认证标识</div>
              </div>
            </el-popover>
          </div>
          <div class="val">
            <copy
              v-if="$authInfomation.getNftId(goodsInfo)"
              class="m-copy-blue"
              @listen="
                $authInfomation.goNftId(
                  $authInfomation.getChainName(goodsInfo),
                  $authInfomation.contractAddress(goodsInfo),
                  $authInfomation.getNftId(goodsInfo),
                  $authInfomation.getChainContract(goodsInfo)
                )
              "
              :short="6"
              :is-full="false"
              :txt="$authInfomation.getNftId(goodsInfo)"
            />
            <div v-else>上链确认中</div>
          </div>
        </div>
        <div class="block">
          <div class="key">认证标准</div>
          <div class="val">
            {{
              $authInfomation.getChainContract(goodsInfo)
                ? $authInfomation.getChainContract(goodsInfo)
                : "上链确认中"
            }}
          </div>
        </div>
        <div class="block">
          <div class="key">认证网络</div>
          <div
            class="val"
            @click="
              $authInfomation.goChain($authInfomation.getChainName(goodsInfo))
            "
          >
            {{
              $authInfomation.getChainName(goodsInfo)
                ? $authInfomation.getChainName(goodsInfo)
                : "上链确认中"
            }}
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    goodsInfo: {
      type: Object,
      default: () => {
        return { commodity: {} };
      },
    },
  },

  data() {
    return {
      marketVolumeTip: {
        name: "市场流通量",
        text: "为平台用户持有的，处于非锁定，非冻结，未销毁等影响数字藏品交易的该数字艺术品总数量。提醒您注意的是，该数量可能收到首发方库存藏品投放，发售，销毁，数字藏品特殊状态产生，解除等因素的影响而发生变化。",
      },
      marketVolume: {},
    };
  },
  watch: {
    goodsInfo: {
      handler(val, oldVal) {
        this.getMarketVolume();
      },
      deep: true, //true 深度监听
    },
  },
  computed: {
    artist() {
      return this.goodsInfo.commodity && this.goodsInfo.commodity.seller
        ? this.goodsInfo.commodity.seller
        : this.goodsInfo.commodity &&
            this.goodsInfo.commodity.extendsData &&
            this.goodsInfo.commodity.extendsData.creator;
    },
    category() {
      let resArr = [];
      const find = (info) => {
        resArr.push({
          name: info.name ? info.name.replace(/市场/gi, "") : "",
          id: info.id,
          level: info.level,
        });
        if (info.children) {
          find(info.children);
        }
      };
      console.log(this.goodsInfo.categoryPath);
      if (this.goodsInfo.categoryPath) {
        find(this.goodsInfo.categoryPath);
      }
      /*      if (
        this.goodsInfo.commodity &&
        this.goodsInfo.commodity.typeMarket == 2
      ) {
        resArr.push({
          name: this.goodsInfo.commodity.name,
          id: "",
          level: "",
        });
      } */
      return resArr;
    },
  },

  created() {
    this.init();
  },
  methods: {
    init() {
      this.getMarketVolumeTip();
    },
    async getMarketVolumeTip() {
      const res = await this.$api.service.getByKey_marketVolumeTip();
      if (res.data.code == 200) {
        this.marketVolumeTip = res.data.data;
      }
    },
    showTxt(obj) {
      this.$confirm(obj.text, `市场流通量说明`, {
        confirmButtonText: "我知道了",
        showCancelButton: false,
        customClass: "mobile-btn-center text-left",
      })
        .then(async () => {})
        .catch(() => {});
    },
    goVolume() {
      this.$router.push({
        path: "/volumeList",
        query: {
          goods: encodeURIComponent(JSON.stringify(this.goodsInfo)),
        },
      });
    },
    async getMarketVolume() {
      const res = await this.$api.service.getMarketVolume({
        commodityUuid: this.goodsInfo.commodity && this.goodsInfo.commodity.id,
      });
      if (res.data.code == 200) {
        this.marketVolume = res.data.data;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.goods-info-body {
}
.good-preview-wrap {
}
.flex-center {
  align-items: center;
}

.pc-hide {
  display: none;
}
.v1-icon-question {
  display: inline-block;
  cursor: pointer;
}
.t1 {
  font-size: 14px;
  color: #000000;
  margin-bottom: 8px;
}
.goods-status {
  .status {
    line-height: 24px;
    border-radius: 4px;
    padding: 0 10px;
    font-size: 12px;
    font-weight: 500;
    display: inline-block;
  }
  .c1 {
    color: rgba(255, 134, 77, 1);
    background-color: rgba(255, 134, 77, 0.3);
  }
  .c2 {
    color: rgba(255, 77, 77, 1);
    background-color: rgba(255, 77, 77, 0.3);
  }
  .c3 {
    color: rgba(255, 197, 77, 1);
    background-color: rgba(255, 222, 77, 0.3);
  }
}
.good-info-wrap {
  flex: 1;
  .key {
    color: rgba(0, 0, 0, 0.4);
    font-size: 14px;
  }
  .val {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.7);
    line-height: 20px;
    flex: 1;
  }
  .category {
    display: flex;
    flex-wrap: wrap;
    span {
      position: relative;
      top: -1px;
      left: 0;
    }
  }
  .goods-title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;

    .goods-name {
      font-size: 26px;
      font-weight: bold;
      color: #000000;
      line-height: 40px;
      display: flex;
      align-items: center;
      flex: 1;
      padding-right: 10px;
    }
  }
  .goods-attr-wrap {
    display: flex;
    margin-bottom: 24px;
    .key {
      font-size: 12px;
    }
    .val {
      font-size: 12px;
      word-break: break-all;
      .item {
        word-break: break-all;
      }
    }
    .line {
      width: 1px;
      height: 35px;
      background-color: rgba(0, 0, 0, 0.1);
      margin: 0 20px;
    }
    .volume-num {
      span {
        color: #397fe7;
        margin-left: 4px;
        cursor: pointer;
      }
    }
  }
  .goods-border-wrap {
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #e3e3e3;
    padding: 16px;
    margin-bottom: 24px;
    .block {
      display: flex;
      margin-bottom: 16px;
      overflow: hidden;
      .key {
        width: 84px;
      }
    }
    .block:last-child {
      margin-bottom: 0;
    }
  }
  .flex-between {
    .block {
      .val {
        justify-content: flex-end;
        display: flex;
      }
    }
  }
}
.icon-face {
  background-image: url("//static.theone.art/pc/icons/icon-author.png");
}
.ui-flex {
  display: flex;
  align-items: center;
  .icon-face {
    margin-right: 2px;
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .pc-hide {
    display: block;
  }
  .good-info-wrap {
    flex: 1;
    .key {
      color: rgba(0, 0, 0, 0.4);
      font-size: 14px;
    }
    .val {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.7);
      line-height: 20px;
    }
    .goods-title-wrap {
      display: none;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;

      .goods-name {
        font-size: 26px;
        font-weight: bold;
        color: #000000;
        line-height: 40px;
        display: flex;
        align-items: center;
        max-width: 400px;
        overflow: hidden;
      }
    }
    .goods-attr-wrap {
      display: none;
      margin-bottom: 24px;
      .key {
        font-size: 12px;
      }
      .val {
        font-size: 12px;
      }
      .line {
        width: 1px;
        height: 35px;
        background-color: rgba(0, 0, 0, 0.1);
        margin: 0 20px;
      }
    }
    .volume-num {
      display: flex;
      align-items: center;
      .go-volume {
        background-image: url("~@/assets/1.0/images/arrowright2@2x.png");
        background-size: 0.48rem 0.48rem;
        background-repeat: no-repeat;
        background-position: right;
        width: 0.48rem;
        height: 0.48rem;
        margin-left: 0.1rem;
      }
    }
    .goods-border-wrap {
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #e3e3e3;
      padding: 16px;
      margin-bottom: 24px;
      margin-top: 24px;
      .block {
        display: flex;
        margin-bottom: 16px;
        .key {
          width: 84px;
          word-break: keep-all;
        }
      }
      .block:last-child {
        margin-bottom: 0;
      }
    }
    .flex-between {
      .block {
        justify-content: space-between;
      }
    }
  }
}
</style>
