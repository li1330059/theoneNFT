<template>
  <div>
    <div>
      <div class="paly-title grayscale">
        <h3>{{ activeTile }}</h3>
        <div class="txt margin-no" v-html="description"></div>
        <!--     <div class="txt">
          已锁定的藏品将在本次合成活动结束后归还到您的藏品中
        </div> -->
      </div>
      <div class="threshold-wrap">
        <!--  遍历合成门槛 -->
        <div
          class="threshold-list-wrap"
          v-for="(item1, index) in playInfo.synthesisThresholds"
          :key="index"
        >
          <!--  遍历合成材料-->
          <div
            class="box"
            v-for="(item2, idx2) in item1.synthesisDetails"
            :key="idx2"
          >
            <dh-material
              v-if="item2.typeJoin == 'commodity'"
              :idx="idx2"
              :activeKey="activeKey"
              :material="item2.commodity"
              :synthesisDetail="item2"
              :threshold="item1"
              @listen="materialCheck"
            ></dh-material>
            <dh-museum
              v-else
              :idx="idx2"
              :material="item2"
              :synthesisDetail="item2"
              :threshold="item1"
              @listen="listenMuseum"
            ></dh-museum>
          </div>
        </div>
      </div>

      <div class="icon-direction-wrap">
        <span
          class="iconfont icon-icon_jiantou synthesis-icon-direction-color"
        />
      </div>
      <div class="preview-wrap">
        <!-- 合成物 -->
        <dh-material class="box" :compose="playInfo.commodity"></dh-material>
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
import DhMuseum from "./dh-museum.vue";
import DhEmpty from "./dh-empty.vue";
import { getNum, getAmountNum } from "@/utils/number-format";
//一个合成（多个门槛｜｜-个门槛）
function groupArr(arr, goupKey) {
  return arr.reduce(function (prev, next) {
    const key = next[goupKey];
    console.log(key);
    console.log(prev);
    prev[key] = prev[key] ? [...prev[key], next] : [next];
    return prev;
  }, {});
}
export default {
  name: "DhPlay2",
  components: { DhMaterial, DhMuseum },
  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
    activeKey: {
      type: String,
      default: "",
    },
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
      if (this.config.conditionCopyWriting) {
        return this.config.conditionCopyWriting;
      }
      return "合成条件";

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
      if (this.config.buttonCopyWriting) {
        return this.config.buttonCopyWriting;
      }
      return "去合成";
    },
    description() {
      return this.playInfo.description
        ? this.playInfo.description.replace(/\n/gi, "<br>")
        : "";
    },
    dataObj() {
      return {};
      //代表只有一个合成
      /*    return this.list[0] || null; */
    },
    isCompose() {
      // 是否可合成
      if (this.playInfo) {
        return this.playInfo.synthesisThresholds.every((item) => {
          return item.userSelect && item.userSelect.length >= item.number;
        });
      }
      return false;
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
    listenMuseum(info) {
      if (info.typeJoin == "category") {
        //重新选择
        this.$emit("listenCategorySelect", info);
      }
    },
    async onCompose() {
      if (!this.isCompose) {
        return;
      }
      let materialArr = [], //用户拥有大于合成所需的（ 未选择遗留下来的
        userSelect = [], //用户主动选择的
        haveJust = [], //刚好满足条件的
        haveJustLength = 0, //刚好满足条件所需材料的长度
        resMateriaIds = []; //最终的材料id

      this.playInfo.synthesisThresholds.forEach((item) => {
        if (item.userSelect) {
          userSelect = [...userSelect, ...item.userSelect];
        }
      });

      let arr4 = []; //特殊材料，合成时需要提示
      resMateriaIds = userSelect.map((item) => {
        if (item.commodity.typeCommodity == 4) {
          arr4.push(item);
        }

        return item.id;
      });

      const probabilityGoodsArr = this.createProbabilityTip(userSelect);

      this.$emit(
        "listen",
        resMateriaIds,
        this.playInfo.id,
        arr4,
        probabilityGoodsArr
      );
    },
    createProbabilityTip(userSelect) {
      //生成概率提示信息
      const resObj = groupArr(userSelect, "synthesisDetailId");

      let resArr = [],
        probability = 0;
      for (let key in resObj) {
        const numbers = resObj[key].map((item) => {
          //取编号
          probability += item.probability || 0;
          return `${getNum(item)}/${getAmountNum(item)}`;
        });
        console.log(resObj[key][0]);
        const name =
          resObj[key][0].commodity.name || resObj[key][0].commoditySku.name;
        let str = `${name}${numbers}`;
        resArr.push(str);
      }
      if (probability) {
        return [resArr, probability];
      }
      return null;
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
.paly-title {
  .margin-no {
    margin-bottom: 6px;
  }
}

.threshold-list-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
    margin: 0 -0.16rem;
    .box {
      width: 50%;
      padding: 0 0.16rem 0.32rem;
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
      font-size: 0.8rem;
      margin: 0.32rem auto 0.32rem;
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
