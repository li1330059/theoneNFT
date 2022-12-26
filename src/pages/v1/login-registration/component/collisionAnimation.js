
let is_start = false;//保持单例模式
function collisionAnimation({ id, imgs }) {
  let animation_id = '';
  let balls = [];
  function start() {
    balls = []

    for (let i = 0; i < imgs.length; i++) {
      const img_info = imgs[i];
      balls.push(new ball({
        id,

        friction: 1 + Math.random() * 1,

        ball_w: 30,
        ball_h: 30,
        x_friction: 1 + Math.random() * .6,
        src: img_info.src
      }));
    }
    is_start = true;
    update();
  }
  if (window.innerWidth > 540) {
    start()
  }


  function update() {
    cancelAnimationFrame(animation_id);
    balls.forEach(function (ball) {
      ball.move();
    });
    animation_id = requestAnimationFrame(update);
  }

  function initBalls() {
    if (window.innerWidth <= 540) {
      balls.forEach(function (ball) {
        is_start = false;
        ball.destory();
      });
      balls = [];
    } else {
      if (!is_start) {
        start()
      }

      balls.forEach(function (ball) {
        ball.upBoundary();

      });
    }
  }

  window.addEventListener('resize', initBalls,false);

  return () => {
    window.removeEventListener('resize',initBalls,false)
  }
}
class ball {
  constructor({ id, src, friction, x_friction, steps }) {
    const self = this;
    this.opt = {
      id,
      w: 30,
      h: 30,
      rotation: 5,
      src,
      friction,
      steps,
      siner: 100 * Math.random()
    }
    this.scale = 0.5 + Math.random();
    this.upBoundary();
    this.pos = {//小球位置
      y: this.y_max * Math.random(),
      x: this.x_max * Math.random()
    }
    this.x_friction = x_friction || Math.sin(this.pos.x * Math.PI / this.opt.steps) * this.opt.siner;
    this.render();
  }
  upBoundary() {
    this.box_pos = document.querySelector(this.opt.id).getBoundingClientRect();
    this.y_max = this.box_pos.height - this.opt.h;
    this.x_max = this.box_pos.width - this.opt.w;
  }
  destory() {
    this.item.remove();
  }
  move() {
    this.pos.y = this.pos.y - this.opt.friction;
    this.pos.x = this.pos.x - this.x_friction;
    let top = this.pos.y
    let left = this.pos.x;
    if (top <= 0) {
      top = 0;
      this.opt.friction = -this.opt.friction;
    }
    if (top >= this.y_max) {
      this.pos.y = this.y_max + this.opt.friction;
      this.opt.friction = -this.opt.friction;
    }
    if (left <= 0) {
      left = 0;
      this.x_friction = -this.x_friction;
    }
    if (left >= this.x_max) {
      this.pos.x = this.x_max + this.x_friction;
      this.x_friction = -this.x_friction;
    }
    this.item.style.transform = `translateX(${left}px) translateY(${top}px) scale(${this.scale})`;
    return true;
  }
  render() {
    const opt = this.opt;
    const ball_img = document.createElement('div');
    ball_img.style.transform = `translateX(${this.pos.x}px) translateY(${this.pos.y}px)`;

    ball_img.style.backgroundImage = `url(${opt.src})`;
    /*   ball_img.style.backgroundColor = 'red'; */
    ball_img.style.width = `${opt.w}px`;
    ball_img.style.height = `${opt.h}px`;
    ball_img.style.backgroundRepeat = 'no-repeat';
    ball_img.style.backgroundSize = 'contain';
    ball_img.style.position = 'absolute';
    ball_img.style.top = '0';
    ball_img.style.left = '0';
    ball_img.style.zIndex = '999';
    this.item = ball_img;
    document.querySelector(opt.id).appendChild(ball_img);
    /*   return {
        width: div.getBoundingClientRect().width,
        height: div.getBoundingClientRect().height
      }; */
  }
}
export default collisionAnimation