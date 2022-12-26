<template>
  <div class="page-body">
    <div class="content">
      <div class="banner-wrap">
        <picture alt="pic">
          <source :srcset="dataJson.banner.img" media="(max-width: 540px)" />

          <img class="responsive-img" :srcset="dataJson.banner.pcImg" />
        </picture>
      </div>

      <div class="block-wrap">
        <div class="header">
          <img
            class="b-tip-img"
            src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/11/mobile/block-tip-img.png"
          />
        </div>

        <img
          class="title"
          src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/11/mobile/block-title.png"
        />
        <div class="block-wrap-flex">
          <div
            class="block hand"
            v-for="(item, idx) in dataJson.block.arr"
            :key="idx"
            @click="go(item)"
          >
            <div class="mask">
              <span class="icon-time"></span>
              <div class="txt">{{ item.txt }}</div>
            </div>
            <img class="responsive-img" :src="item.img" />
          </div>
        </div>
        <div class="message">*具体活动规则以品牌方官方通知为准</div>
        <div class="footer">
          <span class="icon-tip"></span>
        </div>
      </div>

      <picture
        v-for="(item, idx) in listArr"
        :key="idx"
        alt="pic"
        @click="go(item)"
      >
        <source
          :srcset="`${item.img}?timer=${Math.random()}`"
		  v-if="item.img"
          media="(max-width: 540px)"
        />

        <img
          class="responsive-img img"
		  v-if="item.pcImg"
          :class="item.class ? item.class : ''"
          :srcset="`${item.pcImg}?timer=${Math.random()}`"
        />
      </picture>
      -
    </div>
  </div>
</template>
<script>
/* import "./active_11"; */
export default {
  components: {},
  data() {
    return {
      dataJson: {
        arr: [],
        banner: {},
        block: {},
      },
      listArr: [],
    };
  },
  mounted() {
    this.dataJson = window.active11;
    this.listArr = this.dataJson.arr;
  },

  computed: {},

  methods: {
    sort(arr) {
      let arr1 = [];
      let arr2 = [];
      arr.forEach((item) => {
        if (item.disable) {
          arr1.push(item);
        } else {
          arr2.push(item);
        }
      });
      return [...arr2, ...arr1];
    },
    go(item) {
      if (item.disable) {
        return;
      }
      if (item.src) {
        window.location.href = item.src;
      } else {
        this.$message.warning("尚未配置链接");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.hand {
  cursor: pointer;
}
.block-wrap {
  padding: 16px;
  background: linear-gradient(270deg, #fef8f8 0%, #fae1e4 100%);
  border-radius: 12px;
  margin: 70px 0;
  position: relative;
  top: 0;
  left: 0;
  @media screen and (max-width: 540px) {
    margin: 0.7rem 0;
  }
  .header {
    display: flex;
    justify-content: flex-end;
  }
  .b-tip-img {
    width: 14%;
    margin-right: -6px;
    @media screen and (max-width: 540px) {
      width: 28%;
    }
  }
  .title {
    display: block;
    width: 60%;
    margin-bottom: 50px;
    @media screen and (max-width: 540px) {
      width: 100%;
    }
  }
  .icon-tip {
    background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/11/mobile/icon-blok-tip.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    width: 26px;
    height: 26px;
    display: block;
    margin-right: -6px;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
  }
  .message {
    text-align: right;
    font-size: 14px;
    font-weight: normal;
    color: rgba(0, 0, 0, 0.8);
    line-height: 66px;
    margin-top: 8px;
  }
}
.block-wrap-flex {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: -16px;
  @media screen and (max-width: 540px) {
    margin: -0.16rem;
  }
  .block {
    width: 20%;
    padding: 16px;
    position: relative;
    top: 0;
    left: 0;
    @media screen and (max-width: 540px) {
      width: 33.33%;
      padding: 0.16rem;
    }
    .mask {
      width: 70%;
      position: absolute;
      top: 26px;
      left: 50%;
      background-color: rgba(238, 42, 48, 0.6);
      border-radius: 20px;
      transform: translateX(-50%);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3px 4px;
      overflow: hidden;

      .txt {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        color: #fff;
        font-size: 12px;
        padding-left: 3px;
      }
      .icon-time {
        background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/11/mobile/icon-time.png");
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        width: 14px;
        height: 14px;
        display: inline-block;
      }
      @media screen and (max-width: 540px) {
        top: 0.26rem;
        padding: 0.03rem 0.07rem;
        width: 76%;
        .txt {
          font-size: 0.18rem;
          padding-left: 0.03rem;
        }
        .icon-time {
          width: 0.24rem;
          height: 0.24rem;
        }
      }
    }
  }
}
.responsive-img {
  display: block;
  width: 100%;
}
.page-body {
  min-height: 100vh;
  padding: 40px 46px;
  .content {
    max-width: 750px;
    margin: 0 auto;
  }
  .img {
    display: block;
    margin-bottom: 70px;
    cursor: pointer;
    @media screen and (max-width: 540px) {
      margin-bottom: 0.7rem;
    }
  }
  .short {
    max-width: 580px;
    margin: 0 auto;
  }
  @media screen and (max-width: 540px) {
    padding: 40px 0.46rem;
    .short {
      max-width: inherit;
    }
  }

  background: linear-gradient(
    182deg,
    #fa5b65 0%,
    #ffb4b9 15%,
    #fdd4d6 26%,
    #d03636 52%,
    #fdb2b7 80%,
    #d1292e 100%
  );
}
@media screen and (max-width: 540px) {
  .banner-wrap {
    margin-right: -0.46rem;
  }
}
</style>
