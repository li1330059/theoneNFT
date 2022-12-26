<template>
  <div class="page-message-list">
    <div class="v1-main message-list">
      <div class="title">
        <div class="collect">
          <h1>1未读</h1>
          <div class="v1-btn-link blue">全部标记已读</div>
        </div>
        <div class="v1-btn-link" @click="onDeleteAll()">全部删除</div>
      </div>
      <div class="line" v-for="(item, index) in 10" :key="index">
        <div class="msg">
          <div class="avatar">
            <img src="" />
          </div>
          <div class="msg-info">
            <h1>唯一艺术官方<span>2020/9/28 上午9:42:28</span></h1>
            <p>杭州2021亚洲最值得一看的设计艺术展创新展</p>
          </div>
        </div>
        <div class="v1-btn-link blue mode-PC" @click="onDelete(item)">删除</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    onDelete() {
      this.$confirm(`确认删除此信件？`, "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {})
        .catch(() => {});
    },
    onDeleteAll() {
      this.$confirm(`您还有未读信息，是否确定全部删除？`, "全部删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {})
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.page-message-list {
  background: url("//static.theone.art/pc/images/pic-home/message-bg.png") no-repeat center center;
  background-size: cover;
  padding: 60px 0px;
  min-height: 500px;
  .message-list {
    background: #ffffff;
    box-shadow: 0px 2px 16px 0px rgba(180, 180, 180, 0.14);
    border-radius: 4px;
    .title {
      height: 58px;
      line-height: 58px;
      display: flex;
      justify-content: space-between;
      padding: 0 32px;
      font-size: 12px;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
      .collect {
        display: flex;
        h1 {
          font-size: 12px;
          margin-right: 16px;
        }
      }
    }
    .line {
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      padding: 19px 32px;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
      &:hover {
        background: #f5f5f5;
      }
      .msg {
        display: flex;
        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 100%;
          margin-right: 23px;
          // border:1px solid #000000;
        }
        .msg-info {
          font-size: 12px;
          color: rgba($color: #000000, $alpha: 0.4);
          h1 {
            font-size: 14px;
            margin-bottom: 5px;
            color: #000000;
            display: flex;
            span {
              margin-left: 16px;
              font-size: 12px;
              color: rgba($color: #000000, $alpha: 0.4);
              line-height: 19px;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 541px) {
  .page-message-list {
    padding: 0px;
    .v1-main {
      margin: 0px;
    }
    .message-list {
      .title {
        height: 0.96rem;
        line-height: 0.96rem;
        font-size: 0.24rem;
        padding: 0 0.32rem;
        .collect {
          h1 {
            font-size: 0.24rem;
            margin-right: 0.32rem;
          }
        }
      }
      .line {
        padding: 0.32rem;
        flex-direction: column;
        .msg {
          .avatar {
            width: 0.84rem;
            height: 0.84rem;
            margin-right: 0.2rem;
          }
          .msg-info {
            font-size: 0.24rem;
            flex: 1;
            h1 {
              font-size: 0.28rem;
              justify-content: space-between;

              span {
                font-size: 0.2rem;
              }
            }
            p {
              flex: 1;
            }
          }
        }
      }
    }
  }
}
</style>
