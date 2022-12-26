<template>
  <div class="ui-body">
    <play-1
      v-show="'516categoryConfig1' == page[currentPageIdx].key"
      :play-info="page[0]"
      :page="page"
      :notice="notice"
    ></play-1>
    <play-2
      v-show="'516categoryConfig2' == page[currentPageIdx].key"
      :play-info="page[1]"
      :page="page"
      :notice="notice"
    ></play-2>
  </div>
</template>
<script>
import Play1 from "./play-1.vue";
import Play2 from "./play-2.vue";
export default {
  components: {
    Play1,
    Play2,
  },
  data() {
    return {
      currentPageIdx: 0,
      notice: "",
      page: [
        {
          key: "516categoryConfig1",
          name: "玩法1",
        },
        {
          key: "516categoryConfig2",
          name: "玩法2",
        },
      ],
    };
  },
  created() {
    this.getNotice();
  },
  mounted() {},
  computed: {},
  methods: {
    changeTab(idx) {
      this.currentPageIdx = idx;
    },
    async getNotice() {
      const result = await this.$api.$service.config_get({
        key: "love512con",
      });
      if (result.code == 200) {
        this.notice = result.data.confValue1;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>