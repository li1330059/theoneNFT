 <template>
  <div
    class="paging-body"
    v-if="!(selectedNextDisabled && selectedPreDisabled)"
  >
    <div
      class="page-icon"
      :class="{
        disabled: selectedPreDisabled,
      }"
      @click="onPrev"
    >
      <span class="icon icon-left" />
      上一页
    </div>
    <div class="pageNum">
      {{ currentPage }}
    </div>
    <div
      class="page-icon"
      :class="{ disabled: selectedNextDisabled }"
      @click="onNext"
    >
      下一页
      <span class="icon icon-right" />
    </div>
  </div>
</template>
    
<script>
export default {
  name: "g-paging",
  components: {},
  data() {
    return {
      isDisabledNext: false,
    };
  },
  props: {
    pages: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    res: {
      type: Number, // 每次返回的数据长度
      default: 1,
    },
    pageSize: {
      type: Number, // 每次返回的数据长度
      default: 10,
    },
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    pageChange: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    selectedNextDisabled() {
      // 是否禁用下一页
      //当数据返回值为0时｜｜当数据返回长度小于pageSize
      if (this.pages) {
        return this.currentPage >= this.pages;
      }

      return (
        (this.list && this.list.length == 0) ||
        (this.list && this.list.length < this.pageSize)
      );
    },
    selectedPreDisabled() {
      if (this.currentPage <= 1) {
        return true;
      }
      return false;
    },
  },
  mounted() {},

  methods: {
    disabledNext() {
      this.isDisabledNext = true;
      this.currentPage--;
    },
    onPrev() {
      if (this.selectedPreDisabled) {
        return;
      }
      this.currentPage--;
      this.pageChange(this.currentPage);
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.isDisabledNext = false;
    },
    onNext() {
      if (this.selectedNextDisabled) {
        return;
      }
      console.log(this.list.length);
      this.currentPage++;
      this.pageChange(this.currentPage);
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
  },
};
</script> 
  
<style lang="scss" scoped>
.paging-body {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.pageNum {
  padding: 0 6px;
  min-width: 40px;
  text-align: center;
}
.page-icon {
  height: 32px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 0 10px;
  cursor: pointer;
  user-select: none;

  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
  color: #397fe7;
  .icon-left {
    background-image: url("//static.theone.art/pc/mine/icon-left-selected.png");
  }
  .icon-right {
    background-image: url("//static.theone.art/pc/mine/icon-right-selected.png");
  }

  &.disabled {
    color: rgba(0, 0, 0, 0.2);
    .icon-left {
      background-image: url("//static.theone.art/pc/mine/icon-left.png");
    }
    .icon-right {
      background-image: url("//static.theone.art/pc/mine/icon-right.png");
    }
  }
}
</style>