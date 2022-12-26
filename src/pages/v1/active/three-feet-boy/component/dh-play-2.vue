<template>
  <div>
    <dh-empty v-if="!dataObj"></dh-empty>
    <div v-else>
      <div class="paly-title">
        <img class="responsive-img" :src="playInfo.des" />
      </div>
      <div :class="{ 'm-content-wrap': dataObj.commodityList.length == 1 }">
        <div class="material-wrap">
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
        <div class="icon-poin bg synthesis-icon-direction"></div>
        <div class="preview-wrap">
          <dh-material class="box" :compose="dataObj.commodity"></dh-material>
          {{ JSON.stringify() }}
          <div
            class="line"
            v-if="dataObj.commodityList[0].amountNeed == 2"
          ></div>
          <dh-material
            v-if="dataObj.commodityList[0].amountNeed == 2"
            class="box"
            :compose="{
              type: '1',
              name: '附赠狮子头精美手办（仅限前30名，以后台合成顺序为准）',
              cover:
                '//static.theone.art/pc/icons/garage-kit.png',
            }"
          ></dh-material>
          <!--    -->
        </div>
      </div>

      <div
        :class="[
          'btn compose-btn',
          isCompose ? 'synthesis-btn-bg' : 'btn-disabled',
        ]"
        @click="onCompose"
      >
        去合成
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
    dataObj() {
      return this.list[0] || null;
    },
    isCompose() {
      if (this.list[0]) {
        return this.list[0].commodityList.every((item) => {
          return item.amountCurrent >= item.amountNeed;
        });
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
      let isEnough = true; //是否有足够的材料
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
          isEnough = false;
        }
      });
      if (!isEnough) {
        this.$message.warning("材料不足");
        return;
      }
      if (materialArr.length > 0) {
        this.$message.warning("请选择材料");
        return;
      }

      if (haveJust.length > 0) {
        const userMateriaArr = await this.createUserMaterial(
          haveJust,
          haveJustLength
        );
        if (userMateriaArr) {
          resMateriaIds = [
            ...resMateriaIds,
            ...userMateriaArr.map((item) => item.id),
          ];
        }
      }
      resMateriaIds = [...resMateriaIds, ...userSelect.map((item) => item.id)];
      this.$emit("listen", resMateriaIds, this.list[0].id);
      return;

      /*       for (let i = 0; i < materialArr.length; i++) {
        const materiaArr = await this.createUserMaterial([materialArr[i]], 1);
        if (materiaArr) {
          userSelect.push(materiaArr[0].id);
        }
      } */
      if (userSelect.length > 0) {
        this.$emit("listen", userSelect, this.list[0].id);
      } else {
        this.$message.warning("请凑齐材料");
      }
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
@import "@/assets/1.0/scss/active/three-feet-boy.scss";

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
}
.icon-poin {
  width: 63px;
  height: 60px;
  margin: 0 auto 40px;
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
   .line{
     width:.3rem;
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
  .icon-poin {
    transform: rotate(-90deg);
    margin-top: 9%;
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
  .icon-poin {
    width: 0.63rem;
    height: 0.6rem;
    margin: 0.36rem auto 0.42rem;
  }
  .m-content-wrap {
    .box {
      padding: 0;
    }
    .icon-poin {
      width: 0.63rem;
      height: 0.6rem;
      margin: 18% 0.18rem;
    }
    .preview-wrap {
    }
    .material-wrap {
      margin: 0;
    }
  }
}
</style>