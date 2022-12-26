<template>
  <div>
    <div class="" v-if="isShow">
      <div class="dialog-content-wrap">
        <div class="mask"></div>

        <div class="dialog-content grayscale compose-page">
          <div class="ui-icon icon-close hand" @click="onClose"></div>
          <div v-if="isLoading" class="loading-wrap">
            <loading />
          </div>

          <div v-else-if="listData.length > 0">
            <div class="sku-list-wrap">
              <div class="sku-title">
                编号选择
                <el-checkbox :value="isCheckedAll" @change="onCheckAll"
                  ><span>全选</span></el-checkbox
                >
              </div>
              <div class="list-content">
                <div class="sku-bar" v-for="(item, idx) in listData" :key="idx">
                  <el-checkbox
                    :value="item.checked"
                    @change="changHandle(item, idx)"
                    ><div class="number">
                      {{ item.commoditySku && item.commoditySku.number }}/{{
                        item.commoditySku && item.commoditySku.amountNumber
                          ? item.commoditySku.amountNumber == -1
                            ? "纪念品"
                            : item.commoditySku.amountNumber
                          : ""
                      }}
                    </div></el-checkbox
                  >
                </div>
              </div>
            </div>
            <div class="v1-pagination">
              <g-paging
                :pageChange="handleCurrentChange"
                :res="
                  listDataInfo.records &&
                  listDataInfo.records.length >= listParams.pageSize
                "
                :current-page="listDataInfo.current"
              />
            </div>

            <div class="compose-btn" @click="onSubmit">确定</div>
          </div>
          <div v-else><empty /></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import Loading from "@/components/v1/loading/loading";
