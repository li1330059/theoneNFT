<template>
  <div>
    <div v-if="list.length > 0">
      <!--    <div class="content-title">五合一，超爽敦煌动态等你来拿！！</div> -->
      <div class="paly-title">
        <img class="responsive-img" :src="playInfo.des" />
      </div>

      <ul class="content">
        <li class="item" v-for="(item, index) in list" :key="index">
          <div class="item-left">
            <dh-material
              :material="item.commodityList[0]"
              :commodity="item"
              @listen="listen"
            ></dh-material>
          </div>
          <div class="icon bg synthesis-icon-direction"></div>
          <div class="item-right">
            <dh-material
              :material="{ cover: item.commodity.cover }"
              :compose="item.commodity"
            ></dh-material>
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
    playInfo: {
      type: Object,
      default: () => {
        return {};
      },
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
@import "@/assets/1.0/scss/active/three-feet-boy.scss";
.content {
  margin: 40px auto 0;
  color: #c55234;
}
.content-w {
  max-width: 1000px;
}
.item {
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
}
.item-left,
.item-right {
  display: flex;
  flex: 1;
  max-width: 230px;
}
.cover {
  width: 199px;
  min-width: 117px;
  border-radius: 10px;
  background: no-repeat center #eee;
  background-size: cover;
  margin-right: 34px;
}
.merge {
  padding: 23px 0 0;
  box-sizing: border-box;
  width: 220px;
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
  height: 60px;
  width:60px;
  background-size: contain;
  transform: rotate(-90deg);
  margin:8% 70px 0;
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
    width: 100%;
  }
  .merge {
    margin-top: -0.34rem;
    width: 100%;
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
    margin: 1.1rem 0rem 0;
  }
  .btn {
    // font-size: 0.24rem;
    line-height: 0.56rem;
    margin-top: 0.16rem;
    padding: 0 0.4rem;
  }
}
</style>
