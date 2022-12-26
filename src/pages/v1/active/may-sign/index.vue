<template>
  <div class="page-may-sign">
    <div class="page-main">
      <!-- pc -->
      <div class="v1-maySign-pc">
        <div class="logo"></div>
        <div class="v1-maySign-main">
          <div class="content-one">
            <div class="left">
              <div class="signResult">
                您已签到
                <span>{{checkedCount}}</span>
                天
              </div>
              <div class="replenishResult">
                补签卡{{replenishCount}}张
              </div>
              <div class="signProgress">
                <div class="fill"
                     :style="{width:decimalToPercent()}"></div>
              </div>
              <div class="signAward">
                <div>
                  <span>1天</span>
                </div>
                <div>
                  <span>10天</span>
                </div>
                <div>
                  <span>20天</span>
                </div>
                <div>
                  <span>31天</span>
                </div>
              </div>
              <!-- calendar -->
              <div class="calendar">
                <div class="header">
                  <img src="https://static.theone.art/pc/maySign/left.png" />
                  <span>2022年5月</span>
                  <img src="https://static.theone.art/pc/maySign/right.png" />
                </div>
                <div class="body">
                  <ul class="weekdays">
                    <li>日</li>
                    <li>一</li>
                    <li>二</li>
                    <li>三</li>
                    <li>四</li>
                    <li>五</li>
                    <li>六</li>
                  </ul>
                  <ul class="days">
                    <li v-for="day in days"
                        :key="day">
                      <div class="day-info">
                        <p class="day-value">{{day.value}}</p>
                        <p>{{day.label}}</p>
                        <img v-if="checkedList.indexOf(day.time) != -1"
                             class="checked-day"
                             :class="{'animate':show}"
                             src="https://static.theone.art/pc/maySign/checked-day.png">
                        <img v-else-if="replenishList.indexOf(day.time) != -1"
                             class="checked-day"
                             src="https://static.theone.art/pc/maySign/checked-day-replenish.png" />
                        <img v-else-if="currentDate == day.time"
                             class="current-day"
                             src="https://static.theone.art/pc/maySign/current-day.png" />
                        <div class="replenish-btn"
                             @click="showDialog(day.time)"
                             v-else-if="replenishCount > 0 && currentDate > day.time && checkedList.indexOf(day.time) == -1 && replenishList.indexOf(day.time) == -1">补签</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="right">
              <img class="img1"
                   src="https://static.theone.art/pc/maySign/pic-1-pc.png" />
              <img class="img2"
                   src="https://static.theone.art/pc/maySign/pic-2-pc.png" />
              <p>唯一艺术喜迎五月品牌月，等你签到打卡</p>
              <div v-if="expire"
                   class="btn btn2">活动已结束</div>
              <div v-else-if="!expire && signStatus"
                   class="btn btn2"
                   @click="onSign">已签到</div>
              <div v-else-if="!expire && !signStatus"
                   class="btn btn1"
                   @click="onSign">立即签到</div>
              <div class="txt"
                   v-if="!expire && userInfo.userUuid && signStatus">
                {{ userInfo.nickname }}您好，您目前已经签到啦！
              </div>
              <div class="txt"
                   v-else-if="!expire && userInfo.userUuid && !signStatus">
                {{ userInfo.nickname }}您好，快来完成签到吧！
              </div>
              <div class="txt"
                   v-else-if="!expire && !userInfo.userUuid">
                您还未登录，请先<span @click="goLogin">登录</span>
              </div>
            </div>
          </div>
          <div class="content-text">
            <h1>活动介绍</h1>
            <h2>Activity introduction</h2>
            <p>5月18日是唯一艺术周年庆，短短一年不到的时间，唯一艺术平台的“精彩瞬间”正在以日新月异的节奏“定档”和“加更”。<br>为了回馈广大用户长久以来的支持，我们正式宣布：唯一艺术平台品牌月签到活动即将开启！本次活动定格唯一艺术平台的31个精彩瞬间。</p>
            <p>活动时间<br>2022年5月1日至2022年5月31日</p>
            <p>活动对象<br>在唯一艺术平台已完成实名注册、绑定个人实名认证银行卡的用户，且4月30日23:00:00时，账户中需持有2个及以上数字藏品。平台将于4月30日23:00对数字藏品数量进行快照，同时满足以上所有条件，可获得本次签到活动的资格。<br>*数字藏品不包括：未开启的数字藏品盲盒、购买资质盲盒以及未中签凭证、中签购买凭证等凭证。</p>
          </div>
          <div class="content-text">
            <h1>活动规则</h1>
            <h2>Activity rule</h2>
            <p>活动开启期间，每个账户每日可完成1次签到。<br>5月1日至5月18日，连续签到18天，可以获得1个“唯一艺术周年庆盲盒”。<br>5月1日至5月31日，连续签到31天，累计可以获得1个“唯一艺术周年庆盲盒”+1个“唯一艺术超级周年庆盲盒”。<br>盲盒将于活动结束后7个工作日内统一空投。</p>
            <p>活动期间内，可登录唯一艺术官网首页进行签到。</p>
            <p>本次活动一切解释权归唯一艺术平台所有。</p>
          </div>
        </div>
      </div>
      <!-- mobile -->
      <div class="v1-maySign-mobile">
        <div class="logo"></div>
        <div class="v1-maySign-main">
          <div class="content-one">
            <div class="right">
              <img class="img1"
                   src="https://static.theone.art/pc/maySign/pic-1-pc.png" />
              <img class="img2"
                   src="https://static.theone.art/pc/maySign/pic-2-pc.png" />
              <p>唯一艺术喜迎五月品牌月，等你签到打卡</p>
              <div v-if="expire"
                   class="btn btn2">活动已结束</div>
              <div v-else-if="!expire && signStatus"
                   class="btn btn2"
                   @click="onSign">已签到</div>
              <div v-else-if="!expire && !signStatus"
                   class="btn btn1"
                   @click="onSign">立即签到</div>
              <div class="txt"
                   v-if="!expire && userInfo.userUuid && signStatus">
                {{ userInfo.nickname }}您好，您目前已经签到啦！
              </div>
              <div class="txt"
                   v-else-if="!expire && userInfo.userUuid && !signStatus">
                {{ userInfo.nickname }}您好，快来完成签到吧！
              </div>
              <div class="txt"
                   v-else-if="!expire && !userInfo.userUuid">
                您还未登录，请先<span @click="goLogin">登录</span>
              </div>
            </div>
            <div class="left">
              <div class="head-tips">
                <div class="signResult">
                  您已签到
                  <span>{{checkedCount}}</span>
                  天
                </div>
                <div class="replenishResult">
                  补签卡{{replenishCount}}张
                </div>
              </div>
              <div class="signProgress">
                <div class="fill"
                     :style="{width:decimalToPercent()}"></div>
              </div>
              <div class="signAward">
                <div>
                  <span>1天</span>
                </div>
                <div>
                  <span>10天</span>
                </div>
                <div>
                  <span>20天</span>
                </div>
                <div>
                  <span>31天</span>
                </div>
              </div>
              <div class="calendar">
                <div class="header">
                  <img src="https://static.theone.art/pc/maySign/left.png" />
                  <span>2022年5月</span>
                  <img src="https://static.theone.art/pc/maySign/right.png" />
                </div>
                <div class="body">
                  <ul class="weekdays">
                    <li>日</li>
                    <li>一</li>
                    <li>二</li>
                    <li>三</li>
                    <li>四</li>
                    <li>五</li>
                    <li>六</li>
                  </ul>
                  <ul class="days">
                    <li v-for="day in days"
                        :key="day">
                      <div class="day-info">
                        <p class="day-value">{{day.value}}</p>
                        <p>{{day.label}}</p>
                        <img v-if="checkedList.indexOf(day.time) != -1"
                             class="checked-day"
                             :class="{'animate':show}"
                             src="https://static.theone.art/pc/maySign/checked-day.png">
                        <img v-else-if="replenishList.indexOf(day.time) != -1"
                             class="checked-day"
                             src="https://static.theone.art/pc/maySign/checked-day-replenish.png" />
                        <img v-else-if="currentDate == day.time"
                             class="current-day"
                             src="https://static.theone.art/pc/maySign/current-day.png" />
                        <div class="replenish-btn"
                             @click="showDialog(day.time)"
                             v-else-if="replenishCount > 0 && currentDate > day.time && checkedList.indexOf(day.time) == -1 && replenishList.indexOf(day.time) == -1">补签</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="content-text">
            <h1>活动介绍</h1>
            <h2>Activity introduction</h2>
            <p>5月18日是唯一艺术周年庆，短短一年不到的时间，唯一艺术平台的“精彩瞬间”正在以日新月异的节奏“定档”和“加更”。<br>为了回馈广大用户长久以来的支持，我们正式宣布：唯一艺术平台品牌月签到活动即将开启！本次活动定格唯一艺术平台的31个精彩瞬间。</p>
            <p>活动时间<br>2022年5月1日至2022年5月31日</p>
            <p>活动对象<br>在唯一艺术平台已完成实名注册、绑定个人实名认证银行卡的用户，且4月30日23:00:00时，账户中需持有2个及以上数字藏品。平台将于4月30日23:00对数字藏品数量进行快照，同时满足以上所有条件，可获得本次签到活动的资格。<br>*数字藏品不包括：未开启的数字藏品盲盒、购买资质盲盒以及未中签凭证、中签购买凭证等凭证。</p>
          </div>
          <div class="content-text">
            <h1>活动规则</h1>
            <h2>Activity rule</h2>
            <p>活动开启期间，每个账户每日可完成1次签到。<br>5月1日至5月18日，连续签到18天，可以获得1个“唯一艺术周年庆盲盒”。<br>5月1日至5月31日，连续签到31天，累计可以获得1个“唯一艺术周年庆盲盒”+1个“唯一艺术超级周年庆盲盒”。<br>盲盒将于活动结束后7个工作日内统一空投。</p>
            <p>活动期间内，可登录唯一艺术官网首页进行签到。</p>
            <p>本次活动一切解释权归唯一艺术平台所有。</p>
          </div>
        </div>
      </div>
      <!-- blindWrap -->
      <div class="blind-wrap"
           v-if="show">
        <div class="content"
             :class="{ 'hide-content': show }">
          <img :src="'https://static.theone.art/pc/maySign/tips-pic/'+currentTips+'.png'" />
          <img src="https://static.theone.art/pc/maySign/close.png"
               @click="close" />
        </div>
      </div>
      <!-- dialog -->
      <div class="dialog"
           v-if="dialogVisible">
        <div class="container">
          <div class="title">{{dialogTitle}}</div>
          <img src="https://static.theone.art/pc/tomzone/close.png"
               @click="cancel">
          <div class="content">
            {{dialogContent}}
          </div>
          <div class="button"
               v-if="!dialogFlag">
            <div class="submit-btn"
                 @click="submit">立即补签</div>
          </div>
          <div class="button"
               v-if="dialogFlag">
            <div class="submit-btn"
                 @click="sure">确定</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      signStatus: false,
      currentDate: null,
      currentTips: null,
      days: [
        {
          value: '1',
          label: '劳动节',
          time: '2022-05-01'
        },
        {
          value: '2',
          label: '初二',
          time: '2022-05-02'
        },
        {
          value: '3',
          label: '初三',
          time: '2022-05-03'
        },
        {
          value: '4',
          label: '青年节',
          time: '2022-05-04'
        },
        {
          value: '5',
          label: '立夏',
          time: '2022-05-05'
        },
        {
          value: '6',
          label: '初六',
          time: '2022-05-06'
        },
        {
          value: '7',
          label: '初七',
          time: '2022-05-07'
        },
        {
          value: '8',
          label: '母亲节',
          time: '2022-05-08'
        },
        {
          value: '9',
          label: '初九',
          time: '2022-05-09'
        },
        {
          value: '10',
          label: '初十',
          time: '2022-05-10'
        },
        {
          value: '11',
          label: '十一',
          time: '2022-05-11'
        },
        {
          value: '12',
          label: '十二',
          time: '2022-05-12'
        },
        {
          value: '13',
          label: '十三',
          time: '2022-05-13'
        },
        {
          value: '14',
          label: '十四',
          time: '2022-05-14'
        },
        {
          value: '15',
          label: '十五',
          time: '2022-05-15'
        },
        {
          value: '16',
          label: '十六',
          time: '2022-05-16'
        },
        {
          value: '17',
          label: '十七',
          time: '2022-05-17'
        },
        {
          value: '18',
          label: '十八',
          time: '2022-05-18'
        },
        {
          value: '19',
          label: '十九',
          time: '2022-05-19'
        },
        {
          value: '20',
          label: '二十',
          time: '2022-05-20'
        },
        {
          value: '21',
          label: '小满',
          time: '2022-05-21'
        },
        {
          value: '22',
          label: '廿二',
          time: '2022-05-22'
        },
        {
          value: '23',
          label: '廿三',
          time: '2022-05-23'
        },
        {
          value: '24',
          label: '廿四',
          time: '2022-05-24'
        },
        {
          value: '25',
          label: '廿五',
          time: '2022-05-25'
        },
        {
          value: '26',
          label: '廿六',
          time: '2022-05-26'
        },
        {
          value: '27',
          label: '廿七',
          time: '2022-05-27'
        },
        {
          value: '28',
          label: '廿八',
          time: '2022-05-28'
        },
        {
          value: '29',
          label: '廿九',
          time: '2022-05-29'
        },
        {
          value: '30',
          label: '五月',
          time: '2022-05-30'
        },
        {
          value: '31',
          label: '初二',
          time: '2022-05-31'
        },
      ],
      checkedCount: 0,
      checkedDays: [],
      show: false,
      expire: false,
      checkedList: [],
      replenishList: [],
      replenishCount: 0,
      dialogVisible: false,
      tempreplenish: null,
      dialogTitle: null,
      dialogContent: null,
      dialogFlag: false,
    };
  },
  mounted () {
    // 1.判断活动是否过期
    this.checkCurrent();
    // 2.获取当前服务器时间
    this.getCurrentDate();
    // 3.查看是否签到
    this.getUserSignStatus();
    // 4.签到月信息
    this.signMonth();
    // 7.获取补签卡数量
    this.getAdditionInfo();
  },
  computed: {
    userInfo () {
      return this.$store.state.user_info;
    },
  },
  watch: {
    userInfo () {
      this.getUserSignStatus();
    },
  },
  methods: {
    // 1.判断活动是否过期
    async checkCurrent () {
      if (this.userInfo.userUuid) {
        await this.$api.service.userCheckIn_check().then((res) => {
          if (res.data.code == 200) {
            if (!res.data.data.flag) {
              this.expire = true;
            };
          }
        });
      }
    },
    // 2.获取当前服务器时间
    async getCurrentDate () {
      if (this.userInfo.userUuid) {
        await this.$api.service.userCheckIn_current().then((res) => {
          if (res.data.code == 200) {
            this.currentDate = res.data.data;
            this.currentTips = res.data.data.split('-')[2];
            console.log('currentTips,' + res.data.data);
          }
        });
      }
    },
    // 3.查看是否已签到
    async getUserSignStatus () {
      if (this.userInfo.userUuid) {
        await this.$api.service.userCheckIn_today().then((res) => {
          if (res.data.code == 200 && res.data.data) {
            this.signStatus = res.data.data.flag;
          }
        });
      }
    },
    // 4.签到月信息
    async signMonth () {
      if (this.userInfo.userUuid) {
        await this.$api.service.userCheckIn_month_v2().then((res) => {
          if (res.data.code == 200 && res.data.data) {
            this.checkedDays = res.data.data.monthDetailData;
            this.checkedCount = res.data.data.count;
            // 6.过滤签到信息
            this.checkedList = [];
            this.replenishList = [];
            this.checkedDays.filter(item => {
              if (item.type == 0) {
                this.checkedList.push(item.day);
              } else if (item.type == 1) {
                this.replenishList.push(item.day);
              }
            });
          }
        });
      }
    },
    // 计算进度
    decimalToPercent () {
      let data = ((this.checkedCount / 31) * 100).toFixed(2) + '%'
      return data;
    },
    // 5.签到
    async onSign () {
      if (this.signStatus) {
        this.$message.warning("您已签到！");
        return;
      }
      this.$api.service.userCheckIn_save().then(res => {
        if (res.data.code == 200 && res.data.data) {
          this.$message.success("签到成功！");
          this.signMonth();
          this.getUserSignStatus();
          this.show = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    close () {
      this.show = false;
    },
    // 6.登录
    goLogin () {
      // this.$router.push("/login");
      const redirect = `${window.location.href}`;
      this.$router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
    },
    // 7.获取补签卡数量
    async getAdditionInfo () {
      if (this.userInfo.userUuid) {
        await this.$api.service.userCheckIn_getAdditionInfo().then((res) => {
          if (res.data.code == 200 && res.data.data) {
            this.replenishCount = res.data.data.remainingCount;
          }
        });
      }
    },
    // 8.补充签到
    showDialog (time) {
      this.dialogVisible = true;
      this.tempreplenish = time;
      this.dialogTitle = "使用1张补签卡";
      let tipsTime = null;
      if (this.tempreplenish.split('-')[2].substring(0, 1) == 0) {
        tipsTime = this.tempreplenish.split('-')[2].substring(1, 2);
      } else {
        tipsTime = this.tempreplenish.split('-')[2]
      };
      this.dialogContent = "补签日期为5月" + tipsTime + "日,您已签到" + this.checkedCount + "天";
    },
    cancel () {
      this.dialogVisible = false;
      this.dialogTitle = null;
      this.dialogContent = null;
      this.dialogFlag = false;
    },
    sure () {
      this.cancel();
      this.show = true;
    },
    async submit () {
      this.$api.service.userCheckIn_additionCheckIn({
        day: this.tempreplenish
      }).then(res => {
        if (res.data.code == 200 && res.data.data) {
          this.signMonth();
          this.getAdditionInfo();
          this.currentTips = this.tempreplenish.split('-')[2];
          this.dialogFlag = true;
          this.dialogTitle = "补签成功";
          let tipsTime = null;
          if (this.tempreplenish.split('-')[2].substring(0, 1) == 0) {
            tipsTime = this.tempreplenish.split('-')[2].substring(1, 2);
          } else {
            tipsTime = this.tempreplenish.split('-')[2]
          };
          this.dialogContent = "成功补签日期5月" + tipsTime + "日,您已签到" + (this.checkedCount + 1) + "天";
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.page-may-sign {
  width: 100%;
  height: 100%;
  background: linear-gradient(360deg, #e7eaf0 0%, #f7f8f9 100%);
  .page-main {
    max-width: 1400px;
    margin: 0 auto;
    padding-top: 119px;
    padding-bottom: 159px;
    @media screen and (min-width: 0px) and (max-width: 540px) {
      padding-top: 1rem;
      padding-bottom: 2.76rem;
    }
    // ---------------------------------------------------------------------------------------------------------
    .v1-maySign-pc {
      display: block;
      @media screen and (min-width: 0px) and (max-width: 540px) {
        display: none;
      }
      .logo {
        width: 457px;
        height: 43px;
        background: url("https://static.theone.art/pc/maySign/logo-pc.png")
          no-repeat;
        background-size: cover;
        margin: 0 auto;
      }
      .v1-maySign-main {
        margin-top: 50px;
        .content-one {
          display: flex;
          justify-content: center;
          text-align: center;
          .left {
            width: 686px;
            height: 666px;
            box-shadow: 0px 24px 24px -16px rgba(15, 15, 15, 0.1);
            border-radius: 4px;
            background: url("https://static.theone.art/pc/maySign/left-bg-pc.png")
              no-repeat center center;
            background-size: cover;
            position: relative;
            .signResult {
              position: absolute;
              top: 34px;
              left: 32px;
              font-size: 14px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #333333;
              line-height: 20px;
              span {
                color: rgba(231, 40, 33, 1);
              }
            }
            .replenishResult {
              position: absolute;
              top: 34px;
              right: 35px;
              font-size: 14px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #333333;
              line-height: 20px;
            }
            .signProgress {
              position: absolute;
              top: 78px;
              left: 32px;
              width: 622px;
              height: 24px;
              background: #e3e3e3;
              border-radius: 17px;
            }
            .fill {
              height: 24px;
              background: linear-gradient(270deg, #e6231d 0%, #ff7863 100%);
              border-radius: 17px;
            }
            .signAward {
              position: absolute;
              top: 110px;
              left: 44px;
              width: 596px;
              display: flex;
              justify-content: space-between;
              margin-bottom: 44px;
              div {
                text-align: left;
              }
            }
            .calendar {
              position: absolute;
              top: 172px;
              left: 65px;
              width: 556px;
              .header {
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                  width: 200px;
                  font-size: 24px;
                  font-family: FZLTCHK--GBK1-0, FZLTCHK--GBK1;
                  font-weight: bold;
                  color: #000000;
                  line-height: 27px;
                }
              }
              .body {
                .weekdays {
                  margin: 0;
                  padding: 30px 0px 20px 0px;
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: space-around;
                  font-size: 22px;
                  li {
                    display: inline-block;
                    text-align: center;
                  }
                }
                .days {
                  padding: 0 0 10px;
                  margin: 0;
                  display: flex;
                  flex-wrap: wrap;
                  align-items: center;
                  justify-content: flex-start;
                  li {
                    width: 14.2%;
                    height: 72px;
                    padding: 1%;
                    box-sizing: border-box;
                    margin-bottom: 4px;
                    display: flex;
                    justify-content: center;
                    .day-info {
                      width: 68px;
                      position: relative;
                      display: flex;
                      flex-direction: column;
                      .day-value {
                        font-weight: bold;
                        margin-bottom: 5px;
                      }
                      .checked-day {
                        width: 56px;
                        height: 56px;
                        position: absolute;
                        top: -16px;
                        left: 8px;
                      }
                      .current-day {
                        width: 56px;
                        height: 56px;
                        position: absolute;
                        top: -7px;
                        left: 7px;
                      }
                      .animate {
                        transition: all 0.4s;
                      }
                      .replenish-btn {
                        width: 48px;
                        height: 17px;
                        background: linear-gradient(
                          270deg,
                          #e6231d 0%,
                          #ff7863 100%
                        );
                        opacity: 0.6;
                        border-radius: 4px;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #ffffff;
                        line-height: 17px;
                        cursor: pointer;
                        margin: 0 auto;
                      }
                    }
                  }
                }
              }
            }
            @media screen and (min-width: 0px) and (max-width: 540px) {
              width: 95%;
            }
          }
          .right {
            width: 562px;
            display: flex;
            flex-direction: column;
            .img2 {
              margin-top: 35px;
              margin-bottom: 32px;
            }
            p {
              font-size: 24px;
              font-family: FZLTCHK--GBK1-0, FZLTCHK--GBK1;
              font-weight: normal;
              color: #000000;
              line-height: 27px;
              margin-bottom: 74px;
            }
            .btn {
              width: 300px;
              height: 40px;
              border-radius: 44px;
              margin: 0 auto;
              align-items: center;
              font-size: 14px;
              font-family: PingFang-SC-Bold, PingFang-SC;
              font-weight: bold;
              color: #ffffff;
              line-height: 40px;
              cursor: pointer;
            }
            .btn1 {
              background: linear-gradient(270deg, #e6231d 0%, #ff7863 100%);
            }
            .btn2 {
              background: rgba(97, 97, 97, 0.4);
            }
            .txt {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #666666;
              line-height: 20px;
              margin-top: 6px;
              span {
                color: rgba(233, 45, 37, 1);
                cursor: pointer;
              }
            }
          }
        }
        .content-text {
          max-width: 1248px;
          margin: 32px auto;
          padding: 32px;
          background: #ffffff;
          box-shadow: 0px 24px 24px -16px rgba(15, 15, 15, 0.1);
          border-radius: 4px;
          h1 {
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
            line-height: 20px;
          }
          h2 {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 17px;
            margin-bottom: 21px;
          }
          p {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 24px;
            margin-bottom: 12px;
          }
        }
      }
    }
    // ---------------------------------------------------------------------------------------------------------
    .v1-maySign-mobile {
      display: none;
      @media screen and (min-width: 0px) and (max-width: 540px) {
        display: block;
      }
      .logo {
        width: 310px;
        height: 29px;
        background: url("https://static.theone.art/pc/maySign/logo-pc.png")
          no-repeat;
        background-size: cover;
        margin: 0 auto;
      }
      .v1-maySign-main {
        margin-top: 0.9rem;
        .content-one {
          text-align: center;
          .right {
            width: 5.9rem;
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            .img2 {
              margin-top: 0.62rem;
              margin-bottom: 0.32rem;
            }
            p {
              font-size: 0.26rem;
              font-family: FZLTCHK--GBK1-0, FZLTCHK--GBK1;
              font-weight: normal;
              color: #000000;
              line-height: 0.3rem;
              margin-bottom: 0.8rem;
            }
            .btn {
              width: 4rem;
              border-radius: 44px;
              margin: 0 auto;
              align-items: center;
              font-size: 14px;
              font-family: PingFang-SC-Bold, PingFang-SC;
              font-weight: bold;
              color: #ffffff;
              line-height: 40px;
              cursor: pointer;
            }
            .btn1 {
              background: linear-gradient(270deg, #e6231d 0%, #ff7863 100%);
            }
            .btn2 {
              background: rgba(97, 97, 97, 0.4);
            }
            .txt {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #666666;
              line-height: 20px;
              margin-top: 6px;
              span {
                color: rgba(233, 45, 37, 1);
                cursor: pointer;
              }
            }
          }
          .left {
            width: 6.86rem;
            box-shadow: 0px 24px 24px -16px rgba(15, 15, 15, 0.1);
            border-radius: 4px;
            background: url("https://static.theone.art/pc/maySign/left-bg-pc.png")
              no-repeat center center;
            background-size: cover;
            margin: 0.14rem auto;
            padding-top: 0.34rem;
            .head-tips {
              display: flex;
              .signResult {
                width: 50%;
                font-size: 14px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #333333;
                line-height: 20px;
                text-align: left;
                margin: 0rem 0 0.21rem 0.32rem;
                span {
                  color: rgba(231, 40, 33, 1);
                }
              }
              .replenishResult {
                width: 50%;
                font-size: 14px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #333333;
                line-height: 20px;
                text-align: right;
                margin-right: 0.32rem;
              }
            }
            .signProgress {
              background: #e3e3e3;
              border-radius: 0.17rem;
              margin: 0 0.34rem 0.08rem 0.34rem;
            }
            .fill {
              height: 24px;
              background: linear-gradient(270deg, #e6231d 0%, #ff7863 100%);
              border-radius: 17px;
            }
            .signAward {
              width: 100%;
              display: flex;
              justify-content: space-between;
              padding: 0 0.44rem;
              margin-bottom: 0.44rem;
              div {
                text-align: left;
              }
            }
            .calendar {
              margin: 0 auto;
              .header {
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                  width: 2rem;
                  font-size: 0.34rem;
                  font-family: FZLTCHK--GBK1-0, FZLTCHK--GBK1;
                  font-weight: bold;
                  color: #000000;
                  line-height: 27px;
                }
              }
              .body {
                .weekdays {
                  margin: 0;
                  padding: 0.3rem 0 0.2rem 0;
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: space-around;
                  font-size: 0.22rem;
                  font-weight: bold;
                  li {
                    display: inline-block;
                    text-align: center;
                  }
                }
                .days {
                  padding: 0 0 0.1rem;
                  margin: 0;
                  display: flex;
                  flex-wrap: wrap;
                  align-items: center;
                  justify-content: flex-start;
                  li {
                    width: 14.2%;
                    height: 1.3rem;
                    padding: 1% 0;
                    box-sizing: border-box;
                    margin-bottom: 4px;
                    display: flex;
                    justify-content: center;
                    .day-info {
                      width: 42px;
                      position: relative;
                      .day-value {
                        font-weight: bold;
                        margin-bottom: 5px;
                      }
                      .checked-day {
                        width: 45px;
                        height: 45px;
                        position: absolute;
                        top: -0.15rem;
                      }
                      .current-day {
                        width: 45px;
                        height: 45px;
                        position: absolute;
                        top: -0.03rem;
                      }
                      .replenish-btn {
                        width: 0.8rem;
                        height: 0.34rem;
                        background: linear-gradient(
                          270deg,
                          #e6231d 0%,
                          #ff7863 100%
                        );
                        opacity: 0.6;
                        border-radius: 4px;
                        font-size: 0.2rem;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #ffffff;
                        line-height: 0.34rem;
                        cursor: pointer;
                        margin: 0 auto;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .content-text {
          margin: 0.32rem;
          padding: 0.32rem;
          background: #ffffff;
          box-shadow: 0px 24px 24px -16px rgba(15, 15, 15, 0.1);
          border-radius: 4px;
          h1 {
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
            line-height: 20px;
          }
          h2 {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 17px;
            margin-bottom: 21px;
          }
          p {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 24px;
            margin-bottom: 12px;
          }
        }
      }
    }
    .blind-wrap {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 9999;
      .content {
        width: 375px;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        img {
          image-rendering: -moz-crisp-edges; /* Firefox */
          image-rendering: -o-crisp-edges; /* Opera */
          image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
          image-rendering: crisp-edges;
          -ms-interpolation-mode: nearest-neighbor;
        }
        img:nth-child(1) {
          width: 375px;
          height: 525px;
          border-radius: 4px;
          margin-bottom: 20px;
          @media screen and (min-width: 0px) and (max-width: 540px) {
            width: 6rem;
            height: 8.4rem;
          }
        }
        img:nth-child(2) {
          width: 26px;
          height: 26px;
          margin: 0 auto;
          cursor: pointer;
        }
        @media screen and (min-width: 0px) and (max-width: 540px) {
          width: 6rem;
        }
      }
      .hide-content {
        animation: content_hide 1s infinite;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
      }
    }
    .dialog {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 9999;
      .container {
        width: 480px;
        height: 216px;
        background: #ffffff;
        border-radius: 6px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .title {
          position: absolute;
          top: 20px;
          left: 20px;
          font-size: 20px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #2d2f33;
        }
        .content {
          position: absolute;
          top: 78px;
          left: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #45494d;
          line-height: 24px;
        }
        img {
          width: 14px;
          height: 14px;
          position: absolute;
          top: 27px;
          right: 20px;
          cursor: pointer;
        }
        .button {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          line-height: 36px;
          text-align: center;
          .submit-btn {
            width: 90px;
            height: 36px;
            background: linear-gradient(270deg, #e6231d 0%, #ff7863 100%);
            border-radius: 18px;
            position: absolute;
            right: 20px;
            bottom: 20px;
            color: #ffffff;
            cursor: pointer;
          }
        }
        @media screen and (min-width: 0px) and (max-width: 540px) {
          width: 343px;
        }
      }
    }
  }
}
</style>
