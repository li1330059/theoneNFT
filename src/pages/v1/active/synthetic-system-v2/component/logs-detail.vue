<template>
  <div class="log-info-body" v-if="isShow">
    <div class="mask"></div>
    <div class="dialog-content">
      <div
        class="icon-close iconfont icon-icon_quxiao synthesis-select-close"
        @click="hide"
      ></div>
      <div class="log-title">
        <div class="title">合成详情</div>
      </div>
      <div class="logs-info-wrap">
        <status-template
          :list="listInfo"
          api="/goods/api/synthesisLog/detail"
          :init="getList"
        >
          <div class="t1">已锁定的藏品：</div>
          <div class="list-wrap" v-if="listInfo.lockDataList">
            <div
              class="bar d-bar"
              v-for="(item, idx) in listInfo.lockDataList"
              :key="idx"
            >
              <div class="hidden-1">
                {{ item.name }}<span>{{ $numFormat.getNumStr(item) }}</span>
              </div>
            </div>
          </div>
          <div v-else>无</div>
          <div class="t1 m-top">已销毁的藏品：</div>
          <div class="list-wrap" v-if="listInfo.destroyDataList">
            <div
              class="bar red-bar synthesis-log-detail-destroy-bgcolor synthesis-log-detail-destroy-color"
              v-for="(item, idx) in listInfo.destroyDataList"
              :key="idx"
            >
              <div class="hidden-1">
                {{ item.name }}<span>{{ $numFormat.getNumStr(item) }}</span>
              </div>
            </div>
          </div>
          <div v-else>无</div>
        </status-template>
      </div>
      <div
        class="btn-red ui-btn synthesis-log-btn-bgcolor synthesis-log-btn-color"
        @click="hide"
      >
        确定
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    return {
      isShow: false,
      listInfo: {},
      listParams: {
        uuid: "",
      },
    };
  },
  props: {},
  computed: {},
  methods: {
    seeMore() {},
    show(uuid) {
      this.isShow = true;
      if (uuid) {
        this.listParams.uuid = uuid;
        this.getList();
      } else {
        this.$message.warning("参数错误");
      }
    },
    hide() {
      this.isShow = false;
    },
    async getList() {
      const res = await this.$api.service.synthesisLog_detail(this.listParams);
      if (res.data.code == 200) {
        this.listInfo = res.data.data;
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/active/tom.scss";
.m-top {
  margin-top: 30px;
}
.log-info-body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
  }
}
.log-title {
  .title {
    padding: 30px 0 0 40px;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
  }
}
.dialog-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 90%;
  max-width: 600px;
  background: #e5e3e3;
  border-radius: 10px;
  padding-bottom: 60px;
  .logs-info-wrap {
    padding: 40px 40px;
    overflow-y: auto;
    max-height: 50vh;
    .list-wrap {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -5px 20px;
    }
    .t1 {
      font-size: 14px;
      font-weight: 600;
      color: #333333;
    }
    .d-bar {
      background: #ffffff;
      color: #333333;
    }
    .bar {
      border-radius: 14px;
      padding: 5px 13px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 400;
      margin: 7px 5px;
      span {
        display: inline-block;
        padding-left: 6px;
      }
    }
    .red-bar {
    }
  }
  .icon-close {
    position: absolute;
    top: 21px;
    right: 28px;

    font-size: 20px;
    cursor: pointer;
    font-weight: bold;
  }
}
.btn-red {
  display: block;
  width: 90%;
  margin: 0 auto;
  max-width: 500px;
  line-height: 50px;
  border-radius: 25px;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  user-select: none;
}
@media screen and (max-width: 540px) {
  .log-title {
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 0.32rem;
    .title {
      padding: 0.3rem 0 0 0.3rem;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
    }
  }
  .dialog-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 90%;
    max-width: 1100px;
    background: #e5e3e3;
    border-radius: 10px;
    padding-bottom: 60px;
    .logs-info-wrap {
      padding: 0.3rem;
      .list-wrap {
        display: flex;
        flex-wrap: wrap;
        margin: 0 -5px 20px;
      }
      .t1 {
        font-size: 14px;
        font-weight: 600;
        color: #333333;
      }
      .bar {
        border-radius: 14px;
        padding: 5px 13px;
        border-radius: 100px;
        font-size: 12px;
        font-weight: 400;

        margin: 7px 5px;
        width: 46%;
      }
      .red-bar {
      }
    }
    .icon-close {
      position: absolute;
      top: 0.3rem;
      right: 0.3rem;

      font-size: 0.34rem;
      cursor: pointer;
      font-weight: bold;
    }
  }
}
</style>
