<template>
  <Content>
    <div>
      <div class="mode-mobile">
        <m-header :title="'个人资料'" />
      </div>

      <Header class="pc-wrap" title="个人资料" />
      <div class="form-wrap">
        <div class="content">
          <div class="input-block">
            <div class="title">我的昵称</div>
            <input type="text" placeholder="唯一艺术" v-model="nickname" />
          </div>
          <!--    <div class="input-block birthday-block" @click="showDate">
          <div class="title">生日</div>
          <div class="birthday-info">
            <div class="date-res" v-show="birthday">{{ birthday }}</div>
            <div class="date" v-show="!birthday">选择日期</div>
            <div class="icon" />
          </div>
        </div> -->

          <div class="input-block sign-wrap">
            <div class="title sign">个性签名</div>
            <textarea
              rows="4"
              type="text"
              placeholder="30字以内"
              v-model="user_sign"
            ></textarea>
          </div>
        </div>
        <div
          class="finish-btn"
          :class="{ finish_disabled: finish_disabled }"
          @click="onFinish"
        >
          完成
        </div>
      </div>
      <div class="jump" @click="onJump">跳过</div>
    </div>

    <van-popup v-model="showPicker" round position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :columns-order="['year', 'month', 'day']"
        :formatter="formatter"
        @cancel="onTimeOut"
        @confirm="onTimeIn"
        @changeFn="onShift"
      />
    </van-popup>
  </Content>
