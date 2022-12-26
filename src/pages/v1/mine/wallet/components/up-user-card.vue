<template>
  <div>
    <div class="m-user-card">
      <div class="m-navigation">
        <div class="main" @click="onReturn">
          <span class="icon-direction" />身份证信息上传
        </div>
      </div>
      <div class="ui-head">
        <div class="des">
          {{ title }}
        </div>
        <div class="warning">提醒：请上传清晰的身份证正反面来完成认证。</div>
      </div>
      <div class="card-wrap">
        <div class="m-up-card">
          <div class="preview-card-wrap">
            <img
              class="preview-card"
              src="//static.theone.art/pc/icons/id-card-front.png"
            />
            <div
              class="card"
              v-if="preidCardBack"
              :style="`background-image:url(${preidCardBack})`"
            ></div>

            <div class="m-loading" v-if="idCardBackLoading">
              <div><loading /></div>
            </div>
          </div>
          <input
            class="pointer"
            @change="upCard('idCardBack', $event)"
            type="file"
            accept="image/*"
          />
          <div class="txt">点击上传身份证头像面</div>
        </div>
        <div class="m-up-card">
          <div class="preview-card-wrap">
            <img
              class="preview-card"
              src="//static.theone.art/pc/icons/id-card-back.png"
            />
            <div
              class="card"
              v-if="preidCardFront"
              :style="`background-image: url(${preidCardFront})`"
            ></div>

            <div class="m-loading" v-if="idcardFrontLoading">
              <div><loading /></div>
            </div>
          </div>
          <input
            class="pointer"
            @change="upCard('idCardFront', $event)"
            type="file"
            accept="image/*"
          />
          <div class="txt">点击上传身份证国徽面</div>
        </div>
      </div>
      <div class="btn-group btn-center">
        <div
          class="btn btn-red btn-large"
          :class="{ 'btn-disable': !idCardBack || !idCardFront || disable }"
          @click="onSubmit"
        >
          确定
        </div>
      </div>
    </div>
    <el-dialog
      title="验证成功"
      :visible.sync="isShowIdCardSuccess"
      :before-close="() => (isShowIdCardSuccess = false)"
    >
      <div class="m-success-wrap">
        <div class="txt">验证成功</div>
        <div class="txt">
          就差一步就验证完成啦，此支付密码是您在宝付账户专项提现时使用，请牢记。
        </div>
        <div class="btn-group">
          <div class="btn btn-large btn-red">去宝付通设置支付密码</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Loading from "@/components/v1/loading/loading";
import imageCompress from "@/utils/image-compress";
export default {
  components: { Loading },
  data() {
    return {
      isShowIdCardSuccess: false,
      disable: false,
      idCardFront: "",
      idCardBack: "",
      idcardFrontLoading: false,
      idCardBackLoading: false,
      preidCardFront: "",
      preidCardBack: "",
    };
  },
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  computed: {},
  mounted() {},
  methods: {
    onReturn() {
      if (this.$parent.changePage) {
        this.$parent.changePage(0);
      }
      this.$emit("cancel");
    },
    async upCard(type, e) {
      const file = e.target.files[0];
      if (!file) {
        return;
      }
      this[`${type}Loading`] = true;

      try {
        imageCompress(file, { size: 2 * 1024 * 1024 }).then(async (blob) => {
          this.up(type, blob, `${Date.now()}.jpg`);
        });
      } catch (e) {
        this.up(type, file);
      }
    },
    async up(type, file, imgType) {
      const params = new FormData();
      if (imgType) {
        params.append("file", file, imgType);
      } else {
        params.append("file", file);
      }

      params.append("type", "IdCard");
      if (file && file.size > 1024 * 1024 * 3) {
        this.$message.warning("图片体积大于3M，请压缩后上传");
        return;
      }
      const res = await this.$api.service.payChannel_uploadCert(params);
      this[`${type}Loading`] = false;
      if (res.data.code == 200 && res.data.data) {
        const img = res.data.data;
        const previewImg = window.URL.createObjectURL(file);
        this[`pre${type}`] = previewImg;
        this[type] = img;
      } else {
        // this.$store.commit("setLoading", false);
        this.$message({
          message: res.data.message || "图片上传失败",
          type: "warning",
        });
      }
    },
    async onSubmit() {
      /*     this.$emit("listenUpCardSuccess");
       return; */
      if (!this.idCardBack || !this.idCardFront) {
        this.$message.warning("请先上传身份证");
        return;
      }
      this.$emit("listenUpCardSuccess", {
        idCardFront: this.idCardBack,
        idCardBack: this.idCardFront,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/treasure.scss";
.m-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  display: flex;
  align-content: center;
  justify-content: center;
  background-color: #fff;
}
.m-user-card {
  background-color: #fff;
  padding: 16px 30px 38px;
  @media screen and (max-width: 540px) {
    padding: 1rem 0 1.6rem;
    background-color: transparent;
  }
}
.head {
  .des {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 24px;
    margin-bottom: 10px;
  }
  .warning {
    font-size: 14px;
    font-weight: 400;
    color: #eb3229;
  }
}
.ui-head {
  font-size: 14px;
  font-weight: 400;
  padding-bottom: 14px;
  .des {
    color: #333333;
    line-height: 24px;
  }
  .warning {
    color: #e61f1a;
    line-height: 20px;
  }
  @media screen and (max-width: 540px) {
    background: linear-gradient(240deg, #303a63 0%, #0f1722 100%);
    padding: 0.4rem 0.56rem 2rem;
    .des {
      color: #ffffff;
      margin-bottom: 0.1rem;
    }
  }
}
.card-wrap {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;

  @media screen and (min-width: 0px) and (max-width: 540px) {
    display: block;
    padding: 0 0.54rem;
    margin-top: -1.6rem;
  }
}
.m-up-card {
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 0.2rem;
  padding: 34px 0 18px;
  position: relative;
  top: 0;
  left: 0;
  input {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
  .preview-card-wrap {
    position: relative;
    top: 0;
    left: 0;
    width: 392px;
    .preview-card {
      display: block;
      width: 100%;
    }
    .card {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      background-color: #fff;
    }
  }

  .txt {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    margin-top: 19px;
  }
  .card-front {
    background-image: url("//static.theone.art/pc/icons/id-card-front.png");
  }
  .card-back {
    background-image: url("//static.theone.art/pc/icons/id-card-back.png");
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    border-radius: 0.1rem;

    .preview-card-wrap {
      width: 65%;
      margin: 0 auto;
    }
  }
}
.m-success-wrap {
  .btn-group {
    padding-top: 30px;
    display: flex;
    justify-content: flex-end;
  }
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
