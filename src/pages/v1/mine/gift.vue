<template>
  <div class="gift-body">
    <div class="mode-mobile">
      <m-header title="我的礼物" />
    </div>
    <status-template
      class="gift-wrap"
      :list="listGift.records"
      api="/goods/api/treasureGive/listGift"
      :init="getTreasureGiveList"
    >
      <div class="v1-goods-list">
        <div
          class="v1-goods-wrap"
          v-for="item in listGift.records"
          :key="item.id"
        >
          <div class="v1-goods">
            <div
              :class="{
                'v1-goods-cover': true,
              }"
              :style="`background-image:url(${
                item.commodity.gif ||
                '//static.theone.art/pc/mine/gift-img.png'
              })  `"
            ></div>
            <!--    <div class="time">获得时间：{{ item.giveTime }}</div> -->
            <!--      <div class="name">{{ item.commodity.name }}</div> -->
            <div class="btn-open" @click="onOpen(item)">打开</div>
            <div class="give-user">
              {{ item.userGive.nickname }}在{{ item.giveTime }}发出赠与,<br />
              赠与发出{{ item.failHour }}小时不接收礼物自动退回。
            </div>
          </div>
        </div>
      </div>
      <div class="v1-pagination">
        <g-paging
          :pageChange="handleCurrentChange"
          :pageSize="params.pageSize"
          :list="listGift.records"
          :current-page="listGift.current"
        />
      </div>
    </status-template>
    <el-dialog
      :visible.sync="isShowGiftInfo"
      append-to-body
      width="460px"
      title="详情"
    >
      <div class="m-gift-wrap">
        <div
          class="preview"
          :style="`background-image:url(${
            currentGift.commodity && currentGift.commodity.cover
          })  `"
        ></div>

        <div class="line">
          艺术家：{{ currentGift.author ? currentGift.author.name : "" }}
        </div>
        <div class="line">数量：X {{ currentGift.amount }}</div>
        <div class="c-name">
          <div>恭喜你获得</div>
          <div class="des-info">
            <div class="name-txt">
              {{ currentGift.commodity ? currentGift.commodity.name : "" }}
            </div>
            <div>x {{ currentGift.amount }}</div>
          </div>
        </div>
        <div class="btn btn-red" @click="onAccept">接收礼物</div>
        <div class="btn btn-dark" @click="onRefuse">谢谢不需要</div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="isShowConfirm"
      append-to-body
      class="m-confirm"
      width="460px"
      title="提示"
      top="25vh"
    >
      <div class="" style="padding-bottom: 15px">
        你忍心退回来自好友的礼物吗！
      </div>
      <div class="btn-group">
        <div class="btn btn-normal" @click="onGoRefuse">坚持退回</div>
        <div class="btn btn-red" @click="onAccept">收下礼物</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import mHeader from "@/components/v1/layout/mobileHeader";
export default {
  components: { mHeader },
  data() {
    return {
      isShowConfirm: false,
      listGift: {
        records: [],
      },
      currentGift: {
        commodity: {},
      },
      isShowGiftInfo: false,
      params: {
        pageCount: 1,
        pageSize: 16,
      },
    };
  },
  created() {
    this.getTreasureGiveList();
  },
  computed: {
    userAttrResult() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    async onAccept() {
      const res = await this.$api.service.treasureGive_operation({
        id: this.currentGift.id,
        type: 1,
      });
      console.log(res);
      if (res.data.code == 200 && res.data.data) {
        this.isShowConfirm = false;
        this.isShowGiftInfo = false;
        this.getTreasureGiveList();
        this.$message.success("已成功接收");
      } else {
        this.$message.error(res.data.message);
      }
    },
    onRefuse() {
      this.isShowConfirm = true;
      /*   this.$confirm(`你忍心退回来自好友的礼物吗！`, "提示", {
        confirmButtonText: "收下礼物",
        cancelButtonText: "坚持退回",
      })
        .then(async () => {
          this.onAccept();
        })
        .catch(async () => {
          const res = await this.$api.service.treasureGive_operation({
            id: this.currentGift.id,
            type: 2,
          });
          if (res.data.code == 200 && res.data.data) {
            this.isShowGiftInfo = false;
            this.getTreasureGiveList();
            this.$message.success("已拒收");
          } else {
            this.$message.error(res.data.message);
          }
        }); */
    },
    async onGoRefuse() {
      const res = await this.$api.service.treasureGive_operation({
        id: this.currentGift.id,
        type: 2,
      });
      if (res.data.code == 200 && res.data.data) {
        this.isShowConfirm = false;
        this.isShowGiftInfo = false;
        this.getTreasureGiveList();
        this.$message.success("已拒收");
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleCurrentChange(val) {
      this.params.pageCount = val;
      this.getTreasureGiveList();
    },
    async getTreasureGiveList() {
      //api财产赠与列表
      const res = await this.$api.service.treasureGive_listGift(this.params);
      if (res.data.code == 200) {
        this.listGift = res.data.data;
      }
    },
    async onOpen(info) {
      this.currentGift = info;
      this.isShowGiftInfo = true;
      console.log(info);
    },
  },
};
</script>
<style lang="scss" scoped>
.gift-body {
  width: 100%;
  height: 100%;
}
.m-confirm {
  .btn-group {
    display: flex;
    justify-content: flex-end;
    .btn {
      width: 96px;
      height: 30px;
      line-height: 30px;
      border-radius: 15px;
      font-size: 14px;
      text-align: center;
      padding: 0;
      border: none;
      margin-left: 10px;
    }
    .btn-red {
      background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
      color: #fff;
    }
    .btn-normal {
      background: #e5e5e5;
      color: rgba(0, 0, 0, 0.7);
    }
  }
}
.v1-goods-list {
  @media screen and (min-width: 0px) and (max-width: 540px) {
    padding-top: 70px;
  }
}
.v1-goods {
  .time {
    font-size: 12px;
    color: #717171;
    margin-bottom: 8px;
  }
  .give-user {
    text-align: center;
    color: #e54444;
  }
}
.btn-open {
  width: 96px;
  line-height: 30px;
  background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
  margin: 10px auto 15px;
}
.m-gift-wrap {
  .preview {
    width: 100%;
    padding-bottom: 40%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    border: 1px solid #eaeaea;
    margin-bottom: 10px;
    margin-top: -20px;
  }
  .line {
    margin-bottom: 4px;
  }
  .c-name {
    font-size: 16px;
    font-weight: 400;
    color: #ffb000;
    text-align: center;
    padding: 10px 0 26px;
    .des-info {
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
      .name-txt {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 280px;
      }
    }
  }
  .btn {
    width: 166px;
    line-height: 30px;
    border-radius: 15px;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    margin: 10px auto;
    cursor: pointer;
  }
  .btn-red {
    background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
    color: #fff;
  }
}
.v1-pagination {
  padding-bottom: 100px;
}
.gift-wrap {
  ::v-deep .section {
    background-color: transparent;
    @media screen and (min-width: 0px) and (max-width: 540px) {
      padding-top: 40vh;
    }
  }
}
</style>