</template>
<script>
import mHeader from "@/components/v1/layout/mobileHeader";
import Content from "./component/content.vue";
import Header from "./component/header.vue";
export default {
  name: "personalData",
  components: { Content, mHeader, Header },
  data() {
    return {
      nickname: "",
      date: "",
      user_sign: "",
      showPicker: false,
      currentDate: new Date(),
      birthday: "",
      finish_disabled: false,
    };
  },
  created() {
    localStorage.setItem("PERSONAL-DATE", new Date().getTime());
  },

  methods: {
    onJump() {
      this.$router.push("/");
      localStorage.setItem("PERSONAL-DATE", new Date().getTime());
    },
    showDate() {
      this.showPicker = true;
    },
    formatter(type, val) {
      if (type === "year") {
        return val + "年";
      }
      if (type === "month") {
        return val + "月";
      }
      if (type === "day") {
        return val + "日";
      }
      return val;
    },
    // 取消时间弹出框按钮
    onTimeOut() {
      this.showPicker = true;
    },
    // 将时间格式转化为正常的
    onShift() {
      this.changeDate = this.currentDate; // Tue Sep 08 2020 00:00:00 GMT+0800 (中国标准时间)
    },
    // 时间弹出框  确认按钮
    onTimeIn(value) {
      this.birthday = this.timeFormat(this.currentDate);
      this.showPicker = false;
    },
    timeFormat(time) {
      // 时间格式化 2019-09-08
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      return year + "-" + month + "-" + day;
    },
    async onFinish() {
      const self = this;
      if (this.nickname.search(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/) !== -1) {
        if (this.nickname.length >= 10) {
          this.$message({
            message: "不能超过10个字",
            type: "warning",
          });
          return;
        }
      } else {
        this.$message({
          message: "请填写正确的昵称（中文，数字，字母，下划线）",
          type: "warning",
        });
        return;
      }
      if (this.user_sign.length > 30) {
        this.$message({
          message: "个性签名超出30字",
          type: "warning",
        });
        return;
      }
      if (!this.finish_disabled) {
        this.finish_disabled = true;
        if (self.user_sign || self.nickname) {
          const res = await this.$api.service.userattribute_change({
            introduce: self.user_sign,
            nickname: self.nickname,
          });
          if (res && res.data.code === 200 && res.data.data) {
            //去向判断地址栏有无refer
            localStorage.setItem("PERSONAL-DATE", "");
            this.$router.push("/");
          } else {
            this.$notify({
              type: "warning",
              message: res ? res.data.message : "error",
            });
            /*    setTimeout(() => {
              self.$router.push("/");
            }, 500); */
          }
        } else {
          this.$message({
            message: "个性签名超出30字",
            type: "warning",
          });
        }
        this.finish_disabled = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/1.0/scss/loginRegistration.scss";

@mixin pc-input-border {
  height: 0.5rem;
  border-radius: 0.04rem;
  border: 0.01rem solid rgba(0, 0, 0, 0.1);
}
textarea::-webkit-input-placeholder {
  @include input-placeholder;
}
textarea::-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  @include input-placeholder;
}

textarea::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  @include input-placeholder;
}

textarea::-ms-input-placeholder {
  @include input-placeholder;
}
.pc-wrap {
  display: block;
}
.input-block {
  display: block;
  border: none;
  .title {
    font-size: 0.14rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    margin-bottom: 0.08rem;
  }
  input,
  textarea {
    @include pc-input-border;
    display: block;
    width: 100%;
    height: inherit;
  }
}
.birthday-info {
  @include pc-input-border;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.2);
  font-size: 0.14rem;
  padding: 0.15rem 0.16rem;
}
textarea {
  resize: none;
  line-height: 1.4;
  padding: 0.15rem 0.16rem;
}
.finish-btn {
  @include linear-gradient-btn;
  width: 3.8rem;
  line-height: 0.46rem;
  font-size: 0.14rem;
  margin-top: 0.6rem;
  cursor: pointer;
}
.jump {
  text-align: left;
  font-size: 0.12rem;
  font-weight: 400;
  color: #397fe7;
  width: 100%;
  margin-top: 0.32rem;
  cursor: pointer;
}
.birthday-block {
  display: none;
}
.form-wrap {
  .content {
    display: block;
  }

}
@media screen and (max-width: 540px) {
  .pc-wrap {
    display: none;
  }
  .birthday-block {
    display: block;
  }
  .sign-wrap {
    .title {
      position: relative;
      top: -0.52rem;
    }
  }

  .input-block {
    margin-bottom: 0;
    display: flex;
    width: 100%;
    input {
    }
  }
  .body-wrap {
    background: #fafafa;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    z-index: 9999;
    display: block;
    .theme-img {
      display: none;
    }
    .personal-info-wrap {
      flex: 1;
      padding: 0;
    }
  }
  .form-wrap {
    margin-top: 0.32rem;
    padding: 1rem 0 0;
    .content {
      background-color: #fff;
    }
  }

  .input-block {
    display: flex;
    border-bottom: 0.01rem solid rgba(0, 0, 0, 0.1);
    padding: 0 0.2rem 0 0.32rem;
    line-height: 1rem;
    .title {
      width: 2.2rem;
      font-size: 0.28rem;
      font-weight: 400;
      color: #000000;
    }
    input,
    textarea {
      flex: 1;

      @include input-format;
    }
    textarea {
      height: inherit;
      padding: 0.28rem 0;
    }
    input::-webkit-input-placeholder {
      @include input-placeholder;
    }
    input::-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      @include input-placeholder;
    }

    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      @include input-placeholder;
    }

    input::-ms-input-placeholder {
      @include input-placeholder;
    }
  }
  .finish-btn {
    @include linear-gradient-btn;
    margin-top: 2.52rem;

    width: 90%;
    margin: 2.52rem auto 0.1rem;
    box-sizing: border-box;
  }
  .jump {
    text-align: center;
    font-size: 0.24rem;
    font-weight: 400;
    color: #397fe7;
    display: block;
    width: 100%;
  }
  .birthday-info {
    flex: 1;
    font-size: 0.28rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: none;
    padding: 0;
    .date-res {
      color: #000;
    }
    .icon {
      display: block;
      width: 0.36rem;
      height: 0.36rem;
      background: url("//static.theone.art/pc/images/sell-date.png") no-repeat center;
      background-size: contain;
      opacity: 0.2;
    }
    .finish_disabled {
      opacity: 0.8;
    }
  }
}
</style>



