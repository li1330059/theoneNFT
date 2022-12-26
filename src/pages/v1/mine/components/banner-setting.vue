<template>
  <div>
    <div class="mask" :class="{ 'show-mask': isShow }" @click="onHide" />
    <div class="ui-banner-setting" :class="{ show: isShow }">
      <div class="icon-close" @click="onHide"></div>
      <div class="m-banner-wrap grayscale" v-for="item in bannerList" :key="item.uuid">
        <div class="img-wrap" :style="`background-image:url(${item.cover})`">
          <div class="options-wrap">
            <span class="icon-delete" @click="onDeleteBanner(item)" />
          </div>
        </div>
      </div>
      <div class="m-banner-wrap m-banner-wrap-add">
        <div class="icon-add img-wrap">
          <input
            class="up-wrap"
            @change="upBanner"
            type="file"
            accept="image/*"
          />
          <div class="txt">添加背景图</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      isShow: false,
    };
  },
  props: {
    bannerList: {
      type: Array,
    },
  },
  created() {
    /*   this.getUserBannerList(); */
  },
  computed: {},
  beforeDestroy() {
    this.isShow = false;
  },

  methods: {
    init() {
      this.isShow = true;
    },
    onDeleteBanner(item) {
      this.$confirm("确认删除？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "",
      }).then(async () => {
        const res = await this.$api.service.userBanner_delete({
          uuid: item.uuid,
        });
        if (res.data.code == 200 && res.data.data) {
          this.$parent.getUserBannerList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    onHide() {
      this.isShow = false;
    },
    async upBanner(e) {
      if (this.bannerList.length > 5) {
        this.$message.warning("最多设置5张");
        return;
      }

      const file = e.target.files[0];
      if (file && file.size < 1024 * 1024 * 5) {
        this.$store.commit("setLoading", true);
        const params = new FormData();
        params.append("file", file);
        params.append("type", "image");
        const res = await this.$api.service.upload_uploadFile(params);
        if (res.data.code == 200 && res.data.data) {
          const banner_img = res.data.data;
          const save_res = await this.$api.service.userBanner_save({
            cover: banner_img,
          });
          this.$store.commit("setLoading", false);
          if (save_res.data.code == 200 && save_res.data.data) {
            this.$parent.getUserBannerList();
          } else {
            this.$message.error(save_res.data.message);
          }
        } else {
          this.$store.commit("setLoading", false);
          this.$message({
            message: res.data.message || "图片上传失败",
            type: "warning",
          });
        }
      } else {
        this.$message({
          message: "文件大小不得大于5M",
          type: "warning",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.2);
  display: none;
}
.show-mask {
  display: block;
}
.ui-banner-setting {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  box-shadow: 0px -12px 23px 0px #a19a9a;
  border-radius: 50px 50px 2px 0px;
  display: flex;
  flex-wrap: wrap;
  z-index: 99;
  padding: 120px 70px 150px;
  transform: translateY(1000px);
  transition: all ease-out 0.26s;

  .icon-close {
    position: absolute;
    top: 25px;
    right: 42px;
    width: 40px;
    height: 40px;
    background: url("//static.theone.art/pc/icons/close.png")
      no-repeat center;
    background-size: contain;
    cursor: pointer;
  }
  &.show {
    transform: translateY(0);
  }
}

.m-banner-wrap {
  color: rgba(0, 0, 0, 0.4);
  width: 25%;
  position: relative;
  top: 0;
  left: 0;
  text-align: center;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    .options-wrap {
      display: flex;
    }
  }
  .options-wrap {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    display: none;
    align-items: center;
    justify-content: center;
    .icon-delete {
      background: url("//static.theone.art/pc/icons/delete.png")
        no-repeat center;
      background-size: contain;
      width: 51px;
      height: 51px;
      display: inline-block;
    }
  }
  .img-wrap {
    margin: 13px;
    background-position: center;
    border-radius: 10px;
    background-size: cover;
    height: 224px;
  }
}
.m-banner-wrap-add {
  .img-wrap {
    border: 2px solid rgba(0, 0, 0, 0.2);
  }
  .icon-add {
    background: url("//static.theone.art/pc/icons/icon-add.png")
      no-repeat center;
    background-size: 50px;
  }
  .up-wrap {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    opacity: 0;
  }
  .txt {
    position: absolute;
    bottom: 60px;
    left: 0;
    width: 100%;
    text-align: center;
  }
}
</style>
