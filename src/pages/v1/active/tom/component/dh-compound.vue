<template>
  <transition name="fade">
    <div class="content flex" v-if="isShow">
      <div class="center">
        <img
          class="close"
          src="//static.theone.art/pc/dunhuang/icon-close.png"
          alt
          @click="hide"
        />
        <p class="title mode-PC">恭喜获得</p>
        <p class="title mode-mobile">
          恭喜获得{{ commodity.commoditySku.name }}
        </p>
        <div
          class="cover"
          :style="`background: url(${commodity.commoditySku.cover}) no-repeat center;background-size: contain;`"
        >
          <!-- <img class="cover-img" :src="img" alt /> -->
        </div>
        <div class="bottom">
          <p>合成成功</p>
          <p class="mode-PC">恭喜您获得{{ commodity.commoditySku.name }}</p>
          <p>
            去
            <span @click="$common.goPage('/mine/treasure')">我的藏品</span>查看
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "DhCompound",
  props: {
    commodity: {
      type: Object,
      default: () => {
        return {
          commoditySku: {
            cover: "",
            name: "",
          },
        };
      },
    },
    name: {
      type: String,
      default: "B款三个人坐姿奏乐组（静态）",
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.content {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.43);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
.center {
  background-color: #fff7e9;
  max-width: 800px;
  max-height: 800px;
  width: 60%;
  height: 75%;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  text-align: center;
}
.close {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 36px;
  right: 41px;
  cursor: pointer;
}
.cover {
  width: 100%;
  height: 60%;
  position: absolute;
  bottom: 14%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: auto;
  }
}
.bottom {
  width: 101%;
  height: 300px;
  background: url("//static.theone.art/pc/dunhuang/bg-pop.png")
    no-repeat bottom;
  background-size: 100% 100%;
  position: absolute;
  bottom: -2px;
  left: -1px;
  color: #ffebc8;
  font-size: 14px;
  padding-top: 130px;
  p {
    line-height: 30px;
    &:first-child {
      font-size: 20px;
    }
  }
  span {
    font-size: 20px;
  }
}
.title {
  color: #d3583f;
  font-size: 18px;
  padding-top: 60px;
}
@media screen and (max-width: 540px) {
  .center {
    width: 300px;
    height: 291px;
  }
  .close {
    width: 21px;
    height: 21px;
    top: 10px;
    right: 9px;
  }
  .title {
    font-size: 12px;
    padding-top: 24px;
  }
  .bottom {
    height: 112px;
    padding-top: 42px;
    p {
      &:first-child {
        font-size: 14px;
      }
      font-size: 10px;
    }
    span {
      font-size: 14px;
    }
  }
}
</style>