<template>
  <div class="menu-list-body">
    <section v-for="(item, index) in menuList" :key="index" class="menu-block">
      <div class="menu-title hand" @click="toggleOpen(item, idx)">
        <div class="info">
          <span class="ui-icon" :class="`icon-c-${item.level}`"></span>
          <div class="title hidden-1">
            {{ item.childLevelName }}
          </div>
        </div>
        <span
          class="ui-icon icon-p-top"
          :class="{ 'rotate-bottom': !item.open }"
        ></span>
      </div>
      <div v-show="item.open">
        <div
          class="menu-list-wrap"
          v-if="item.childrens && item.childrens.length > 0"
        >
          <div
            class="menu-item-box"
            v-for="(menuItem, menuIdx) in item.childrens"
            :key="menuIdx"
            @click="onMenuHandle(menuItem, menuIdx)"
          >
            <div
              class="menu-item hidden-1 hand"
              :class="{ selected: menuItem.selected }"
            >
              {{ menuItem.name.replace(/市场/gi, "") }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  props: {
    menuList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  data() {
    return { list: [] };
  },

  created() {},
  mounted() {
    console.log(this.menuList);
  },
  methods: {
    onMenuHandle(menuItem, menuIdx) {
      this.$emit("listen", { menuItem, menuIdx });
    },
    toggleOpen(item, idx) {
      item.open = !item.open;
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-p-top {
  background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/market/icon-p-top.png");
}

.menu-title {
  width: 260px;
  height: 60px;
  background: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 17px 0 14px;

  .info {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    .ui-icon {
      width: 30px;
      height: 30px;
      margin-right: 4px;
    }
  }
  .title {
    font-size: 14px;
    color: #333333;
    flex: 1;
  }
  .icon-p-top {
  }
  .rotate-bottom {
    transform: rotate(180deg);
  }
}
.menu-list-wrap {
  background: #f9f9f9;
  padding: 15px 10px;
  display: flex;
  flex-wrap: wrap;
  .menu-item-box {
    width: 50%;
    padding: 5px;
    overflow: hidden;
  }
  .menu-item {
    overflow: hidden;
    background: #ffffff;
    border-radius: 4px;
    font-size: 12px;
    color: #666666;
    line-height: 34px;
    text-align: center;
    padding: 0 10px;
  }
  .selected {
    background: #f7e6e5;
    color: #e61e1a;
  }
}
</style>
