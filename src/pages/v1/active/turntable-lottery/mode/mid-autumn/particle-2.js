class Particle {
  constructor(svg, coordinates, friction, dom) {
    this.dom = dom;
    this.svg = svg;
    this.steps = document.documentElement.clientHeight / 2;
    this.item = null;
    this.friction = friction;
    this.coordinates = coordinates;
    this.position = this.coordinates.y;
    this.dimensions = this.render();
    this.rotation = Math.random() > 0.5 ? "-" : "+";
    this.scale = 0.5 + Math.random();
    this.siner = 400 * Math.random();
  }

  destroy() {
    this.item.remove();
  }

  move() {
    this.position = this.position - this.friction;
    let top = this.position;
    let left = Math.sin((this.position * Math.PI) / this.steps) * this.siner;
    this.item.style.transform = ` scale(${this.scale}) rotate(${
      this.rotation + this.position + this.dimensions.height
    }deg)`;
    this.item.style.position = "absolute";
    this.item.style.top = `${top}px`;
    this.item.style.left = `${left}px`;

    /*    "translateX(" +
      left +
      "px) translateY(" +
      top +
      "px) scale(" +
      this.scale +
      ") rotate(" +
      this.rotation +
      (this.position + this.dimensions.height) +
      "deg)"; */

    if (this.position < -this.dimensions.height) {
      this.destroy();
      return false;
    } else {
      return true;
    }
  }

  render() {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = this.svg;
    var div = wrapper.firstChild;
    div.style.position = "absolute";
    div.style.top = `${this.coordinates.y}px`;
    div.style.left = `${this.coordinates.x}px`;
    div.style.zIndex = random();
    div.style.opacity = Math.random().toFixed(1);
    /*     div.style.transform =
      "translateX(" +
      this.coordinates.x +
      "px) translateY(" +
      this.coordinates.y +
      "px)"; */
    this.item = div;
    wrapper.remove();
    document.querySelector(this.dom).appendChild(div);
    return {
      width: div.getBoundingClientRect().width,
      height: div.getBoundingClientRect().height,
    };
  }
}
function random(min, max) {
  return Math.floor(Math.random() * 13) - 3;
}
export { Particle };
