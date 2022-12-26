<template>
  <div>
    <div class="ui-body-head">
      <div class="return" @click="onPageReturn">
        <span class="icon icon-left" />
        返回
      </div>
    </div>
    <div class="ui-body">
      <div class="ui-content max-content">
        <div class="ui-head">赠与好友</div>
        <div class="ui-card">
          <div
            class="preview-img"
            :style="`background-image:url(${commodity.cover})`"
          ></div>
          <div class="commodity-info">
            <div class="m-bar title-wrap">
              <div class="label">名称：</div>
              <div class="title">{{ commodity.name }}</div>
            </div>
            <div class="m-bar artist-wrap">
              <div class="label">艺术家：</div>
              <div class="">{{ author.name }}</div>
            </div>
            <div v-if="this.commodity.statusNumber == 1">
              <div class="m-bar select-num" @click="isShowSelected = true">
                <div class="label">编号选择:</div>
                <div class="">
                  {{ selectedArr.length > 0 ? "已选择" : "去选择" }}
                  <span>&gt;</span>
                </div>
              </div>
              <div class="m-bar give-num">
                <div class="label">赠与数量：</div>
                <div class="">X {{ selectedArr.length }}</div>
              </div>
            </div>

            <div class="m-bar give-num" v-else>
              <div class="label">赠与数量：</div>
              <div class="">
                <el-input-number
                  v-model="giveNum"
                  @change="giveNumChange($event)"
                  :min="1"
                  :step="1"
                  step-strictly
                  :max="info.records.length"
                  label="数量"
                ></el-input-number>
              </div>
            </div>
            <div class="m-phone m-bar">
              <div class="label">手机号：</div>
              <el-input
                type="text"
                v-model="phone"
                placeholder="请输入好友手机号"
              ></el-input>
            </div>
            <div class="des">
              好友未接收，礼物将会在{{ config && config.failHour }}小时内退回
            </div>
            <div class="message-warning">
              提示：藏品赠与成功后不可撤回，请勿进行线下交易，谨防受骗。
            </div>
          </div>
        </div>
      </div>
      <div class="btn-group max-content btn-end" style="margin-top: 20px">
        <div class="btn" @click="onSubmit">确定</div>
      </div>
      <div class="m-give-success" v-if="isShowSuccess">
        <img
          src="//static.theone.art/pc/mine/give-success.png"
        />
        <div class="des">
          您赠与的礼物正在路上<br />
          请等待好友接收。
        </div>
      </div>
    </div>

    <el-dialog
      class="c-dialog"
      :visible.sync="isShowSelected"
      append-to-body
      width="460px"
      title="编号选择"
    >
      <div class="num-select-content">
        <div class="head">
          <!--       <div class="select-all" @click="onSelectedAll">
            <label>全选</label>
            <div
              class="icon icon-checkbox-default"
              :class="{ 'icon-checkbox-selected': isSelectedAll }"
            ></div>
          </div> -->
        </div>
        <div class="content">
          <div
            class="num-bar"
            :class="{ selected: item.selected }"
            v-for="(item, idx) in info.records"
            :key="item.id"
            @click="selectSku(item, idx)"
          >
            <div class="ui-num-bar">
              {{ item.commoditySku.number }}/{{
                item.commoditySku.amountNumber || item.commodity.amountSku
              }}
            </div>
          </div>
        </div>
        <div class="btn-group">
          <div class="txt">已选择：{{ selectedArr.length }}</div>
          <div class="btn" @click="isShowSelected = false">确定</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { checkPhoneNumber } from "@/utils/common";
