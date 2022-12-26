<template>
  <div class="notice-body">
    <div
      class="m-block"
      v-for="(item, idx) in list"
      :key="idx"
      @click="go(item)"
    >
      <div class="cover">
        <div
          class="img bg-img"
          :key="idx"
          v-lazy:background-image="item.cover"
        ></div>
      </div>
      <div class="info">
        <div class="title">
          <div class="hidden-one">{{ item.name }}</div>
        </div>
        <span class="sign" />
        <div class="wrap-des">
          <div class="des hidden-2">{{ item.summarize }}</div>
        </div>

        <div class="time">
          <span>{{ item.releaseTime }}</span>
          <span class="ui-icon icon-right"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
	categoryName: {
	  type: String,
	  default: () => {
	    return "";
	  },
	},
  },
  created() {
    this.init();
  },
  computed: {},
  methods: {
    init() {},
    go(item) {
		this.$sensors.track('hotspot_click', {
			module_name: this.categoryName,
			button_name: item.name,	
		});
      window.open(`/news/${item.uuid}`);
    },
  },
};
</script>
<style lang="scss" scoped>
.m-block {
  display: flex;
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  .cover {
    .img {
      width: 300px;
      height: 160px;
      border-radius: 4px;
    }
  }
  .info {
    flex: 1;
    overflow: hidden;
    padding-left: 30px;
    .title {
      padding-top: 10px;
      font-size: 14px;
      color: #333333;
    }
    .sign {
      display: block;
      width: 20px;
      height: 2px;
      background: #e61f1a;
      margin-top: 8px;
      margin-bottom: 20px;
    }
    .wrap-des {
      height: 60px;
    }
    .des {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.4);
      line-height: 20px;
    }
    .time {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.4);

      display: flex;
      align-items: center;
      justify-content: space-between;
      .icon-right {
        width: 20px;
        height: 20px;
        background-image: url("//static.theone.art/pc/hotspot/icon-notice-right-default.png");
      }
    }
  }
  &:hover {
    .time {
      .icon-right {
        background-image: url("//static.theone.art/pc/hotspot/icon-notice-right.png");
      }
    }
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .m-block {
    display: block;
    border-bottom: none;

    cursor: pointer;
    .cover {
      margin-bottom: 0.2rem;
      .img {
        width: 100%;
        height: 2.8rem;
        border-radius: 0.04rem;
      }
    }
    .info {
      overflow: hidden;
      width: inherit;
      flex: 1;
      padding: 0;
      .wrap-des {
        height: inherit;
      }
      .title {
        padding-top: 0.2rem;
        font-size: 0.3rem;
        color: #333333;
        margin-bottom: 0.1rem;
        .sign {
          display: none;
        }
      }
      .des {
        font-size: 0.24rem;
        color: rgba(0, 0, 0, 0.4);
        margin-top: 0.1rem;
      }
      .time {
        font-size: 0.24rem;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
        margin-top: 0.2rem;
        .icon-right {
          display: none;
        }
      }
    }
  }
}
</style>
