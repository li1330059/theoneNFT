<template>
  <div class="transfer-record">
    <div class="nav" @click="goBack">
      <img class="icon" src="~@/assets/img/icon/back@2x.png" alt="" />
      <span>转移记录</span>
    </div>
    <Empty v-if="!dataList.length"></Empty>
    <div class="transfer-list" v-for="(item, i) in dataList" :key="i">
      <div class="title">
        <div class="item">转移时间：{{ item.transferTime }}</div>
        <div class="item">
          转移单号：{{ item.orderNo }}
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
      <div class="content">
        <div class="info">
          <div class="left">
            <img :src="item.cover" class="cover" alt="" />
            <div class="name">{{ item.name }}</div>
          </div>
          <div class="amount">x{{ item.amount }}</div>
        </div>
        <div class="item status">{{ statusMap[item.currentStatus] }}</div>
        <div class="item operation">
          <div @click="openDialog(item)" v-if="item.currentStatus === 2">
            接收明细
          </div>
          <div @click="openDialog(item)" v-if="item.currentStatus === 3">
            查看原因
          </div>
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
            <span class="right">{{ item.number || '-' }}</span>
          </div>
          <div class="item">
            <span class="left">接收/退回时间</span>
            <span class="right">{{ item.operationTime || '-' }}</span>
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
      <div class="close-btn" @click="handleClose">我知道了</div>
    </Dialog>
  </div>
</template>
<script>
import Empty from "@/components/v1/empty";
import Dialog from "../components/Dialog.vue";
export default {
  components: {
    Empty,
    Dialog,
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
  max-height: 460px;
  overflow-y: scroll;
  overflow-x: hidden;
  .receive-list {
    width: 552px;
    // height: 120px;
    background: #fafafa;
    border-radius: 4px;
    padding: 20px 24px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 12px;

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 20px;
      &:not(:last-child) {
        margin-bottom: 10px;
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
  color: #000000;
}

::v-deep .ui-dialog {
  .close-btn {
    width: 96px;
    height: 30px;
    background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
    border-radius: 15px;
    font-size: 14px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    float: right;
    cursor: pointer;
    margin-top: 24px;
  }
}
.transfer-record {
  width: 100%;
  .nav {
    font-size: 14px;
    font-size: 14px;
    display: flex;
    cursor: pointer;
    align-items: center;
    .icon {
      width: 14px;
      height: 14px;
    }
  }
  .transfer-list {
    margin-top: 25px;
    border: 1px solid #e5e5e5;
    .title {
      display: flex;
      align-items: center;
      color: #999999;
      font-size: 12px;
      padding: 0 15px;
      height: 39px;
      background: #f4f4f4;
      .item {
        margin-right: 32px;
        display: flex;
        align-items: center;
      }
      .icon {
        width: 14px;
        height: 14px;
        margin-left: 5px;
        cursor: pointer;
      }
    }
    .content {
      height: 110px;
      display: flex;
      font-size: 14px;
      color: #4d4d4d;

      .info {
        padding-left: 24px;
        // padding-right: 90px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
          width: 70%;
          .name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .cover {
            width: 70px;
            height: 70px;
            border-radius: 2px;
            margin-right: 16px;
            float: left;
          }
        }
        .amount {
          color: #999999;
          width: 20%;
        }
      }

      .item {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .info {
        border-right: 1px solid #e5e5e5;
        width: 44%;
      }
      .status {
        border-right: 1px solid #e5e5e5;
        width: 28%;
      }
      .operation {
        width: 28%;
        display: flex;
        align-items: center;
        justify-content: center;
        div {
          width: 96px;
          height: 30px;
          background: #e5e5e5;
          border-radius: 15px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
