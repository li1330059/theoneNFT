<template>
  <div>

    <div class="content-w" v-if="list.length > 0">
      <div class="content-title">五合一，超爽敦煌动态等你来拿！！</div>
      <ul class="content" >
        <li class="item" v-for="(item, index) in list" :key="index">
          <div class="item-left">
            <dh-material
              class="box"
              :type="windowWidth <= 540 ? 'y' : 'x'"
              way="1"
              :material="item.commodityList[0]"
              :commodity="item"
              @listen="listen"
            ></dh-material>
          </div>
          <div class="icon"></div>
          <div class="item-right">
            <div
              :class="[
                'cover',
                item.commodity.amountHas <= 0 ? 'image-gray' : '',
              ]"
              :style="`background-image:url(${item.commodity.cover})`"
            ></div>
            <div class="merge">
              <p class="text pc">已合成</p>
              <div class="info">
                <p>{{ item.commodity.name }}</p>
                <p>已合成{{ item.commodity.amountHas || 0 }}个</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
        <dh-empty v-else></dh-empty>
  </div>
</template>
<script>
import DhMaterial from "./dh-material.vue";
import DhEmpty from "./dh-empty.vue";
export default {
  name: "DhPlay1",
  components: { DhMaterial, DhEmpty },
  props: {
    list: {
      type: Array,
    },
  },
  data() {
    return {
      windowWidth: document.documentElement.clientWidth,
    };
  },
  created() {
    window.onresize = () => {
      return (() => {
        this.windowWidth = document.documentElement.clientWidth;
      })();
    };
  },
  watch: {
    windowWidth(val) {
      this.windowWidth = val;
    },
  },
  methods: {
    showCompoundPop() {
      this.$parent.showCompoundPop();
    },
    listen() {
      this.$emit("listen");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/1.0/scss/dunhang-pub.scss";
.content {
  margin: 40px auto 0;
  color: #c55234;
}
.content-w{
  max-width:1000px;
}
.item {
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.item-left,
.item-right {
  display: flex;
  // flex:1;
}
.cover {
  width: 199px;
  min-width: 117px;
  height: 286px;
  border-radius: 10px;
  background: no-repeat center #eee;
  background-size: cover;
  margin-right: 34px;
}
.merge {
  padding: 23px 0 0;
  box-sizing: border-box;
  width:220px;
}
.text {
  font-size: 18px;
}
.info {
  margin: 31px 0 60px;
  p {
    font-size: 14px;
    line-height: 26px;
  }
}
.icon {
  min-width: 50px;
  flex: 1;
  height: 27px;
  background: url("//static.theone.art/pc/dunhuang/icon-arrow.png")
    no-repeat center;
  background-size: 48px 100%;
}
.btn {
  line-height: 33px;
  padding: 0 48px;
  white-space: nowrap;
}
.btn-border {
  line-height: 33px;
  margin-top: 6px;
}
.pc {
  display: inline-block;
}
.wap {
  display: none;
}
::v-deep .m-material-wrap-x {
  .ui-cover {
    height: 286px;
  }
}
@media screen and (max-width: 540px) {
  .pc {
    display: none;
  }
  .wap {
    display: inline-block;
  }
  .item {
    align-items: normal;
    box-sizing: border-box;
    margin-bottom: 22px;
  }
  .item-left,
  .item-right {
    display: block;
  }
  .cover {
    margin-right: 0;
    width: 2.34rem;
    height: 3.42rem;
    width:100%;
  }
  .merge {
    margin-top: -0.34rem;
    width:100%;
  }
  .info {
    margin: 0;
    p {
      // font-size: 0.2rem;
      line-height: 0.4rem;
      &:first-child {
        // font-size: 0.22rem;
      }
    }
  }
  .icon {
    width: 0.94rem;
    height: 0.52rem;
    margin:1.4rem .2rem 0;
  }
  .btn {
    // font-size: 0.24rem;
    line-height: 0.56rem;
    margin-top: 0.16rem;
    padding: 0 0.4rem;
  }
  ::v-deep .m-material-wrap-y {
    .img {
      width:100%;
      height: 3.42rem;
      border-radius: 0.2rem;
      margin-bottom: 0.15rem;
    }
    .info {
      padding-top: 0;
      .txt {
        // font-size: 0.2rem;
        text-align: left;
      }
      .ui-txt {
        justify-content: flex-start;
      }
    }
    .btn {
      width: 2.3rem;
      min-width: 2.3rem;
      margin-top: 0.16rem;
    }
  }
}
</style>
