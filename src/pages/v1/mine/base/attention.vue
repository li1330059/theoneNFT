<template>
  <div>
    <div class="mode-mobile">
      <m-header :title="title" />
    </div>
    <div class="page-mine-attention">
      <div class="loading" v-if="loading">
        <loading></loading>
      </div>
      <empty v-else-if="showEmpty"></empty>
      <div class="page-center" v-else>
        <div class="people-list">
          <div
            class="v1-people-card"
            v-for="(item, index) in attentionListResult.records"
            :key="index"
          >
            <!-- <div :class="`avatar bg${Math.floor(Math.random() * 10) + 1}`"> -->
            <div :class="['avatar', item.isFirend == 1 ? 'avatar-firend' : '']">
              <div
                class="avatar-bg"
                :style="{
                  background:
                    'url(' +
                    (item.userInfo
                      ? item.userInfo.photo || '/static/img/avatars.svg'
                      : item.artistInfo
                      ? item.artistInfo.photo || '/static/img/avatars.svg'
                      : '/static/img/avatars.svg') +
                    ') no-repeat center',
                }"
              ></div>
              <div class="img">
                <img
                  :src="
                    item.userInfo
                      ? item.userInfo.photo || '/static/img/avatars.svg'
                      : item.artistInfo
                      ? item.artistInfo.photo || '/static/img/avatars.svg'
                      : '/static/img/avatars.svg'
                  "
                  alt
                />
                <i v-if="item.userType == 2" class="artist-icon"></i>
              </div>
            </div>

            <h1 v-if="item.userType == 1">
              <span>
                {{
                  item.userInfo
                    ? item.userInfo.nickname || item.userInfo.stageName
                    : "-"
                }}
              </span>
            </h1>
            <h1 class="hidden" v-if="item.userType == 2">
              <span>
                {{
                  item.artistInfo
                    ? item.artistInfo.nickname || item.artistInfo.stageName
                    : "-"
                }}
              </span>
            </h1>
            <h2>
              {{
                item.userInfo
                  ? $dayjs(item.userInfo.createTime).format("YYYY年MM月")
                  : item.artistInfo
                  ? $dayjs(item.artistInfo.createTime).format("YYYY年MM月")
                  : ""
              }}
            </h2>
            <div class="amount-wrap">
              <div>
                <h1>
                  {{ $common.formatFansNumber(item.statistics.passiveNum) }}
                </h1>
                <h2>粉丝</h2>
              </div>
              <div>
                <h1>
                  {{ $common.formatFansNumber(item.statistics.initiativeNum) }}
                </h1>
                <h2>关注</h2>
              </div>
            </div>
            <div
              :class="['btn-gz', getType(item) ? 'active' : '']"
              @click="cancel(item, getType(item), index)"
            >
              {{ getType(item) ? "取消关注" : "关注" }}
            </div>
          </div>
        </div>
        <div class="v1-pagination">
          <g-paging
            :pageChange="handleCurrentChange"
            :list="attentionListResult.records"
            :pageSize="attentionListParam.pageSize"
            :current-page="attentionListResult.current"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
import mHeader from "@/components/v1/layout/mobileHeader";
export default {
  components: { empty, loading, mHeader },
  data() {
    return {
      loading: true,
      showEmpty: false,
      attentionListParam: {
        pageCount: 1,
        pageSize: 12,
        type: this.$route.params.type,
      },
      attentionListResult: null,
      title: null,
    };
  },
  computed: {
    getType() {
      return function (item) {
        return this.attentionListParam.type == 1 ||
          (this.attentionListParam.type == 2 && item.isFirend == 1)
          ? true
          : false;
      };
    },
  },
  watch: {
    $route(to, from) {
      this.attentionListParam.type = this.$route.params.type;
      this.attentionListParam.pageCount = 1;
      this.attentionList();
    },
  },
  created() {
    if (this.attentionListParam.type == 1) {
      this.title = "我的关注";
    } else if (this.attentionListParam.type == 2) {
      this.title = "我的粉丝";
    }
    this.attentionList();
  },
  methods: {
    async attentionList() {
      this.loading = true;
      let result = await this.$api.service.userfriend_list(
        this.attentionListParam
      );
      this.loading = false;
      this.attentionListResult = result.data.data;
      this.showEmpty = !this.attentionListResult.records.length > 0;
    },
    handleCurrentChange(val) {
      this.attentionListParam.pageCount = val;
      this.attentionList();
    },
    async cancel(item, isFlag, index) {
      let result = null;
      if (!isFlag) {
        result = await this.$api.service.userfriend_operation({
          type: 1,
          userUuid: item.userUuid,
        });
        if (result.data.code == 200) {
          this.$message.success("关注成功");
          this.attentionList();
        }
      } else {
        result = await this.$api.service.userfriend_operation({
          type: 2,
          userUuid: item.userUuid,
        });
        if (result.data.code == 200) {
          this.$message.success("取消关注成功");
          this.attentionList();
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.btn-gz {
  text-align: center;
  display: flex;
  justify-content: center;
  width: 80%;
  height: 30px;
  background: linear-gradient(to right, #ff7a64, #e61f1a);
  border-radius: 15px;
  line-height: 30px;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
  position: relative;
  margin: 5px auto 15px;
  &.active {
    color: #666;
    background: #eee;
  }
}

.artist-icon {
  position: absolute;
  background: url("//static.theone.art/pc/images/yishujia%402x.png")
    no-repeat;
  width: 30px;
  height: 30px;
  background-size: 100% 100%;
  z-index: 999;
  right: 0;
  bottom: 0;
}
.avatar-bg {
  width: 100%;
  height: 87px;
  opacity: 0.3;
  filter: blur(8px);
  -webkit-mask: linear-gradient(rgb(255, 255, 255), transparent);
  overflow: hidden;
}
.avatar {
  img {
    object-fit: cover;
  }
  &-firend {
    position: relative;
    &:before {
      display: inline-block;
      content: "";
      width: 18px;
      height: 18px;
      background: url("//static.theone.art/pc/images/pic-home/haoyou%402x.png")
        no-repeat;
      background-size: 100% auto;
      position: absolute;
      right: 8px;
      top: 8px;
    }
  }
}
@media screen and (min-width: 541px) {
  .page-mine-attention {
    .loading {
      height: 500px;
    }
    .people-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .v1-people-card {
        margin: 0 12px 25px;
      }
    }
  }
}

@media screen and (min-width: 0px) and (max-width: 540px) {
  .page-mine-attention {
    background: #fafafa;
    padding-top: 1.42rem;
    .loading {
      height: 8rem;
    }

    .people-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .v1-people-card {
        width: 3.24rem;
        height: 4.72rem;
        margin-bottom: 0.34rem;
        &:nth-child(odd) {
          margin-left: 0.34rem;
        }
        &:nth-child(even) {
          margin-right: 0.34rem;
        }
      }
    }
  }
  .page-center {
    padding-bottom: 1rem;
  }
  .artist-icon {
    right: -7px;
    bottom: -7px;
  }
}
</style>
