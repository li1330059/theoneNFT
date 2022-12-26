<template>
  <div>
    <dh-empty v-if="!dataObj"></dh-empty>
    <div v-else>
      <!--      <div class="content-title">七合一，超爽敦煌静态等你来拿！！</div>
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
       -->
      <dh-title>合成条件</dh-title>
      <div class="material-wrap">
        <div
          class="box"
          v-for="(item, index) in dataObj.commodityList"
          :key="index"
        >
          <dh-material
            type="y"
            :idx="index"
            :material="item"
            :commodity="dataObj"
            @listen="materialCheck"
          ></dh-material>
        </div>
      </div>
      <div class="icon-poin bg"></div>
      <img :src="dataObj.commodity.cover" class="m-compose-wrap" />
      <div class="preview-text">
        <p>{{ dataObj.commodity.name }}</p>
        <p>已合成*{{ dataObj.commodity.amountHas || 0 }}</p>
      </div>
      <div
        :class="['btn compose-btn', isCompose ? 'btn-linear' : 'btn-disabled']"
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
@import "@/assets/1.0/scss/active/tom.scss";

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
  background-image: url("//static.theone.art/pc/tom/icon-point.png");
  margin: 0 auto 19px;
  transform: rotate(-90deg);
}
.m-compose-wrap {
  max-width: 460px;
  display: block;
  width: 100%;
  margin: 0 auto 20px;
}
.preview-text {
  font-size: 20px;
  font-weight: 400;
  color: $base-font-color;
  text-align: center;
}
@media screen and (max-width: 540px) {
  .preview {
    width: 6.28rem;
    height: 2.38rem;
  }

  .btn {
    width: 5.24rem;
    height: 0.88rem;
    line-height: 0.88rem;
    margin: 0 auto;
    max-width: inherit;
  }
}
</style>