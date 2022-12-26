/* 选择材料组件 */
<template>
  <div>
    <transition name="fade">
      <div
        class="m-select-material synthesis-base-color container"
        v-if="isShow"
      >
        <div class="mask" />
        <div
          class="m-content synthesis-content-bg-img synthesis-dialog-content-bgcolor grayscale"
        >
          <div class="m-content-title">
            <div class="title">您持有可用于合成的藏品：</div>
            <el-checkbox :value="isCheckedAll" @change="onCheckAll"
              ><span>全选</span></el-checkbox
            >
          </div>

          <div
            class="icon-close iconfont icon-icon_quxiao synthesis-select-close"
            @click="hide"
          />

          <div class="ui-material-wrap">
            <div class="ui-material-content">
              <div
                class="m-material-card"
                v-for="(item, idx) in materialList"
                :key="idx"
                :class="[item.select ? 'select' : '']"
                @click="onSelect(item, idx)"
              >
                <div
                  class="material-card-content"
                  :class="[item.select ? 'synthesis-select-border-color' : '']"
                >
                  <div class="img-wrap">
                    <div
                      class="img-cover"
                      :style="`background-image:url(${item.commoditySku.cover})`"
                    ></div>
                  </div>

                  <div class="info">
                    <div class="txt">{{ item.commoditySku.name }}</div>
                    <div class="m-num-wrap-center">
                      <commodity-num :treasure="item"></commodity-num>
                    </div>

                    <div
                      class="synthesis-select-icon iconfont icon-icon_xuanzhong synthesis-select-icon-color"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pagination-wrap">
              <g-paging
                ref="gPagingRef"
                :pageChange="handleCurrentChange"
                :pageSize="params.pageSize"
                :list="pList"
                :current-page="materialPageInfo.current"
              />
            </div>
          </div>
          <div class="m-have-select">
            <div class="title">
              已选择：<span v-if="isProbability"
                >（概率 {{ sumProbability }}%）</span
              >
              <span v-else
                >{{ userSelectList.length }}/{{ multipleChoiceNum }}</span
              >
            </div>
            <div class="select-wrap">
              <div
                class="bar"
                v-for="(item, idx) in userSelectList"
                :key="idx"
                @click="onRemoveUserSelected(item, idx)"
              >
                {{ item.commoditySku.name }}

                {{ $numFormat.getNumStr(item) }}

                <span
                  class="iconfont icon-icon_quxiao synthesis-select-close"
                />
              </div>
            </div>
            <div
              class="btn synthesis-btn-bg complate-btn"
              :class="{
                'btn-disabled': btnDisabled,
              }"
              @click="onSynthesis"
            >
              {{ btnTxt }}
            </div>
          </div>
        </div>
      </div>
    </transition>
    <selected-confirm
      ref="SelectedConfirmRef"
      @listenSure="listenSure"
    ></selected-confirm>
    <compose-tip ref="ComposeTipRef"></compose-tip>
  </div>
</template>
<script>
import SelectedConfirm from "./selected-confirm.vue";
import ComposeTip from "./compose-tip.vue";

