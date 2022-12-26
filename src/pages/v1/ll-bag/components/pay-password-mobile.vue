<template>
  <div class="keyboard-wrap password-input">
    <div v-if="loading" class="loadig">安全键盘初始化中</div>
    <input
      :id="`${id}-password-keyboard`"
      class="default"
      :style="`padding-left:${left - 1}px;letter-spacing:${space - 2}px`"
    />
  </div>
</template>
<script>
function loadScript(cb, obj) {
  if (document.getElementById(obj.id)) {
    cb();
  } else {
    const script = document.createElement("script");
    script.async = true;
    script.src = obj.url;
    script.id = obj.id;
    script.onload = () => {
      cb();
    };
    document.body.appendChild(script);
  }
}
function loadStyle(id, url) {
  const oldEl = document.getElementById(`${id}-theme-style`);
  const style = document.createElement("link");
  style.id = `${id}-theme-style`;
  style.rel = "stylesheet";
  style.setAttribute("type", "text/css");
  style.href = url;
  oldEl
    ? document.head.replaceChild(style, oldEl)
    : document.head.appendChild(style);
}
function destory(id) {
  const dom = document.getElementById(id);
  console.log(dom);
}

export default {
  components: {},
  props: {
    price: {
      type: Number,
      default: 0,
    },
    /*     id: {
      type: String,
      default: "",
    }, */
    space: {
      type: Number,
      default: 0,
    },
    left: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return { password: "", options: {}, isShow: false, microDone: {}, id: "" };
  },
  computed: {
    loading() {
      if (this.options && JSON.stringify(this.options) != "{}") {
        return false;
      }
      return true;
    },
  },
  beforeDestroy() {
    /*     destory("s-1");
    destory("s-2"); */
  },
  created() {
    loadStyle(
      "m-2",
      "https://mpay-static.oss-cn-hangzhou.aliyuncs.com/html/lib/microdone/microdone.css"
    );

    /*     loadScript(() => {}, {
      id: "s-1",
      url: "https://mpay-static.oss-cn-hangzhou.aliyuncs.com/html/js/jquery-3.1.1.min.js",
    });
    loadScript(() => {}, {
      id: "s-2",
      url: "https://mpay-static.oss-cn-hangzhou.aliyuncs.com/html/lib/microdone/index.js",
    }); */
  },
  methods: {
    back() {},
    hide() {
      this.isShow = false;
    },
    init(options) {
      this.id = `${new Date().getTime()}${parseInt(Math.random() * 10000)}`;
      console.log(this.id);

      this.$nextTick(() => {
        this.isShow = true;
        this.initParams(options);
      });
    },
    initMicroDone(props) {
      const svgPath =
        "https://mpay-static.oss-cn-hangzhou.aliyuncs.com/html/lib/microdone/svg"; // svg图片的地址
      const { guardName, random } = props;
      if (typeof window.kb === "undefined") {
        // 键盘构造
        window.kb = new window.keyBoard({
          chaosMode: 0, // 混乱模式,0:无混乱;1:打开时乱一次;2:每输入一个字符乱一次,默认值0
          pressStatus: 1, // 按键状态,0:按下、抬起按键无变化;1:按下、抬起按键的颜色变化,默认值0
          kbType: 0, // 键盘类型,0:全键盘;1:纯数字键盘,默认值0
          svg: svgPath,
          hasMap: "1", // 是否调用mapping值：当为1时调用，当为非1时，不调用
          license: random.license,
        });
      }
      try {
        /*    if ($("#testkbid")[0] === undefined) { } */

        window.kb.generate();
      } catch (e) {
        console.log(e);
      }
      window.passGuard.ib = random.map_arr;
      if (typeof window[guardName] === "undefined") {
        // 密码卫士构造
        window[guardName] = new window.passGuard({
          jump: 1,
          fixed: "H5fixed", // 当fixed接口添加时，代表该输入框在fixed覆盖层上且覆盖层的ID为接口的值(在demo中覆盖层ID为"H5fixed")
          maxLength: 6, // 最大输入长度
          regExp1: "[\\d]", // 输入过程限制的正则
          regExp2: `^(?!(\\d)\\1+$|(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)|9(?=0)){5}\\d$|(?:0(?=9)|1(?=0)|2(?=1)|3(?=2)|4(?=3)|5(?=4)|6(?=5)|7(?=6)|8(?=7)|9(?=8)){5}\\d$)\\d{6}$`,
          displayMode: 0, // 显示形式,0:星号;1:明文,默认值0
          callBack: () => {
            props.success();
          }, // 成功回调
          errorCallBack: () => {
            props.error();
          }, // 失败回调
          focus: () => {}, // H5键盘获取焦点回调
          blur: () => {}, // H5键盘失去焦点回调
          add: () => {
            console.log();
          },
          del: () => {},
          rsaPublicKey: random.rsa_public_content,
        });
      }
      return window[guardName];
    },

    async initParams(option) {
      if (option) {
        this.options = option;
        this.createConfig();
        const microDone = this.initMicroDone(this.config);
        this.microDone = microDone;
        this.microDone.generate(
          `${this.id}-password-keyboard`,
          window.kb,
          `PasswordKeyboard${this.id}`,
          1
        ); // 密码卫士初始化
        this.microDone.setRandKey(this.config.random.random_value);
        return;
      }

      const keyRes = await this.$api.service.ll_safeConfig_randomKey({
        appName: this.$store.state.llConfig.appName,
        encryptAlgorithm: "RSA",
        flagChnl: "H5",
        pkgName: this.$store.state.llConfig.pkgName,
      });
      if (keyRes.data.code == 200 && keyRes.data.data.success) {
        this.options = keyRes.data.data;
        this.createConfig();
        this.microDone = this.initMicroDone(this.config);
        this.microDone.generate(
          `${this.id}-password-keyboard`,
          window.kb,
          `PasswordKeyboard${this.id}`,
          1
        ); // 密码卫士初始化
        this.microDone.setRandKey(this.config.random.random_value);
      } else {
        this.$message.error(keyRes.data.message);
      }
    },
    createConfig() {
      this.config = {
        inputId: `${this.id}-password-keyboard`,
        guardName: `PasswordKeyboard${this.id}`,
        random: {
          license: this.options.license,
          map_arr: this.options.mapArr,
          rsa_public_content: this.options.rsaPublicContent,
          random_value: this.options.randomValue,
        },
        success: () => {
          this.success();
        },
        error: () => {
          this.$emit("error", { code: "密码简单，请重新输入" });
        },
      };
    },
    success() {
      const self = this;

      const hash = window[`PasswordKeyboard${this.id}`].getHash();

      this.getValue(this.microDone)
        .then((password) => {
          self.$emit("success", {
            password,
            hash: hash || "",
            randomKey: this.options.randomKey,
          });
        })
        .catch((code) => {
          // code EMPTY-input值为空 FORMAT_ERROR-密码格式校验不正确
          self.$emit("error", { code });
        });
    },
    getValue(guard) {
      return new Promise((resolve, reject) => {
        if (guard.getLength() === 0) {
          reject("EMPTY");
        }
        if (guard.getValid() === 1) {
          return reject("FORMAT_ERROR");
        }
        const password = guard.getOutput();
        window.passGuard.ib = this.config.random.map_arr;
        resolve(password);
      });
    },

    async getPassword() {
      // 清空input的内容
      /* microDone.clearAllPwd() */

      // 获取密码
      const res = await this.microDone
        .getValue()
        .then((password) => {
          return {
            password,
            randomKey: this.options.randomKey,
          };
        })
        .catch((code) => {
          // code EMPTY-input值为空 FORMAT_ERROR-密码格式校验不正确
          return { code };
        });
      return res;
    },
    clearInput() {
      //console.log(this.microDone);
      this.microDone.clearpwd();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.ipt_pwd {
  border: none;
}

.loadig {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
  color: #717171;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
