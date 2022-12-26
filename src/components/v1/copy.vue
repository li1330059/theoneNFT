/* 复制组件*/
 <template>
  <div >
    <div v-if="isFull" class="m-copy">
      <div
        class="copy"
        v-clipboard:copy="txt"
        v-clipboard:success="onCopy"
        v-clipboard:error="onCopyError"
      >
        {{ short > 0 && txt ? $common.formatStr(txt, short) : txt }}
        <span class="icon" v-if="txt"></span>
      </div>
    </div>
    <div v-else class="m-copy">
      <div class="txt" @click="onCustom">{{ short > 0 && txt ? $common.formatStr(txt, short) : txt }}</div>
      <div
        class="copy"
        v-clipboard:copy="txt"
        v-clipboard:success="onCopy"
        v-clipboard:error="onCopyError"
      >
        <span class="icon" v-if="txt"></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "copy",
  props: {
    txt: {
      type: String,
    },
    short: {
      type: Number,
      default: 0,
    },
    isFull: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },

  methods: {
    onCopy(e) {
      this.$message({
        message: "复制成功",
        type: "success",
      });
    },
    onCopyError() {
      this.$message({
        message: "浏览器不支持",
        type: "error",
      });
    },
    onCustom(){
      this.$emit('listen');
    }
  },
};
</script>

<style lang='scss' scoped>
.m-copy {
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: opacity ease-out 0.16s;
  .icon {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url("//static.theone.art/pc/images/trade-copy.png") no-repeat center;
    background-size: contain;
    margin-left: 4px;
  }
  &:hover {
    opacity: 0.8;
  }
}
</style>