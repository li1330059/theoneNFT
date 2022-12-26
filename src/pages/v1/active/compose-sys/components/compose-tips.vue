<template>
  <div class v-if="isShow">
    <div class="dialog-content-wrap">
      <div class="dialog-content">
        <div class="icon-close" @click="hide"></div>
        <div class="tips">提示</div>
        <div class="content">
          <p>您已选择终极合成</p>
          <p class="name">
            <span v-for="(item,index) in nameInfo" :key="index">{{index+1 +'、'+item}}</span>
          </p>
          <p>合成后不可撤销，请确认是否使用此藏品合成</p>
          <div class="btn">
            <div class="btn-cancel" @click="hide">取消</div>
            <div class="btn-confirm" @click="confirm">确定</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
      nameInfo: null
    };
  },
  async created() {},
  methods: {
    show(option) {
      this.nameInfo = option;
      this.isShow = true;
    },
    hide() {
      this.nameInfo = null;
      this.isShow = false;
    },
    confirm() {
      this.$emit("listen", true);
      this.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
.compose-btn {
  width: 100%;
  max-width: 500px;
  line-height: 50px;
  background: #e4a516;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  margin: 42px auto 0;
  cursor: pointer;
  user-select: none;
}
.dialog-content-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999999;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
  }
  .dialog-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background: #e5e3e3;
    border-radius: 4px;
    width: 50%;
    max-width: 1100px;
    .icon-close {
      background-image: url("//static.theone.art/pc/compose/icon-close.png");
      position: absolute;
      top: 22px;
      right: 28px;
      width: 18px;
      height: 18px;
    }
    .tips {
      font-size: 16px;
      padding: 16px 24px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }
    .content {
      padding: 16px 24px;
      box-sizing: border-box;
    }
    span {
      color: #e61f1a;
      margin-right: 10px;
    }
    .name {
      margin-bottom: 14px;
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin: 30px 0px 10px;
      cursor: pointer;
      div {
        margin-left: 17px;
        padding: 5px 34px;
        border-radius: 50px;
      }
    }
    .btn-cancel {
      background-color: #cccccc;
      color: #666;
    }
    .btn-confirm {
      background-color: #e4a516;
      color: #fff;
    }
  }
}
@media screen and (max-width: 540px) {
  .dialog-content-wrap {
    padding: 0 15px;
    .mask {
    }
    .dialog-content {
      width: 95%;
      .icon-close {
      }
    }
  }
}
</style>