<template>
  <div>
    <div class="title-body right-block" v-if="isRight">
      <div class="content">
        <div class="title-wrap">
          <div class="line-wrap"><span class="icon"></span></div>
          <div><img class="title-img" :src="title" /></div>
        </div>
        <div class="des" v-if="des">
          <div v-html="des"></div>
        </div>
      </div>
      <div class="sign right"></div>
    </div>
    <div class="title-body" v-else>
      <div class="sign left"></div>
      <div class="content">
        <div class="title-wrap">
          <div><img class="title-img" :src="title" /></div>
          <div class="line-wrap"><span class="icon"></span></div>
        </div>
        <div class="des" v-if="des">
          <div v-html="des"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    isRight: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    des: {
      type: String,
      default: "",
    },
  },
  created() {},
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.title-body {
  display: flex;
  .sign {
    width: 16px;
    background-color: #00b99f;
  }
  .content {
    flex: 1;
    padding-left: 10px;
  }
}
.title-wrap {
  display: flex;
  align-items: flex-end;
  .title-img {
    display: block;
    height: 32px;
    margin-right: 18px;
  }
  .line-wrap {
    height: 1px;
    background-color: rgba(0, 185, 159, 0.4);
    flex: 1;
    position: relative;
    top: -6px;
    left: 0;
    .icon {
      width: 8px;
      height: 8px;
      background: #ffda87;
      display: block;
      position: absolute;
      left: 0;
      top: -4px;
    }
  }

  @media screen and (max-width: 540px) {
    .title-img {
      height: 0.4rem;
    }
  }
}
.des {
  color: #75ffec;
  font-size: 16px;
  line-height: 16px;
  font-weight: 400;
  margin-top: 10px;
  ::v-deep span {
    color: rgba(255, 218, 135, 1);
  }
  @media screen and (max-width: 540px) {
    font-size: 0.26rem;
    padding-top: 0.02rem;
  }
}

.right-block {
  .content {
    padding-right: 10px;
    padding-left: 0;
  }
  .title-wrap {
    .title-img {
      margin-left: 10px;
      margin-right: 0;
    }
    .line-wrap {
      .icon {
        right: 0;
        left: initial;
      }
    }
  }
  .des {
    text-align: right;
  }
}
</style>
