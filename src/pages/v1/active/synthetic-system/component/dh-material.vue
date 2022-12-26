<template>
  <div :class="`m-material-wrap-${type}`" v-if="material">
    <div
      class="ui-cover"
      :class="['img responsive-img', isFinish ? '' : 'image-gray']"
      :style="`background-image:url(${
        material.cover || (compose && compose.cover)
      })`"
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
          <div>需要*{{ material.amountNeed }}</div>
          <div>当前拥有*{{ material.amountCurrent }}</div>
          <div
            class="ui-user-selected"
            v-if="material.userSelect && material.userSelect.length > 0"
          >
            当前选择：
            <div
              class="select-bar synthesis-select-border-color"
              v-for="(item, idx) in material.userSelect"
              :key="idx"
            >
              {{ item.commoditySku.number || 0 }}/{{
                item.commoditySku.amountNumber
              }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="!compose">
        <div
          class="btn btn-bg synthesis-btn-bg"
          v-if="isFinish"
          @click="onFinish(material,1)"
          :class="[
            btnStatus.key == 1 ? 'synthesis-btn-selected' : '',
            btnStatus.key == 5 ? 'btn-disabled' : '',
          ]"
        >
          {{ btnStatus.val }}
        </div>
        <div
          class="btn btn-border synthesis-btn-border"
          :class="{ 'btn-disabled': goBuyDisabled }"
          v-else
          @click="onFinish(material,2)"
        >
          去购买
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
    idx: Number,
    material: {
      //材料
      type: Object,
      default: () => {
        return {
          amountCurrent: null,
          amountHas: null,
          amountNeed: null,
          cover: "",
          id: "",
          name: "",
          userSelect: "",
        };
      },
    },
    commodity: {
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
    goBuyDisabled() {
      return this.material.name.search(/中签/i) !== -1;
    },
    isFinish() {
      //是否收集完毕

      return (
        this.material.amountCurrent &&
        this.material.amountCurrent >= this.material.amountNeed
      );
    },
    btnStatus() {
      if (this.material.userSelect && this.material.userSelect.length > 0) {
        return { key: 1, val: "已选择" };
      }
      if (this.material.amountCurrent) {
        if (this.material.amountCurrent > this.material.amountNeed) {
          if (this.material.disabled) {
            return { key: 5, val: "去选择" };
          }
          return { key: 2, val: "去选择" };
        } else if (this.material.amountCurrent == this.material.amountNeed) {
          if (this.way == 1) {
            return { key: 3, val: "去合成" };
          } else {
            if (
              this.commodity.amount != 0 &&
              this.commodity.amount < this.commodity.commodityList.length
            ) {
              if (this.material.disabled) {
                return { key: 5, val: "去选择" };
              }
              return { key: 2, val: "去选择" };
            } else {
              return { key: 4, val: "完成" };
            }
          }
        }
      }
      return { key: 5, val: "去购买" };
    },
  },
  methods: {
    onFinish(info,type) {
      if(this.goBuyDisabled&&type==2){
        return;
      }
      this.$bus.$emit("materialListen", {
        material: this.material,
        commodity: this.commodity,
        idx: this.idx,
        isFinish: this.isFinish,
      });
    },
    onGet() {},
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/active/synthetic-system.scss";
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
  margin-top: 20px;
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
      font-size: 0.22rem;
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
    height: 1.4rem;

    .txt {
    }
    .txt-title {
    }
  }
}
</style> 