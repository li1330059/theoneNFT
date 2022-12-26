<template>
  <div class="ll-bag-body ll-max-width">
    <m-head></m-head>
    <billing-option
      @timeChange="timeChange"
      @typeChange="typeChange"
      :init-data="listParams"
    ></billing-option>
    <loading v-if="loading"></loading>
    <section
      class="ui-list-wrap"
      v-infinite-scroll="load"
      infinite-scroll-immediate="false"
      v-else
    >
      <div
        class="li hand"
        v-for="(item, index) in list"
        :key="index"
        @click="goDetails(item)"
      >
        <!--   {{item}} -->
        <div class="info">
          <div class="name">{{ item.goodsName }}</div>
          <div class="cut-price" v-if="item.operatorType == 0">
            +{{ $common.formatMoney(item.amount) }}
          </div>
          <div class="price" v-else>
            -{{ $common.formatMoney(item.amount) }}
          </div>
        </div>
        <div class="other">
          <div>
            {{ $common.formatDate(item.createTime, "yyyy-MM-dd") }}
          </div>
          <div v-if="item.type == 1">收款</div>
          <div v-if="item.type == 2">消费</div>
          <div v-if="item.type == 3">充值</div>
          <div v-if="item.type == 4">提现</div>
          <div v-if="item.type == 5">退款</div>
          <div v-if="item.type == 6">收款-定金</div>
          <div v-if="item.type == 7">收款-尾款</div>
          <div v-if="item.type == 10">收款-退赔</div>

          <div v-if="item.type == 8">消费-定金</div>
          <div v-if="item.type == 9">消费-尾款</div>
          <div v-if="item.type == 11">消费-退赔</div>
        </div>
      </div>
      <div class="list-empty" v-if="list.length <= 0"></div>
      <div class="empty" v-if="!isLoad">没有更多内容了</div>
    </section>
    <ll-footer class="fixed-bottom" />
  </div>
</template>
<script>
import MHead from "./components/m-head.vue";
import billingOption from "./components/billing-option.vue";
import llFooter from "./components/ll-footer.vue";
import Loading from "./components/loading.vue";
export default {
  components: { billingOption, llFooter, Loading, MHead },
  data() {
    return {
      loading: true,
      listParams: {
        endTime: "",
        pageCount: 1,
        pageSize: 20,
        startTime: "",
        type: "",
      },
      isLoad: true,
      list: [],
      accountInfo: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.loading = true;
      const time = this.$common.formatDate(new Date(), "yyyy-MM-dd");
      console.log(time);
      this.listParams.endTime = time;
      this.listParams.startTime = time;
      this.getInitList();
    },
    getInitList() {
      this.listParams.pageCount = 1;

      this.list = [];
      this.getList();
    },
    timeChange(info) {
      const time = this.$common.formatDate(info, "yyyy-MM-dd");
      this.listParams.endTime = time;
      this.listParams.startTime = time;
      this.getInitList();
    },
    typeChange(info) {
      this.listParams.type = info.id == -1 ? "" : info.id;
      this.getInitList();
    },

    async getList() {
      const res = await this.$api.service.llAccount_list(this.listParams);
      this.loading = false;
      if (res.data.code == 200) {
        if (res.data.data.records && res.data.data.records.length > 0) {
          this.list = [...this.list, ...res.data.data.records];
          if (res.data.data.records.length >= this.listParams.pageSize) {
            this.isLoad = true;
          } else {
            this.isLoad = false;
          }
        } else {
          this.isLoad = false;
        }
      } else {
        this.isLoad = false;
        this.$message.error(res.data.message);
      }
    },
    load() {
      if (!this.isLoad) {
        return;
      }
      this.listParams.pageCount++;
      this.getList();
    },
    goDetails(item) {
      this.$router.push({
        path: "/ll_bag/billing_details",
        query: {
          item: encodeURIComponent(JSON.stringify(item)),
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.ll-bag-body {
  position: relative;
  padding-top: 16px;
}
.ui-list-wrap {
  background-color: #ffffff;

  height: 640px;
  padding-bottom: 60px;
  overflow-y: auto;
  margin: 0 -22px;
  padding: 0 22px;
  .li {
    padding: 16px 0;
    border-bottom: 1px solid #f7f7f7;
    .info {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      .name {
        color: #333333;
      }
      .price {
        color: #343edf;
      }
      .cut-price {
        color: #ff6e1f;
      }
    }
    .other {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #999999;
      margin-top: 6px;
    }
  }
  .empty {
    font-size: 12px;
    color: #999999;
    text-align: center;
    margin-top: 38px;
  }
  .list-empty {
    width: 100%;
    height: 196px;
    background: url("~@/assets/1.0/images/billing-empty.png") no-repeat;
    background-size: 375px 196px;
    background-position: center;
    margin-top: 31px;
  }
  @media screen and (max-width: 540px) {
    height: 80vh;
    margin: 0;
    padding: 0;
  }
}
.fixed-bottom {
  background-color: #fff;
  @media screen and (max-width: 540px) {
    bottom: 0;
    padding-bottom: 0.32rem;
  }
}
</style>
