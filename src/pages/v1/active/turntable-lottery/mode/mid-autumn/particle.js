class Particle {
  constructor(dom, svg, coordinates, domP, friction, end, siner) {
    this.dom = dom;
    this.svg = svg;
    this.steps = document.documentElement.clientHeight / 2;
    this.item = null;
    this.friction = friction;
    this.coordinates = coordinates;
    this.position = this.coordinates.y;
    this.dimensions = domP;
    this.rotation = 0;
    this.scale = 1;
    this.siner = siner;
    this.render();
    this.end = end;
  }

  destroy() {
    /*    this.item.remove(); */
  }

  move() {
    this.position = this.position - this.friction;
    let top = this.position;
    let left =
      this.coordinates.x +
      Math.sin((this.position * Math.PI) / this.steps) * this.siner;
    this.item.style.transform =
      "translateX(" + left + "px) translateY(" + top + "px)";
    if (this.position < document.body.clientHeight * 0.2) {
      this.destroy();
      this.end();
      return false;
    } else if (
      this.position <
      this.coordinates.y / 2 - this.dimensions.height / 1.5
    ) {
      this.item.style.opacity = Number(this.item.style.opacity) - 0.06;
      return true;
    } else {
      return true;
    }
  }

  render() {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = this.svg;
    var div = wrapper.firstChild;
    div.style.transform =
      "translateX(" +
      this.coordinates.x +
      "px) translateY(" +
      this.coordinates.y +
      "px)";
    div.style.opacity = 1;

    this.item = div;

    wrapper.remove();
    document.querySelector(this.dom).appendChild(div);
    return {
      width: div.getBoundingClientRect().width,
      height: div.getBoundingClientRect().height,
    };
  }
}

export { Particle };
