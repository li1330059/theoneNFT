<template>
  <div>
    <section class="m-title-wrap">
      <div class="t1">{{ activeName }}</div>
      <div class="date active-turntable-lottery-title-date-color">
        {{ activeTime }}
      </div>
    </section>
    <section class="m-box-list active-turntable-lottery-main-bg">
      <title-block
        :title="activeName"
        :right="config.titleright"
        :left="config.titleLeft"
        :md="config.titleMd"
        :icon="config.titleIcon"
        class="bg-full"
      ></title-block>
      <div class="turntable-wrap">
        <turntable
          :prizes="prizes"
          ref="turntableRef"
          :blocks="blocks"
          :buttons="buttons"
          @listen="listenTurntableOver"
        ></turntable>
      </div>
      <picture>
        <source :srcset="config.tableBgMobile" media="(max-width: 540px)" />
        <img
          class="responsive-img turntable-table"
          :srcset="config.tableBg"
          alt="pic"
        />
      </picture>
      <div class="draw-btn-group">
        <div
          class="btn hand"
          :class="[
            item.type == 1
              ? 'active-turntable-lottery-btn-one'
              : 'active-turntable-lottery-btn-ten',
          ]"
          @click="onDraw(item)"
          v-for="(item, idx) in wayArr"
          :key="idx"
        >
          {{ item.txt }}
        </div>
      </div>
    </section>
    <section
      v-if="activeRule"
      class="m-active-rule active-turntable-lottery-active-rule-color active-turntable-lottery-main-bg"
    >
      <title-block
        title="活动说明"
        :right="config.titleright"
        :left="config.titleLeft"
        :md="config.titleMd"
        :icon="config.titleIcon"
        :color="config.titleColor"
        class="bg-full"
      ></title-block>
      <div class="txt" v-html="activeRule"></div>
    </section>

    <section
      v-if="config.activeMessage"
      class="m-active-rule m-active-message active-turntable-lottery-active-message-color active-turntable-lottery-main-bg"
    >
      <title-block
        title="活动须知"
        :color="config.titleColor"
        :right="config.titleright"
        :left="config.titleLeft"
        :md="config.titleMd"
        :icon="config.titleIcon"
        class="bg-full"
      ></title-block>
      <div class="txt" v-html="config.activeMessage"></div>
    </section>
  </div>
</template>
<script>
import Turntable from "../../component/turntable.vue";
import TitleBlock from "../../component/title-block.vue";
import { config } from "./config";
export default {
  components: { Turntable, TitleBlock },
  props: {
    dataJson: {
      type: Object,
      default: () => {
        return {};
      },
    },
    wayArr: {
      type: Array,
      default: () => {
        return [];
      },
    },
    activeRule: {
      type: String,
      default: "",
    },
    activeObj: {
      type: Object,
      default: () => {
        return {};
      },
    },

    activeName: {
      type: String,
      default: "",
    },
  },
  computed: {
    config() {
      return { ...config, ...this.dataJson };
    },
    prizes() {
      let prizes = this.activeObj.spinAreaList.map((item, idx) => {
        item.background = idx % 2 == 0 ? "#FEEDDE" : "#FFDFB5";
        const prizeImg = {
          src: item.areaUrl,
          width: "32%",
          top: "30%",
        };
        item.imgs = [prizeImg];
        return item;
      });
      if (prizes.length % 2 != 0) {
        prizes[prizes.length - 1].background = "#FFE6B6";
      }
      return prizes;
    },
    blocks() {
      return [
        {
          padding: ".4rem",
          imgs: [
            {
              src: this.dataJson && this.dataJson.roundShadow,
              width: "100%",
              height: "100%",
            },
          ],
        },
        {
          padding: ".48rem",
          imgs: [
            {
              src: this.dataJson && this.dataJson.roundBg,
              width: "100%",
              height: "100%",
            },
          ],
        },
      ];
    },
    buttons() {
      return [
        {
          radius: "50%",
          imgs: [
            {
              src: this.dataJson && this.dataJson.roundButton,
              width: "30%",
              top: "-130%",
            },
          ],
        },
      ];
    },
  },
  created() {},
  methods: {
    onDraw(type) {
      this.$emit("listenDraw", type);
    },
    play(idx) {
      this.$refs.turntableRef.start(idx);
    },
    listenTurntableOver(e) {
      this.$emit("listenAnimateEnd", e);
    },
  },
};
</script>
<style lang="scss" scoped>
.turntable-wrap {
  display: flex;
  justify-content: center;
}
.turntable-table {
  margin-top: -60px;
  @media screen and (max-width: 540px) {
    margin-top: -0.8rem;
  }
}
.draw-btn-group {
  display: flex;
  justify-content: space-around;
  max-width: 740px;
  margin: -60px auto 0;
  padding-bottom: 20px;
  position: relative;
  top: 0;
  left: 0;
  z-index: 10;
  .btn {
    width: 320px;
    height: 79px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    text-align: center;
    line-height: 70px;
    color: #fff;
    font-size: 16px;
  }
  .btn-one {
    background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/btn-one.png");
  }
  .btn-batch {
    background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/btn-bacth.png");
  }
  @media screen and (max-width: 540px) {
    margin-top: -1.5rem;
    padding-bottom: 0.2rem;
    margin-bottom: 0.9rem;
    .btn {
      width: 3.2rem;
      height: 0.96rem;
      line-height: 0.9rem;
    }
    .btn-one {
      background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/btn-one-m.png");
    }
    .btn-batch {
      background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/btn-bacth-m.png");
    }
  }
}

.m-active-rule {
  border-radius: 10px;
  padding: 0px 40px 40px;
  margin-top: 58px;
  background-position: -10px -10px;
  .title {
    font-size: 20px;
    text-align: center;
    margin-bottom: 24px;
  }
  .txt {
    word-break: break-all;
    font-size: 12px;
    line-height: 28px;
  }
  @media screen and (max-width: 540px) {
    padding: 0 0.22rem 0.16rem;
    margin-top: 0.6rem;
    border-radius: 0.1rem 0.1rem 0 0;
    background-position: -0.1rem -0.1rem;
    .title {
      font-size: 0.26rem;
      text-align: center;
      margin-bottom: 0.24rem;
    }
    .txt {
      font-size: 0.24rem;
      line-height: 0.4rem;
      padding-top: 0.3rem;
    }
  }
}
.m-active-message {
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    .t-txt {
      margin: 0 20px;
    }
    span {
      display: inline-block;
      padding: 0 2px;
    }
    .iconfont {
      font-size: 20px;
    }
  }
  @media screen and (max-width: 540px) {
    .title {
      .t-txt {
        margin: 0 0.2rem;
      }
      .iconfont {
        font-size: 0.24rem;
      }
    }
  }
}
.m-title-wrap {
  margin-bottom: 50px;
  text-align: center;
  margin-top: 60px;
  .t1 {
    font-size: 32px;
    font-weight: bold;
  }
  .date {
    font-size: 24px;
    font-weight: 500;
    line-height: 33px;
    margin-top: 6px;
  }
  @media screen and (max-width: 540px) {
    margin-bottom: 0.5rem;
    margin-top: 0.6rem;
    .t1 {
      font-size: 0.3rem;
    }
    .date {
      font-size: 0.24rem;
      margin-top: 0;
    }
  }
}
</style>
