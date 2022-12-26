<template>
  <div class="news-body">
    <div class="news-list-wrap">
      <div
        class="m-news"
        v-for="item in list"
        :key="item.uuid"
        @click="go(item)"
      >
        <div class="news-block">
          <div class="cover">
            <div class="img bg-img" v-lazy:background-image="item.cover"></div>
          </div>
          <div class="info">
            <div>
              <div class="title hidden-2">
                {{ item.name }}
              </div>
              <div class="place">
                <div class="des hidden-2">{{ item.summarize }}</div>
              </div>

              <div class="time">{{ item.releaseTime }}</div>
            </div>
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
.news-body {
}
.news-list-wrap {
  display: flex;
  flex-wrap: wrap;
}
.m-news {
  width: 50%;
  padding: 12px;
  .news-block {
    padding: 16px;
    display: flex;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #f5f5f5;
    cursor: pointer;
    transition: all ease-out 0.26s;
    &:hover {
      box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.1);
    }
  }

  .cover {
    position: relative;
    top: 0;
    left: 0;
    .img {
      width: 200px;
      height: 100%;
      border-radius: 4px;
    }
  }
  .info {
    padding-left: 16px;
    overflow: hidden;
    flex: 1;
    .title {
      font-size: 14px;
      color: #000000;
      line-height: 22px;
      letter-spacing: 1px;
      height:46px;
  
    }
    .des {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.4);
      line-height: 22px;
    }
    .place {
      height: 80px;
    }
    .time {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.4);
      text-align: right;
    }
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .news-body {
    margin: 0 -0.12rem;
  }
  .m-news {
    width: 100%;
    padding: 0.12rem;
    .news-block {
      padding: 0.16rem;
      display: flex;
      background: #ffffff;
      border-radius: 4px;
      cursor: pointer;
      transition: all ease-out 0.26s;
      &:hover {
        box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.1);
      }
    }

    .cover {
      position: relative;
      top: 0;
      left: 0;
      .img {
        width: 2.2rem;
        height: 100%;
      }
    }
    .info {
      padding-left: 16px;
      flex: 1;
      .title {
        font-size: 0.3rem;
        color: #333;
        line-height: 22px;
        letter-spacing: 1px;
        height:inherit;
        margin-bottom:.12rem;
      }
      .des {
        font-size: 0.24rem;
        color: rgba(0, 0, 0, 0.4);
        line-height: 22px;
      }
      .place {
        height: 1rem;
      }
      .time {
        font-size: 0.24rem;
        color: rgba(0, 0, 0, 0.4);
        text-align: left;
      }
    }
  }
}
</style>
