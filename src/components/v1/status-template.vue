<template>
  <div class="body-content">
    <div class="section" v-if="isLoading">
      <div class="loading">
        <img src="//static.theone.art/pc/icons/icon-loading.png" />
        <div class="txt">加载中，请稍后</div>
      </div>
    </div>
    <div class="section" v-else-if="statusErr">
      <div class="loading loading-err">
        <img src="//static.theone.art/pc/icons/icon-loading-err.png" />
        <div class="txt">
          加载失败请检查您的网络，<span @click="init">点击手动刷新</span>
        </div>
      </div>
    </div>
    <div class="section" v-else-if="showEmpty">
      <empty :title="nullMessage"></empty>
    </div>
    <div v-if="isLoading || showEmpty || statusErr" class="placeholder"></div>
    <div v-show="!isLoading && !showEmpty && !statusErr">
      <slot />
    </div>
  </div>
</template>

<script>
import empty from "@/components/v1/empty";
export default {
  components: { empty },
  data() {
    return {
      message: "",
      isLoading: false, //加载
      showEmpty: false, //空数据
      statusErr: false, //接口异常
    };
  },
  props: {
    list: { require: true }, //任意数据类型
    api: {
      type: String,
    },
    init: {
      type: Function,
      default: () => {},
    },
    emptyMessage: {
      type: String,
    },
    code: {
      type: Number,
    },
    isError: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    nullMessage() {
      return this.emptyMessage || this.message;
    },
  },
  watch: {
    list: function () {
      this.getApiStatus();
    },
    "$store.state.apis": function () {
      this.getApiStatus();
    },
  },
  created() {
    this.getApiStatus();
  },

  methods: {
    getApiStatus() {
      if (!this.api) {
        return;
      }
      const apiStatus = this.$store.state.apis.find(
        (item) => item.api.search(this.api) !== -1
      );

      if (apiStatus) {
        switch (apiStatus.status) {
          case "start":
            this.isLoading = true;
            break;
          case "over":
            this.isLoading = false;
            this.statusErr = false;
            /*   this.showEmpty = true;
           return */
            if (this.list) {
              switch (Object.prototype.toString.call(this.list)) {
                case "[object Array]":
                  this.showEmpty = this.list.length <= 0;
                  break;
                case "[object Object]":
                  this.showEmpty = JSON.stringify(this.list) == "{}";
                  break;
                default:
                  this.showEmpty = false;
                  break;
              }
            } else {
              this.showEmpty = true;
            }
            break;
          case "error":
            this.isLoading = false;
            if (this.isError) {
              if (
                (apiStatus && apiStatus.info && apiStatus.info.code == 1010) ||
                (apiStatus && apiStatus.info && apiStatus.info.code == 10020) ||
                (apiStatus && apiStatus.info && apiStatus.info.code == 10019)
              ) {
                this.message = apiStatus.info.message;
                this.showEmpty = true;
              } else {
                this.showEmpty = false;
                this.statusErr = true;
              }
            } else {
              this.message = apiStatus.info.message;
              this.showEmpty = true;
              this.statusErr = false;
            }

            break;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.body-content {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // overflow:hidden;
}
.placeholder {
  height: 300px;
}
.section {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading {
  width: 220px;
  margin: 0 auto;
  .txt {
    text-align: center;

    color: #666666;
    span {
      color: rgba(226, 89, 73, 1);
      text-decoration: underline;
      cursor: pointer;
    }
  }
  img {
    display: block;
    width: 100%;
    margin: 0 auto 20px;
  }
}
.loading-err {
  width: inherit;
  img {
    width: 220px;
  }
}
</style>
