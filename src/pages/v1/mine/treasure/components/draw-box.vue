/* 盲盒 */
<template>
  <div>
    <div ref="contentRef" class="blind-wrap">
      <!--       <div class="content-title">
        <span class="left" />抽签结果专场<span class="right" />
      </div> -->

      <div class="v1-goods-list">
        <div class="v1-goods-wrap" v-for="item in resList" :key="item.id">
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
            <p>
              数量： X{{
                item.amount +
                item.amountLockSold +
                (item.amountLockGive ? item.amountLockGive : 0)
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="list-bottom">
        <status-template
          :list="resList"
          api="/goods/api/treasure/list"
          :init="getBlindList"
          class="catch"
        >
        </status-template>
      </div>

      <blindBoxAnimate ref="BlindAnimate" :img="show_img" />
      <div id="blind-animate"></div>
    </div>
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
      isBottom: false,
      show_img: "",
      blind_box_params: {
        pageCount: 1,
        pageSize: 8,
        blindBoxDraw: 1,
      },
      blind_box_list: {
        records: [],
      },
      resList: [],
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
      const result = await this.$api.service.treasure_list(
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
.blind-wrap {
  padding-top: 20px;
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
.v1-goods {
  p {
    font-size: 12px;
    margin-top: 13px;
    color: rgba(0, 0, 0, 0.7);
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
}
</style>
