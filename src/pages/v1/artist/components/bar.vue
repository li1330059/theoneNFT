<template>
  <div class="page-artist-bar" v-if="artist">
    <div
      class="bar-wrap"
      v-if="
        !authorInstitution ||
        (authorInstitution.viewHomepage == 1 && !isFoucsInstitution) ||
        authorInstitution.viewHomepage == 2
      "
    >
      <div class="info">
        <div class="name">
          <div class="avatar">
            <img
              :src="artist.cover ? artist.cover : '/static/img/avatars.svg'"
              alt
            />
          </div>
          <div class="ui-user-info">
            <h1 class="hidden-one">{{ artist.nickname }}</h1>
            <!--    <p class="hidden-one">{{ artist.name }}</p> -->
          </div>
        </div>
        <div
          v-if="!hideFollow"
          :class="[isFoucs ? 'v1-btn-followed' : 'v1-btn-attention']"
          @click.stop="focusArtist"
        >
          {{ isFoucs ? "已关注" : "关注" }}
        </div>
      </div>

      <div class="introduce">
        <p v-if="artist.description">
          {{ artist.description }}
        </p>
        <p class="center" v-else>
          这个艺术家什么也没有介绍，快去他的个人主页看看吧～
        </p>
        <div
          class="v1-btn-link blue pointer"
          @click="goUser(artist.id)"
        >
          查看主页
        </div>
      </div>
    </div>

    <div class="bar-wrap" v-else>
      <div class="info">
        <div class="name">
          <div class="avatar">
            <img
              :src="
                authorInstitution.cover || authorInstitution.avatar
                  ? authorInstitution.cover || authorInstitution.avatar
                  : '/static/img/avatars.svg'
              "
              alt
            />
          </div>
          <div class="ui-user-info">
            <h1 class="hidden-one">{{ authorInstitution.name }}</h1>
          </div>
        </div>
        <div
          v-if="!hideFollow"
          :class="[isFoucsInstitution ? 'v1-btn-followed' : 'v1-btn-attention']"
          @click.stop="focusArtist"
        >
          {{ isFoucsInstitution ? "已关注" : "关注" }}
        </div>
      </div>

      <div class="introduce">
        <p v-if="authorInstitution.description">
          {{ authorInstitution.description }}
        </p>
        <p class="center" v-else>
          这个艺术家什么也没有介绍，快去他的个人主页看看吧～
        </p>
        <div
          class="v1-btn-link blue pointer"
		  @click="goUser(authorInstitution.id)"
        >
          查看主页
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    artist: Object,
    authorInstitution: Object,
    hideFollow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isFoucs: null, //是否关注
      isFoucsInstitution: false, //机构是否关注
    };
  },
  watch: {
    artist: function () {
      if (localStorage.getItem("THEONE_MEMBER")) {
        this.getFoucsByuuid();
      }
    },
    authorInstitution: function () {
      if (localStorage.getItem("THEONE_MEMBER")) {
        this.getFoucsByuuid();
      }
    },
  },
  created() {},
  methods: {
    //是否关注艺术家
    async getFoucsByuuid() {
      let userUuid;
      let ifInstitution = false;
      if (!this.authorInstitution || this.authorInstitution.viewHomepage == 2) {
        //没机构或者机构不开放，取艺术家id
        userUuid = this.artist.id;
      } else {
        if (this.authorInstitution.viewHomepage == 0) {
          //机构开放，取机构id
          userUuid = this.authorInstitution.id;
          ifInstitution = true;
        }
        if (this.authorInstitution.viewHomepage == 1) {
          //机构仅关注可见，请求一次看看关注没
          let result = await this.$api.service.userFriend_result({
            userUuid: this.authorInstitution.id,
          });
          if (result && result.data.data) {
            console.dir(result);
            if (result.data.data.isFocus != 1) {
              //请求了发现没关注，取艺术家id
              userUuid = this.artist.id;
            } else {
              //关注了机构，直接拿状态，就不二次请求了
              this.isFoucsInstitution =
                result.data.data.isFocus == 1 ? true : false;
              console.dir(this.isFoucsInstitution);
              return;
            }
          }
        }
      }
      let result = await this.$api.service.userFriend_result({
        userUuid: userUuid,
      });
      if (result && result.data.data) {
        if (ifInstitution) {
          this.isFoucsInstitution =
            result.data.data.isFocus == 1 ? true : false;
        } else {
          this.isFoucs = result.data.data.isFocus == 1 ? true : false;
        }
      }
    },
	goUser(id){
		this.$sensors.track('goodsdetail_click',{
			button_name:"艺术家名片_查看主页"
		});
		this.$common.goPage(`/user/${id}`, '_blank')
	},
    //关注与取消关注
    async focusArtist() {
      let result = null;
      let isfcu;
      let userUuid;
      let ifInstitution = false;
      if (
        !this.authorInstitution ||
        (this.authorInstitution.viewHomepage == 1 &&
          !this.isFoucsInstitution) ||
        this.authorInstitution.viewHomepage == 2
      ) {
        userUuid = this.artist.id;
        isfcu = this.isFoucs;
      } else {
        userUuid = this.authorInstitution.id;
        isfcu = this.isFoucsInstitution;
        ifInstitution = true;
      }
      if (!isfcu) {
		  this.$sensors.track('goodsdetail_click',{
		  	button_name:"艺术家名片_加关注"
		  });
        result = await this.$api.service.userfriend_operation({
          type: 1,
          userUuid: userUuid,
        });
        if (result.data.code == 200) {
          this.$message.success("关注成功");
          this.getFoucsByuuid();
        }
      } else {
		  this.$sensors.track('goodsdetail_click',{
		  	button_name:"艺术家名片_取消关注"
		  });
        result = await this.$api.service.userfriend_operation({
          type: 2,
          userUuid: userUuid,
        });
        if (result.data.code == 200) {
          this.$message.success("取消关注成功");
          this.isFoucsInstitution = false;
          if (!ifInstitution) {
            this.getFoucsByuuid();
          }
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.page-artist-bar {
  padding: 32px 40px 39px 0;
  margin: 0 auto;
  border-radius: 4px;
  border: 1px solid #e3e3e3;
  .bar-wrap {
    display: flex;
  }
  .info {
    width: 239px;
    border-right: 1px solid rgba($color: #000000, $alpha: 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .avatar {
      width: 70px;
      height: 70px;
      border-radius: 100%;
      border: 1px solid rgba($color: #000000, $alpha: 0.4);

      overflow: hidden;
      margin: 0 auto 5px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    h1 {
      font-size: 14px;
      font-weight: bold;
      color: #000000;
      line-height: 20px;
      text-align: center;
      margin-bottom: 2px;
    }
    p {
      font-size: 12px;
      color: rgba($color: #000000, $alpha: 0.4);
      margin-bottom: 16px;
      line-height: 20px;
      text-align: center;
    }
  }
  .introduce {
    padding-left: 54px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    p {
      width: 100%;
      text-align: left;
      color: rgba($color: #000000, $alpha: 0.4);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      overflow: hidden;
    }
    .center {
      text-align: center;
    }
    .v1-btn-link {
      position: absolute;
      right: 0px;
      bottom: -15px;
    }
  }
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 541px) {
  .page-artist-bar {
    margin: 0 0.32rem 0;
    padding: 0.32rem;
    flex-direction: column;
    .bar-wrap {
      flex-direction: column;
    }
    .info {
      width: 100%;
      border: none;
      margin-bottom: 0.32rem;
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      .name {
        display: flex;
        align-items: center;
      }
      .avatar {
        width: 1rem;
        height: 1rem;
        margin-right: 0.2rem;
        margin-bottom: 0;
      }
      .ui-user-info {
        flex: 1;
        max-width: 2.6rem;
        h1 {
          font-size: 0.28rem;
          line-height: 0.4rem;
          margin-bottom: 0.04rem;
        }
        p {
          font-size: 0.24rem;
          line-height: 0.32rem;
          text-align: left;
          margin: 0;
        }
      }
    }
    .introduce {
      padding-left: 0;
      padding-bottom: 0.64rem;
      p {
      }
      .v1-btn-link {
        right: 0px;
        bottom: 0px;
      }
    }
    .v1-btn-attention {
      padding-left: 0.9rem;
      &:before {
        left: 15px;
      }
    }
  }
}
</style>
