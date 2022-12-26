<template>
  <div class="">
    <div class="mode-mobile">
      <m-header
        :title="pageTitle"
        :righttext="this.$store.getters.showTransferRecord ? '转移记录' : ''"
        @add="goTransferRecord"
      />
    </div>
    <div class="mobile-wrap">
      <receive-alert
        @update="receiveUpdate"
        class="receive-alert"
        v-if="
          this.$common.isMobile() && this.$store.getters.showTransferReceive
        "
      />
      <section class="selected-tab-wrap">
        <div class="m-tab">
          <div
            class="tab"
            v-for="(item, idx) in tabs"
            :key="item.key"
            :class="{ selected: idx == currentIdx }"
            @click="tabChange(item, idx)"
          >
            {{ item.name }}
            <div class="line"></div>
          </div>
        </div>
      </section>

      <blindBox v-if="tabs[currentIdx].key == 'blind-box'" />
      <treasure-list
        ref="treasureList"
        v-if="tabs[currentIdx].key == 'collection'"
      ></treasure-list>
      <draw-box v-if="tabs[currentIdx].key == 'draw-box'"></draw-box>
    </div>
  </div>
</template>
<script>
import mHeader from "@/components/v1/layout/mobileHeader";
import blindBox from "./components/blindBox.vue";
import treasureList from "./components/treasure-list.vue";
import DrawBox from "./components/draw-box.vue";
import receiveAlert from "./components/receive-alert.vue";

export default {
  components: {
    mHeader,
    blindBox,
    treasureList,
    DrawBox,
    receiveAlert,
  },
  data() {
    return {
      pageTitle: "我的藏品",
      tabs: [
        {
          name: "我的藏品",
          key: "collection",
        },
        {
          name: "我的盲盒",
          key: "blind-box",
        },
        {
          name: "抽签结果",
          key: "draw-box",
        },
      ],
      currentIdx: 0,
    };
  },
  created() {
    this.getTransferRecordDetailCount();
  },
  mounted() {},

  methods: {
    receiveUpdate() {
      this.$refs.treasureList && this.$refs.treasureList.getTreasureList()
    },
    async getTransferRecordDetailCount() {
      this.$store.dispatch("setTransferRecordDetailCount");
    },

    tabChange(info, idx) {
      this.currentIdx = idx;
    },
    goTransferRecord() {
      this.$router.push(`/mine/transfer_record_mobile`);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .m-header {
  z-index: 99999;
  box-shadow: 0px 2px 4px 0px rgba(131, 131, 131, 0.1);
}
.mobile-wrap {
  @media screen and (min-width: 0px) and (max-width: 540px) {
    padding-top: 1.1rem;
  }
}
.m-tab {
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 10px;
  .tab {
    padding: 8px 0;
    margin-right: 38px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    position: relative;
    top: 0;
    left: 0;
    .line {
      width: 100%;
      height: 2px;
      background-color: transparent;
      position: absolute;
      bottom: -10px;
      left: 0;
    }
  }
  .selected {
    color: rgba(0, 0, 0, 0.7);
    .line {
      background-color: #e61f1a;
    }
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .selected-tab-wrap {
    padding: 0 0.3rem;
    background-color: #fff;
  }
  .m-tab {
    background-color: #fff;
    justify-content: space-around;
    padding-bottom: 0;

    .tab {
      margin: 0 0.38rem;
      .line {
        bottom: -0.02rem;
      }
    }
  }
}
</style>
