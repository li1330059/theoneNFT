<template>
  <div>
    <el-dialog
      class="theone-dialog page-login dialogContain dialog-border filter-mask"
      :visible.sync="isShow"
      append-to-body
      width="460px"
      :title="title"
    >
      <status-template
        :list="list"
        api="/om-goods/api/lottery/spin/treasureList"
        :init="getList"
        :isError="false"
      >
        <div class="main">
          <div class="m-list-content">
            <div v-for="(item, idx) in list" :key="idx">
              <section class="title-wrap">
                {{ item.name }}
                <span class="num" v-if="item.type == 2"
                  >{{ item.userSelect.length }}/{{ item.amount }}</span
                >
              </section>
              <section
                class="list-wrap"
                v-if="item.treasureInfoList && item.treasureInfoList.length > 0"
              >
                <div
                  class="list-box hand"
                  :class="{ selected: item2.select && item.type == 2 }"
                  @click="onGetSku(idx, idx2, item, item2)"
                  v-for="(item2, idx2) in item.treasureInfoList"
                  :key="item2.uuid"
                >
                  <div
                    v-if="item2.amount > 0 && item.type == 2"
                    class="flex-center"
                  >
                    <span class="ui-icon icon-select"></span>
                  </div>

                  <span class="hidden-one">{{ item2.commodityName }}</span
                  ><span class="num-wrap">*{{ item2.amount }}</span>
                </div>
              </section>
              <empty v-else title="暂无符合条件的商品"></empty>
            </div>
          </div>

          <!--       <section class="title-wrap">
            消耗条件 <span class="num">2/2</span>
          </section>
          <section class="list-wrap">
            <div class="list-box hand">hhhhh</div>
          </section>-->
          <section class="m-foot">
            <div class="btn btn-default hand" @click="isShow = false">取消</div>
            <div
              class="btn btn-red hand"
              :class="{ 'btn-disable': isDisabled }"
              @click="submit"
            >
              确认
            </div>
          </section>
        </div>
      </status-template>
    </el-dialog>
    <select-sku
      ref="selectSkuRef"
      :activeId="activeId"
      @listen="listenSkuSelect"
      :activeObj="activeObj"
    ></select-sku>
  </div>
