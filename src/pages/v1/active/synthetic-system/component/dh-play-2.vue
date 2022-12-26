<template>
  <div>
    <dh-empty v-if="!dataObj"></dh-empty>
    <div v-else>
      <div class="paly-title grayscale">
        <h3>{{ activeTile }}</h3>
        <div class="txt" v-html="description"></div>
      </div>
      <div :class="{ 'm-content-wrap': dataObj.commodityList.length == 1 }">
        <div class="material-wrap grayscale">
          <div
            class="box"
            v-for="(item, index) in dataObj.commodityList"
            :key="index"
          >
            <dh-material
              :idx="index"
              :material="item"
              :commodity="dataObj"
              @listen="materialCheck"
            ></dh-material>
          </div>
        </div>
        <div class="icon-direction-wrap">
          <span
            class="iconfont icon-icon_jiantou synthesis-icon-direction-color"
          />
        </div>
        <div class="preview-wrap">
          <dh-material class="box" :compose="dataObj.commodity"></dh-material>
        </div>
      </div>

      <div
        :class="[
          'btn compose-btn grayscale',
          isCompose ? 'synthesis-btn-bg' : 'btn-disabled',
        ]"
        @click="onCompose"
      >
        {{ buttonTxt }}
      </div>
    </div>
  </div>