export default {
  name: "treasure-sku-list",
  components: { empty, Loading },
  data() {
    return {
      isLoading: true,
      isCheckedAll: false,
      commodityInfo: {},
      isShow: false,
      listDataInfo: {},
      listData: [],
      selectNum: 0,
      inSelectedSkuList: [],
      listParams: {
        pageSize: 20,
        pageCount: 1,
      },
    };
  },
  props: {
    userSelectedRule: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  async created() {},
  computed: {},
  watch: {
    listData(val) {
      this.isCheckedAll = val.every((item) => {
        return item.checked == true;
      });
    },
  },

  methods: {
    onCheckAll() {
      if (this.isCheckedAll) {
        //取消全选

        this.listData = this.listData.map((item) => {
          item.checked = false;
          const oldList = JSON.parse(JSON.stringify(this.inSelectedSkuList));
          const oldIdx = oldList.findIndex((item2) => item2.id == item.id);
          oldList.splice(oldIdx, 1);
          this.inSelectedSkuList = oldList;
          return item;
        });
      } else {
        //全选本页
        //除本页之外的其他选项
        const resArr = this.selectedSkuList.filter(
          (item) => item.commoditySku.commodityId != this.commodityInfo.id
        );

        let is_tip = false;
        this.listData = this.listData.map((item, idx) => {
          //当前一共选择的数量
          let haveSelectedArr = this.$common.uniqueAry(
            [...resArr, ...this.inSelectedSkuList],
            "id"
          );
          if (haveSelectedArr.length < this.userSelectedRule.value1) {
            const findIdx = this.inSelectedSkuList.findIndex(
              (item2) => item2.id == item.id
            );
            if (findIdx == -1) {
              item.checked = true;
              this.inSelectedSkuList.push(item);
            }
          } else {
            is_tip = true;
          }

          return item;
        });
        if (is_tip) {
          this.$message.warning("您已选择足够的藏品数量");
        }
      }
    },
    async init(info, selectedSkuList) {
      if (!info.id) {
        this.$message.warning("缺少入参");
        return;
      }
      this.isCheckedAll = false;
      this.selectedSkuList = JSON.parse(JSON.stringify(selectedSkuList)); //接收已经选择的列表
      this.inSelectedSkuList = selectedSkuList
        ? JSON.parse(JSON.stringify(selectedSkuList))
        : [];

      this.commodityInfo = info;

      this.isShow = true;
      this.isLoading = true;
      this.rest();
      this.getList();
    },
    changHandle(info, idx) {
      const list = JSON.parse(JSON.stringify(this.listData));
      if (info.checked) {
        const oldList = JSON.parse(JSON.stringify(this.inSelectedSkuList));
        const oldIdx = oldList.findIndex((item) => item.id == info.id);
        oldList.splice(oldIdx, 1);
        this.inSelectedSkuList = oldList;
      } else {
        if (this.userSelectedRule.value1 == this.inSelectedSkuList.length) {
          this.$message.warning("您已选择足够的藏品数量");
          return;
        }
        this.inSelectedSkuList.push(info);
      }
      list[idx].checked = !list[idx].checked;
      this.listData = list;
    },
    handleCurrentChange(val) {
      this.listParams.pageCount = val;
      this.getList();
    },
    onClose() {
      this.isShow = false;
    },
    rest() {
      this.listParams.pageCount = 1;
      this.listDataInfo = {};
      this.listData = [];
    },
    async getList() {
      this.isLoading = true;
      const res = await this.$api.service.treasureSku_listMaterial({
        ...this.listParams,
        commodityIdList: [this.commodityInfo.id],
      });
      this.isLoading = false;
      this.listDataInfo = res.data.data;
      const findChecked = (id) => {
        for (let i = 0; i < this.inSelectedSkuList.length; i++) {
          if (id == this.inSelectedSkuList[i].id) {
            return true;
          }
        }
        return false;
      };

      if (res.data.code == 200) {
        if (res.data.data.records.length > 0) {
          this.listData = res.data.data.records.map((item) => {
            item.checked = findChecked(item.id);
            return item;
          });
        } else {
          if (this.listParams.pageCount > 1) {
            this.listDataInfo.current--;
          }
        }
      }
    },
    onSubmit() {
      this.$emit("listen", this.commodityInfo, this.inSelectedSkuList, this);
    },
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.loading-wrap {
  min-height: 30vh;
  padding-top: 15vh;
}
.compose-btn {
  width: 100%;
  max-width: 500px;
  line-height: 50px;
  background: #e4a516;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  margin: 42px auto 0;
  cursor: pointer;
  user-select: none;
}
.dialog-content-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999999;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
  }
  .dialog-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background: #f0e9d3;
    border-radius: 10px;
    width: 100%;
    max-width: 1100px;
    padding: 45px 30px 48px;
    .icon-close {
      background-image: url("//static.theone.art/pc/compose/icon-close.png");
      position: absolute;
      top: 22px;
      right: 28px;
      width: 40px;
      height: 40px;
    }
    .sku-title {
      font-size: 14px;
      font-weight: 600;
      color: #333333;
    }
    .sku-list {
    }
    .list-content {
      display: flex;
      flex-wrap: wrap;
      overflow-y: auto;
      max-height: 50vh;
      padding: 10px 40px;
    }
    .sku-bar {
      width: 20%;
      padding: 25px 0;
    }
  }
}
::v-deep .el-checkbox__inner {
  background-color: transparent;
  border: 1px solid #979797;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #e4a516;
}
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #e4a516;
  border-color: #e4a516;
  border-radius: 4px;
}
@media screen and (max-width: 540px) {
  .dialog-content-wrap {
    .mask {
    }
    .dialog-content {
      width: 95%;
      .icon-close {
        width: 0.5rem;
        height: 0.5rem;
      }
      .sku-title {
      }
      .sku-list {
      }
      .list-content {
        padding: 0;
      }
      .sku-bar {
        width: 50%;
      }
    }
  }
  .v1-pagination {
    padding: 0.5rem 0 0;
  }
}
</style>
<style>
.compose-page .page-icon {
  background: #e5e3e3;
}
</style>
