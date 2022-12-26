<template>
  <div class="ui-body">
    <div class="m-collection" @click="$common.goPage('/mine/treasure')">
      <div class="icon-collection" />
      我的藏品
    </div>
    <div class="m-content">
      <div class="m-list">
        <div v-for="item in list" :key="item.id">
          <div class="play-title">{{ item.name }}</div>
          <div
            class="m-synthesis-bar"
            v-for="item2 in item.commodityList"
            :key="item2.id"
          >
            <div class="info">
              <div
                class="cover"
                :style="`background-image:url(${item2.cover})`"
              ></div>
              <h4>{{ item2.name }}</h4>
              <div>需要*{{ item2.amountNeed }}</div>
              <div>当前拥有*{{ item2.amountCurrent }}</div>
            </div>
            <div class="icon">=></div>
            <div class="info">
              <div
                class="cover"
                :style="`background-image:url(${item.commodity.cover})`"
              ></div>
              <h4>{{ item.commodity.name }}</h4>
              <div>已拥有{{ item.commodity.amountHas }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="v1-btn" @click="onSynthesis">合成（一个不留）</div>
    </div>
    <el-dialog
      class="v1-dialog-mycenter content-responsive"
      title="合成进度"
      width="300px"
      :visible.sync="dialogVisible"
      :before-close="
        () => {
          dialogVisible = false;
        }
      "
    >
      <div class="dialog-txt-wrap">
        <h3>{{ status }}</h3>
        <div>已成功合成：{{ right }}个</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      dialogVisible: false,
      list: [],
      right: 0,
      isNext: true,
      status: "正在合成",
    };
  },
  created() {
    this.key = this.$route.params.key;
    this.getPlayInfo();
  },

  mounted() {},
  beforeDestroy() {},
  computed: {},
  methods: {
    async getPlayInfo() {
      const playRes = await this.$api.$service.synthesis_list({
        playsKey: this.key,
      });
      if (playRes.code == 200) {
        this.list = playRes.data;
      } else {
        this.$message.error(playRes.message);
      }
    },
    async onSynthesis() {
      this.right = 0;
      this.$confirm(`确定全部合成？`, "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(async () => {
        this.dialogVisible = true;
        this.status = "正在合成";
        this.start();
      });
    },
    async start() {
      const synthesisInfo = this.checkMaterial();
      if (synthesisInfo) {
        const [commodityId, materialArr] = synthesisInfo;

        const userMaterial = await this.createParams(materialArr);
        if (userMaterial) {
          if (/* window.confirm("next?")|| */ this.isNext) {
            const res = await this.$api.$service.treasureSku_synthesis({
              treasureSkuIdList: userMaterial,
              synthesisId: commodityId,
            });
            if (res.code == 200) {
              this.right++;
              await this.getPlayInfo();
              this.start();
            } else {
              this.$message.warning("遇到失败，请重试");
            }
          }
        }
      } else {
        this.status = "已完成";
      }
    },
    checkMaterial() {
      const newList = JSON.parse(JSON.stringify(this.list));
      for (let i = 0; i < newList.length; i++) {
        const item = newList[i];
        const commodityId = item.id;
        let materialArr = []; //此合成需要的材料种类
        for (let j = 0; j < item.commodityList.length; j++) {
          const item2 = item.commodityList[j];
          if (item2.amountCurrent >= item2.amountNeed) {
            materialArr.push(item2);
          }
        }
        if (materialArr.length == item.commodityList.length) {
          return [commodityId, materialArr];
        }
      }
      return false;
    },
    async createParams(materialArr) {
      //id,list,可以合成数量
      let arr = [];
      for (let i = 0; i < materialArr.length; i++) {
        const info = materialArr[i];
        if (info.amountCurrent < info.amountNeed) {
          return false;
        } else {
          const userMaterial = await this.getUserMaterial({
            commodityIdList: [info.id],
            pageCount: 1,
            pageSize: info.amountNeed,
          });
          arr = [...arr, ...userMaterial.map((item) => item.id)];
        }
      }
      return arr;
    },

    async getUserMaterial(params) {
      const res = await this.$api.$service.treasureSku_listMaterial(params);
      if (res.code == 200) {
        if (res.data.records && res.data.records.length > 0) {
          return res.data.records;
        }
      } else {
        return [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.m-collection {
  width: 100px;
  height: 100px;
  background: #d3583f;
  border-radius: 6px 0px 0px 6px;
  position: fixed;
  top: 60vh;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #ffebc8;
  cursor: pointer;
  z-index: 99;
  user-select: none;
  .icon-collection {
    margin-bottom: 8px;
    width: 30px;
    height: 30px;

    background: url("//static.theone.art/pc/dunhuang/icon-collection.png")
      no-repeat center;
    background-size: contain;
  }
}
.ui-body {
  display: flex;
  justify-content: center;
  padding: 60px 0 100px;
}
.m-list {
  margin: 0 auto;
  .play-title {
    font-size: 20px;
    padding: 15px 0;
  }
}

.m-synthesis-bar {
  display: flex;
  align-items: center;
  color: #717171;
  margin-bottom: 30px;
  .icon {
    padding: 0 30px;
  }
  .cover {
    width: 160px;
    padding-bottom: 100%;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #f7f7f7;
  }
}
.v1-btn {
}
@media screen and (max-width: 540px) {
  .m-synthesis-bar {
  
    margin-bottom: 30px;
    padding:0 15px;
    .icon {
      padding: 0 30px;
    }
    .cover {
      width:100%;
    }
    .info{
      flex:1;
    }
  }
}
</style>