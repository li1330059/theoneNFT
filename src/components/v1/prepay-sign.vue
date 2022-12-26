<template>
  <div class="prepay-sign-wrap">
    <div class="prepay-detail">
      <div class="ui-icon icon-prepay-sign" :class="[`size-${size}`]"></div>
      <div class="txt" :class="[`bg-size-${size}`]">
        <div class="txt-main">{{ text }}</div>
      </div>
    </div>

    <div class="bg" :class="[`bg-size-${size}`]"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: true,
    };
  },
  props: {
    text: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "normal",
    },
  },
  watch: {
    $route: function (to, from) {},
  },
  created() {},
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.icon-prepay-sign {
  background-position: left bottom;
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/icon-prepay-sign.png");
}
.size-normal {
  width: 93px;
  height: 23px;
}
.size-md {
  width: 157px;
  height: 38px;
}
.bg-size-normal {
  height: 12px;
}
.bg-size-md {
  height: 28px;
}
.size-sm {
  width: 45px;
  height: 15px;
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/goods-detail/icon-small.png");
}
.bg-size-sm {
  height: 8px;
  border-radius: 0 !important;
}

.prepay-sign-wrap {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;

  .prepay-detail {
    display: flex;
    align-items: flex-end;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    .txt {
      flex: 1;
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      color: #fdfdfd;
    }
  }
  .bg {
    width: 100%;

    background: linear-gradient(270deg, #fd8983 0%, #fb514c 100%);
    border-radius: 0px 18px 0px 0px;
  }
}
@media screen and (max-width: 540px) {
  .size-normal {
    width: 2.26rem;
    height: 0.52rem;
  }
  .size-md {
    width: 2.19rem;
    height: 0.54rem;
  }
  .bg-size-normal {
    height: 0.25rem;
  }
  .bg-size-md {
    height: 0.43rem;
    font-size: 0.24rem;
  }
}
</style>
