<template>
  <div>
    <div class="m-tab-wrap">
      <div
        class="tab synthesis-tab-color"
         v-for="(item,idx) in playList"
         :key="idx"
        :class="{ selected: playInfo.key == item.key }"
        @click="onChangePlay(idx)"
      >
        <div class="tab-icon iconfont icon-icon_wanfahezi"></div>
        <div class="txt">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props:{
      playList:{
          type:Array,
          default:()=>{
              return []
          }
      },
    playInfo:{
        type:Object,
        default:()=>{
            return {}
        }
    }
  },
  async created() {},
  methods: {
    onChangePlay(idx) {
        this.$parent.$parent.changeTab(idx);
    },
    hide() {},
    confirm() {},
  },
};
</script>

<style lang="scss" scoped>
.m-tab-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 auto 0;
  user-select: none;
  background-color: #FFEBC6;
  border-radius: 10px 10px 0 0;
  .tab {
    flex: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px 0;
    border-radius: 10px;
/*     border: 1px solid rgba(151, 151, 151, 0.3); */
    background: rgba(255, 255, 255, 0.3);
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
  }
  @media screen and (max-width: 540px) {
    margin-bottom: 0.2rem;
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
</style>