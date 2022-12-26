<template>
  <el-dialog
    class="v1-dialog-mycenter"
    :visible.sync="isShowConsignment"
    append-to-body
    :width="$common.isMobile() ? '90%' : '600px'"
    :title="title"
  >
    <div class="content consignment-content">
      <div
        class="c-html"
        v-html="text ? text : '暂无内容'"
        @scroll="onScroll($event)"
      ></div>
      <div class="btn-group" v-if="isShowBtn">
        <div class="btn btn-default" @click="onCancelC">不同意</div>
        <div
          class="btn btn-red"
          v-if="isBottom && isDownOver"
          @click="onIAgree()"
        >
          我同意
        </div>
        <div class="btn btn-default" v-else>
          {{ btnTxt }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import countDown from "@/utils/countDown";
export default {
  props: {
    isShowBtn: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      btnTxt: "",
      isDownOver: false,
      isShowConsignment: false,
      isBottom: false,
    };
  },
  computed: {},
  created() {},
  beforeDestroy() {
    if (this.countDown) {
      this.countDown.stop();
    }
  },
  methods: {
    show() {
      this.isShowConsignment = true;
      this.isDownOver = false;
      this.isBottom = false;
      if (!this.text) {
        this.isBottom = true;
      }
      if (this.countDown) {
        this.countDown.stop();
        this.countDown = null;
      }
      this.countDown = new countDown({
        cdTime: 6,
        tickCall: (obj) => {
          this.btnTxt = `请下滑阅读全文:${obj.cdTime}s`;
        },
        endCall: () => {
          this.btnTxt = `请下滑阅读全文`;
          this.isDownOver = true;
        },
      });
    },
    onScroll(e, info) {
      const el = e.target;
      if (el.scrollTop + el.clientHeight + 20 >= el.scrollHeight) {
        if (!this.isBottom) {
          this.isBottom = true;
        }

        return false;
      }
    },
    onIAgree() {
      this.hide();
      this.$emit("agree");
    },
    hide() {
      this.isShowConsignment = false;
    },
    onCancelC() {
      if (this.countDown) {
        this.countDown.stop();
      }
      this.hide();
      this.$emit("cancel");
    },
  },
};
</script>
<style lang="scss" scoped>
.consignment-content {
  .c-html {
    max-height: 240px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    line-height: 20px;
    overflow-y: auto;
  }
  .btn-group {
    display: flex;
    align-items: right;
    justify-content: flex-end;
    padding-top: 26px;
    .btn {
      display: inline-block;
      line-height: 30px;
      background: #e5e5e5;
      border-radius: 15px;
      font-size: 14px;
      text-align: center;
      padding: 0 36px;
      margin-left: 24px;
      cursor: pointer;
    }
    .btn-default {
      background-color: #e5e5e5;
      color: rgba(0, 0, 0, 0.7);
    }
    .btn-red {
      background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
      color: #fff;
    }
  }

  @media screen and (max-width: 540px) {
    .btn-group {
      justify-content: space-between;
      .btn {
        margin: 0;
        padding: 0;
        text-align: center;
        font-size: 0.28rem;
      }

      .btn-default {
        width: 46%;
      }
      .btn-red {
        width: 50%;
      }
    }
  }
}
</style>
