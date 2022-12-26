<template>
  <div class="ll-bag-billing-option">
    <div class="phone-input-wrap">
      <div class="time" @click="onShowPhoneTime">
        <span class="ui-icon icon-time"></span
        >{{ timeBetween[0].Format("yyyy-MM-dd") }}
      </div>
    </div>
    <div class="phone-input-wrap">
      <div class="time" @click="onShowPhoneType">
        <span class="ui-icon icon-time"></span>{{ currentTypeInfo.name }}
      </div>
    </div>
    <div>
      <van-popup round v-model="isShowPhoneTime" position="bottom">
        <van-datetime-picker
          @confirm="confirm"
          @cancel="cancel"
          v-model="timeBetween[0]"
          type="date"
          title="选择日期"
        />
      </van-popup>
      <van-popup round v-model="isShowPhoneType" position="bottom">
        <div class="type-wrap">
          <div class="header">
            <div class="cancel" @click="cancel">取消</div>
            <div class="title">选择类型</div>
            <div class="enter" @click="confirmType">确认</div>
          </div>
          <div class="cont">
            <div
              class="type-box"
              @click="changeType(index)"
              v-for="(item, index) in type"
              :key="index"
            >
              <div class="bar" :class="{ active: item.check }">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    initData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    initData: {
      handler(val) {
        if (val.endTime) {
          this.timeBetween = [new Date(val.endTime)];
        }
        if (val.type) {
          this.type = this.type.map((item) => {
            item.check = item.id == val.type;
            return item;
          });
        } else {
          this.type = this.type.map((item) => {
            item.check = item.id == -1;
            return item;
          });
        }
      },
      deep: true,
    },
  },
  computed: {
    currentTypeInfo() {
      return this.type.find((item) => item.check) || {};
    },
  },
  data() {
    return {
      timeBetween: [new Date()],
      isShowPhoneTime: false,
      isShowPhoneType: false,
      type: [
        {
          name: "全部类型",
          id: "-1",
          check: true,
        },
        {
          name: "收款",
          id: "1",
          check: false,
        },
        {
          name: "消费",
          id: "2",
          check: false,
        },
        {
          name: "充值",
          id: "3",
          check: false,
        },
        {
          name: "提现",
          id: "4",
          check: false,
        },
        {
          name: "退款",
          id: "5",
          check: false,
        },
        {
          name: "收款-定金",
          id: "6",
          check: false,
        },
        {
          name: "收款-尾款",
          id: "7",
          check: false,
        },
        {
          name: "消费-定金",
          id: "8",
          check: false,
        },
        {
          name: "消费-尾款",
          id: "9",
          check: false,
        },
        {
          name: "收款-退赔",
          id: "10",
          check: false,
        },
        {
          name: "消费-退赔",
          id: "11",
          check: false,
        },
      ],
    };
  },
  created() {},
  methods: {
    onShowPhoneTime() {
      this.isShowPhoneTime = true;
    },
    onShowPhoneType() {
      this.isShowPhoneType = true;
    },
    cancel() {
      this.isShowPhoneTime = false;
      this.isShowPhoneType = false;
      console.dir("cancel");
      return;
      this.$emit("cancel");
    },
    confirm(e) {
      this.isShowPhoneTime = false;
      console.log();

      this.$emit("timeChange", e);
    },
    confirmType() {
      this.isShowPhoneType = false;
      this.$emit(
        "typeChange",
        this.type.find((item) => item.check)
      );
    },
    changeType(index) {
      for (let i = 0; i < this.type.length; i++) {
        this.type[i].check = false;
      }
      this.type[index].check = true;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.icon-time {
  background: url("~@/assets/1.0/images/timepicker_down.png") no-repeat;
  background-size: 100% auto;
}
.ll-bag-billing-option {
  display: flex;
  padding-left: 4px;
}
.phone-input-wrap {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #c5d0ec;
  font-weight: 400;
  justify-content: space-between;
  margin-right: 16px;
  width: 131px;
  height: 32px;
  border-radius: 9px;
  border: 1px solid #e5eaf6;
  .time {
    position: relative;
    width: 100%;
    padding-left: 12px;
    .ui-icon {
      position: absolute;
      right: 10px;
      width: 10px;
      height: 10px;
      top: 3px;
    }
  }
}
.type-wrap {
  padding: 26px 16px;
  font-size: 14px;
  .header {
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
    .cancel,
    .enter {
      color: #343edf;
      cursor: pointer;
    }
    .title {
      color: #333333;
    }
  }
  .cont {
    display: flex;
    flex-wrap: wrap;
    padding-top: 28px;
    padding-bottom: 60px;
    margin: -4px;
    .type-box {
      width: 33.33%;
      padding: 4px;

      .bar {
        height: 48px;
        line-height: 48px;
        background: #f7f7f7;
        border-radius: 12px;
        color: #333333;
        text-align: center;
        cursor: pointer;
      }
      .active {
        background-color: rgba(52, 62, 223, 0.2);
        color: #343edf;
      }
    }
  }
}
.select-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
::v-deep .van-overlay,
::v-deep .van-popup {
  position: absolute;
}
::v-deep .van-picker__cancel,
::v-deep .van-picker__confirm {
  font-weight: 600;
  color: #343edf;
  cursor: pointer;
}
::v-deep .van-picker__title {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
}
</style>
