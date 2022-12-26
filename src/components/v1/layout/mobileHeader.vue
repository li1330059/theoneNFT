<template>
  <div class="m-header">
    <div class="left" @click="$router.back()"></div>
    <div class="title">{{ title }}</div>
    <div class="right" @click="add">{{ righttext }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "我的关注",
    },
    righttext: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },

  created() {},
  methods: {
    add() {
      this.$emit("add");
    },
  },
};
</script>

<style lang="scss" scoped>
.m-header {
  width: 100%;
  background: #fff;
  height: 1.08rem;
  position: fixed;
  z-index: 999;
  padding: 0 0.32rem;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.36rem;
  font-weight: 500;
  color: #333333;
  .title {
    // flex: 1;
    // text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 4rem;
    font-size: 0.36rem;
  }

  .left {
    // background: url("~@/assets/1.0/images/back@2x.png") no-repeat;
    // width: 0.48rem;
    // height: 0.48rem;
    // background-size: 0.48rem 0.48rem;
    position: absolute;
    left: 0.32rem;
  }

  .right {
    font-size: 0.24rem;
    font-weight: 400;
    color: rgba($color: #000000, $alpha: 0.7);
    position: absolute;
    right: 0.32rem;
    font-size: 0.32rem;
  }
}
</style>
