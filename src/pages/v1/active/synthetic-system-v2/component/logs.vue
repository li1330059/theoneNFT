<template>
  <div class="log-body" v-if="isShow">
    <div class="mask"></div>
    <div class="dialog-content">
      <div
        class="icon-close iconfont icon-icon_quxiao synthesis-select-close"
        @click="hide"
      ></div>
      <div class="log-title">
        <div class="title">合成记录</div>
      </div>
      <div class="logs-list-wrap">
        <div
          class="list-bar list-title synthesis-log-title-bgcolor synthesis-log-title-color"
        >
          <div class="td">序号</div>
          <div class="td">合成时间</div>
          <div class="td">合成材料</div>
        </div>
        <div class="list-body">
          <status-template
            :list="list"
            api="/om-goods/api/synthesisLog/list"
            :init="getList"
          >
            <div class="list-bar" v-for="(item, idx) in list" :key="idx">
              <div class="td">
                {{ idx + 1 + listParams.pageSize * (listInfo.current - 1) }}
              </div>
              <div class="td">{{ item.createTime }}</div>
              <div class="td">
                <span class="see-link-btn" @click="seeMore(item)"
                  >查看详情</span
                >
              </div>
            </div>
          </status-template>
        </div>
        <g-paging
          :pageChange="handleCurrentChange"
          :list="listInfo.records"
          :pageSize="listParams.pageSize"
          :current-page="listInfo.current"
        />
      </div>
      <div
        class="btn-red ui-btn synthesis-log-btn-bgcolor synthesis-log-btn-color"
        @click="hide"
      >
        确定
      </div>
    </div>
    <logs-detail ref="LogsDetailRef"></logs-detail>
  </div>
</template>
<script>
import LogsDetail from "./logs-detail.vue";
export default {
  name: "",
  components: {
    LogsDetail,
  },
  data() {
    return {
      isShow: false,
      listInfo: {},
      list: [],
      listParams: {
        key: "",
        pageCount: 1,
        pageSize: 12,
      },
    };
  },
  props: {},
  computed: {},
  methods: {
    seeMore(item) {
      this.$refs.LogsDetailRef.show(item.id);
    },
    show(key) {
      this.isShow = true;
      this.listParams.pageCount = 1;
      this.listParams.key = key;
      this.getList();
    },
    hide() {
      this.isShow = false;
    },
    async getList() {
      const res = await this.$api.service.synthesisLog_list(this.listParams);

      this.listInfo = res.data.data;
      if (res.data.code == 200) {
        if (res.data.data.records.length > 0) {
          this.list = res.data.data.records;
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleCurrentChange(page) {
      this.listParams.pageCount = page;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/active/tom.scss";
.see-link-btn {
  font-size: 12px;
  font-weight: 500;
  color: #397fe7;
  cursor: pointer;
}
.list-body {
  border-right: 1px solid #c5c5c5;
  border-left: 1px solid #c5c5c5;
  max-height: 40vh;
  overflow-y: auto;
  border-radius: 0 0 10px 10px;
}
.log-body {
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
  max-width: 1100px;
  background: #e5e3e3;
  border-radius: 10px;
  padding-bottom: 60px;
  .logs-list-wrap {
    padding: 40px 40px;
    ::v-deep .com-empty {
      min-height: inherit;
    }

    .list-bar {
      display: flex;
      height: 56px;
      align-items: center;
      border-bottom: 1px solid #c5c5c5;
      .td {
        flex: 1;
        text-align: center;
        line-height: 20px;
      }
    }
    .list-title {
      border-radius: 10px 10px 0 0px;
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
    .logs-list-wrap {
      padding: 0.3rem 0.3rem;

      .list-bar {
        display: flex;
        height: 56px;
        align-items: center;
        border-bottom: 1px solid #c5c5c5;
        .td {
          flex: 1;
          text-align: center;
          line-height: 20px;
        }
      }
      .list-title {
        border-radius: 10px 10px 0 0px;
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
