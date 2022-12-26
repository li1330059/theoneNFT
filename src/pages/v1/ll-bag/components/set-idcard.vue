<template>
  <div class="ll-bag-body ll-block-body">
    <m-head :back="back"></m-head>
    <section class="idcard-block">
      <input
        class="pointer"
        @change="upCard('idCardBack', $event)"
        type="file"
        accept="image/*"
      />
      <div class="img-block">
        <div
          class="preview-card"
          :style="`background-image:url(${preidCardBack})`"
          v-if="preidCardBack"
        ></div>
        <img
          class="responsive-img"
          src="//static.theone.art/pc/ll-bag/id-face.png"
        />
      </div>

      <div class="loading-wrap" v-if="idCardBackLoading">
        <content-loading />
      </div>
      <div class="des">点击上传身份证人像面</div>
    </section>
    <section class="idcard-block">
      <input
        class="pointer"
        @change="upCard('idCardFront', $event)"
        type="file"
        accept="image/*"
      />
      <div class="loading-wrap" v-if="idCardFrontLoading">
        <content-loading />
      </div>
      <div class="img-block">
        <div
          class="preview-card"
          :style="`background-image:url(${preidCardFront})`"
          v-if="preidCardFront"
        ></div>
        <img
          class="responsive-img"
          src="//static.theone.art/pc/ll-bag/id-hui.png"
        />
      </div>

      <div class="des">点击上传身份证国徽面</div>
    </section>
    <section class="fixed-bottom bottom-btn-wrap">
      <div class="ll-btn ll-btn-default" @click="back">返回</div>
      <div
        class="ll-btn ll-btn-primary"
        :class="{ 'll-btn-opacity': isDisabled }"
        @click="next"
      >
        下一步
      </div>
    </section>
    <div v-if="loading" class="body-loading">
      <content-loading />
    </div>
  </div>
</template>
<script>
import ContentLoading from "./content-loading";
import imageCompress from "@/utils/image-compress";
import MHead from "./m-head.vue";
export default {
  components: { ContentLoading, MHead },
  props: {
    nextPage: {
      type: String,
      default: "",
    },
    resParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      idCardBack: "", //人像面
      idCardFront: "", // 国徽面
      idCardBackLoading: false,
      idCardFrontLoading: false,
      preidCardFront: "",
      preidCardBack: "",
      isUp: false, //用户是否上传过
      loading: false,
    };
  },
  computed: {
    isDisabled() {
      if (this.isUp) {
        return false;
      }
      return !(this.idCardFront && this.idCardBack);
    },
  },
  created() {},
  watch: {
    resParams(val, val2) {
      if (
        val &&
        JSON.stringify(val) !== "{}" &&
        val.idCardFront &&
        val.idCardBack
      ) {
        this[`preidCardFront`] = val.idCardFront;
        this[`preidCardBack`] = val.idCardBack;
        this.idCardFront = {
          id: val.idCardFrontId,
        };
        this.idCardBack = {
          id: val.idCardBackId,
        };
        this.isUp = true;
      } else {
        this.isUp = false;
        /*         this.rest(); */
      }
    },
  },
  methods: {
    rest() {
      this.idCardBack = ""; //人像面
      this.idCardFront = ""; // 国徽面
      this.idCardBackLoading = false;
      this.idCardFrontLoading = false;
      this.preidCardFront = "";
      this.preidCardBack = "";
    },
    back() {
      this.$emit("listen", {
        page: "user-info",
      });
    },
    restIsUp() {
      this.isUp = false;
    },
    async next() {
      if (this.isDisabled) {
        return;
      }
      if (this.isUp) {
        this.$emit("listen", {
          page: this.nextPage,
          data: {},
        });
        return;
      }
      this.loading = true;
      const res = await this.$api.service.ll_llWithdrawal_uploadIdCard({
        idCardBackUuid: this.idCardFront.id, //身份证国徽
        idCardFrontUuid: this.idCardBack.id,
      });
      this.loading = false;
      if (res.data.code == 200) {
        if (res.data.data && res.data.data.success) {
          this.isUp = true;
          this.$emit("listen", {
            page: this.nextPage,
            data: {},
          });
        } else {
          this.$message.error(
            (res.data.data && res.data.data.reason) || "error"
          );
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    upCard(type, e) {
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
      this.restIsUp();
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
      try {
        const res = await this.$api.service.upload_uploadCert(params);
        this[`${type}Loading`] = false;
        if (res.data.code == 200 && res.data.data) {
          const img = res.data.data;
          const previewImg = window.URL.createObjectURL(file);
          this[`pre${type}`] = previewImg;
          this[type] = img;
        } else {
          this.$message({
            message: res.data.message || "图片上传失败",
            type: "warning",
          });
        }
      } catch (e) {
        this[`${type}Loading`] = false;
        this.$message({
          message: "图片上传失败",
          type: "warning",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.body-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999999;
  background-color: rgba(0, 0, 0, 0.2);
  @media screen and (max-width: 540px) {
    position: fixed;
  }
}
.bottom-btn-wrap {
  background-color: #fff;
  z-index: 99;
}
.idcard-block {
  overflow: hidden;
  padding: 10px;
  background: #ffffff;
  box-shadow: 0px 2px 16px 0px rgba(182, 182, 182, 0.16);
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  position: relative;
  top: 0;
  left: 0;
  .img-block {
    position: relative;
    top: 0;
    left: 0;
  }
  .preview-card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #dddddd;
    border-radius: 10px;
  }
  .loading-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 6;
  }
  .pointer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: visible;
    z-index: 3;
  }
  .des {
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    margin-top: 10px;
    padding-bottom: 2px;
    text-align: center;
  }
}
</style>
