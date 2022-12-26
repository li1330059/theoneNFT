<template>
  <div class="ui-body synthesis-base-color synthesis-body-bg-color">
    <!--    <status-template
      :list="playOptions"
      api="/goods/api/activityTemplate/detailV2"
      :init="getPlayDetail"
    > -->

    <div class="loading-wrap" v-if="loading">
      <loading></loading>
    </div>

    <div v-else-if="playOptions.length > 0">
      <div class="m-banner grayscale">
        <div class="banner" v-lazy:background-image="templateInfo.banner"></div>
        <img
          class="banner-phone"
          :src="
            templateInfo.bannerAdapter
              ? templateInfo.bannerAdapter
              : templateInfo.banner
          "
        />
      </div>
      <!--       <section class="m-active-notice bg-img">
        <span class="ui-icon icon-notice"></span>
        <span class="txt"
          >已有合成人数：<span class="sign">{{ 1 }}</span> 位 ！</span
        >
      </section> -->
      <div class="content-w grayscale">
        <div
          class="synthesis-active-title-color m-active-title"
          v-if="configObj.title"
        >
          {{ configObj.title }}
        </div>
        <img
          v-else
          class="responsive-img block-des"
          :src="templateInfo.ipDescription"
        />
        <div
          class="available-msg synthesis-available-color"
          v-if="available >= 0"
        >
          剩余可合成<span class="synthesis-available-num-color">{{
            available
          }}</span
          >个
        </div>

        <div class="m-tab-wrap">
          <div
            class="tab synthesis-tab-color"
            v-for="(item, idx) in playOptions"
            :key="idx"
            :class="{ selected: currentPlay == idx }"
            @click="onChangePlay(item, idx)"
          >
            <div class="tab-icon iconfont icon-icon_wanfahezi"></div>
            <div class="txt hidden-1">{{ item.name }}</div>
          </div>
        </div>

        <div class="m-content synthesis-content-bg-img">
          <div class="swiper-container swiper j-page-swiper">
            <div class="swiper-wrapper">
              <div
                class="swiper-slide"
                v-for="(item, idx) in playOptions"
                :key="idx"
              >
                <dh-play-2
                  :config="configObj"
                  class="j-page2"
                  @listen="createCompose"
                  @listenCategorySelect="listenCategorySelect"
                  :list="item"
                  :playInfo="item"
                  :activeKey="activeKey"
                ></dh-play-2>
              </div>
            </div>
          </div>
        </div>
        <div
          class="rule-block synthesis-message-bg-color"
          v-if="ruleDescription"
        >
          <div
            class="m-title synthesis-active-txt-color synthesis-message-color"
          >
            <span class="iconfont icon-icon_wanfahezi" />
            <div class="txt">{{ configObj.ruleTitle }}</div>
            <span class="iconfont icon-icon_wanfahezi" />
          </div>
          <div
            class="ui-activity-instructions synthesis-active-txt-color synthesis-message-color"
          >
            <div
              v-html="ruleDescription"
              class="synthesis-message-link-color"
            ></div>
          </div>
        </div>
        <div class="rule-block synthesis-message-bg-color">
          <div
            class="m-title synthesis-active-txt-color synthesis-message-color"
          >
            <span class="iconfont icon-icon_wanfahezi" />
            <div class="txt">活动须知</div>
            <span class="iconfont icon-icon_wanfahezi" />
          </div>
          <div
            class="ui-activity-instructions synthesis-active-txt-color synthesis-message-color"
          >
            <div
              v-html="description"
              class="synthesis-message-link-color"
            ></div>
          </div>
        </div>
      </div>

      <div
        class="m-collection synthesis-icon-collection-color synthesis-collection-bgcolor grayscale"
        @click="$common.goPage('/mine/treasure')"
      >
        <div class="icon-collection iconfont icon-icon_wanfahezi" />
        我的藏品
      </div>

      <div
        class="m-collection m-logs synthesis-log-icon-color synthesis-log-bgcolor grayscale"
        @click="onShowLogs"
      >
        <div class="icon-collection iconfont icon-hechengjilu" />

        <div class="hidden-1">
          {{
            configObj.recordCopyWriting
              ? configObj.recordCopyWriting
              : "合成记录"
          }}
        </div>
      </div>
      <dh-loading
        ref="refDhLoading"
        :name="commodity.commodity && commodity.commodity.name"
      ></dh-loading>
      <dh-select-material
        ref="refDhSelectMaterial"
        width="360"
        :groupProbability="groupProbability"
        @listen="compose"
        @upList="upList"
      ></dh-select-material>
      <!--     <dh-compound ref="refDhCompound" :commodity="createCommodity"></dh-compound> -->
      <el-dialog
        class="v1-dialog-mycenter content-responsive"
        title="提示"
        width="300px"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
      >
        <div class="dialog-txt-wrap">已经购买成功？</div>
        <div class="form-btns">
          <div class="v1-btn mycenter" @click="dialogVisible = false">
            未购买
          </div>
          <div class="v1-btn mycenter red" @click="onUpListInfo">已购买</div>
        </div>
      </el-dialog>
      <dh-compose-animate
        ref="refDhCompound"
        :commodity="createCommodity"
      ></dh-compose-animate>
    </div>
    <div v-else>
      <dh-empty></dh-empty>
    </div>
    <!--     </status-template> -->
    <treasure-list
      :isApp="isApp"
      ref="TreasureListRef"
      :groupProbability="groupProbability"
      @listen="listenTreasureListSelected"
    ></treasure-list>

    <logs ref="LogsRef"></logs>
    <compose-tip ref="ComposeTipRef"></compose-tip>
    <bankSubmit
      v-if="userInfo"
      ref="bankSubmit"
      :userInfo="userInfo"
      @listen="listenBankSubmit"
    ></bankSubmit>
    <nameVerified
      ref="nameVerified"
      @listen="listenNameVerified"
    ></nameVerified>
  </div>
