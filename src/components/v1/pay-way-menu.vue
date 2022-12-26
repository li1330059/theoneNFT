<template>
  <div class="pay-way-body">
    <div class="pay-way-list">
      <div
        class="pay-way-wrap"
        v-for="(item, index) in payWayList"
        :key="index"
        @click="setSelectItem(index, item)"
      >
        <div
          :class="[
            'pay-way-item',
            item.disable ? 'pay-way-disabled' : '',
            currentIdx == index ? 'pay-way-active' : '',
          ]"
        >
          {{ item.name }}
          <img
            class="warning-img"
            src="https://static.theone.art/pc/images/icon-balance.png"
            alt
          />
          <div class="pay-balance-pop">{{ item.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentIdx: -1,
    };
  },
  props: {
    payWayList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    index: {
      type: String,
      default: "normal",
    },
  },
  watch: {
    index: {
      handler(val) {
        this.currentIdx = val;
      },
      immediate: true,
    },
  },
  created() {},
  computed: {},
  methods: {
    setSelectItem(idx, item) {
      if (item.disable) {
        return;
      }
      this.currentIdx = idx;
      this.$emit("change", idx, item);
    },
  },
};
</script>
<style lang="scss" scoped>
.pay-way-body {
  display: flex;
  justify-content: flex-start;
  margin: 10px 0;
}
.pay-way-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.pay-way-wrap {
  width: 50%;
  padding: 10px;
  max-width: 180px;
  @media screen and (max-width: 540px) {
    max-width: inherit;
  }
}
.pay-way-item {
  font-size: 12px;
  width: 100%;
  height: 36px;
  line-height: 36px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  text-align: center;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  color: #666;
  img {
    width: 15px;
    height: 15px;
    margin-left: 5px;
  }
}
.warning-img {
  display: none;
}
.pay-way-disabled {
  background-color: #f4f4f4;
  border: 1px solid #f4f4f4;
  .warning-img {
    display: block;
  }
  &:hover {
    .pay-balance-pop {
      display: inline-block;
    }
  }
}
.pay-way-active {
  border: 1px solid #e61f1a;
  position: relative;
  color: #e61f1a;
  &::after {
    display: inline-block;
    content: "";
    width: 20px;
    height: 20px;
    background: url("https://static.theone.art/pc/images/icon-pay-active.png")
      no-repeat center;
    background-size: contain;
    position: absolute;
    bottom: -1px;
    right: -1px;
  }
}
.pay-balance-pop {
  display: none;
  position: absolute;
  top: -55px;
  left: 50%;
  white-space: nowrap;
  padding: 5px 10px 5px 16px;
  box-shadow: 0px 0px 4px 0px rgba(102, 102, 102, 0.18);
  background-color: #fff;
  z-index: 10;
  border-radius: 4px;
  &::after {
    display: inline;
    content: "";
    width: 20px;
    height: 20px;
    background: url("https://static.theone.art/pc/images/icon-pay-pop.png")
      no-repeat center;
    background-size: 20px 20px;
    position: absolute;
    bottom: -10px;
    left: 40%;
  }
}
</style>
