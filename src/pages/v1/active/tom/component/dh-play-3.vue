<template>
  <div>
     <dh-empty v-if="!dataObj"></dh-empty>
    <div v-else class="content-w m-play-3">
      <div class="m-preview-wrap">
        <div class="content-title">三合一，超爽敦煌动态等你来拿！！</div>
        <div
          class="ui-preview-wrap preview-img"
          :class="{ 'image-gray': dataObj.commodity.amountHas <= 0 }"
          :style="`background-image: url('${dataObj.commodity.cover}')`"
          alt="合成图预览"
        />
        <div class="des">
          {{ dataObj.commodity.name }}<br />
          已合成*{{ dataObj.commodity.amountHas }}
        </div>
      </div>
      <dh-title>合成条件</dh-title>
      <div class="material-wrap">
        <dh-material
          type="y"
          way="1"
          class="ui-material"
          v-for="(item, idx) in dataObj.commodityList"
          :key="idx"
          :material="item"
          :commodity="dataObj"
        ></dh-material>
      </div>
      <!--     <div
      class="compose-btn btn btn-red"
      :class="{ 'btn-disabled': isCompose }"
      @click="onCompose"
    >
      去合成
    </div> -->
    </div>
   
  </div>
</template>
<script>
import DhTitle from "./dh-title.vue";
import DhMaterial from "./dh-material.vue";
import DhEmpty from "./dh-empty.vue";
export default {
  name: "DhPlay3",
  components: { DhTitle, DhMaterial, DhEmpty },
  data() {
    return {};
  },
  props: {
    list: Array,
    default: [],
  },
  mounted() {},
  computed: {
    dataObj() {
      return this.list[0] || null;
    },
    isCompose() {
      //是否满足合成条件
      if (this.list[0] && this.list[0].commodityList.length > 0) {
        return this.list[0].commodityList.every(
          (item) => item.amountNeed > item.amountCurrent
        );
      }
      return false;
    },
  },
  methods: {
    onCompose() {
      console.log(this.list);
      this.$emit("listen", {});
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/1.0/scss/dunhang-pub.scss";
.ui-material {
  max-width: 268px;
  @media screen and (max-width: 540px) {
    max-width: inherit;
    margin: 0;
    ::v-deep .btn {
      margin: 0.16rem auto;
      max-width: 2.3rem;
    }
  }
}
.m-preview-wrap {
  .preview-img {
    display: block;
    margin-bottom: 20px;
  }
  .des {
    font-size: 14px;
    color: #c55234;
    text-align: center;
  }
}
.material-wrap {
  margin-bottom: 40px;
  justify-content: center;
}
.m-play-3 {
  padding-bottom: 30px;
}
.compose-btn {
  width: 60%;
  margin: 0 auto;
}

@media screen and (max-width: 540px) {
  .material-wrap {
    display: block;
    padding:0 .15rem;
  }
  .compose-btn {
    width: 90%;
    line-height: 0.88rem;
    font-size: 0.24rem;
  }
}
</style>