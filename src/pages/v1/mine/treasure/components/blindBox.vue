/* 盲盒 */
<template>
  <div>
	<div class="box-tab">
		<div class="box-tab-on" :class="boxActive==1?'active':''" @click="changeBoxTab(1)">可开启</div>
		<div class="box-tab-off" :class="boxActive==0?'active':''" @click="changeBoxTab(0)">不可开启</div>
	</div>
    <div ref="contentRef" class="blind-wrap">
      <!--       <div class="content-title">
        <span class="left" />盲盒专场<span class="right" />
      </div> -->
      <div class="open-box-wrap" v-if="resList.length > 0&&boxActive==1">
        <div class="left">
          <span class="ui-icon icon-party"></span>
          <div class="info">
            <div class="title">一键开启盲盒</div>
            <div class="des">一键开启多个您拥有的盲盒</div>
          </div>
        </div>
        <div class="btns">
          <div class="ui-btn ui-btn-red" @click="goBatchOpen">去开启</div>
        </div>
      </div>

      <div class="v1-goods-list">
        <div
          class="v1-goods-wrap"
          v-for="(item, idx) in resList"
          :key="item.id"
          @click="onOpenBox(item, idx)"
        >
          <div class="v1-goods">
            <div
              :class="{
                'v1-goods-cover': true,
              }"
            >
              <preview-img
                v-if="item.commodity"
                class="cover-wrap"
                :info="item"
                :isShowPreview="false"
              ></preview-img>
            </div>
            <div class="name">{{ item.commodity.name }}</div>
          </div>
        </div>
      </div>
      <div class="list-bottom">
        <status-template
          :list="resList"
          api="/goods/api/treasureSku/listBox"
          :init="getBlindList"
          class="catch"
        >
        </status-template>
      </div>

      <blindBoxAnimate ref="BlindAnimate" :img="show_img" />
      <div id="blind-animate"></div>
    </div>
    <el-dialog
      class="theone-dialog"
      :visible.sync="isShowBatchBox"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="570px"
      :lock-scroll="true"
      title="盲盒开启中"
    >
      <div class="content">
        <div class="progress-wrap">
          <div class="txt">盲盒批量开启中，请勿退出此页面</div>
          <div class="progress-bar-box">
            <div class="progress-bar">
              <div
                class="progress-line"
                :style="`width:${
                  (this.batchOpenList.length / batchList.length) * 100
                }%`"
              >
                <span class="ui-icon icon-bar"></span>
              </div>
            </div>
            <div class="num">
              {{ this.batchOpenList.length }}/{{ batchList.length }}
            </div>
          </div>
        </div>
        <div class="list-wrap">
          <div class="table-title line-bar show">
            <div class="name">盲盒名称</div>
            <div class="des">开启结果</div>
          </div>
          <div class="list-main">
            <!--     <transition-group name="myfade" tag="div"> -->
            <div
              class="line-bar"
              v-for="(item, idx) in batchOpenList"
              :key="idx"
              :class="{ active: idx + 1 == currentPlayIdx, show: idx > 0 }"
            >
              <div class="name hidden-1">{{ item.info.commodity.name }}</div>
              <div v-if="item.isSuccess">
                <div v-if="item.typeDraw">
                  <div class="des warning" v-if="!item.isDraw">
                    恭喜您，中签了！<span class="ui-icon icon-party-2"></span>
                  </div>
                  <div class="des" v-else>很遗憾，您未中签。</div>
                </div>
                <div v-else>
                  <div class="des default-txt">
                    {{ item.openStatus.commoditySku.name }}
                  </div>
                </div>
              </div>
              <div v-else class="des">{{ item.errorMessage }}</div>
            </div>
            <!--      </transition-group> -->
          </div>
        </div>
      </div>
      <div class="ui-btn-group ui-btn-center">
        <div
          class="ui-btn ui-btn-red"
          :class="{
            'ui-btn-disabled': this.batchOpenList.length !== batchList.length,
          }"
          @click="onOver"
        >
          {{ isOverSuccess ? "收下" : "关闭" }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import blindBoxAnimate from "./blindBoxAnimate.vue";
import { MessageBox } from "element-ui";
import StatusTemplate from "../../../../../components/v1/status-template.vue";
export default {
  components: { blindBoxAnimate, StatusTemplate },
  data() {
    return {
      currentPlayIdx: 1,
      currentCount: 1,
      isBottom: false,
      isShowBatchBox: false,
      show_img: "",
      blind_box_params: {
        pageCount: 1,
        pageSize: 8,
        blindBoxDraw: 0,
		blindBoxOpen:1
      },
      blind_box_list: {
        records: [],
      },
      resList: [],
      batchList: [],
      batchOpenList: [],
      isOverSuccess: true,
	  boxActive:1
    };
  },

  mounted() {
    this.getBlindList();
    window.addEventListener("scroll", this.scroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scroll, false);
  },
  methods: {
    init() {},
	changeBoxTab(item) {
		this.boxActive = item;
		this.blind_box_params.blindBoxOpen = item;
		this.blind_box_params.pageCount = 1;
		this.resList = [];
		this.getBlindList();
	},
    onOver() {
      if (this.batchOpenList.length == this.batchList.length) {
        this.isShowBatchBox = false;
        this.blind_box_params.pageCount = 1;
        this.resList = [];
        this.getBlindList();
      }
    },
    delayTime() {
      return new Promise((resolve, reject) => {
        // return / await 等待执行完
        setTimeout(() => {
          resolve("延迟");
        }, 700);
      });
    },
    async goBatchOpen() {
      const res = await this.$api.service.treasureSku_listBox({
        pageCount: 1,
        pageSize: 100,
        blindBoxDraw: 0,
		blindBoxOpen: this.blind_box_params.blindBoxOpen
      });
      if (res.data.code == 200) {
        this.batchList = res.data.data.records;
        this.$confirm(
          `您本次可一键开启<span style="color:#D0021B">${this.batchList.length}</span>个盲盒，确定开启吗？`,
          "一键开盲盒",
          {
            confirmButtonText: "确定开启",
            cancelButtonText: "取消",
            // type: "warning",
            dangerouslyUseHTMLString: true,
          }
        )
          .then(async () => {
            this.isShowBatchBox = true;
            this.isOverSuccess = true;
            this.batchOpenList = [];
            this.batchOpen();
          })
          .catch(() => {});
      } else {
        this.$message.error(res.data.message);
      }
    },
    async batchOpen() {
      for (let i = 0; i < this.batchList.length; i++) {
        this.currentPlayIdx = -1;
        setTimeout(() => {
          this.currentPlayIdx = 1;
        }, 260);
        const info = this.batchList[i];
        const params = {
          commodityId: info.commodity.id,
          treasureSkuId: info.id,
        };
        await this.delayTime();
        const res = await this.$api.service.play_treasureSku_openBox(params);
        let openStatus = res.data.data;
        let isSuccess = false;
        let isDraw = false;
        let typeDraw = "",
          errorMessage = "";
        const checkDraw = (info, txt) => {
          if (info.commoditySku && info.commoditySku.name.search(txt) !== -1) {
            return true;
          }
          return false;
        };
        if (res.data.code == 200) {
          this.isOverSuccess = true;
          //成功
          isDraw = checkDraw(openStatus, "未中签");
          isSuccess = true;
          typeDraw = checkDraw(openStatus, "中签");
        } else {
          //失败
          this.isOverSuccess = false;
          isSuccess = false;
          errorMessage = res.data.message;
        }
        this.batchOpenList.unshift({
          idx: i,
          info,
          openStatus,
          isSuccess,
          isDraw,
          typeDraw,
          errorMessage,
        });
      }
    },
    scroll() {
      const scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      /*      const clientHeight = document.documentElement.clientHeight;
      const scrollHeight = document.body.scrollHeight; */

      /*       console.log(viewHeight); */
      var fullHeight = this.$refs.contentRef.offsetHeight
        ? this.$refs.contentRef.offsetHeight
        : document.documentElement.clientHeight;
      if (fullHeight - scrollTop <= 1000 && !this.isBottom) {
        this.isBottom = true;
        console.log("到底了");

        this.blind_box_params.pageCount++;
        this.getBlindList();
      }
    },
    async getBlindList() {
      const result = await this.$api.service.treasureSku_listBox(
        this.blind_box_params
      );

      if (result && result.data.code == 200) {
        this.blind_box_list = result.data.data;
        if (
          this.blind_box_list.records &&
          this.blind_box_list.records.length > 0
        ) {
          this.resList = [...this.resList, ...this.blind_box_list.records];
          this.isBottom = false;
        } else {
          this.isBottom = true;
        }
      } else {
        this.$message.error(result.data.message);
      }
    },
    handleCurrentChange(page) {
      this.blind_box_params.pageCount = page;
      this.getBlindList();
    },
    onOpenBox(info, idx) {
      this.$confirm("亲，确认开启您的盲盒？", "", {
        confirmButtonText: "打开",
        cancelButtonText: "合上",
        type: "",
      })
        .then(async () => {
          this.openBox(info, idx);
        })
        .catch(() => {});
    },
    upList(idx) {
      console.log();
      const newList = JSON.parse(JSON.stringify(this.resList));
      newList.splice(idx, 1);
      this.resList = newList;
    },
    async openBox(info, idx) {
      const self = this;
      const start_time = new Date();
      this.$nextTick(() => {
        this.show_img =
          info.commodity.gif || "//static.theone.art/pc/category/blind-box.gif";
        this.$refs.BlindAnimate.init();
      });
      const params = { commodityId: info.commodity.id, treasureSkuId: info.id };

      const res = await this.$api.service.play_treasureSku_openBox(
        params,
        () => {}
      );

      if (res && res.data.code == 200) {
        this.upList(idx);

        const now_time = new Date();
        const between_time = now_time.getTime() - start_time.getTime();
        const delay = 2 * 1000; //s
        if (between_time >= delay) {
          playAnimate();
        } else {
          setTimeout(() => {
            playAnimate();
          }, delay - between_time);
        }
        function playAnimate() {
          self.$refs.BlindAnimate.showLetter(res.data.data);
        }
      } else if (res.data.code == 503) {
        //服务器问题
        self.$refs.BlindAnimate.hide();
        MessageBox.alert(
          "活动太火爆了，距离抽中隐藏款又进一步，再点一下攒攒欧气再开吧～",
          {
            confirmButtonText: "确定",
            callback: (action) => {},
          }
        );
      } else {
        self.$refs.BlindAnimate.hide();
        this.$message.error(res.data.message);
      }
    },
    update(info) {
      //更新我的藏品
      console.log(info);

      /*       this.$parent.getTreasureList(); */
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .m-header {
  z-index: 99999;
  box-shadow: 0px 2px 4px 0px rgba(131, 131, 131, 0.1);
}
.box-tab{
	padding: 4px;
	display: flex;
	border-radius: 4px;
	border: 1px solid #D8D8D8;
	width: fit-content;
	margin-top: 24px;
	margin-bottom: 4px;
	div{
		color: rgba(0, 0, 0, 0.4);
		font-size: 14px;
		line-height: 20px;
		padding: 4px 20px;
		border-radius: 3px;
		cursor: pointer;
	}
	.active{
		background: rgba(230,31,26, .09);
		color: #E61F1A;
	}
	@media screen and (min-width: 0px) and (max-width: 540px) {
		margin-left: .32rem;
		margin-top: .36rem;
	}
}
.blind-wrap {
  padding-top: 20px;
}
.myfade-enter-active,
.myfade-leave-active {
  transition: all 0.8s linear;
}
/* 进场的瞬间与离场的效果添加 */
.myfade-enter,
.myfade-leave-to {
  opacity: 0;
  /*   transform: translateX(200px); */
}
.theone-dialog {
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .progress-wrap {
    padding: 0 24px;
    .txt {
      font-size: 14px;
      font-weight: 400;
      color: #ed362d;
      margin-bottom: 24px;
      margin-top: 16px;
    }
  }
  .ui-btn-group {
    padding: 33px 0;
  }
  .progress-bar-box {
    margin-bottom: 30px;
    padding: 10px 0;
    overflow: hidden;
    display: flex;
    .num {
      width: 38px;
      text-align: right;
      font-size: 12px;
      color: #000000;
    }
  }
  .progress-bar {
    flex: 1;
    height: 14px;
    background: #f5f5f5;
    border-radius: 100px;
    position: relative;
    .progress-line {
      transition: all ease-out 0.7s;
      border-radius: 100px;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
      .icon-bar {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
        width: 36px;
        height: 31px;
      }
    }
  }
  .list-wrap {
    transition: all ease-out 0.26s;
    .table-title {
      padding: 14px 24px;
      background: #fff9f9;
      font-size: 16px;
      font-weight: 400;
      color: #201207;
    }
    .line-bar {
      display: flex;
      align-items: center;
      padding: 0 24px;
      transition: all ease-out 0.2s;
      opacity: 0;
      height: 50px;
      .name {
        width: 286px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.7);
      }
      .des {
        flex: 1;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
      }
      .warning {
        color: #ed362d;
        display: flex;
        align-items: center;

        .ui-icon {
          position: relative;
          top: -2px;
        }
      }
      .default-txt {
        color: rgba(0, 0, 0, 0.7);
      }
    }
    .active {
      opacity: 1;
    }
    .show {
      opacity: 1;
    }
    .list-main {
      height: 30vh;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
}
.icon-bar {
  background-image: url("//static.theone.art/pc/icons/icon-progress-top.png");
}
.open-box-wrap {
  display: flex;
  align-items: center;
  max-width: 532px;
  width: 100%;

  background: #ffffff;
  border-radius: 4px;
  justify-content: space-between;
  padding: 12px 20px;
  margin: 0 auto 32px;
  .left {
    display: flex;
    align-items: center;
    .title {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
    }
    .des {
      font-size: 12px;
      font-weight: 400;
      color: #666666;
      margin-top: 2px;
    }
    .info {
      padding-left: 9px;
    }
  }
}
.icon-party {
  width: 46px;
  height: 41px;
  background-image: url("//static.theone.art/pc/icons/icon-party.png");
}
.icon-party-2 {
  width: 46px;
  height: 41px;
  background-image: url("//static.theone.art/pc/icons/icon-party-2.png");
}
.list-bottom {
  position: relative;
  height: 160px;
  top: 0;
  left: 0;
  .catch {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    ::v-deep .section {
      background-color: transparent;
      img {
        width: 160px;
      }
    }
  }
}
.content-title {
  font-size: 20px;
  font-weight: bold;
  color: #e61f1a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 60px 0;
  span {
    display: inline-block;
    width: 73px;
    height: 6px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    margin: 0 30px;
  }
  .left {
    background-image: url("//static.theone.art/pc/images/pic-home/icon-left-title.svg");
  }
  .right {
    background-image: url("//static.theone.art/pc/images/pic-home/icon-right-title.svg");
  }
}
.bilnd-box-wrap {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
}
.more-wrap {
  .bar {
    width: 100%;
    border-radius: 4px 4px 0 0;
  }
  .hide {
    opacity: 0;
  }
}
.body-wrap {
  display: flex;
  flex-wrap: wrap;
  .v1-goods-wrap {
    width: 25%;
    .name {
      font-size: 16px;
      color: #000000;
      line-height: 22px;
    }
  }
}
.list-bottom {
  margin-top: 10vh;
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .open-box-wrap {
    width: calc(100% - 0.64rem);

    .left {
      display: flex;
      align-items: center;
      .title {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
      }
      .des {
        font-size: 12px;
        font-weight: 400;
        color: #666666;
        margin-top: 2px;
      }
      .info {
        padding-left: 9px;
      }
    }
  }
  .content-title {
    font-size: 0.4rem;

    margin: 1.5rem 0 0.5rem;
    span {
      display: inline-block;
      width: 1.4rem;
      height: 0.12rem;
      margin: 0 0.3rem;
    }
  }
  .body-wrap {
    .v1-goods-wrap {
      width: 100%;
      .name {
        font-size: 0.32rem;
        color: #000000;
      }
    }
  }
  .theone-dialog {
    .progress-wrap {
      .txt {
      }
    }
    .ui-btn-group {
    }
    .progress-bar-box {
      .num {
      }
    }
    .progress-bar {
      .progress-line {
        .icon-bar {
        }
      }
    }
    .list-wrap {
      .table-title {
      }
      .line-bar {
        display: flex;
        align-items: center;
        padding: 0 24px;
        transition: all ease-out 0.46s;

        .name {
          width: 3rem;
          padding-right: 0.2rem;
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.7);
        }
        .des {
          flex: 1;
          font-size: 14px;
          font-weight: 400;
          color: #999999;
        }
        .warning {
          color: #ed362d;
          display: flex;
          align-items: center;

          .ui-icon {
            position: relative;
            top: -2px;
          }
        }
        .default-txt {
          color: rgba(0, 0, 0, 0.7);
        }
      }
      .list-main {
        height: 20vh;
        overflow-y: auto;
      }
    }
  }
}
</style>
