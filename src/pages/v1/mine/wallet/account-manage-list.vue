<template>
  <div class="account-list-body">
    <m-head title="认证记录" :go="goBack" />
    <div class="g-min-wrap">
      <div class="head ui-native-title">
        <div class="left hand" @click="goBack">
          <span class="ui-icon icon-left"></span>
          结算账户管理
        </div>
      </div>
      <div class="main-body">
        <div class="body-title">
          {{ $common.tranPayChannel(payChannel) }}认证记录
        </div>
        <status-template
          :list="list && list.length"
          api="/user/api/payChannel/operationInfo"
          :init="getList"
        >
          <div class="ui-content">
            <div class="list-bar" v-for="(item, index) in list" :key="index">
              <div class="line-group">
                <div class="left">
                  <div class="key gray phone-none">操作步骤</div>
                  <div class="des">
                    <div
                      class="type-name"
                      :class="{ warning: !item.status }"
                    >
                      {{ item.operationName }}
                    </div>
                  </div>
                </div>
                <div class="right">
                  <div class="time">时间 {{ item.createTime }}</div>
                </div>
              </div>
              <div class="q-wrap" v-if="item.errorMsg">
                <div class="q">
                  <span class="gray phone-none q-name">原因 </span>
                  <span class="q-info">{{ item.errorMsg }}</span>
                </div>
              </div>
            </div>
          </div>
        </status-template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.payChannel = this.$route.params.payChannel;
    this.getList();
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    async getList() {
      const res = await this.$api.service.payChannel_operationInfo({
        payChannel: this.payChannel,
        type: 0,
      });
      if (res.data.code == 200) {
         this.list = res.data.data; 
      }
    },
    goBack() {
      this.$router.back();
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-left {
  background-image: url("//static.theone.art/pc/icons/icon-left-direction.png");
}
.ui-native-title {
  display: flex;
  padding: 20px 28px;
  .ui-icon {
    position: relative;
    top: 3px;
  }
}
.body-title {
  font-size: 14px;
  padding: 8px 0 8px;
  font-weight: 500;
  color: #000000;
  border-bottom: 1px solid rgba(151, 151, 151, 0.2);

}
.main-body {
  padding: 0 48px;
}
.list-bar {
  border-bottom: 1px solid rgba(151, 151, 151, 0.2);
  padding: 15px 0 16px;
  .q-wrap {
    padding-left: 78px;
    font-size: 12px;
    font-weight: 400;
    color: #000000;
    line-height: 17px;
  }
}
.line-group {
  display: flex;
  justify-content: space-between;

  .left {
    display: flex;
    align-items: flex-start;
    flex: 1;

    .key {
      margin-right: 30px;
    }
    .des {
      width: 120px;
      font-size: 12px;
      font-weight: 400;
      color: #000000;
      flex: 1;
      .type-name {
        margin-bottom: 8px;
      }
    }
    .warning {
      color: #e61f1a;
    }
    .gray {
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
    }
    .q-name {
      display: inline-block;
      padding-right: 16px;
    }
    .q-info {
      font-size: 12px;
      font-weight: 400;
      color: #000000;
    }
  }
  .right {
    .time {
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
    }
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .ui-native-title {
    display: none;
  }
  .ui-content {
  }
  .main-body {
    padding: 0.32rem 0.32rem 0;
    background: #ffffff;
    box-shadow: 0px 2px 16px 0px rgba(180, 180, 180, 0.1);
    border-radius: 0.08rem;
    margin: 0.32rem;
  }
  .body-title {
    padding: 0.32rem 0.32rem 0.3rem;
    font-size: 14px;
    font-weight: 500;
    color: #000000;

    border-bottom: 1px solid rgba(151, 151, 151, 0.2);
  }
  .phone-none {
    display: none;
  }
  .list-bar {
    .q-wrap {
      padding-left: 0;
    }
  }
}
</style>
