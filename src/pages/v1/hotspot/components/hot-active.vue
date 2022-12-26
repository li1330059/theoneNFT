<template>
  <div class="active-body">
    <div
      class="m-block"
      v-for="(item, idx) in list"
      :key="item.uuid"
      @click="go(item)"
    >
      <div class="block">
        <div class="cover">
          <div
            class="img bg-img"
            v-lazy:background-image="item.cover"
            :key="idx"
          ></div>
        </div>
        <div class="info">
          <div class="title hidden-2">{{ item.name }}</div>
          <div class="des hidden-2">{{ item.summarize }}</div>
          <div class="time">{{ item.releaseTime }}</div>
          <div class="ui-btn-group ui-btn-center">
            <div class="ui-btn ui-btn-red">查看详情</div>
          </div>
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
  created() {
    this.init();
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
.active-body {
  display: flex;
  flex-wrap: wrap;
}
.m-block {
  width: 25%;
  padding: 10px;
  .block {
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: all ease-out 0.26s;

    .info {
      padding: 0 8px 10px;
      overflow: hidden;
    }
    .cover {
      border-radius: 4px 4px 0 0;
      position: relative;
      top: 0;
      left: 0;
      .img {
        width: 100%;
        padding-bottom: 60%;
      }
    }
    .title {
      margin-top: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      margin-bottom: 10px;
    }
    .des {
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
      margin-bottom: 10px;
    }
    .time {
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
    }
    .ui-btn-group {
      height: 50px;
      .ui-btn {
        opacity:0;
        transition: all ease-out .16s;
      }
      padding-top: 10px;
    }
    &:hover {
      box-shadow: 0px 1px 15px 0px rgba(0, 0, 0, 0.05);
      .ui-btn-group {
        .ui-btn {
          opacity:1;
        }
      }
    }
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .active-body {
    margin: 0 -0.1rem;
  }
  .m-block {
    width: 50%;
    padding: 0.1rem;
    .block {
      overflow: hidden;
      cursor: pointer;
      .info {
      }
      .cover {
        border-radius: 4px 4px 0 0;
        position: relative;
        top: 0;
        left: 0;
        .img {
          width: 100%;
          padding-bottom: 60%;
        }
      }
      .title {
        margin-top: 20px;
        font-size: 0.3rem;
        font-weight: 400;
        color: #333333;
        margin-bottom: 10px;
      }
      .des {
        font-size: 0.24rem;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
        margin-bottom: 10px;
      }
      .time {
        font-size: 0.24rem;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
      }
      .ui-btn-group {
        height: 50px;
        .ui-btn {
          display: none;
        }
        padding-top: 16px;
      }
      &:hover {
        box-shadow: 0px 1px 15px 0px rgba(0, 0, 0, 0.05);
        .ui-btn-group {
          .ui-btn {
            display: block;
          }
        }
      }
    }
  }
}
</style>
