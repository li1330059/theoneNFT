<template>
  <div class="art-box-wrap hand" @click="go">
    <div class="ticket-total">{{ goodsObj.serialNum }}</div>
    <div
      class="cover bg-img"
      :style="`background-image:url(${goodsObj.previewImg})`"
    ></div>
    <div class="name hidden-1">{{ goodsObj.name }}</div>
    <div class="block">
      <div class="info-wrap">
        <div class="art-user">
          <span class="ui-icon icon-author"></span>
          <div class="hidden-1">{{ goodsObj.authorName }}</div>
        </div>
        <div class="ticket">
          <span class="num">{{ voteNum }}</span>
          票
        </div>
      </div>

      <div class="ui-icon status icon-voted hand" v-if="goodsObj.isVote"></div>
      <div
        class="ui-icon status icon-vote hand"
        @click.stop="onVote(goodsObj)"
        v-else
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    goodsObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  created() {},
  mounted() {},
  computed: {
    voteNum() {
      return this.$common.formatNum(this.goodsObj.voteNum);
    },
  },
  methods: {
    onVote(obj) {
      this.$emit("listenVote", obj);
    },
    go() {
      this.$emit("listenGo", this.goodsObj);
    },
  },
};
</script>
<style lang="scss" scoped>
.art-box-wrap {
  background: #b7cceb;
  /*   */
  border-radius: 10px;
  position: relative;
  top: 0;
  left: 0;
  padding: 12px;
  transition: all ease-out 0.16s;
  &:hover {
    box-shadow: 0px 2px 26px 0px #5080cb;
  }
  .ticket-total {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 16px;
    min-width: 46px;
    /*     font-weight: bold; */
    color: #333333;
    padding: 8px 14px;
    border-radius: 10px;
    text-align: center;
    background: #b7cceb;
  }
  .cover {
    padding-bottom: 100%;
    border-radius: 10px;
    background-position: center;
  }
  .name {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    line-height: 21px;
    margin-top: 12px;
  }
  @media screen and (max-width: 540px) {
    border-radius: 0.1rem;
    .cover {
      border-radius: 0.1rem;
    }
    .name {
      font-size: 0.28rem;
      line-height: initial;
      margin-top: 0.12rem;
    }
    .ticket-total {
      border-radius: 0.1rem;
    }
  }
}
.block {
  display: flex;
  align-items: flex-end;
  margin-top: 13px;

  .info-wrap {
    flex: 1;
    overflow: hidden;
    .art-user {
      flex: 1;
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      color: #575b62;
      overflow: hidden;
      .icon-author {
        margin-right: 8px;
      }
    }
    .ticket {
      font-size: 12px;
      color: #575b63;
      margin-top: 12px;

      .num {
        font-size: 16px;
        font-weight: bold;
        color: #f4682b;
      }
    }
  }
  .status {
    width: 54px;
    height: 54px;
  }
  @media screen and (max-width: 540px) {
    margin-top: 0.05rem;
    .info-wrap {
      flex: 1;
      overflow: hidden;
      .art-user {
        font-size: 0.24rem;
        .icon-author {
          margin-right: 0.08rem;
        }
      }
      .ticket {
        font-size: 0.24rem;
        color: #575b63;
        margin-top: 0.05rem;

        .num {
          font-size: 0.28rem;
          font-weight: bold;
          color: #f4682b;
        }
      }
    }
    .icon-vote {
      width: 0.82rem;
      height: 0.82rem;
    }
  }
}
.icon-author {
  background-image: url("//static.theone.art/pc/icons/icon-author.png");
}
.icon-voted {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/icon-voted.png");
}
.icon-vote {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/icon-vote.png");
}
</style>