</template>
<script>
import DhMaterial from "./dh-material.vue";
import DhEmpty from "./dh-empty.vue";
export default {
  name: "DhPlay2",
  components: { DhMaterial, DhEmpty },
  props: {
    list: {
      type: Array,
    },
    playInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    activeTile() {
      if (
        this.activeKey == "locking-duanqiao" ||
        this.activeKey == "locking-xihu"
      ) {
        return "锁定条件";
      } else if (this.activeKey == "exchange-wy") {
        return "兑换条件";
      }
      return "合成条件";
    },
    buttonTxt() {
      if (
        this.activeKey == "locking-duanqiao" ||
        this.activeKey == "locking-xihu"
      ) {
        return "去锁定";
      } else if (this.activeKey == "exchange-wy") {
        return "去兑换";
      }
      return "去合成";
    },
    description() {
      return this.dataObj.description
        ? this.dataObj.description.replace(/\n/gi, "<br>")
        : "";
    },
    dataObj() {
      return this.list[0] || null;
    },
    isCompose() {
      if (this.list[0]) {
        if (this.list[0].amount && this.list[0].amount > 0) {
          const userHave = this.list[0].commodityList.filter(
            (item) => item.amountCurrent >= item.amountNeed
          );

          if (userHave.length >= this.list[0].amount) {
            return true;
          } else {
            return false;
          }
        } else {
          return this.list[0].commodityList.every((item) => {
            return item.amountCurrent >= item.amountNeed;
          });
        }
      } else {
        return false;
      }
    },
  },
  methods: {
    materialCheck(material, idx) {
      this.materialIdx = idx;
      if (material.amountCurrent > material.amountNeed) {
        //去选择
        this.$parent.showSelectMaterial(material, "完成");
      }
    },
    async onCompose() {
      //优先使用用户选择的
      //没选当用户拥有>合成所需的，提示要继续选择
      //用户拥有==合成所需，直接使用

      let materialArr = [], //用户拥有大于合成所需的（ 未选择遗留下来的
        userSelect = [], //用户主动选择的
        haveJust = [], //刚好满足条件的
        haveJustLength = 0, //刚好满足条件所需材料的长度
        resMateriaIds = []; //最终的材料id
      const amount = this.list[0].amount;

      this.list[0].commodityList.forEach((item) => {
        if (item.userSelect) {
          userSelect = [...userSelect, ...item.userSelect];
        } else if (item.amountCurrent == item.amountNeed) {
          haveJust.push(item.id);
          haveJustLength += Number(item.amountCurrent);
        } else if (item.amountCurrent > item.amountNeed) {
          materialArr.push(item.id);
        } else {
          //没有足够的材料
        }
      });
      if (!this.isCompose) {
        this.$message.warning("材料不足");
        return;
      }
      if (amount > 0) {
        if (
          userSelect.length + haveJust.length < amount ||
          haveJust.length > amount
        ) {
          if (userSelect.length == amount) {
          } else if (userSelect.length > amount) {
            this.$message.warning("选多了");
            return;
          } else if (userSelect.length < amount) {
            this.$message.warning("请选择材料");
            return;
          }
        }
      } else {
        if (materialArr.length > 0) {
          this.$message.warning("请选择材料");
          return;
        }
      }

      if (haveJust.length > 0) {
        const userMateriaArr = await this.createUserMaterial(
          haveJust,
          haveJustLength
        );
        if (userMateriaArr) {
          //刚好满足条件的材料id集合
          resMateriaIds = [
            ...resMateriaIds,
            ...userMateriaArr.map((item) => item.id),
          ];
        }
      }
      resMateriaIds = [...userSelect.map((item) => item.id), ...resMateriaIds];
      resMateriaIds =
        amount > 0 ? resMateriaIds.splice(0, amount) : resMateriaIds;
      this.$emit("listen", resMateriaIds, this.list[0].id);
      return;
    },
    async createUserMaterial(commodityIdList, pageSize) {
      const res = await this.$api.$service.treasureSku_listMaterial({
        commodityIdList,
        pageCount: 1,
        pageSize,
      });
      if (res.code == 200) {
        return res.data.records || [];
      } else {
        this.$message.error(res.message);
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/1.0/scss/active/synthetic-system.scss";

.material-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .box {
    width: 33.3%;
    padding: 0 50px 60px;
  }

  @media screen and (max-width: 900px) {
    .box {
      width: 50%;
    }
  }
  @media screen and (max-width: 540px) {
    .box {
      width: 50%;
    }
  }
}
.compose-btn {
  max-width: 450px;
  margin: 59px auto 0;
  border-radius: 100px;
}

.icon-direction-wrap {
  display: flex;
  justify-content: center;
  padding: 30px 0 60px;
  .iconfont {
    font-size: 50px;
  }
}

.preview-wrap {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  .line {
    width: 95px;
  }
  .box {
    max-width: 400px;
  }
  @media screen and (max-width: 540px) {
    .line {
      width: 0.3rem;
    }
  }
}
.m-content-wrap {
  display: flex;
  .box {
    width: 100%;
    padding: 0;
    max-width: 260px;
    margin: 0 auto;
  }

  .icon-direction-wrap {
    margin: 0;
    margin-top: 9%;
    display: block;
    .iconfont {
      display: inline-block;
      transform: rotate(-90deg);
    }
  }
  .preview-wrap {
    flex: 1;
    display: block;
  }
  .material-wrap {
    flex: 1;
    display: block;
  }
}

@media screen and (max-width: 540px) {
  .preview {
    width: 6.28rem;
    height: 2.38rem;
  }

  .compose-btn {
    width: 5.24rem;
    height: 0.88rem;
    line-height: 0.88rem;
    margin: 0.49rem auto 0;
    max-width: inherit;
  }
  .material-wrap {
    margin: 0 -0.1rem;
    .box {
      padding: 0 0.1rem 0.4rem;
    }
  }
  .icon-direction-wrap {
    margin-top: 9%;
    .iconfont {
      font-size: 0.5rem;
      margin: 0.42rem auto 0.42rem;
    }
  }
  .m-content-wrap {
    .box {
      padding: 0;
    }
    .icon-direction-wrap {
      margin: 9% 0.18rem;
      .iconfont {
        font-size: 0.5rem;
        margin: 0.42rem auto 0.42rem;
      }
    }
    .preview-wrap {
    }
    .material-wrap {
      margin: 0;
    }
  }
}
</style>
