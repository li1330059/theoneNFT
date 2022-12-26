<template>
  <div :id="`${id}-ipt_pwd2`" class="password-input">
    <div v-if="loading" class="loadig">安全键盘初始化中</div>
    <span :id="`${id}-LOGPASS2_SHOW`"></span>
    <input
      :style="`padding-left:${left - 1}px;letter-spacing:${space - 0.5}px`"
      :id="`${id}-LOGPASS2`"
      class="default input_search"
      type="password"
      disabled="disabled"
    />
    <div :id="`${id}-keyboardBtn2`" class="ipt_pwd_rjp default"></div>
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
export default {
  components: {},
  props: {
    price: {
      type: Number,
      default: 0,
    },
    id: {
      type: String,
      default: "",
    },
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
    return { password: "", options: {}, isShow: false };
  },
  computed: {
    loading() {
      if (this.options && JSON.stringify(this.options) != "{}") {
        return false;
      }
      return true;
    },
  },
  created() {
    loadStyle(
      "p-1",
      "https://mpay-static.oss-cn-hangzhou.aliyuncs.com/html/lib/state-secret/microdone.css"
    );
    /* 
    loadScript(() => {}, {
      id: "p-2",
      url: "https://static.theone.art/pc/ll-bag/js/microdone.js",
    }); */
  },
  methods: {
    back() {},
    hide() {
      this.isShow = false;
    },
    init(options) {
      /*       this.id = `keyboard-${new Date().getTime()}${parseInt(Math.random() * 10000)}`;
      console.log(this.id); */
      this.$nextTick(() => {
        this.isShow = true;
        this.initParams(options);
      });
    },

    initPassword() {
      // eslint-disable-next-line
      const config = {
        png: "//mpay-static.oss-cn-hangzhou.aliyuncs.com/html/lib/state-secret/img", // 图片路径，用这个就行了，也可以下载到本地
        click_objId: `#${this.id}-keyboardBtn2`, // 触发显示键盘的Dom节点Id
        regExp1: "[\\d]", // 输入过程限制的正则，不匹配正则的字符不让输入
        regExp2: `^(?!(\\d)\\1+$|(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)|9(?=0)){5}\\d$|(?:0(?=9)|1(?=0)|2(?=1)|3(?=2)|4(?=3)|5(?=4)|6(?=5)|7(?=6)|8(?=7)|9(?=8)){5}\\d$)\\d{6}$`, // 输入完成后的正则，与getValid()对应，判断输入值是否匹配该正则
        Input_texId: `#${this.id}-LOGPASS2`, // 接收内容的Dom节点Id
        parent_objId: `#${this.id}-ipt_pwd2`, // 将键盘插入到何处的Dom节点Id
        placeholderId: `#${this.id}-LOGPASS2_SHOW`, // span标签的id，该span用于模拟Input_texId的placeholder
        len: "6", // 表示最大允许输入多少个字符[可以不传递]
        keyBordLeft: "",
        keyBordTop: "",
        chaosMode: 0, // 混乱模式,0:无混乱;1:打开时乱一次;2:每输入一个字符乱一次,默认值0
        clickStatus: 1, // 按键状态,0:鼠标划过、悬浮时按键无变化;1:鼠标划过、悬浮时按键的颜色变化,默认值0
        titlefont: "安全支付输入",
        backfont: "退 格",
        capsfont: "切换大/小写",
        surefont: "确定",
        isen: false,
        callBack: () => {
          const res = this.getPassword();
          this.$emit("success", res);
        }, // 密码校验成功回调
        errorCallBack: (info) => {
          console.log(info);
          this.$emit("error", { code: "密码简单，请重新输入" });
        }, // 密码校验失败回调
        rsaPublicKey: this.options.rsaPublicContent, // RSA加密必须参数，国密加密可不要
        sm2KeyHex: this.options.sm2KeyHex, // 国密加密必须参数，RSA加密可不要
        license: this.options.license, // 必须参数
      };
      const passowrd = new showKeyBord(config);

      return passowrd;
    },
    async initParams(options) {
      if (options) {
        this.options = options;
        this.passwordInstance = this.initPassword();
        this.passwordInstance.initOptions();
        console.log(this.passwordInstance);
        return;
      }
      const keyRes = await this.$api.service.ll_safeConfig_randomKey({
        appName: this.$store.state.llConfig.appName,
        encryptAlgorithm: "SM2",
        flagChnl: "H5",
        pkgName: this.$store.state.llConfig.pkgName,
      });
      if (keyRes.data.code == 200 && keyRes.data.data.success) {
        this.options = keyRes.data.data;
        this.passwordInstance = this.initPassword();
        this.passwordInstance.initOptions();
      } else {
        this.$message.error(keyRes.data.message);
      }
    },

    getPassword() {
      this.passwordInstance.setRandKey(this.options.randomValue); // 先设置随机key
      const password = this.passwordInstance.getOutputSM(); // 国密加密密码
      const rsaPassword = this.passwordInstance.getOutput(); // RSA加密密码

      const res = {
        password,
        rsaPassword: rsaPassword,
        randomKey: this.options.randomKey,
        hash: this.passwordInstance.getHash(),
        keyboard: this.passwordInstance,
      };

      return res;
    },
    clearInput() {
      this.passwordInstance.clearPWD();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.ipt_pwd {
  border: none;
  height: 37px;
}
.input_search {
  padding-left: 31px;
  letter-spacing: 57px;
  font-size: 14px;
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