import Encryption from "@/utils/encryption";
export default {
  props: {
    treasureId: {
      type: String,
      default: "",
    },

    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      passwowrd:'',
      phone: "",
      giveNum: 1,
      isShowSelected: false,
      isShowSuccess: false,
      listInfo: [],
      isSelectedAll: false,
      info: {
        records: [],
      },
    };
  },
  computed: {
    commodity() {
      if (this.info && this.info.records && this.info.records.length > 0) {
        return this.info.records[0].commodity;
      }
      return {};
    },
    author() {
      if (this.info && this.info.records && this.info.records.length > 0) {
        return this.info.records[0].author;
      }
      return {};
    },
    selectedArr() {
      if (this.info && this.info.records && this.info.records.length > 0) {
        return this.info.records.filter((item) => item.selected);
      }
      return [];
    },
  },
  mounted() {},
  methods: {
    init(info, passwowrd) {
      console.log(passwowrd);
      this.passwowrd = passwowrd;
      this.rest();
      this.getSkuList();
      /*   if (info) {
        const _info = JSON.parse(JSON.stringify(info));
        _info.records = _info.records.map((item) => {
          item.selected = false;
          return item;
        });

        this.info = _info;
      } else {
        this.info = {
          records: [],
        };
      } */
    },
    rest() {
      this.phone = "";
      this.isShowSuccess = false;
    },
    async getSkuList() {
      let result = await this.$api.service.treasureSku_list({
        pageCount: 1,
        pageSize: 9999,
        sort: {
          field: 1, //购买价格
          upOrDown: "",
        },
        treasureId: this.treasureId,
        visible: "",
      });
      if (result.data.code == 200) {
        console.log(result.data.data.records);
        const _info = result.data.data;
        _info.records = _info.records
          .map((item) => {
            item.selected = false;
            return item;
          })
          .filter((item) => {
            if (item.commodity.statusGive == 1) {
              return (
                (item.statusAvailable == 1 && item.operationType == 0) ||
                (item.statusAvailable == 0 && item.operationType == 12)
              );
            }
            return false;
          });

        this.info = _info;
      } else {
        this.$message.error(result.data.message);
      }
    },
    onPageReturn() {
      this.$parent.changePage(1);
    },
    giveNumChange(val) {},
    onSelectedAll() {
      this.isSelectedAll = !this.isSelectedAll;
      this.info.records = this.info.records.map((item) => {
        item.selected = this.isSelectedAll;
        return item;
      });
    },
    selectSku(item, idx) {
      let arr = [...this.info.records];
      arr[idx].selected = !item.selected;
      this.info.records = arr;
      this.isSelectedAll = this.info.records.every((item) => item.selected);
    },
    async onSubmit() {
      if (!checkPhoneNumber(this.phone)) {
        this.$message.warning("请输入正确的手机号");
        return;
      }
      if (this.commodity.statusNumber == 1 && this.selectedArr.length <= 0) {
        this.$message.warning("请选择藏品");
        return;
      }
      console.log(this.passwowrd);
      const resPassword = await Encryption.getPassword(this.passwowrd);
      console.log(resPassword);
      if (!resPassword) {
        this.$message.warning("密码加密错误");
        return;
      }
      this.$confirm(`您确定要赠与给好友吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          const res = await this.$api.service.treasureGive_add({
            payPw: resPassword,
            commodityId: this.commodity.id,
            treasureId: this.treasureId,
            typeGive: 1,
            phone: this.phone,
            typeNumber: this.commodity.statusNumber, //1有编号 2无编号
            amount: this.giveNum, //2
            treasureSkuIdList: this.selectedArr.map((item) => item.id), //1
          });
          if (res.data.code == 200) {
            this.isShowSuccess = true;
            this.$parent.handleCurrentChange(1);
          } else {
            this.$message.warning(res.data.message);
          }
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.message-warning {
  font-size: 12px;
  font-weight: 400;
  color: #e8251f;
  margin-top: 4px;
}
.ui-body {
  position: relative;
  top: 0;
  left: 0;

  @media screen and (max-width: 540px) {
    margin-top: 1.3rem;
    padding-bottom: 1.5rem;
  }
}
.c-dialog {
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}
.ui-card {
  display: flex;
  padding: 0 30px;
  .des {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    margin-top: 8px;
  }
  .commodity-info {
    padding-left: 100px;
    flex: 1;
  }
  .preview-img {
    width: 146px;
    height: 197px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    border: 1px solid #d9d9d9;
  }
  @media screen and (max-width: 540px) {
    display: block;
    .preview-img {
      width: 100%;
      margin-bottom: 0.6rem;
    }
    .commodity-info {
      padding: 0;
    }
  }
}
.m-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  .label {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
  }
  .title {
    flex: 1;
    max-width: 300px;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.m-phone {
  display: block;
  .label {
    margin-bottom: 8px;
  }
}
.max-content {
  max-width: 800px;
  margin: 0 auto;
  @media screen and (max-width: 540px) {
    max-width: inherit;
    width: 92%;
    margin: 0 auto;
  }
}
.ui-content {
  margin-top: 32px;
  background: #ffffff;
  box-shadow: 0px 0px 9px 4px rgba(164, 164, 164, 0.1);
  border-radius: 4px;
  padding: 0 25px 40px;
  .ui-head {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 12px 0;
    margin-bottom: 40px;
  }
}
.btn {
  width: 96px;
  line-height: 30px;
  background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
}

.btn-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btn-end {
  justify-content: flex-end;
}
.btn-center {
  justify-content: center;
}
.btn-disabled {
  background: #d9d9d9;
}
.select-num {
  cursor: pointer;
}
.icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.icon-checkbox-default {
  background-image: url("//static.theone.art/pc/icons/checkbox.png");
}
.icon-checkbox-selected {
  background-image: url("//static.theone.art/pc/icons/checkbox-selected.png");
}
.icon-left {
  background-image: url("//static.theone.art/pc/images/back.png");
}
.ui-body-head {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  .return {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    padding: 14px 0;
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 80px;
  }
  @media screen and (max-width: 540px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 999;
    padding: 0.1rem 0.3rem;
    .return {
      margin: 0;
      border-bottom: none;
    }
  }
}
.num-select-content {
  .head {
    display: flex;
    justify-content: space-between;
    .select-all {
      cursor: pointer;
      display: flex;
      align-items: center;
      .icon {
        margin-left: 6px;
      }
    }
  }
  .content {
    max-height: 300px;
    margin: 26px 0 40px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    .num-bar {
      padding: 8px;
      .ui-num-bar {
        width: 92px;
        line-height: 20px;
        border-radius: 2px;
        border: 1px solid #cbcbcb;
        font-size: 12px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
        text-align: center;
        cursor: pointer;
      }
    }
    .selected {
      .ui-num-bar {
        border-color: #000;
        color: #000;
      }
    }
  }
}
.m-give-success {
  padding-top: 100px;
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  height: 120%;
  background-color: #fff;
  z-index: 2;
  img {
    width: 235px;
    margin: 0 auto 29px;
  }
  .des {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    line-height: 20px;
    text-align: center;
  }
}
</style>
