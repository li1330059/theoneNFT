<template>
  <el-dialog
    class="theone-dialog-radius page-login dialogContain dialog-border filter-mask"
    :visible.sync="isShow"
    append-to-body
    :title="title"
  >
    <div class="log-body">
      <div class="dialog-content">
        <!--     <div class="icon-close iconfont icon-icon_quxiao" @click="hide"></div>
      <div class="log-title">
        <div class="title">抽奖记录</div>
      </div> -->
        <div class="logs-list-wrap">
          <div class="list-bar list-title log-title-bgcolor log-title-color">
            <div class="td number">序号</div>
            <div class="td time">{{ t1 }}</div>
            <div class="td">消耗物品</div>
            <div class="td">{{ t2 }}</div>
          </div>
          <div
            class="list-body"
            v-infinite-scroll="load"
            infinite-scroll-immediate="false"
          >
            <status-template
              :list="list"
              class="cus-status"
              api="/om-goods/api/lottery/logList"
              :init="getList"
            >
            </status-template>
            <div class="list-bar" v-for="(item, idx) in list" :key="idx">
              <div class="td number">
                {{ item.number }}
              </div>
              <div class="td time">{{ item.createTime }}</div>
              <div class="td">{{ item.consumeInfo }}</div>
              <div class="td">
                <span class="see-link-btn">{{ item.awardInfo }}</span>
              </div>
            </div>
          </div>
          <!--       <g-paging
          :pageChange="handleCurrentChange"
          :list="listInfo.records"
          :pageSize="listParams.pageSize"
          :current-page="listInfo.current"
        /> -->
        </div>
        <div class="btn-red ui-btn log-btn-bgcolor log-btn-color" @click="hide">
          确定
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      isShow: false,
      listInfo: {},
      list: [],
      listParams: {
        uuid: "",
        pageCount: 1,
        pageSize: 20,
      },
      isLoad: true,
    };
  },
  props: {
    title: {
      type: String,
      default: "抽奖记录",
    },
    activeObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    t1() {
      return this.activeObj.luckySpinType == "LOTTERY"
        ? "开启记录"
        : "放飞时间";
    },
    t2() {
      return this.activeObj.luckySpinType == "LOTTERY"
        ? "开启物品"
        : "获得物品";
    },
  },
  methods: {
    load() {
      if (this.listParams.pageCount < this.listInfo.pages) {
        console.log("加载");
        this.listParams.pageCount++;
        this.getList();
      }
    },
    seeMore(item) {
      this.$refs.LogsDetailRef.show(item.id);
    },
    show(uuid) {
      this.isShow = true;
      this.listParams.pageCount = 1;
      this.listParams.uuid = uuid;
      this.list = [];
      this.getList();
    },
    hide() {
      this.isShow = false;
    },
    async getList() {
      const res = await this.$api.service.om_goods_lottery_logList(
        this.listParams
      );

      this.listInfo = res.data.data;
      if (res.data.code == 200) {
        if (res.data.data.records.length > 0) {
          this.list = [...this.list, ...res.data.data.records];
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleCurrentChange(page) {
      this.listParams.pageCount = page;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.theone-dialog {
  ::v-deep .el-dialog__body {
    max-width: 1100px;
  }
}
.cus-status {
  ::v-deep .placeholder {
    height: 40vh;
  }
  ::v-deep .com-empty {
    min-height: initial;
  }
}
@import "@/assets/1.0/scss/active/tom.scss";
.log-title-bgcolor {
  background-color: rgba(255, 90, 74, 1);
}
.log-title-color {
  color: #fff;
}
.log-btn-bgcolor {
  background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
}
.log-btn-color {
  color: #fff;
}
.see-link-btn {
  font-size: 12px;
  font-weight: 500;
  color: #397fe7;
  cursor: pointer;
}
.list-body {
  border-right: 1px solid #c5c5c5;
  border-left: 1px solid #c5c5c5;
  border-bottom: 1px solid #c5c5c5;
  max-height: 45vh;

  border-radius: 0 0 10px 10px;
  overflow-y: auto;
}
.log-body {
  /*  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
  } */
}
.log-title {
  .title {
    padding: 30px 0 0 40px;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
  }
}
.dialog-content {
  /*  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 90%;
  max-width: 1100px; */

  background-color: #fff;
  margin-top: -20px;

  border-radius: 10px;
  padding-bottom: 0px;
  .logs-list-wrap {
    padding: 10px 10px 30px;

    .list-bar {
      display: flex;
      min-height: 56px;
      padding: 10px 0;
      align-items: center;
      border-bottom: 1px solid #c5c5c5;
      .td {
        flex: 1;
        text-align: center;
        line-height: 20px;
        padding: 0 10px;
      }
      .number {
        width: 100px;
        flex: initial;
      }
      .time {
        width: 100px;
        flex: initial;
      }
    }

    .list-title {
      border-radius: 10px 10px 0 0px;
    }
  }
  .icon-close {
    position: absolute;
    top: 21px;
    right: 28px;

    font-size: 20px;
    cursor: pointer;
    font-weight: bold;
  }
}
.btn-red {
  display: block;
  width: 90%;
  margin: 0 auto;
  max-width: 500px;
  line-height: 50px;

  border-radius: 25px;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  user-select: none;
}
@media screen and (max-width: 540px) {
  .log-title {
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 0.32rem;
    .title {
      padding: 0.3rem 0 0 0.3rem;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
    }
  }
  .dialog-content {
    /*     position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 90%;
    max-width: 1100px; */
    border-radius: 10px;
    padding-bottom: 0;
    .logs-list-wrap {
      padding: 0.3rem 0rem;

      .list-bar {
        display: flex;
        min-height: 56px;
        padding: 0.02rem;
        align-items: center;
        border-bottom: 1px solid #c5c5c5;
        .td {
          flex: 1;
          text-align: center;
          line-height: 20px;
          padding: 0.02rem 0.08rem;
        }
        .number,
        .time {
          width: 1rem;
          flex: initial;
        }
      }
      .list-title {
        border-radius: 10px 10px 0 0px;
      }
    }
    .icon-close {
      position: absolute;
      top: 0.3rem;
      right: 0.3rem;

      font-size: 0.34rem;
      cursor: pointer;
      font-weight: bold;
    }
  }
}
</style>
