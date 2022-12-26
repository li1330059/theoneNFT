<template>
  <div class="ll-bag-keyboard-body fixed-bottom">
    <div class="main">
      <section class="keyboard-wrap">
        <div
          class="key-box"
          v-for="(item, idx) in keyboard"
          :key="idx"
          @click="handle(item)"
        >
          <div class="key">
            <span v-if="item.val">{{ item.val }}</span>
            <span class="ll-icon" :class="[item.icon]" v-if="item.icon"></span>
          </div>
        </div>
      </section>
      <div class="ll-btn ll-btn-primary ll-btn-full" @click="submit">确定</div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      keyboard: [
        {
          val: 1,
        },
        {
          val: 2,
        },
        {
          val: 3,
        },
        {
          val: 4,
        },
        {
          val: 5,
        },
        {
          val: 6,
        },
        {
          val: 7,
        },
        {
          val: 8,
        },
        {
          val: 9,
        },
        {
          val: ".",
          key: 1,
        },
        {
          val: "0",
        },
        {
          val: "",
          icon: "icon-delete",
          key: -1,
        },
      ],
    };
  },
  created() {},
  methods: {
    handle(e) {
      this.$emit("keyup", e);
    },
    submit() {
      this.$emit("confirm");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.icon-delete {
  width:50%;
  padding-bottom:12%;
  background-image: url("https://static.theone.art/pc/ll-bag/icon-keyboard-delete.png");
}
.ll-bag-keyboard-body {
  .main {
    background: #f7f7f7;
    border-radius: 16px 16px 0px 0px;
    backdrop-filter: blur(10px);
    padding: 17px 17px;
  }
}
.key-box {
  width: 33.33%;
  padding: 3px;
  .key {
    background: #ffffff;
    border-radius: 12px;
    font-size: 24px;
    font-weight: 600;
    color: #333333;
    line-height: 48px;
    height: 48px;
    text-align: center;
    cursor: pointer;
    user-select: none;
  }
}
.keyboard-wrap {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
</style>