</template>
<script>
import DhPlay1 from "./component/dh-play-1.vue";
import DhPlay2 from "./component/dh-play-2.vue";
import Swiper from "swiper";
import DhLoading from "./component/dh-loading.vue";
import DhSelectMaterial from "./component/dh-select-material.vue";
import DhComposeAnimate from "./component/dh-compose-animate.vue";
import writeThemeStyle from "./component/create-theme-css";
import DhEmpty from "./component/dh-empty";
import Logs from "./component/logs.vue";
import TreasureList from "./component/treasure-list.vue";
import ComposeTip from "./component/compose-tip.vue";
import bankSubmit from "../../mine/wallet/bankSubmit";
import nameVerified from "../../mine/setting/nameVerified";
import Loading from "../../../../components/v1/loading/loading.vue";

const toChinesNum = (num) => {
  let changeNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]; //changeNum[0] = "零"
  let unit = ["", "十", "百", "千", "万"];
  num = parseInt(num);
  let getWan = (temp) => {
    let strArr = temp.toString().split("").reverse();
    let newNum = "";
    for (var i = 0; i < strArr.length; i++) {
      newNum =
        (i == 0 && strArr[i] == 0
          ? ""
          : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0
          ? ""
          : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i])) +
        newNum;
    }
    return newNum;
  };
  let overWan = Math.floor(num / 10000);
  let noWan = num % 10000;
  if (noWan.toString().length < 4) noWan = "0" + noWan;
  return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
};