export default {
  components: { SelectedConfirm, ComposeTip },
  name: "DhSelectMaterial",
  data() {
    return {
      isCheckedAll: false,
      isTypeCommodity4: false,
      materialList: [],
      type: 1,
      pList: [],
      threshold: {},
      isShow: false,
      multipleChoiceNum: 1, //应该选择几个材料
      btnTxt: "确定",
      recordsLength: 0,
      materialPageInfo: {
        current: 0,
        size: 0,
        total: 0,
      },
      params: {
        commodityIdList: [],
        pageCount: 1,
        pageSize: 20,
      },
      userSelectList: [],
    };
  },
  props: {
    groupProbability: {
      type: Object,
      default: () => {
        return {};
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
    btnDisabled() {
      return false;
    },
    sumProbability() {
      let probability = this.haveProbability;
      this.userSelectList.forEach((item) => {
        probability += item.probability;
      });
      return probability;
    },
    haveProbability() {
      let num = 0;
      /*      for (let key in this.groupProbability) {
        if (this.synthesisDetailId && key != this.synthesisDetailId) {
          num += this.groupProbability[key];
        }
      } */
      return num;
    },
  },
  watch: {
    materialList(val) {
      this.isCheckedAll = val.every((item) => {
        return item.select;
      });
    },
    isShow(v) {
      if (this.$common.isMobile()) {
        if (v) {
          const scrollTop =
            document.documentElement.scrollTop ||
            window.pageYOffset ||
            document.body.scrollTop;
          this.scrollTop = scrollTop;
          document.body.style["overflowY"] = "hidden";
          document.body.style["height"] = "100vh";
          document.querySelector("html").style["height"] = "100vh";
          document.querySelector("html").style["overflowY"] = "hidden";
        } else {
          document.querySelector("html").style["height"] = "inherit";
          document.querySelector("html").style["overflowY"] = "inherit";
          document.body.style["overflowY"] = "inherit";
          document.body.style["height"] = "inherit";
          document.documentElement.scrollTop = this.scrollTop;
        }
      }
    },
  },
  methods: {
    listenSure(type) {
      this.type = type;
      this.selecteAll();
    },
    onCheckAll() {
      if (this.isCheckedAll) {
        //取消全选
        this.materialList = this.materialList.map((item) => {
          item.select = false;
          const oldList = JSON.parse(JSON.stringify(this.userSelectList));
          const oldIdx = oldList.findIndex((item2) => item2.id == item.id);
          oldList.splice(oldIdx, 1);
          this.userSelectList = oldList;

          return item;
        });
      } else {
        //全选本页
        if (this.isTypeCommodity4) {
          this.$refs.SelectedConfirmRef.show();
        } else {
          this.selecteAll();
        }

        /*    */
        return;
        //除本页之外的其他选项
      }
    },
    selecteAll() {
      const resArr = this.userSelectList.filter(
        (item) => item.synthesisDetailId != this.synthesisDetailId
      ); //得到其他类别的已选数据

      let is_tip = false;
      const list = JSON.parse(JSON.stringify(this.materialList));
      this.materialList = list.map((item, idx) => {
        //当前一共选择的数量
        let haveSelectedArr = this.$common.uniqueAry(
          [...resArr, ...this.userSelectList],
          "id"
        );
        //每次添加元素都要判断是否符合条件
        if (
          haveSelectedArr.length < this.multipleChoiceNum ||
          (this.isProbability && this.sumProbability + item.probability <= 100)
        ) {
          const findIdx = this.userSelectList.findIndex(
            (item2) => item2.id == item.id
          );
          if (findIdx == -1) {
            //不存在添加
            if (this.type == 2) {
              if (item.commodity.typeCommodity != 4) {
                item.select = true;
                this.userSelectList.push(item);
              }
            } else {
              item.select = true;
              this.userSelectList.push(item);
            }
          }
        } else {
          is_tip = true;
        }

        return item;
      });
      if (is_tip || this.sumProbability == 100) {
        if (this.isProbability) {
          if (this.sumProbability == 100) {
            this.$message.warning("您的合成概率已经达到100%，无须再添加。");
          } else {
            const goodsName =
              list[0].commodity.name || list[0].commoditySku.name;
            this.$message.warning(`${goodsName}已达最大数量，无法再添加。`);
          }
        } else {
          this.$message.warning("您已选择足够的藏品数量");
        }
      }
    },
    toggleContainerTouchAction(v) {
      const container = document.querySelector(".container");
      if (!container) {
        return;
      }
      container.style["touch-action"] = v ? "none" : "auto";
    },
    stopTouch(e) {
      e.preventDefault();
    },
    show(materialInfo, threshold, needAmount, synthesisDetail) {
      this.userSelectList = [];
      this.materialList = [];
      this.threshold = threshold;
      this.synthesisDetailId = synthesisDetail.id;
      this.synthesisDetail = synthesisDetail;

      /*       console.log(materialInfo);
      if (playInfo.list.length > 1) {
        this.btnTxt = "合成";
      } else {
        this.btnTxt = "完成";
      } */
      this.userSelectList = threshold.userSelect
        ? JSON.parse(JSON.stringify(threshold.userSelect))
        : [];
      console.log(this.userSelectList);
      this.multipleChoiceNum = needAmount;
      this.params = {
        commodityIdList: [materialInfo.id],
        pageCount: 1,
        pageSize: 20,
      };

      this.getUserMaterial();
    },
    async getUserMaterial() {
      this.isTypeCommodity4 = false;
      const res = await this.$api.$service.treasureSku_listMaterial(
        this.params
      );
      /*      const res = {
        code: 200,
        message: "成功",
        data: {
          records: [
            {
              createTime: "2022-12-13 19:29:13",
              commoditySku: {
                number: 1272,
                amountNumber: 7500,
                name: "法国凭证-第二轮",
                cover:
                  "https://source.theone.art/watermarkResize/98ce2221777449433b7cc6dbf444c86a/4c00ff21b9a7a6296ecc19c3189ba726-16693830906470.9.jpg",
                coverGifVideo: null,
                coverAppGifVideo: null,
                gifFirstImageUrl: null,
                actualPicture: null,
                amountLike: null,
                chainName: null,
                chainContract: null,
                contractAddress: null,
                nftId: null,
                dataJson: null,
                statusNumber: null,
                id: "423e3b02611e530726623356b07dd16c",
                commodityId: "cba7c36fb9efa571dad5d6f6cbf6f618",
              },
              commodity: {
                name: null,
                cover: null,
                amountCurrent: null,
                typeMarket: 2,
                typeCommodity: 6,
                statusNumber: 2,
                id: null,
              },
              id: "b4564b4dafa1cd4752e39e30b1a9ce6a",
            },
            {
              createTime: "2022-12-13 19:29:13",
              commoditySku: {
                number: 2653,
                amountNumber: 7500,
                name: "法国凭证-第二轮",
                cover:
                  "https://source.theone.art/watermarkResize/98ce2221777449433b7cc6dbf444c86a/4c00ff21b9a7a6296ecc19c3189ba726-16693830906470.9.jpg",
                coverGifVideo: null,
                coverAppGifVideo: null,
                gifFirstImageUrl: null,
                actualPicture: null,
                amountLike: null,
                chainName: null,
                chainContract: null,
                contractAddress: null,
                nftId: null,
                dataJson: null,
                statusNumber: null,
                id: "00cf823e82640f435ec09d3f4fb1cd57",
                commodityId: "cba7c36fb9efa571dad5d6f6cbf6f618",
              },
              commodity: {
                name: null,
                cover: null,
                amountCurrent: null,
                typeMarket: 2,
                typeCommodity: 6,
                statusNumber: 2,
                id: null,
              },
              id: "4d69a467e56ed1d56656d4c76bcdc1b8",
            },
          ],
          total: 0,
          size: 20,
          current: 1,
          pages: 0,
        },
      }; */

      if (res.code == 200) {
        this.pList = res.data.records;
        if (res.data.records && res.data.records.length > 0) {
          this.isShow = true;
          this.recordsLength = res.data.records.length;
          this.materialPageInfo = {
            current: res.data.current,
            size: res.data.size,
            total: res.data.total,
          };
          this.materialList = res.data.records.map((item) => {
            if (item.commodity.typeCommodity == 4) {
              this.isTypeCommodity4 = true;
            }
            item.select = this.userSelectList.find(
              (item2) => item2.id == item.id
            );
            let probability = 0;
            if (this.synthesisDetail && this.synthesisDetail.probability) {
              probability = this.synthesisDetail.probability;
            }

            item.probability = probability;
            return item;
          });
        } else {
          this.recordsLength = 0;
          /*     this.$message.warning("没有足够的材料"); */
        }
      } else {
        this.$message.warning(res.message);
      }
    },
    createList() {},

    handleCurrentChange(val) {
      this.params.pageCount = val;
      this.getUserMaterial();
    },
    hide() {
      this.isShow = false;
    },
    init() {
      this.materialList = this.materialList.map((item) => {
        item.select = false;
        return item;
      });
    },
    onSelect(info, idx) {
      const have_idx = this.userSelectList.findIndex(
        (item) => item.id == info.id
      );
      if (have_idx == -1) {
        if (this.multipleChoiceNum == 1 && !this.isProbability) {
          this.materialList = this.materialList.map((item, _idx) => {
            item.select = _idx == idx;
            return item;
          });
          this.userSelectList = [];
        }
        if (
          this.userSelectList.length < this.multipleChoiceNum ||
          (this.isProbability && this.sumProbability + info.probability <= 100)
        ) {
          if (info.commodity.typeCommodity == 4) {
            this.$refs.ComposeTipRef.show(() => {
              this.userSelectList.push(info);
              this.materialList[idx].select = true;
            }, [info]);
          } else {
            this.userSelectList.push(info);
            this.materialList[idx].select = true;
          }
        } else {
          if (this.isProbability) {
            if (this.sumProbability == 100) {
              this.$message.warning("您的合成概率已经达到100%，无须再添加。");
            } else {
              this.$message.warning(
                `${
                  info.commodity.name || info.commoditySku.name
                }已达最大数量，无法再添加。`
              );
            }
          } else {
            this.$message.warning("您已选择足够的藏品数量");
          }
        }
      } else {
        this.userSelectList.splice(have_idx, 1);
        this.materialList[idx].select = false;
      }
    },
    onRemoveUserSelected(info, idx) {
      this.userSelectList.splice(idx, 1);
      this.materialList = this.materialList.map((item) => {
        if (info.commoditySku.id == item.commoditySku.id) {
          item.select = false;
        }
        return item;
      });
    },
    onSynthesis() {
      if (!this.btnDisabled) {
        this.$emit(
          "listen",
          this.userSelectList.map((item) => {
            if (!item.synthesisDetailId) {
              item.synthesisDetailId = this.synthesisDetailId;
            }
            return item;
          })
        );
      }
      /*      if (this.userSelectList.length == this.multipleChoiceNum) {
        this.$emit("listen", this.userSelectList);
      } else {
        if (this.playInfo.list.length == 0) {
           this.$emit("listen", this.userSelectList);
        } else {
          this.$message.warning("请选则足够的材料");
        }
      } */
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/active/synthetic-system.scss";
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.m-content-title {
  padding-bottom: 30px;
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 34px;
  }
}
.m-select-material {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.43);
  }
}
.m-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 100%;
  max-width: 1099px;

  border-radius: 10px;
  padding: 18px 68px 40px;
  .icon-close {
    cursor: pointer;
    position: absolute;
    top: 22px;
    right: 29px;
    font-size: 20px;
  }
}
.ui-material-wrap {
  overflow-y: auto;
  max-height: 40vh;
  .ui-material-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
.m-material-card {
  cursor: pointer;
  padding: 5px 10px 45px;
  width: 25%;

  .img-wrap {
    padding-bottom: 70%;
    padding-top: 20px;
    position: relative;
    top: 0;
    left: 0;
    margin-bottom: 13px;
  }
  .img-cover {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    margin-bottom: 21px;
    border-radius: 10px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .info {
    padding: 0 10px 15px;
    position: relative;
    .synthesis-select-icon {
      display: none;
      position: absolute;
      bottom: -2px;
      right: -3px;
      font-size: 32px;
    }
    .txt {
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .num {
      display: inline-block;
      font-size: 12px;
      font-weight: 600;
      color: #e2b57f;
      text-align: center;
      margin-top: 10px;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: url("//static.theone.art/pc/icons/pic_icon_bianhao.png");
      background-position: center;
      padding: 6px 10px 6px 16px;
      min-width: 109px;
    }
  }
  &.select {
    .info {
      .synthesis-select-icon {
        display: block;
      }
    }
  }
}
.material-card-content {
  border: 1px solid transparent;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
}
.ui-w {
  width: 50%;
  .img-cover {
    display: block;
    width: 100%;
    height: 210px;
  }
}
/* 用户选中列表 */
.m-have-select {
  padding-top: 33px;
  .title {
    font-size: 14px;
    margin-bottom: 10px;
  }
  .select-wrap {
    display: flex;
    flex-wrap: wrap;
    max-height: 108px;
    min-height: 50px;
    overflow-y: auto;
  }
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    background-color: #fff;
    padding: 7px 13px;
    border-radius: 14px;
    cursor: pointer;
    width: 32%;
    margin-bottom: 20px;
    margin-right: 12px;

    &:hover {
      opacity: 0.8;
    }
    .icon-delete {
      margin-left: 6px;
      margin-top: 1px;
    }
  }
}
/* 用户选中列表 -end*/
.pagination-wrap {
  display: flex;
  justify-content: flex-end;
}
.complate-btn {
  max-width: 460px;
  margin: 10px auto 0;
}
@media screen and (max-width: 540px) {
  .m-num-wrap-center {
    display: flex;
    justify-content: center;
    padding-top: 0.1rem;
  }
  .complate-btn {
    line-height: 0.8rem;
    margin: initial;
    max-width: initial;
  }
  .m-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-width: inherit;
    height: 100%;
    transform: translateX(0) translateY(0);
    padding: 0.44rem 0.3rem;
    /*   
    .icon-close {
      width: 40px;
      height: 40px;
      background: url("//static.theone.art/pc/dunhuang/icon-close.png")
        no-repeat center;
      background-size: contain;
      cursor: pointer;
      position: absolute;
      top: 22px;
      right: 29px;
    } */
  }
  .ui-material-wrap {
    overflow-y: auto;
    height: 90vh;
    max-height: inherit;
    padding-bottom: 8rem;
  }
  .m-material-card {
    border-radius: 0.4rem;
    padding: 0 0.12rem;
    width: 50%;
    margin-bottom: 0.46rem;
    .img-wrap {
    }
    .img-cover {
      display: block;
      width: 100%;
      height: 140px;
      margin-bottom: 0.4rem;
      border-radius: 0.2rem;
    }

    .info {
      padding-bottom: 0.3rem;
      text-align: center;
      .synthesis-select-icon {
        font-size: 0.54rem;
        bottom: -0.02rem;
        right: -0.02rem;
      }
      .select-icon {
        display: none;
        width: 0.8rem;
        height: 0.8rem;
      }
      .txt {
        font-size: 0.22rem;
        color: $base-font-color;
      }
      .num {
        display: inline-block;
        font-size: 0.24rem;
        margin: 0.2rem auto 0;
        padding: 0.12rem 0.2rem 0.12rem 0.32rem;
        min-width: 2rem;
      }
    }
    &.select {
      .info {
        .select-icon {
          display: block;
        }
      }
    }
  }
  .ui-w {
    width: 100%;
    .img-cover {
      display: block;
      width: 100%;
      height: 2.1rem;
    }
  }
  .m-have-select {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f5f5f5;
    border-radius: 0.4rem 0.4rem 0 0;
    padding: 0.28rem 0.4rem;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .title {
      font-size: 14px;
      color: $base-font-color;
      margin-bottom: 10px;
    }
    .btn {
      margin: 0 0.6rem 0.2rem;
    }

    .select-wrap {
      display: block;
      height: 2.8rem;
      overflow-y: auto;
      padding: 0 0.6rem;
    }
    .bar {
      width: 100%;
      display: flex;
      align-items: center;
      font-size: 0.24rem;
      margin-bottom: 0.3rem;
      padding: 7px 13px;
      border-radius: 14px;
      justify-content: space-between;
      &:hover {
      }
      .icon-delete {
        background-image: url("//static.theone.art/pc/icons/icon-close-white.png");
      }
    }
  }
  .m-content {
    padding-top: 1rem;

    .icon-close {
      position: absolute;
      top: 0.2rem;
      right: 0.2rem;
    }
  }
}
</style>
