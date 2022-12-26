<template>
  <div :class="`m-material-wrap-${type}`" v-if="material">
    <div
      class="ui-cover"
      :class="['img responsive-img', isFinish ? '' : 'image-gray']"
      :style="`background-image:url(${material.imgUrl})`"
      :alt="material.haveCommodityName"
    />
    <div class="info grayscale">
      <div class="ui-txt synthesis-base-color">
        <div class="txt" v-if="compose">
          <div class="max-txt-len">{{ compose.name }}</div>
          <div class="" v-if="compose.type != 1">
            已合成{{ compose.amountHas || 0 }}个
          </div>
        </div>
        <div class="txt" v-else>
          <div class="max-txt-len">{{ material.name }}</div>
          <div v-if="isProbability">
            概率 <span>{{ synthesisDetail.probability }}%</span>
          </div>
          <div v-if="threshold.number && !isProbability">
            <div
              v-if="
                threshold.synthesisDetails &&
                threshold.synthesisDetails.length > 1
              "
            >
              需要*指定馆内的{{ threshold.number }}个藏品
            </div>
            <div v-else>需要*{{ threshold.number }}</div>
          </div>

          <!--    <div>当前拥有*{{ material.amountCurrent }}</div> -->
          <div class="ui-user-selected" v-if="userSelect.length > 0">
            已选择：
            <div class="select-bar synthesis-select-border-color">
              {{ userSelect.length }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="!compose">
        <div
          class="btn btn-bg synthesis-btn-bg"
          @click="onFinish(material, 1)"
          :class="[
            btnStatus.key == 1 ? 'synthesis-btn-selected' : '',
            btnStatus.key == 5 ? 'btn-disabled' : '',
          ]"
        >
          {{ btnStatus.val }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "DhMaterial",
  data() {
    return {};
  },
  props: {
    type: {
      type: String, //横向显示x/竖向显示y
      default: "y",
    },
    synthesisDetail: {
      type: Object,
      default: () => {
        return {};
      },
    },
    idx: Number,
    material: {
      //材料
      type: Object,
      default: () => {
        return {};
      },
    },
    threshold: {
      //门槛信息
      type: Object,
      default: () => {
        return {
          description: null,
          id: "",
          name: "",
          playsKey: "",
        };
      },
    },
    way: {
      type: String,
      default: null,
    },
    compose: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  computed: {
    isProbability() {
      if (this.threshold && this.threshold.synthesisDetails) {
        const idx = this.threshold.synthesisDetails.findIndex((item) => {
          return parseInt(item.probability) >= 0;
        });
        return idx == -1 ? false : true;
      }
      return false;
    },
    goBuyDisabled() {
      return 1;
    },
    isFinish() {
      //是否收集完毕

      return (
        this.material.amountCurrent &&
        this.material.amountCurrent >= this.material.amountNeed
      );
    },
    userSelect() {
      if (this.threshold.userSelect && this.threshold.userSelect.length > 0) {
        const userSelect = this.threshold.userSelect.filter(
          (item) => item.synthesisDetailId == this.synthesisDetail.id
        );
        return userSelect;
      }
      return [];
    },
    btnStatus() {
      if (this.userSelect.length > 0) {
        return { key: 1, val: "已选择" };
      } else {
        return { key: 2, val: "去选择" };
      }
    },
  },
  methods: {
    onFinish(info, type) {
      //中签无法去购买

      if (this.goBuyDisabled && type == 2) {
        return;
      }
      this.$emit("listen", {
        material: this.material,
        threshold: this.threshold,
        idx: this.idx,
        isFinish: this.isFinish,
        synthesisDetail: this.synthesisDetail,
        typeJoin: "category",
      });

      /*      this.$bus.$emit("materialListen", {
        material: this.material,
        threshold: this.threshold,
        idx: this.idx,
        isFinish: this.isFinish,
        synthesisDetail: this.synthesisDetail,
      }); */
    },
    onGet() {},
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/active/synthetic-system.scss";
.compose-page {
}
.btn {
  width: 100%;
}
.ui-user-selected {
  display: flex;
  flex-wrap: wrap;
}
.select-bar {
  padding: 0 4px;
}
.ui-cover {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.53);
  border-radius: 12px;
  padding-bottom: 100%;
  border-radius: 11px;
  border: 1px solid #ffffff;
}
.m-material-wrap-y {
  width: 100%;
  .ui-cover {
    width: 100%;
  }
  .info {
    padding: 20px 0 0;
  }
}
.ui-txt {
  .txt-title {
    display: none;
  }
  overflow-y: auto;
  height: 90px;
  font-size: 14px;

  line-height: 1.6;
}
.m-material-wrap-x {
  display: flex;
  width: 100%;
  .ui-cover {
    width: 199px;
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 23px 0 16px 34px;
    width: 220px;
  }
}
.btn {
  margin-top: 10px;
  @media screen and (max-width: 540px) {
    margin-top: 0.1rem;
  }
}
.have-select {
  background-color: #fab707;
  color: #fff;
  border-color: #fab707;
}
@media screen and (max-width: 540px) {
  .m-material-wrap-y {
    .ui-cover {
      img {
        width: 100%;
      }
    }
    .ui-txt {
      font-size: 0.24rem;
    }
    .info {
      padding: 0.16rem 0 0;
    }
  }

  .m-material-wrap-x {
    display: block;
    .ui-cover {
      width: 100%;
      .cover {
        width: 100%;
      }
    }
    .info {
      padding: 0.2rem 0 0;
      width: 100%;
    }
  }
  .ui-txt {
    height: 1.55rem;

    .txt {
    }
    .txt-title {
    }
  }
}
</style>
