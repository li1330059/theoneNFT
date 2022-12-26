<template>
  <div class="blind-wrap" v-if="show">
    <div class="content" :class="{ 'hide-content': hide_content }">
      <div class="letter-wrap">
        <div class="draw-wrap">
          <img class="gif" :src="gif_img" alt="gif" v-if="!show_letter" />
          <div v-else>
            <div class="envelope-wrap">
              <img
                class="ribbon"
                src="//static.theone.art/pc/category/ribbon.png"
              />
              <img
                class="back"
                src="//static.theone.art/pc/category/letter-back.png"
              />
              <img
                class="letter"
                :class="{ 'letter-move': letter_move }"
                :src="
                  (order_info.commoditySku && order_info.commoditySku.cover) ||
                  '//static.theone.art/pc/category/letter-img.png'
                "
              />
              <img
                class="front"
                src="//static.theone.art/pc/category/letter-front.png"
              />
            </div>
            <div class="txt-wrap" @click="OnAccept">
              <div class="btn">{{ isDraw ? "确定" : "收下" }}</div>
              <div v-if="!isDraw">
                <div class="title">恭喜获得</div>
                <div class="des">
                  {{ order_info.commoditySku && order_info.commoditySku.name }}
                </div>
              </div>

              <!-- <div class="number">
                {{
                  order_info.commoditySku && order_info.commoditySku.number
                }}/{{
                  order_info.commoditySku &&
                  order_info.commoditySku.amountNumber
                }}
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      letter_move: false,
      show_letter: false, //是否显示信
      hide_content: false,
      order_info: { commoditySku: {} }, //商品信息
    };
  },
  props: {
    gif_img: {
      type: String,
      default:
        "//static.theone.art/pc/category/blind-box.gif",
    },
    letterMove() {
      this.letter_move = true;
    },
  },
  computed: {
    isDraw() {
      if(this.order_info.commoditySku && this.order_info.commoditySku.name.search('中签')!==-1){
        return true
      }
      return false
    },
  },

  created() {},
  methods: {
    init() {
      this.show = true;
    },
    showLetter(order_info) {
      this.order_info = JSON.parse(JSON.stringify(order_info));
       console.log(this.order_info);
    this.show_letter = true;
    },
    hide() {
      this.show = false;
      this.letter_move = false;
      this.show_letter = false;
      this.hide_content = false;
    },
    OnAccept() {
      this.letter_move = true;
      setTimeout(() => {
        this.hide_content = true;
        setTimeout(() => {
          this.hide();
          if (this.$parent.update) {
            this.$parent.update(this.order_info);
          }
        }, 1000);
      }, 1600);
    },
  },
};
</script>
<style lang="scss" scoped>
.blind-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999;
  .content {
    display: flex;
    padding-top: 60vh;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .hide-content {
    animation: content_hide 1s infinite;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }
}
.draw-wrap {
  position: relative;
  top: 0;
  left: 0;
  min-width: 260px;

  img {
    display: block;
    position: absolute;
    width: 100%;
  }
  .front {
    bottom: -3px;
    width: 104%;
    margin: 0 -2%;
    z-index: 1000;
  }
  .back {
    bottom: 0;
    z-index: 800;
  }
  .ribbon {
    bottom: 160px;
    margin: 0 -20%;
    width: 140%;
    z-index: 700;
  }
  .letter {
    bottom: 100px;
    width: 80%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 900;
  }
  .letter-move {
    animation: move 2s infinite;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }
  .gif {
    bottom: 0;
    width: 140%;
    margin: 0 -20%;
  }
}
.txt-wrap {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding-bottom: 15px;
  cursor: pointer;
  z-index: 1001;
  .btn {
    line-height: 30px;
    background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
    border-radius: 50px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    width: 96px;
    margin: 0 auto;
  }
  .title {
    font-size: 14px;
    color: #000000;
    margin-top: 16px;
  }
  .des {
    margin-top: 4px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.7);
  }
  .number {
    font-size: 10px;
    font-weight: 600;
    color: #e7aa71;
    text-align: center;
    margin-top: 8px;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("//static.theone.art/pc/icons/pic_icon_bianhao.png");
    background-position: center;
    padding: 0 0 0 16px;
  }
}
@keyframes move {
  0% {
    transform: translateY(0) translateX(-50%) scale(1);
  }
  2% {
    border-radius: 100px;
  }
  50% {
    border-radius: 100px;
    transform: translateY(-260px) translateX(-50%) scale(0.7);
  }
  100% {
    z-index: 100;
    border-radius: 100px;
    transform: translateY(100px) translateX(-50%) scale(0);
  }
}
@keyframes content_hide {
  0% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }

  100% {
    opacity: 0;
    transform: rotate(700deg) scale(0.2);
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .blind-wrap {
    .content {
      padding-top: 66vh;
    }
  }
}
</style>
