<template>
  <div>
    <dh-empty v-if="!dataObj"></dh-empty>
    <div v-else class="content">
      <div class="content-title">七合一，超爽敦煌静态等你来拿！！</div>
      <div
        :class="[
          'preview',
          dataObj.commodity.amountHas > 0 ? '' : 'image-gray',
        ]"
        :style="`background-image: url('${dataObj.commodity.cover}')`"
      ></div>
      <div class="preview-text">
        <p>{{ dataObj.commodity.name }}</p>
        <p>已合成*{{ dataObj.commodity.amountHas || 0 }}</p>
      </div>
      <dh-title>合成条件</dh-title>
      <div class="material-wrap">
        <dh-material
          class="box"
          type="y"
          v-for="(item, index) in dataObj.commodityList"
          :key="index"
          :idx="index"
          :material="item"
          :commodity="dataObj"
          @listen="materialCheck"
        ></dh-material>
      </div>
      <div
        :class="['btn compose-btn', isCompose ? 'btn-red' : 'btn-disabled']"
        @click="onCompose"
      >
        去合成
      </div>
    </div>
  </div>
</template>
<script>
import DhTitle from "./dh-title.vue";
import DhMaterial from "./dh-material.vue";
import DhEmpty from "./dh-empty.vue";
export default {
  name: "DhPlay2",
  components: { DhTitle, DhMaterial, DhEmpty },
  props: {
    list: {
      type: Array,
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
      let materialArr = [], //用户拥有大于合成所需的（ 未选择遗留下来的
        userSelect = [], //用户主动选择的
        haveJust = []; //刚好满足条件的
      let isConfig = true;
      this.list[0].commodityList.forEach((item) => {
        if (item.userSelect) {
          userSelect.push(item.userSelect.id);
        } else if (item.amountCurrent == item.amountNeed) {
          if (item.amountNeed == 1) {
            haveJust.push(item.id);
          } else {
            isConfig = false;
          }
        } else if (item.amountCurrent > item.amountNeed) {
          materialArr.push(item.id);
        }
      });
      if (!isConfig) {
        this.$message.warning("玩法配置错误！每种材料所需为1");
      }
      if (materialArr.length > 0) {
        this.$message.warning("请选择材料");
        return;
      }
      if (haveJust.length > 0) {
        const userMateriaArr = await this.createUserMaterial(
          haveJust,
          haveJust.length
        );
        if (userMateriaArr) {
          userMateriaArr.forEach((item) => {
            userSelect.push(item.id);
          });
        }
      }

      for (let i = 0; i < materialArr.length; i++) {
        const materiaArr = await this.createUserMaterial([materialArr[i]], 1);
        if (materiaArr) {
          userSelect.push(materiaArr[0].id);
        }
      }
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
@import "@/assets/1.0/scss/dunhang-pub.scss";
.content {
  max-width: 856px;
  margin: 0 auto;
}
.preview {
  max-width: 855px;
  height: 324px;
  background: no-repeat center #eee;
  background-size: cover;
  margin: 0 auto;
  border-radius: 10px;
  &-text {
    margin-top: 18px;
    color: #d3583f;
    text-align: center;
  }
}
.material-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .box {
    max-width: 199px;
    margin: 0px 9px 40px;
    ::v-deep .info {
      .ui-txt {
        min-height: 80px;
      }
    }
    ::v-deep .ui-cover {
      height: 286px;
    }
  }
}
.compose-btn {
  max-width: 450px;
  margin: 0 auto;
}
@media screen and (max-width: 540px) {
  // .content {
  // }
  .preview {
    width: 6.28rem;
    height: 2.38rem;
  }
  .material-wrap {
    justify-content: space-between;
    padding: 0 0.58rem;
    margin-bottom: 0.48rem;
    ::v-deep .box {
      .ui-cover {
        height: 4.28rem;
      }
      ::v-deep .info {
        .ui-txt {
          min-height: 100px;
        }
      }
    }
  }
  .material-wrap {

  .box {
  
    ::v-deep .info {
      .ui-txt {
        min-height: 100px;
      }
    }
  
  }
}

  .m-material-wrap-x,
  .m-material-wrap-y {
    &.box {
      max-width: 2.8rem;
      margin: 0.48rem 0.12rem 0;
    }
  }
  .btn {
    width: 5.24rem;
    height: 0.88rem;
    line-height: 0.88rem;
    margin: 0 auto;
    max-width: inherit;
  }
  ::v-deep .m-material-wrap-y {
    .img {
      width: 100%;
      height: 3.42rem;
      border-radius: 0.2rem;
      margin-bottom: 0.15rem;
    }
    .info {
      padding-top: 0;
      .txt {
        // font-size: 0.2rem;
        text-align: left;
      }
      .ui-txt {
        justify-content: flex-start;
      }
    }
    .btn {
      width: 2.3rem;
      min-width: 2.3rem;

      margin-top: 0.16rem;
    }
  }
}
</style>