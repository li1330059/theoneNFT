<template>
  <div class="active-date-body">
    <div class="active-block shadow-block">
      <div class="left txt-info-wrap">
        <div class="info-wrap">
          <img
            src="//static.theone.art/pc/index/t1.png"
            class="t1"
          />
          <div class="txt-info-block">
            <div class="des hidden-2">
              {{ dataObj.commodity && dataObj.commodity.name }}
            </div>
            <div class="date">{{ $common.formatDate(dataObj.activityDate,'yyyy-MM-dd HH:mm') }}</div>
          </div>

          <div class="ui-btn ui-btn-red" @click="go(dataObj)">立即查看</div>
        </div>
      </div>
      <div class="right img-cover bg-img"></div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      listParams: { pageIndex: 1, pageSize: 1, uuid: "" },
      dataObj: {},
    };
  },
  props: {},

  created() {
    this.getList();
  },

  methods: {
    go(dataObj) {
		this.$sensors.track('homepage_click', {
			module_name: "次级banner-活动日历立即查看",
			button_name:dataObj.commodity && dataObj.commodity.name
		});
		this.$router.push("/active_date");
    },
    async getList() {
      const res = await this.$api.service.activityCalendar_page(
        this.listParams
      );
      if (res.data.code == 200) {
        if (res.data.data.records && res.data.data.records.length > 0) {
          this.dataObj = res.data.data.records[0];
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/1.0/scss/index/active.scss";
.img-cover {
  background-image: url("//static.theone.art/pc/index/pc-active-date.gif");
}
.active-block {
  background-image: url("//static.theone.art/pc/index/active-date-bg.png");
  background-size: contain;
  padding-right:17px;
  background-repeat: no-repeat;
  background-position: right bottom;
}
@media screen and (max-width: 540px) {
  .active-date-body {
    display: none;
  }
}
</style>

