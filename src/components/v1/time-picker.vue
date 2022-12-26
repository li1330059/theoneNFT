<template>
  <div>
    <div class="computer">
      <span class="demonstration"></span>
      <el-date-picker
        v-model="timeBetween"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
      >
      </el-date-picker>
    </div>
    <div class="phone">
      <!--             :min-date="minDate"
        :max-date="maxDate" -->
      <div class="phone-input-wrap">
        <div class="time" @click="onShowPhoneStartTime">
          <span class="ui-icon icon-time"></span
          >{{ timeBetween[0].Format("yyyy-MM-dd") }}
        </div>
        <div>至</div>
        <div class="time" @click="onShowPhoneEndTime">
          <span class="ui-icon icon-time"></span
          >{{ timeBetween[1].Format("yyyy-MM-dd") }}
        </div>
      </div>
      <div class="select-wrap">
        <van-datetime-picker
          @confirm="startConfirm"
          @cancel="startCancel"
          v-if="isShowPhoneStartTime"
          v-model="timeBetween[0]"
          type="date"
          title="开始日期"
        />
        <van-datetime-picker
          @confirm="phoneEndConfirm"
          @cancel="phoneEndCancel"
          v-if="isShowPhoneEndTime"
          v-model="timeBetween[1]"
          type="date"
          title="结束日期"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeBetween: [new Date(`2022-10-10`), new Date(`2022-10-11`)],
      isShowPhoneStartTime: false,
      isShowPhoneEndTime: false,
    };
  },
  methods: {
    onShowPhoneStartTime() {
      this.isShowPhoneStartTime = true;
    },
    onShowPhoneEndTime() {
      this.isShowPhoneEndTime = true;
    },
    startConfirm(e) {
      //this.timeBetween[0] = new Date(e);
      this.isShowPhoneStartTime = false;
    },
    startCancel(e) {
      this.isShowPhoneStartTime = false;
    },
    phoneEndCancel(e) {
      this.isShowPhoneEndTime = false;
    },
    phoneEndConfirm(e) {
     // this.timeBetween[1] = new Date(e);
      this.isShowPhoneEndTime = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.phone {
  display: none;
}
.computer {
  display: block;
}

@media screen and (max-width: 540px) {
  .icon-time {
    background-image: url("//static.theone.art/pc/icons/icon-time.png");
  }
  .phone-input-wrap {
    display: flex;
    align-items: center;
    font-size: 0.24rem;
    color: rgba(51, 51, 51, 0.4);
    font-weight: 400;
    justify-content: space-between;
    height: 0.66rem;
    border-radius: 0.4;
    padding: 0 0.3rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    .time {
      .ui-icon {
        margin-right: 0.1rem;
        position: relative;
        top: 0.05rem;
        left: 0;
      }
    }
  }
  .phone {
    display: block;
    margin-bottom: 100px;
  }
  .computer {
    display: none;
  }
  .select-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
}
</style>