</template>
<script>
import SelectSku from "./select-sku.vue";
import empty from "./empty.vue";
export default {
  components: { SelectSku, empty },
  props: {
    activeId: {
      type: String,
      default: "",
    },
    activeObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      isShow: false,
      list: [],
      drawType: "",
      statusOperate: false,
    };
  },
  computed: {
    title() {
      return this.activeObj.luckySpinType == "LOTTERY"
        ? "选择消耗条件"
        : "选择孔明灯火种";
    },
    isDisabled() {
      const isSelectOver = this.list.every((item) => {
        if (item.type == 2) {
          if (item.minConsumeCommodity == 1) {
            return item.userSelect.length >= 1;
          } else {
            return item.userSelect.length >= item.amount;
          }
        } else {
          return item.treasureInfoList.find((item) => item.amount > 0);
        }
      });
      return !isSelectOver;
    },
    userSelectArr() {
      let arr = [];
      this.list.forEach((item) => {
        const listArr = item.treasureInfoList.filter((item) => item.select);
        if (listArr.length > 0) {
          arr.push({
            ...item,
            treasureInfoList: listArr,
          });
        }
      });
      return arr;
    },
  },

  created() {},
  methods: {
    sumUserSelect(arr) {
      return arr.map((item) => {
        let arr = [];
        let userSelectAmount = 0;
        item.treasureInfoList.forEach((item) => {
          if (item.select) {
            arr.push(item);
            userSelectAmount += item.amount;
          }
        });
        item.userSelect = arr;
        item.userSelectAmount = userSelectAmount;
        return item;
      });
    },
    show(drawType) {
      this.isShow = true;
      this.drawType = drawType;
      this.getList();
    },
    hide() {
      this.isShow = false;
    },
    listenSkuSelect(consumeList) {
      this.$emit("listen", consumeList);
    },
    hideAll() {
      this.hide();
      this.$refs.selectSkuRef.hide();
    },
    async submit() {
      if (this.isDisabled) {
        this.$message.warning("消耗条件不符合，请确认");
        return;
      }
      this.$refs.selectSkuRef.show(this.drawType, this.userSelectArr);
    },
    async getList() {
      if (this.activeId && this.drawType) {
        const res = await this.$api.service.lottery_spin_treasureList({
          uuid: this.activeId,
          openType: this.drawType,
        });
        if (res.data.code == 200) {
          this.statusOperate = res.data.data.statusOperate;
          this.list = res.data.data.consumeList.map((item) => {
            item.treasureInfoList.map((item2) => {
              if (item.type == 1) {
                item2.select = true;
              } else {
                item2.select = false;
              }

              return item2;
            });
            /*      let userAmount = 0;
            item.treasureInfoList.forEach((item) => {
              userAmount += item.amount;
            });
            if (userAmount < item.amount) {
              isEnough = false;
            } */

            //是否符合条件
            item.userSelect = [];
            item.userSelectAmount = 0;
            return item;
          });
          this.list = this.sumUserSelect(this.list);
          let isEnough = this.list.every((item) => {
            if (item.type == 1) {
              return (
                item.treasureInfoList.length >= 1 &&
                item.treasureInfoList.find((item) => item.amount > 0)
              );
            } else {
              if (item.minConsumeCommodity == 1) {
                return item.treasureInfoList.length >= 1;
              } else {
                return item.treasureInfoList.length >= item.amount;
              }
            }
          });
          if (!this.statusOperate || !isEnough) {
            this.$message.warning("消耗条件不符合，请确认");
          }
        } else {
          this.$message.error(res.data.message);
        }
      } else {
        this.$message.warning("参数错误");
      }
    },
    onGetSku(idx1, idx2, item, item2) {
      if (item2.amount > 0) {
        let list = JSON.parse(JSON.stringify(this.list));
        if (item2.select) {
          list[idx1].treasureInfoList[idx2].select = false;
        } else {
          /*        list[idx1].treasureInfoList[idx2].select = true; */
          /*      if (list[idx1].userSelectAmount < item.amount) {
            list[idx1].treasureInfoList[idx2].select = true;
          } else {
            this.$message.warning("已满足条件");
          } */
          if (list[idx1].userSelect.length < item.amount) {
            list[idx1].treasureInfoList[idx2].select = true;
          } else {
            this.$message.warning("已满足条件");
          }
        }
        this.list = this.sumUserSelect(list);
      } else {
        this.$message.warning("无可用数量");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.flex-center {
  display: flex;
  align-items: center;
}
.title-wrap {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16px;
  .num {
    display: inline-block;
    padding-left: 16px;
    color: #666666;
  }
}
.list-wrap {
  display: flex;
  flex-wrap: wrap;
  margin: -13px;
  padding-bottom: 24px;
  max-height: 300px;
  overflow-y: auto;
}
.list-box {
  display: flex;
  align-items: center;

  font-size: 14px;
  font-weight: 400;
  color: #666;
  padding: 13px;
  width: 50%;
  overflow: hidden;
  .num-wrap {
    display: inline-block;
    width: 40px;
  }
  .icon-select {
    margin-right: 6px;
    width: 18px;
    height: 18px;
    background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/icon-select-default.png");
  }
  &.selected {
    color: #ff5a4a;
    .icon-select {
      background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/icon-select.png");
    }
  }
}
.m-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  .btn {
    width: 47%;
    line-height: 36px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    user-select: none;
  }
  .btn-default {
    color: #333333;
    background: #ffffff;
    border: 1px solid #333333;
  }
  .btn-red {
    background: #ff5a4a;
    color: #fff;
    border: 1px solid #ff5a4a;
  }
  .btn-disable {
    background: #cccccc;
    color: #666666;
    border: 1px solid #cccccc;
  }
}
</style>
