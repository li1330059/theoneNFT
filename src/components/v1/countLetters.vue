/* 单字符输入组件 count-letters*/
 <template>
  <div>
    <el-input
      v-if="isMobile"
      class="mobile-input"
      type="password"
      v-model="mobilePassword"
      maxlength="6"
      :autofocus="true"
      autocomplete="new-password"
    
    />
    <div class="letters-wrap" v-else>
      <div class="letter" v-for="(item, index) in letters" :key="index">
        <div class="mask" @click="onEditor($event, index)"></div>
        <input
          type="password"
          :disabled="letters[index].status !== 1"
          :ref="index"
          :class="{ focus: letters[index].status }"
          maxlength="1"
          :value="letters[index].val"
          @keyup="onKeyup($event, index)"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "countLetters",
  props: {
    count: {
      type: Number,
      default: 6,
    },
  },
  data() {
    return {
      letters: [],
      isMobile: false,
      mobilePassword: "",
    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  destroyed() {},

  methods: {
    init() {
      this.isMobile = this.$common.isMobile();
      this.mobilePassword = "";
      this.createLetters();
      if (this.isMobile) {
      } else {
        this.$nextTick(() => {
          this.focus(0);
        });
      }
    },
    onEditor(e, idx) {
      const info = this.letters[idx];
      if (info.val) {
        this.focus(idx);
      } else {
        //下一个应该填写的位置
        const editor_idx = this.letters.findIndex((item) => !item.val);
        if (editor_idx == idx) {
          this.focus(idx);
        }
      }
    },
    focus(idx) {
      if (this.letters[idx]) {
        //清除其他状态
        this.letters = this.letters.map((item) => {
          item.status = 0;
          return item;
        });
        this.letters[idx].status = 1;
        this.$nextTick(() => this.$refs[idx][0].focus());
      }
    },
    blur(idx) {
      if (this.letters[idx]) {
        this.letters[idx].status = 0;
        this.$nextTick(() => this.$refs[idx][0].blur());
      }
    },
    getLetters() {
      if (this.isMobile) {
        if (this.mobilePassword) {
          return this.mobilePassword.trim().split("");
        }
        return [];
      } else {
        return this.letters.map((item) => {
          return item.val;
        });
      }
    },

    onKeyup(e, idx) {
      if (idx < this.count) {
        const val = e.target.value;

        if (val) {
          if (val.search(/\D/gi) !== -1) {
            this.letters[idx].val = "";
            this.$refs[idx][0].value = "";
            return;
          }
          this.letters[idx].val = val;
          this.letters[idx].status = 0;

          if (idx == this.count - 1) {
            this.blur(idx);
          } else {
            if (this.letters[idx + 1].val) {
              const editor_idx = this.letters.findIndex((item) => !item.val);
              if (editor_idx !== -1) {
                this.focus(editor_idx);
              } else {
                this.blur(idx);
              }
            } else {
              this.focus(idx + 1);
            }
          }
        } else {
          if (e.keyCode == 8) {
            //删除操作
            //判断当前元素的后一个是否已经填写
            if (idx == this.letters.length - 1) {
              this.letters[idx].val = "";
              this.letters[idx].status = 0;
              this.focus(idx - 1);
            } else {
              const next_info = this.letters[idx + 1];
              if (next_info.val) {
                //如果已经填写了不允许删除
                this.blur(idx);
              } else {
                this.letters[idx].val = "";
                this.letters[idx].status = 0;
                if (idx == 0) {
                  this.blur(idx);
                } else {
                  this.focus(idx - 1);
                }
              }
            }
          }
        }
      }
    },
    createLetters() {
      let letters = [];
      for (let i = 0; i < this.count; i++) {
        letters.push({
          status: 0,
          val: "",
        });
      }
      this.mobilePassword = "";
      this.letters = letters;
    },
  },
};
</script>

<style lang='scss' scoped>
.mobile-input {
  ::v-deepinput {
    width: 100%;
  }
}
.letters-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .letter {
    margin-right: 10px;
    position: relative;
    top: 0;
    left: 0;

    text-align: center;

    input {
      line-height: 40px;
      display: block;
      width: 34px;
      padding: 0;
      text-align: center;
      line-height: 40px;
      border: 1px solid rgba(0, 0, 0, 0.4);
      border-radius: 4px;
      background-color: #fff;
      transition: all ease-out 0.16s;
    }
    .focus {
      border-color: #397fe7;
    }
    .mask {
      width: 100%;
      height: 100%;
      z-index: 2;
      position: absolute;
      top: 0;
      left: 0;
    }
    .show {
      display: block;
    }
  }
  .letter:last-child {
    margin-right: 0;
  }
}
</style>