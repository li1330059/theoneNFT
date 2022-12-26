<template>
  <div class="collect-body">
    <picture>
      <source
        srcset="
          //static.theone.art/pc/active/collect/p-banner.png
        "
        media="(max-width: 540px)"
      />

      <img
        class="banner responsive-img"
        srcset="
          //static.theone.art/pc/active/collect/banner.png
        "
        alt="pic"
      />
    </picture>
    <div class="ui-message phone-padding">
      唯一艺术平台自2021年5月18日成立以来，把握数字藏品的属性，在元宇宙建构过程中释放文化及文物的价值，印证了大众对富有文化内涵的数字藏品的喜爱和追捧。<br />
      唯一艺术平台对元宇宙的探索，正是在贯彻落实数字文化产业发展的重要指示精神，推动文化产业、文博事业高质量发展，传承和弘扬中华优秀传统文化，探索“讲好中国故事，传播好中国声音，展示真实、立体、全面的中国”的新模式、新路径。
    </div>
    <picture>
      <source
        srcset="
          //static.theone.art/pc/active/collect/p-title.png
        "
        media="(max-width: 540px)"
      />

      <img
        class="t-img"
        srcset="
          //static.theone.art/pc/active/collect/title.png
        "
        alt="pic"
      />
    </picture>

    <div class="phone-padding">
      <div class="ui-collect-des">
        <div class="title">
          为了在更高的水准、更广的范围、更深的维度进行系统思考、规划与实施。<br />唯一艺术平台即将开启五月品牌月活动
          并面向全国广泛征集活动方案！
        </div>
        <div class="p-wrap">
          <div class="num">1.</div>
          <div class="p-info">
            <div class="p-title">征集内容</div>
            <div class="p">
              在基于合法合规，公平公正的基础上，藏家们可以就平台玩法、活动形式、活动内容、合作IP、购买规则、产品建议、页面优化等
              多方面内容，提出具有针对性和可行性的活动方案，提出的活动方案数量不设上限，一经采纳，即可获得丰厚的奖励。
            </div>
          </div>
        </div>
        <div class="p-wrap">
          <div class="num">2.</div>
          <div class="p-info">
            <div class="p-title">征集时间</div>
            <div class="p">2022年4月18日—2022年5月18日。</div>
          </div>
        </div>
        <div class="p-wrap">
          <div class="num">3.</div>
          <div class="p-info">
            <div class="p-title">其他说明</div>
            <div class="p">本次活动的最终解释权归唯一艺术平台所有。</div>
          </div>
        </div>
        <div class="p-wrap p-careful">
          <div class="p-title">注意:</div>
          <div class="p">
            用户购买一次任意藏品后可以参与投稿活动。 每个账号只能投稿一次。
          </div>
        </div>
      </div>
    </div>
    <div class="phone-padding">
      <div class="ui-form">
        <div class="textarea">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="textarea"
            maxlength="5000"
            show-word-limit
            rows="15"
            resize="none"
            :disabled="userStatus !== 'submit'"
          />
        </div>

        <div class="form-tool-wrap">
          <div>
            <div
              class="g-tip-txt"
              v-if="userStatus == 'not-login'"
              @click="goLogin"
            >
              您还未登录，请先<span class="link-btn">去登录>></span>
            </div>
            <div
              class="g-tip-txt"
              v-if="userStatus == 'not-buy'"
              @click="goMarket"
            >
              您好{{
                userInfo.nickname
              }}，您还未达到投稿条件，请先完成一次任意藏品购买。 <span class="link-btn">去购买>></span>
            </div>
            <div class="g-tip-txt" v-if="userStatus == 'submit'">
              快来投稿您的活动意见吧。
            </div>
            <div class="g-tip-txt" v-if="userStatus == 'submited'">
              感谢您的投稿
            </div>
          </div>
          <div class="ui-btn-group ui-btn-end">
            <div
              class="sub-btn"
              :class="{ 'sub-disabled': userStatus != 'submit' }"
              @click="save(0)"
            >
              保存
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="contribution-btn"
      :class="{ disabled: userStatus != 'submit' }"
      @click="save(1)"
    >
      {{ userStatus == "submited" ? "已投稿" : "投稿" }}
    </div>
    <picture>
      <source
        srcset="
          //static.theone.art/pc/active/collect/p-title2.png
        "
        media="(max-width: 540px)"
      />

      <img
        class="t-title-2"
        srcset="
          //static.theone.art/pc/active/collect/title2.png
        "
        alt="pic"
      />
    </picture>

    <div class="phone-padding">
      <div class="active-des">
        <div class="t">
          唯一艺术平台即将满一周年！唯一艺术平台始终坚持精耕数字艺术产业。每一次高光时刻的背后离不开大众的支持。
          为延伸艺术的无限遐想，唯一艺术平台以数字艺术为载体，向消费者倾情献礼，将再一次定义经典。
        </div>
        <div class="p">
          唯一艺术平台将在广泛征集活动方案的基础上，开启新一轮的品牌日活动！
        </div>
        <div class="p">
          感恩老用户活动、欢迎新用户活动、IP联动活动、签到福利活动、未中签福利活动.......更多惊喜活动即将纷至沓来，将向大众栩栩展现唯一艺术平台对元宇宙最好的诠释。
        </div>
        <div class="p">
          新故相推，日生不滞。唯一艺术平台在不断奔流的时代长河中，始终行走在传播数字艺术理念的旅途，从全方位、多维度发展精进探索，将数字生活和艺术美学传播至千家万户。
        </div>
      </div>
    </div>

    <img
      src="//static.theone.art/pc/active/collect/footer.png"
      class="ui-footer responsive-img"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      textarea: "",
      userTxtInfo: {},
    };
  },
  created() {
    this.getUserStatus();
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
    userStatus() {
      if (this.userInfo && JSON.stringify(this.userInfo) != "{}") {
        // 0表示用户可以提交 1:用户未购买过藏品 2:用户已经提交过建
        if (this.userTxtInfo.status == 0) {
          return "submit";
        } else if (this.userTxtInfo.status == 1) {
          return "not-buy";
        } else if (this.userTxtInfo.status == 2) {
          return "submited";
        }
      } else {
        return "not-login";
      }
      return "";
    },
  },
  methods: {
    textChange(e) {
      console.log(e);
    },
    goLogin() {
      const redirect = `${window.location.href}`;
      this.$router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
    },
    async getUserStatus() {
      if (this.userInfo && JSON.stringify(this.userInfo) != "{}") {
        const res = await this.$api.service.suggestion_info();
        if (res.data.code == 200) {
          this.userTxtInfo = res.data.data;
          if (this.userTxtInfo.status == 0 && this.userTxtInfo.suggestion) {
            this.textarea = this.userTxtInfo.suggestion;
          }
        } else {
          this.$message.error(res.data.message);
        }
      }
    },
    goMarket() {
      this.$router.push(`/market?type=derive`);
    },
    async save(editStatus) {
      if (this.userStatus == "submit") {
        if (this.textarea && this.textarea.trim()) {
          const res = await this.$api.service.suggestion_save({
            editStatus,
            suggestion: this.textarea,
          });
          if (res.data.code == 200) {
            this.userTxtInfo = res.data.data;
            this.$message.success(res.data.message);
            this.getUserStatus();
          } else {
            this.$message.error(res.data.message);
          }
        } else {
          this.$message.warning("请先填写");
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.collect-body {
  background: linear-gradient(180deg, #f8ece9 0%, #ffffff 100%);
}
.ui-message {
  max-width: 1039px;
  margin: 18px auto 42px;
  font-size: 14px;
  color: #333333;
  line-height: 24px;
  text-align: center;
}
.t-img {
  display: block;
  width: 482px;
  margin: 18px auto;
}
.t-title-2 {
  display: block;
  width: 653px;
  margin: 18px auto;
}
.link-btn {
  font-size: 14px;
  font-weight: 400;
  color: #397fe7;
  cursor: pointer;
  display: inline-block;
  padding-left:4px;
}
.g-tip-txt {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
}
.sub-btn {
  width: 128px;
  line-height: 44px;
  border-radius: 4px;
  border: 1px solid #d43e20;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  color: #d43e20;
  text-align: center;
}
.contribution-btn {
  width: 240px;
  line-height: 44px;
  background: linear-gradient(135deg, #d43c1e 0%, #e3816e 100%);
  border-radius: 4px;
  margin: 0 auto;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
}
.sub-disabled {
  border: 1px solid #d8d8d8;
  color: #d8d8d8;
}
.disabled {
  background: #d8d8d8;
  color: #fff;
}
.ui-collect-des {
  max-width: 948px;
  width: 100%;
  background: linear-gradient(135deg, #d43c1e 0%, #e3816e 100%);
  border-radius: 4px;
  margin: 0 auto;
  color: #ffffff;
  padding: 52px 50px;
  .title {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    line-height: 26px;
    margin-bottom: 52px;
  }
  .p-wrap {
    display: flex;
    .num {
      font-size: 28px;
      position: relative;
      top: -8px;
    }
    .p-info {
      padding-left: 6px;
      flex: 1;
      margin-bottom: 14px;
    }
    .p-title {
      font-size: 16px;
      margin-bottom: 4px;
    }
  }
  .p-careful {
    display: block;
    padding-left: 30px;
    margin-top: 28px;
  }
}
.ui-form {
  max-width: 948px;
  width: 100%;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #dfdfdf;
  margin: 32px auto 24px;
  padding: 24px 24px 12px;
  ::v-deeptextarea {
    border-color: #ffffff;
    background-color: transparent;
  }
  ::v-deeptextarea:focus {
    border-color: #409eff;
    &.textarea {
      background: red !important;
    }
  }
  ::v-deep .el-input__count {
    bottom: -20px;
    right: 0;
  }
  ::v-deep .el-textarea__inner {
    padding: 12px;
  }
  .textarea {
    background: #f4f4f4;
    border-radius: 4px;
    margin-bottom: 20px;

    /*     padding: 12px; */
    .txt-wrap {
      text-align: right;
      font-size: 14px;
      font-weight: 400;
      color: #999999;
    }
    textarea {
      display: block;
      resize: none;
      width: 100%;
      height: 387px;
      background: transparent;
      border: none;
      outline: none;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }
  }
  .form-tool-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
  }
}
.active-des {
  max-width: 948px;
  width: 100%;
  margin: 0 auto 108px;
  background: linear-gradient(135deg, #d43c1e 0%, #e3816e 100%);
  border-radius: 4px;
  padding: 32px 82px;
  font-size: 14px;
  color: #ffffff;
  line-height: 24px;
  text-align: center;
  .t {
    margin-bottom: 60px;
  }
  .p {
    margin-bottom: 20px;
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .phone-padding {
    padding: 0 0.32rem;
  }
  .ui-message {
  }
  .t-img {
    width: 80%;
  }
  .t-title-2 {
    width: 85%;
    margin-top: 26px;
  }
  .link-btn {
  }
  .sub-btn {
  }
  .contribution-btn {
  }
  .ui-collect-des {
    padding: 0.64rem 0.3rem;
    .title {
    }
    .p-wrap {
      .num {
        font-size: 20px;
        top: 0px;
      }
      .p-info {
      }
      .p-title {
      }
    }
    .p-careful {
      padding-left: 19px;
    }
  }
  .ui-form {
    padding: 0.32rem 0.24rem 0.12rem;
    ::v-deeptextarea {
    }
    .textarea {
      .txt-wrap {
      }
      textarea {
      }
    }
    .form-tool-wrap {
      display: block;
    }
  }
  .active-des {
    padding: 0.64rem 0.3rem;
    .t {
      margin-bottom: 0.44rem;
    }
    .p {
      margin-bottom: 0.44rem;
    }
  }
}
</style>