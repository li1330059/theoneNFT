<template>
  <transition name="fade">
    <div
      class="animate-body"
      id="animate-wrap"
      ref="animateWrapRef"
      v-if="isShow"
    ></div>
  </transition>
</template>
<script>
import { Particle } from "./particle";
import { Particle as Particle2 } from "./particle-2";
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export default {
  components: {},
  data() {
    return {
      isShow: false,
    };
  },
  props: {
    dataJson: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {},
  created() {
    /*     this.$nextTick(()=>{
      this.start();

    }) */
  },
  watch: {
    isShow(v) {
      if (v) {
        const scrollTop =
          document.documentElement.scrollTop ||
          window.pageYOffset ||
          document.body.scrollTop;
        this.scrollTop = scrollTop;
        document.body.style["overflowY"] = "hidden";
        document.body.style["height"] = "100vh";
        document.querySelector("html").style["height"] = "100vh";
        document.querySelector("html").style["overflowY"] = "hidden";
      } else {
        clearInterval(this.timer);
        setTimeout(() => {
          document.querySelector("html").style["height"] = "inherit";
          document.querySelector("html").style["overflowY"] = "inherit";
          document.body.style["overflowY"] = "inherit";
          document.body.style["height"] = "inherit";
          document.documentElement.scrollTop = this.scrollTop;
        }, 200);
      }
    },
  },
  methods: {
    play() {
      this.isShow = true;
      this.$nextTick(() => {
        let width = 360;
        let pos = 4.2; //速率

        let siner = 209; //偏移

        if (this.$common.isMobile()) {
          width = 200;
          pos = 5 + Math.random() * 2;
          siner = 100 * (Math.random() + 0.4);
        }
        const domP = this.$refs.animateWrapRef.getBoundingClientRect();
        const data = [
          `<div id="mid-autumn-box" style="width:${width}px;position:relative;top:0;left:0;"><img
        style="width:${width}px"
      class="img-block"
      src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/mid/lantern.png"
    /></div>`,
        ];
        let particles = [
          new Particle(
            "#animate-wrap",
            data[randomInt(0, data.length - 1)],
            {
              x: domP.width / 2 - width / 2,
              y: domP.height,
            },
            {
              width: width,
              height: width,
            },
            pos,
            this.end,
            siner
          ),
        ];

        function update() {
          particles = particles.filter(function (p) {
            return p.move();
          });
          requestAnimationFrame(update);
        }
        update();
        this.createRound(width);
      });
    },
    createRound(width) {
      clearInterval(this.timer);
      const data = [
        `<img
        style="width:${40}px"
      src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/mid/icon-round.png"
    />`,
      ];
      let particles = [];
      let num = 4;
      let r = 1 + Math.random() * 6;
      if (this.$common.isMobile()) {
        r = 0.6 + Math.random() * 5;
        num = 4;
      }
      for (let i = 0; i < num; i++) {
        particles.push(
          new Particle2(
            data[0],
            {
              x: Math.random() * width,
              y: width,
            },
            r,
            "#mid-autumn-box"
          )
        );
      }

      this.timer = setInterval(() => {
        particles.push(
          new Particle2(
            data[0],
            {
              x: Math.random() * width,
              y: width,
            },
            1 + Math.random() * 3,
            "#mid-autumn-box"
          )
        );
      }, 500);

      function update() {
        particles = particles.filter(function (p) {
          return p.move();
        });
        requestAnimationFrame(update);
      }
      update();
    },
    end() {
      this.isShow = false;
      this.$emit("listenEnd");
    },
  },
};
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.img-block {
  display: block;
  width: 358px;
}
.animate-body {
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(5px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  overflow: hidden;
}
</style>
