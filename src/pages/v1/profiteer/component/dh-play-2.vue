<template>
  <div class="ui-body">
    <div class="content-w content1">
      <img
        class="ui-des-title"
        src="//static.theone.art/pc/looking-for-luck/des-title.png"
        alt="title"
      />
      <img
        class="ui-des-img"
        src="//static.theone.art/pc/looking-for-luck/des-img.png"
        alt="title"
      />
      <img
        class="ui-des-tip"
        src="//static.theone.art/pc/looking-for-luck/des-tip.png"
        alt="title"
      />
    </div>
    <div class="ui-line"></div>
    <div class="content-w" v-if="list[0]">
      <div class="ui-title">
        <div class="title">合成条件</div>
        <div class="des">持有《捞世界》10款剧照就可以合成定档海报</div>
      </div>
      <div class="material-wrap">
        <dh-material
          class="box"
          type="y"
          v-for="(item, index) in list[0].commodityList"
          :key="index"
          :idx="index"
          :material="item"
          @listen="materialCheck"
        ></dh-material>
      </div>
      <div
        :class="['btn', isClick ? 'btn-red' : 'btn-disabled']"
        @click="onCompose"
      >
        去合成
      </div>
    </div>
    <dh-select-material
      ref="refDhSelectMaterial"
      btn-txt="完成"
      @listen="getUserSelect"
    ></dh-select-material>
    <el-dialog
      class="v1-dialog-mycenter content-responsive"
      title="提示"
      width="300px"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <div class="dialog-txt-wrap">已经购买成功？</div>
      <div class="form-btns">
        <div class="v1-btn mycenter" @click="dialogVisible = false">未购买</div>
        <div class="v1-btn mycenter red" @click="onUpListInfo">已购买</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DhMaterial from "./dh-material.vue";
import DhSelectMaterial from "./dh-select-material.vue";
export default {
  name: "DhPlay2",
  components: { DhMaterial, DhSelectMaterial },
  props: {
    list: {
      type: Array,
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  computed: {
    isClick() {
      return this.list[0].commodityList.every((item) => {
        return item.amountCurrent >= item.amountNeed;
      });
    },
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    onUpListInfo() {
      this.dialogVisible = false;
       this.$emit("upListInfo");
    },
    async onCompose() {
      if(!this.isClick){
        return
      }
      let materialArr = [], //用户拥有大于合成所需的
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
      console.log(userSelect);
      this.$emit("listen", userSelect, this.list[0].id);
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
    materialCheck(material, idx, isFinish) {
      console.log(isFinish);
      if (!isFinish) {
        this.dialogVisible=true;
        
        window.open(`/market?key=${material.name}&id=${material.id}&type=${material.typeMarket}`);
      }
      this.materialIdx = idx;
      if (material.amountCurrent > material.amountNeed) {
        //去选择
        this.$refs.refDhSelectMaterial.show(material);
      }
    },
    getUserSelect(userMaterialArr) {
      //处理用户选中的数据
  
      const newList = JSON.parse(JSON.stringify(this.list[0]));

      newList.commodityList[this.materialIdx].userSelect = userMaterialArr[0];
      this.$emit("upList", [newList]);
      this.$refs.refDhSelectMaterial.hide();
      //用户选择完成更改原始数据
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/1.0/scss/profiteer-pub.scss";
.form-btns {
  display: flex;
  justify-content: flex-end;
  .v1-btn {
    margin-left: 15px;
  }
}
.dialog-txt-wrap {
  padding: 0 0 30px;
}
.content-w {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 58px;
  border-radius: 10px;
  @media screen and (max-width: 540px) {
    max-width: inherit;
    padding: 0.6rem;
  }
}
.ui-body {
  padding-bottom: 70px;
}

.content1 {
  img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .ui-des-title {
    font-size: 14px;
    font-weight: 800;
    color: #ffffff;
    max-width: 280px;
    margin-bottom: 40px;
  }
  .ui-des-tip {
    max-width: 400px;
    margin-top: 38px;
  }
}
.ui-line {
  width: 28px;
  height: 53px;
  background: url("//static.theone.art/pc/looking-for-luck/icon-line.png")
    no-repeat center;
  background-size: contain;
  margin: 20px auto;
}
.ui-title {
  padding: 0px 0 40px;
  text-align: center;
  .title {
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    line-height: 30px;
    margin-bottom: 10px;
  }
  .des {
    font-size: 14px;
    font-weight: 800;
    color: #ffffff;
  }
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
    width: 25%;
    padding: 10px;
    margin-bottom: 30px;
  }
}
.btn {
  max-width: 500px;
  margin: 40px auto 0;
}
@media screen and (max-width: 540px) {
  .btn {
    max-width: inherit;
    width: 80%;
    line-height: 0.88rem;
    margin-top: 0.1rem;
  }
  .material-wrap {
    justify-content: space-between;
    .box {
      width: 50%;
    }
  }
}
</style>