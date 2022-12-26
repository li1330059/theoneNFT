<template>
  <div class="page-question-list">
    <div class="banner">
      <div class="v1-main">
        <h1>平台规则和常见问题</h1>
        <h2>获取更多实用信息，帮助更好的了解平台</h2>
      </div>
    </div>
    <div class="loading" v-if="loading">
      <loading></loading>
    </div>
    <empty v-else-if="showEmpty"></empty>
    <div v-else>
      <div class="v1-main question-list">
        <div
          :class="{ line: true, show: item.active }"
          v-for="(item, index) in questionListResult.records"
          :key="index"
        >
          <div class="title" @click="onShow(item)">
            <h1>{{ item.queation }}</h1>
          </div>
          <div class="content" v-html="item.solution"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
export default {
  components: { empty, loading },
  data() {
    return {
      loading: true,
      questionListParam: {
        pageCount: 1,
        pageSize: 20,
      },
      questionListResult: null,
    };
  },
  created() {
    this.getQuestionList();
  },
  methods: {
    onShow(item) {
      item.active = !item.active;
      this.$forceUpdate();
    },
    async getQuestionList() {
      try {
        this.loading = true;
        let result = await this.$api.service.question_list(
          this.questionListParam
        );
        this.questionListResult = result.data.data;
        this.showEmpty = !this.questionListResult.records.length > 0;
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.page-question-list {
  padding-bottom: 60px;
  min-height:70vh;
  .loading {
    height: 500px;
  }
  .banner {
    background: #eaeaea;
    margin-bottom: 32px;
    .v1-main {
      background: url("//static.theone.art/pc/images/pic-home/help.png")
        no-repeat right center;
      background-size: 337px 162px;
      height: 200px;
    }
    h1 {
      padding-top: 69px;
      font-size: 20px;
      font-weight: bold;
      line-height: 26px;
      margin-bottom: 16px;
    }
    h2 {
      font-size: 14px;
      color: #000000;
      line-height: 20px;
    }
  }
  .question-list {
    box-shadow: 0px 2px 16px 0px rgba(180, 180, 180, 0.14);
    border-radius: 4px;
    .line {
      &.show {
        .title {
          h1 {
            background-image: url("//static.theone.art/pc/images/up.png");
          }
        }
        .content {
          display: block;
        }
      }
      .title {
        padding: 25px 32px;
        border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
        cursor: pointer;
        h1 {
          line-height: 20px;
          font-size: 14px;
          background: url("//static.theone.art/pc/images/pic-home/down.png")
            no-repeat right center;
          background-size: 14px 14px;
        }
      }
      .content {
        display: none;
        background: #f5f5f5;
        padding: 25px 32px;
        line-height: 24px;
        color: rgba($color: #000000, $alpha: 0.4);
        border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 541px) {
  .page-question-list {
    .banner {
      margin-bottom: 0;
      .v1-main {
        background-position: right bottom;
        background-size: 3.82rem 2rem;
        height: 2.8rem;
      }
      h1 {
        padding-top: 0.64rem;
        font-size: 0.32rem;
        line-height: 0.44rem;
        margin-bottom: 0.12rem;
      }
      h2 {
        font-size: 0.24rem;
      }
    }
    .question-list {
      .line {
        .title {
          padding: 0.3rem 0.32rem;
          h1 {
            line-height: 0.4rem;
            font-size: 0.28rem;
            background-size: 0.28rem 0.28rem;
          }
        }
        .content {
          font-size: 0.24rem;
          padding: 0.32rem;
          line-height: 0.44rem;
        }
      }
    }
    .question-list {
      margin: 0;
    }
  }
}
</style>