export default {
  name: "SyntheticSystem",
  components: {
    DhPlay2,
    DhLoading,
    DhSelectMaterial,
    DhComposeAnimate,
    DhEmpty,
    Logs,
    TreasureList,
    ComposeTip,
    bankSubmit,
    nameVerified,
    Loading,
  },
  data() {
    return {
      configObj: {},
      isApp: false,
      loading: true,
      activeKey: "",
      dialogVisible: false,
      templateInfo: {}, //合成模版信息
      playOptions: [],
      currentPlay: 0, //默认显示哪种玩法(0,1,2)
      noticeArr: [
        "恭喜藏家张***，成功合成了C款三人坐姿奏乐组（静态）！！",
        "testtest！",
      ],

      commodity: {}, //当前选中的合成目标信息
      currentMaterial: {}, //当前操作的材料
      createCommodity: {
        commoditySku: {},
      }, //合成成功后的信息
    };
  },
  async created() {
    this.loading = true;
    this.activeKey = this.$route.params.activeKey;
    this.isApp = this.$route.query.token ? true : false;
    if (this.activeKey) {
      await this.getPlayDetail();
      if (this.playOptions && this.playOptions.length > 0) {
        this.$nextTick(() => {
          this.createPlaySwiper();
        });
      }
    }
  },

  mounted() {
    this.$bus.$on(
      "materialListen",
      async ({ material, threshold, btnStatus, synthesisDetail }) => {
        if (this.userInfo.userUuid && this.userInfo.userUuid.length > 0) {
        } else {
          this.$message.error("请先登录！");
          const redirect = `${window.location.href}`;
          this.$router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
          return;
        }
        //来自材料组件按钮
        this.threshold = threshold; //合成门槛（对应一个合成材料）
        this.currentMaterial = synthesisDetail.commodity; //当前选择的材料
        this.synthesisDetail = synthesisDetail;
        if (btnStatus.key == 5) {
          if (this.isApp) {
            //app内
            this.$confirm(`App请前往市场进行购买.`, "提示", {
              confirmButtonText: "确定",
              showCancelButton: false,
              type: "warning",
              center: true,
              customClass: "confirm-center",
            }).then(async () => {});
            return;
          }
          //去购买
          setTimeout(() => {
            this.dialogVisible = true;
          }, 300);

          window.open(
            `/market?key=${material.name}&id=${material.id}&type=${material.typeMarket}`
          );
          return;
        }
        const playInfo = this.playOptions[this.currentPlay]; //当前玩法配置
        //当前门槛需要的材数量
        const amount = this.threshold.number;
        //当前门槛用户选择的材料总数
        const userSelect = this.threshold.userSelect;
        console.log(synthesisDetail);

        this.$refs.refDhSelectMaterial.show(
          material,
          threshold,
          amount,
          synthesisDetail
        );
      }
    );
  },
  beforeDestroy() {
    this.$bus.$off("materialListen");
  },
  computed: {
    logTitle() {
      if (this.activeKey == "test" || this.activeKey == "plan-weiyi") {
        return "锁定记录";
      }
      return "合成记录";
    },
    available() {
      if (this.playOptions[this.currentPlay]) {
        const num =
          this.playOptions[this.currentPlay].commodity.amountAvailable;
        console.log(this.playOptions[this.currentPlay]);
        if (typeof num == "number") {
          if (num < 0) {
            return 0;
          }
          return num;
        }
      }
      return -1;
    },
    description() {
      if (this.templateInfo.description) {
        if (this.activeKey == "tuomeng-qingxi") {
          return this.templateInfo.description
            .replace(/\n/gi, "<br>")
            .replace(/16:00。/gi, "17:00。");
        }
        return this.templateInfo.description.replace(/\n/gi, "<br>");
      }
      return "";
    },
    ruleDescription() {
      if (this.configObj.ruleContent) {
        return this.configObj.ruleContent.replace(/\n/gi, "<br>");
      }
      return "";
    },
    userInfo() {
      return this.$store.state.user_info;
    },
    groupProbability() {
      function sumGroupProbability(arr, goupKey) {
        return arr.reduce(function (prev, next) {
          const key = next[goupKey];
          const probability = next.probability ? next.probability : 0;

          prev[key] = prev[key] ? prev[key] + probability : probability;
          return prev;
        }, {});
      }
      const playInfo = this.playOptions[this.currentPlay];
      let userSelect = [];
      if (playInfo) {
        playInfo.synthesisThresholds.forEach((item) => {
          if (item.userSelect) {
            userSelect = [...userSelect, ...item.userSelect];
          }
        });
      }

      return sumGroupProbability(userSelect, "synthesisDetailId");
    },
  },
  methods: {
    //绑定银行卡
    listenBankSubmit(result) {
      if (result.result) {
        this.$store.commit("setUserInfo", {
          ...this.userInfo,
          statusBankVerified: 1,
        });
      }
    },
    //实名认证结果
    listenNameVerified(info) {
      if (info.result) {
        this.$message.success("认证成功");
        if (this.userInfo.statusBankVerified != 1) {
          this.$refs.bankSubmit.init();
          return;
        }
      } else {
        this.$message.error("认证失败");
      }
    },
    listenTreasureListSelected(info) {
      if (this.userInfo.userUuid && this.userInfo.userUuid.length > 0) {
      } else {
        this.$message.error("请先登录！");
        const redirect = `${window.location.href}`;
        this.$router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
        return;
      }
      this.updateThresholdUserSelected(
        info.selectedSkuList,
        info.synthesisDetailId
      );
    },
    updateThresholdUserSelected(userSelect, synthesisDetailId) {
      //更新用户门槛选择信息
      const data = JSON.parse(JSON.stringify(this.playOptions)); //当前玩法配置
      const currentOption = data[this.currentPlay]; // 当前合成配置
      //找到对应的合成门槛
      const idx = currentOption.synthesisThresholds.findIndex(
        (item) => item.id == this.threshold.id
      );
      if (idx != -1) {
        //添加去重处理
        const haveSelect = currentOption.synthesisThresholds[idx].userSelect;
        console.log(userSelect);
        if (haveSelect && haveSelect.length > 0) {
          const arr = haveSelect.filter((item) => {
            item.synthesisDetailId !== synthesisDetailId;
          }); //去掉同类型
          currentOption.synthesisThresholds[idx].userSelect = [
            ...arr,
            ...userSelect,
          ];
        } else {
          currentOption.synthesisThresholds[idx].userSelect = userSelect;
        }
      }
      this.playOptions = data; //更新玩法数据
      this.playSwiper.update();
    },
    updataCurrentSelecteInfo(threshold, synthesisDetail) {
      this.threshold = threshold; //合成门槛（对应一个合成材料）
      this.currentMaterial = synthesisDetail.commodity; //当前选择的材料
      this.synthesisDetail = synthesisDetail;
    },
    listenCategorySelect({ material, threshold, isFinish, synthesisDetail }) {
      this.updataCurrentSelecteInfo(threshold, synthesisDetail);
      //当前门槛需要的材数量
      const amount = this.threshold.number;
      //当前门槛用户选择的材料总数
      const userSelect = this.threshold.userSelect;
      if (this.threshold.synthesisDetails.length > 0) {
        //一个门槛对应多个类型的藏品｜｜馆
      } else {
        //一个门槛对应一个类型的藏品｜｜馆
      }
      this.$refs.TreasureListRef.init(synthesisDetail, threshold, amount);
    },
    onShowLogs() {
      this.$refs.LogsRef.show(this.activeKey);
    },
    handleClose() {
      this.dialogVisible = false;
    },
    onUpListInfo() {
      this.dialogVisible = false;
      this.getPlayDetail();
    },

    showSelectMaterial(material, btnTxt) {
      //需要当前材料信息
      this.$refs.refDhSelectMaterial.show(material, btnTxt);
    },
    upList({ newList, idx }) {
      this.playOptions[idx].list = newList;
    },
    async getUserMaterial(id_arr, size) {
      const res = await this.$api.$service.treasureSku_listMaterial({
        commodityIdList: id_arr,
        pageCount: 1,
        pageSize: size,
      });
      if (res.code == 200) {
        this.toCompose(res.data.records);
      } else {
        this.$message.error(res.message);
      }
    },
    async getPlayDetail() {
      const res = await this.$api.$service.activityTemplate_detailV2({
        key: this.activeKey,
      });

      this.loading = false;

      if (res.code == 200) {
        const {
          banner,
          dataJson,
          description,
          keyBackground,
          ipDescription,
          syntheses,
          bannerAdapter,
        } = res.data;
        this.configObj = res.data;
        if (!(syntheses && syntheses.length > 0)) {
          this.$message.warning("尚未配置玩法");
          return;
        }

        /*      const playInfo = this.groupPage(syntheses, "page"); */
        this.playOptions = syntheses.sort((a, b) => {
          if (a.page && b.page) {
            return Number(a.page) - Number(b.page);
          } else {
            return 0;
          }
        });

        this.templateInfo = {
          banner,
          bannerAdapter,
          description,
          keyBackground,
          ipDescription,
        };
        try {
          this.templateInfo.dataJson = dataJson ? JSON.parse(dataJson) : {};
          console.log(this.templateInfo.dataJson);
        } catch (e) {}
        //         , //内容区背景图
        const themeConfig = {
          themeBgColor: "#2B3358", //模版背景色
          baseFontColor: "#2B3358", //默认字体颜色【材料信息，合成物信息，】

          btnBorderColor: "#2B3358", //边框按钮【边框颜色】（去获得）
          btnBorderFontColor: "#2B3358", //边框字色

          btnBgColor: "#2B3358", //有背景色的按钮【背景色】（去选择）
          btnBgFontColor: "#fff", //【字色】

          btnSelectedBgColor:
            "linear-gradient(270deg, #94AEFF 0%, #F0D5FF 100%)", //特殊背景色按钮【背景色】（已选择）
          btnSelectedFontColor: "rgba(33, 40, 61, 1)", //【字色】

          activeTxtColor: "#fff", //活动须知文字色

          tabColor: "#2B3358", //玩法tab文字色
          iconDirectionColor: "#ecd231", //合成方向icon颜色

          iconCollectionColor: "#D6DEFF", //右侧我的藏品【字色｜icon色】
          collectionBgColor: "#475598", //右侧我的藏品【背景色】

          materialSelectColor: "#2B3358", //选择材料弹窗【边框颜色｜选择icon颜色|手机端已选择背景色】
          materialCloseColor: "#2B3358", //选择材料弹窗关闭icon【icon颜色】
          animateContentBgcolor: "#fff",
          availableNumColor: "red",
          availableColor: "blue",
        };

        if (JSON.stringify(this.templateInfo.dataJson) == "{}") {
          this.templateInfo.dataJson = themeConfig;
          /*        this.templateInfo.dataJson = {
            themeBgColor: "#FFBEC8",
            baseFontColor: "#222222",
            btnBorderColor: "#222222",
            btnBorderFontColor: "#222222",
            btnBgColor: "#EA2C48",
            btnBgFontColor: "#fff",
            btnSelectedBgColor: "#FD5D74",
            btnSelectedFontColor: "#fff",
            activeTxtColor: "#222222",
            tabColor: "#222222",
            iconDirectionColor: "#222222",
            iconCollectionColor: "#222222",
            collectionBgColor: "#fff",
            materialSelectColor: "#222222",
            materialCloseColor: "#222222",
            animateContentBgcolor: "#FFBEC8",
            logIconColor: "#D6DEFF",
            logBgColor: "#475598",
            logTitleBgColor: "#D6DEFF",
            logTitleColor: "#475598",
            logBtnBgColor: "#475598",
            logBtnColor: "#D6DEFF",
            logDetailDestroyBgColor: "#D6DEFF",
            logDetailDestroyColor: "#475598",
            numberBtnBgColor: "#475598",
            numberBtnColor: "#D6DEFF",
            warningTxtColor: "red",
            selectedCheckboxColor:'red',
            numberBtnBorderColor:'red',
            numberBtnFontColor:'red'
          }; */
        }

        /*       this.templateInfo.dataJson.activeTitle = "哈哈哈哈哈";
        this.templateInfo.dataJson.activeTitleColor = "#fff"; */
        writeThemeStyle({
          ...this.templateInfo.dataJson,

          contentBgImg: keyBackground,
          key: this.activeKey,
        });
      } else {
        this.$message.error(res.message);
      }
    },
    groupPage(ary, key) {
      if (
        ary &&
        Object.prototype.toString.call(ary) == "[object Array]" &&
        ary.length > 0
      ) {
        var res = [];
        ary.sort((a, b) => a[key] - b[key]);
        for (var i = 0; i < ary.length; ) {
          var count = 0;
          let list = [];
          for (var j = i; j < ary.length; j++) {
            if (ary[i][key] == ary[j][key]) {
              list.push(ary[j]);
              count++;
            }
          }
          res.push({
            page: ary[i].page,
            count,
            list,
            name: `玩法${ary[i].page ? toChinesNum(ary[i].page) : ""}`,
            key: ary[i].playsKey,
          });

          i += count;
        }
        if (res.length == 1) {
          res[0].name = "合成玩法";
        }
        return res;
      }
      return [];
    },
    compose(userMaterialList) {
      this.updateThresholdUserSelected(userMaterialList);
      //来自选择框商品（非馆）
      this.$refs.refDhSelectMaterial.hide();
      return;
    },
    async toCompose(materia_arr) {
      //直接合成
      //合成物所需材料，合成物id
      let arr4 = []; //特殊合成材料需要弹窗提示
      const treasureSkuIdList = materia_arr.map((item) => {
        if (item.commodity.typeCommodity == 4) {
          arr4.push(item);
        }
        console.log(item);
        return item.id;
      });

      const synthesisId = this.threshold.id;
      this.createCompose(treasureSkuIdList, synthesisId, arr4);
      /*     if (arr4.length > 0) {
        this.$refs.ComposeTipRef.show(() => {
          this.createCompose(treasureSkuIdList, synthesisId);
        }, arr4);
      } else {
        this.createCompose(treasureSkuIdList, synthesisId);
      } */
    },
    composeTipF(cb, list) {
      this.$refs.ComposeTipRef.show(cb, list);
    },
    async createCompose(
      treasureSkuIdList,
      synthesisId,
      arr4,
      probabilityGoodsArr
    ) {
      if (this.userInfo.statusVerified != 1) {
        this.$refs.nameVerified.init();
        return;
      } else if (this.userInfo.statusBankVerified != 1) {
        this.$refs.bankSubmit.init();
        return;
      }
      const fc = () => {
        const composeFun = async () => {
          const start_time = new Date();
          this.$refs.refDhLoading.show();
          const res = await this.$api.$service.treasureSku_synthesisV3({
            treasureSkuIdList,
            synthesisId,
          });
          this.$refs.refDhSelectMaterial.hide();

          if (res.code == 200) {
            if (res.data.result == 1) {
              const now_time = new Date();
              const between_time = now_time.getTime() - start_time.getTime();
              const delay = 1.6 * 1000; //s
              const fRes = () => {
                this.createCommodity = res.data;
                this.$refs.refDhLoading.hide();
                this.$refs.refDhCompound.show();
                this.getPlayDetail();
              };
              fRes();
            } else {
              this.getPlayDetail();
              this.$refs.refDhLoading.hide();
              this.$confirm(res.data.failMessage, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                // type: "warning",
              }).then(() => {});
            }
          } else {
            this.$refs.refDhLoading.hide();
            this.$message.error(res.message);
          }
        };
        if (probabilityGoodsArr) {
          this.$confirm(
            `<div style="word-break:break-all">您已选择${probabilityGoodsArr[0]},进化成功率为${probabilityGoodsArr[1]}%。</div>
          <div style="color:#D0021B">进化失败会返回对应的元计划素材，以太灵珠和电磁胶囊会对应消耗。</div><div>请确认是否进化？</div>`,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              dangerouslyUseHTMLString: true,
              // type: "warning",
            }
          ).then(() => {
            composeFun();
          });
        } else {
          this.$confirm(`确定合成？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            // type: "warning",
          }).then(() => {
            composeFun();
          });
        }
      };
      if (arr4.length > 0) {
        this.$refs.ComposeTipRef.show(() => {
          fc();
        }, arr4);
      } else {
        fc();
      }
    },

    async onChangePlay(info, idx) {
      this.currentPlay = idx;
      if (this.playSwiper) {
        this.playSwiper.slideTo(idx, 200, false);
      } else {
        this.$message.warning("swiper 尚未初始化");
      }
    },
    createNoticeSwiper() {
      new Swiper(".j-notice-swiper", {
        loop: true, // 循环模式选项
        speed: 300,
        autoplay: 5000,
        height: 42,
        direction: "vertical",
        autoplayDisableOnInteraction: false,
        waitForTransition: false,
      });
    },
    createPlaySwiper() {
      const self = this;
      this.playSwiper = new Swiper(".j-page-swiper", {
        autoHeight: true,
        threshold: 50,
        onSlideChangeStart: function (swiper) {
          self.currentPlay = swiper.activeIndex;
        },
      });
      this.playSwiper.slideTo(this.currentPlay, 0, false);
    },
    closeLoadingPop() {
      this.$refs.refDhLoading.hide();
    },
    showLoadingPop() {
      this.$refs.refDhLoading.show();
    },
    closeCompoundPop() {
      this.$refs.refDhCompound.hide();
    },
    showCompoundPop() {
      this.$refs.refDhCompound.show();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/1.0/scss/active/synthetic-system.scss";
.m-active-title {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
  @media screen and (max-width: 540px) {
    margin-bottom: 0;
    font-size: 0.32rem;
  }
}
.rule-block {
  margin-top: 50px;
  border-radius: 10px;
}
.m-active-notice {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: contain;
  margin-bottom: 42px;
  margin-top: -20px;
  position: relative;
  z-index: 1;
  height: 42px;
  background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/compose/notice-bg.png");
  display: none;
  .ui-icon {
    margin-right: 16px;
    width: 22px;
    height: 22px;
  }
  .icon-notice {
    background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/compose/icon-laba.png");
  }
  .sign {
    color: #e61f1a;
  }
  @media screen and (max-width: 540px) {
    margin-bottom: 0.42rem;
    margin-top: -0.26rem;
    height: 0.58rem;
    background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/compose/notice-bg-m.png");
  }
}
.available-msg {
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  color: #333333;
  @media screen and (max-width: 540px) {
    font-size: 0.24rem;
  }
}
.loading-wrap {
  padding-top: 20vh;
}
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
.block-des {
  max-width: 950px;
  margin: 0 auto;
  @media screen and (max-width: 540px) {
    margin: 0 auto 0.32rem;
  }
}

.ui-body {
  padding-bottom: 50px;
  @media screen and (max-width: 540px) {
  }
}
.m-title {
  text-align: center;
  font-size: 16px;
  padding: 30px 0 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  .txt {
    padding: 0 15px;
  }
  span {
    display: inline-block;
  }
}
.m-content {
  width: 100%;
  padding-bottom: 108px;
  border-radius: 10px;
  .swiper-slide {
    padding: 0 80px;
  }
  @media screen and (max-width: 540px) {
    .swiper-slide {
      padding: 0 0.29rem;
    }
  }
}
.m-banner {
  position: relative;
  top: 0;
  left: 0;
  margin-bottom: 42px;
  .banner {
    min-height: 350px;
    background-position: center;
    background-size: auto 100%;
    background-repeat: no-repeat;
  }
  .banner-phone {
    display: none;
  }
  @media screen and (max-width: 540px) {
    margin: 0 0 0.42rem;
    .banner {
      display: none;
    }
    .banner-phone {
      display: block;
      width: 100%;
    }
  }
}

.m-tab-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 60px auto -1px;
  user-select: none;
  .tab {
    overflow: hidden;
    flex: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px 0;
    border-radius: 10px;
    border: 1px solid rgba(151, 151, 151, 0.3);
    background: rgba(255, 255, 255, 1);
    opacity: 0.7;
    .tab-icon {
      margin-right: 10px;
      transition: all ease-out 0.16s;
      font-size: 22px;
    }
    .txt {
      text-align: center;
      font-size: 24px;
    }
  }
  .selected {
    background: rgba(255, 255, 255, 1);
    border-color: #fff;
    opacity: 1;
  }
  @media screen and (max-width: 540px) {
    margin-bottom: 0.2rem;
    margin-top: 0.4rem;
    .tab {
      padding: 0.18rem 0;
      border-radius: 0.1rem;
      .icon {
        width: 0.21rem;
        height: 0.24rem;
        margin-right: 0.03rem;
      }
      .txt {
        text-align: center;
        font-size: 0.24rem;
      }
    }
  }
}

.ui-activity-instructions {
  font-size: 12px;
  font-weight: normal;
  line-height: 2.4;
  padding: 0 40px 50px;
  @media screen and (max-width: 540px) {
    padding: 0 0.3rem 0.4rem;
  }
}
.m-collection {
  width: 100px;
  height: 100px;
  overflow: hidden;

  border-radius: 6px 0px 0px 6px;
  position: fixed;
  top: 6rem;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  z-index: 99;
  user-select: none;
  .icon-collection {
    margin-bottom: 8px;
    font-size: 30px;
  }
}
.m-logs {
  top: 4.5rem;
}
@media screen and (max-width: 540px) {
  .m-collection {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 0.12rem 0 0 0.12rem;
    top: 46vh;
    font-size: 0.2rem;
    .icon-collection {
      font-size: 0.4rem;
      margin-bottom: 0.08rem;
    }
  }
  .m-logs {
    top: 32vh;
  }
}
</style>
