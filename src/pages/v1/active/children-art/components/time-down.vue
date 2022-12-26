<template>
  <div class="time-block">
    <span class="time-bar day">{{ time[0] }}<span class="line"></span> 天</span>
    <span class="time-bar">{{ time[1] }} </span>
    <span class="sign">:</span>
    <span class="time-bar">{{ time[2] }} </span>
    <span class="sign">:</span>
    <span class="time-bar">{{ time[3] }} </span>
  </div>
</template>
<script>
import countDown from "@/utils/countDown";
export default {
  data() {
    return {
      time: ["00", "00", "00", "00"],
    };
  },
  props: {
    endTime: {
      type: String,
      default: "",
    },
    startTime: {
      type: String,
      default: "",
    },
  },
  created() {},
  mounted() {},
  computed: {},
  beforeDestroy() {
    if (this.timeDown) {
      this.timeDown.stop();
    }
  },
  methods: {
    start({ endTime, startTime }) {
      this.$nextTick(() => {
        if (endTime && startTime) {
          const start = new Date(startTime.replace(/\-/gi, "/")).getTime();
          const end = new Date(endTime.replace(/\-/gi, "/")).getTime();
          const betweenTime = parseInt((end - start) / 1000);
          if (betweenTime > 0) {
            this.startCall(betweenTime);
          }
        }
      });
    },
    startCall(downTime) {
      //s
      this.timeDown = new countDown({
        cdTime: downTime,
        tickCall: (obj) => {
          const time = this.$common.setSeconds(obj.cdTime);
          this.time = time;
        },
        endCall: () => {
          this.$emit("listenEnd");
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.time-block {
  padding: 7px 17px;
  background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/bg-time.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: inline-block;
  .day {
    margin-right: 16px;
  }

  .time-bar {
    display: inline-block;
    line-height: 26px;
    font-size: 16px;
    font-weight: 600;
    padding: 0 4px;
    color: #ffffff;
    background: linear-gradient(180deg, #62b7fa 0%, #3380f4 100%);
    box-shadow: inset 0px 1px 2px 0px #0e4caa;
    border-radius: 5px;

    .line {
      display: inline-block;
      width: 1px;
      height: 14px;
      margin-left: 4px;
      position: relative;
      top: 2px;
      background-color: rgba(255, 255, 255, 0.35);
    }
  }
  .sign {
    font-size: 22px;
    font-weight: 600;
    color: #ffffff;
    display: inline-block;
    padding: 0 8px;
  }
}

@media screen and (max-width: 540px) {
  .time-block {
    padding: 0.08rem 0.14rem;
    .day {
      margin-right: 0.16rem;
    }
    .line {
    }
    .sign {
      font-size: 0.24rem;
      padding: 0 0.05rem;
    }
    time-bar {
      display: inline-block;
      line-height: 0.33rem;
      font-size: 0.28rem;
      font-weight: 600;
      padding: 0 0.05rem;
      border-radius: 0.06rem;
    }
  }
}
</style>
