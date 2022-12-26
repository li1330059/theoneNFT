<template>
  <div>
    <div class="search-wrap">
      <span class="ui-icon icon-search hand" @click="onSearch"></span>
      <input
        placeholder="请输入您想查找的内容"
        type="text"
        class="search-input"
        :value="searchTxt"
        @input="searchChange"
        @keyup.13="search"
        ref="inputRef"
        v-if="showSearch"
      />
      <span class="txt hand" v-else @click="showSearch = true">搜索</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showSearch: false,
      searchTxt: "",
      inputE: null,
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.showSearch = this.open;
    this.searchTxt = this.value;
  },
  mounted() {},
  watch: {
    value(_new, _old) {
      console.log(_new, _old);
      this.searchTxt = _new;
    },
    open(_new, _old) {
      this.showSearch = _new;
    },
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    onSearch() {
      if (this.showSearch) {
        if (this.inputE) {
          this.search(this.inputE);
        }
        return;
      } else {
        this.showSearch = true;
      }
    },
    searchChange(e) {
      this.inputE = e;
      this.searchTxt = e.target.value;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$emit("listenChange", e);
      }, 260);
    },
    search(e) {
      this.$emit("listenSearch", e);
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-search {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/icon-search.png");
}
.search-wrap {
  display: flex;
  align-items: center;
  .txt {
    font-size: 14px;
    color: #ffffff;
    display: inline-block;
    padding-left: 2px;
  }
  .search-input {
    border: none;
    outline: none;
    background-color: transparent;
    display: block;
    font-size: 14px;
    color: #ffffff;
    padding-left: 10px;
    width: 150px;
    &::-webkit-input-placeholder {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }
    @media screen and (max-width: 540px) {
      font-size: 0.28rem;
    }
  }
  .icon-search {
    width: 18px;
    height: 18px;
    @media screen and (max-width: 540px) {
      width: 0.36rem;
      height: 0.36rem;
    }
  }
}
</style>
