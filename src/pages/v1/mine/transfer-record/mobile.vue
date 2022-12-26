<template>
  <div class="transfer-record">
    <div class="mode-mobile">
      <m-header title="转移记录" />
    </div>
    <Empty v-if="!dataList.length"></Empty>
    <div class="transfer-list" v-for="(item, i) in dataList" :key="i">
      <div class="title font-24">
        <div class="left">
          <div class="time">转移时间：{{ item.transferTime }}</div>
          <div class="status">{{ item.status }}</div>
        </div>
        <div class="right">{{ statusMap[item.currentStatus] }}</div>
      </div>
      <div class="content font-24">
        <img :src="item.cover" class="cover" alt="" />
        <div class="info">
          <div class="amount">x{{ item.amount }}</div>
          <div class="name font-28">{{ item.name }}</div>
          <div class="order">
            <span class="grey">转移单号：</span
            ><span class="order-num">{{ item.orderNo }}</span>
            <img
              class="icon"
              src="~@/assets/img/icon/copy@2x.png"
              v-clipboard:copy="item.orderNo"
              v-clipboard:success="onCopySuccess"
              v-clipboard:error="onCopyError"
              alt=""
            />
          </div>
        </div>
      </div>
      <div class="operation">
        <div
          class="btn"
          @click="openDialog(item)"
          v-if="item.currentStatus === 2"
        >
          接收明细
        </div>
        <div
          class="btn"
          @click="openDialog(item)"
          v-if="item.currentStatus === 3"
        >
          查看原因
        </div>
      </div>
    </div>
    <div class="v1-pagination">
      <g-paging
        :pageChange="handleCurrentChange"
        :list="dataList"
        :pageSize="pageSize"
        :current-page="pageCount"
      />
    </div>
    <Dialog v-model="dialogShow" :title="dialogTitle">
      <div class="receive-wrap" v-if="dialogType === 2">
        <div class="receive-list" v-for="(item, i) in detailList" :key="i">
          <div class="item">
            <span class="left">藏品编号</span>
            <span class="right">{{ item.number || "-" }}</span>
          </div>
          <div class="item">
            <span class="left">接收/退回时间</span>
            <span class="right">{{ item.operationTime || "-" }}</span>
          </div>
          <div class="item">
            <span class="left">当前状态</span>
            <span class="right">{{ statusMapSku[item.currentStatus] }}</span>
          </div>
        </div>
      </div>

      <div class="dialog-reason" v-if="dialogType === 3">
        {{ failReason }}
      </div>
      <div class="bottom">
        <div class="close-btn" @click="handleClose">我知道了</div>
      </div>
    </Dialog>
  </div>
</template>
<script>
import Empty from "@/components/v1/empty";
import Dialog from "../components/Dialog.vue";
import mHeader from "@/components/v1/m-head";

export default {
  components: {
    Empty,
    Dialog,
    mHeader,
  },
  data() {
    return {
      dialogShow: false,
      dialogTitle: "",
      dialogType: 1,
      pageCount: 1,
      pageSize: 10,
      failReason: "当前转移次数较多，请稍后再试",
      statusMap: {
        1: "转移中",
        2: "转移成功",
        3: "转移失败",
      },
      statusMapSku: {
        1: "待接收",
        2: "已接收",
        3: "已退回",
      },
      dataList: [],
      detailList: [],
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    handleCurrentChange(val) {
      this.pageCount = val;
      this.getListData();
    },
    async getListData() {
      let params = {
        pageSize: this.pageSize,
        pageCount: this.pageCount,
      };
      try {
        let res = await this.$api.service.transferRecord_list(params);
        let records = res?.data?.data?.records;
        console.log(records);
        if (records) {
          this.dataList = records;
        }
      } catch (error) {}
    },
    handleClose() {
      this.dialogShow = false;
    },
    async openDialog(target) {
      if (target.currentStatus === 2) {
        this.dialogTitle = "接收明细";
      }
      if (target.currentStatus === 3) {
        this.failReason = target.reason;
        this.dialogTitle = "转入失败";
      }
      this.dialogType = target.currentStatus;
      this.dialogShow = true;
      let params = {
        orderNo: target.orderNo,
      };
      try {
        let res = await this.$api.service.transferRecord_detail(params);
        let detailList = res?.data?.data;
        if (detailList) {
          this.detailList = detailList;
        }
      } catch (error) {}
    },
    goBack() {
      this.$router.go(-1);
    },
    onCopySuccess() {
      this.$message.success("复制成功");
    },
    onCopyError() {
      this.$message.warning("复制失败");
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .receive-wrap {
  max-height: 6.6rem;
  overflow-y: scroll;
  overflow-x: hidden;
  .receive-list {
    background: #fafafa;
    border-radius: 0.04rem;
    padding: 0.2rem 0.2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 0.2rem;

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 0.33rem;
      font-size: 0.24rem;
      &:not(:last-child) {
        margin-bottom: 0.2rem;
      }
      .left {
        color: #999999;
      }
      .right {
        color: #4d4d4d;
      }
    }
  }
}

::v-deep .dialog-reason {
  color: #666666;
  padding-bottom: 0.08rem;
}

::v-deep .content {
  position: relative;
  .bottom {
    display: flex;
    justify-content: center;
    margin-top: 0.32rem;
    .close-btn {
      font-size: 0.28rem;
      width: 2.76rem;
      height: 0.72rem;
      background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
      border-radius: 0.36rem;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      float: right;
    }
  }
}
.transfer-record {
  width: 100%;

  .v1-pagination {
    padding: 0.5rem 0 0;
  }

  .font-24 {
    font-size: 0.24rem;
  }
  .font-28 {
    font-size: 0.28rem;
  }
  .transfer-list {
    margin-top: 0.16rem;
    background-color: #fff;
    padding: 0.2rem 0.32rem;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 0.71rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      .time {
        color: #999999;
      }
      .status {
        color: #333333;
      }

      .right {
        color: #333333;
      }
    }
    .content {
      height: 2.14rem;
      display: flex;
      color: #4d4d4d;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      height: 1.48rem;
      padding: 0.32rem 0 0.36rem 0;
      box-sizing: content-box;

      .cover {
        width: 1.52rem;
        height: 1.52rem;
        border-radius: 0.04rem;
        margin-right: 0.2rem;
        float: left;
      }

      .info {
        padding: 0.2rem 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name {
          width: 4.6rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .order {
          display: flex;
          .grey {
            color: #999999;
          }
          .order-num {
            display: inline-block;
            width: 3rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .icon {
          width: 0.28rem;
          height: 0.28rem;
          margin-left: 0.08rem;
        }
      }

      .amount {
        color: #999999;
        position: absolute;
        right: 0;
        top: 0.55rem;
      }
    }
    .operation {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      height: 1.03rem;
      .btn {
        width: 3.2rem;
        height: 0.72rem;
        background: #e5e5e5;
        border-radius: 0.36rem;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 0.28rem;
        color: #4d4d4d;
      }
    }
  }
}
</style>
