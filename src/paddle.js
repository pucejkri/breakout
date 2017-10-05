// Pad.js

/** @class Padel3
  * The paddle in a Breakout game
  */
export default class Paddle {
  constructor(x, w, windowW, windowH) {
    this.x = x;
    this.dx = 0;
    this.ddx = 0;
    this.ddxSet = 0.02;
    this.dxMax = 1
    this.width = w;
    this.height = 10;
    this.brake = false;
    this.windowWidth = windowW;
    this.windowHeight = windowH;
    this.direction = 'none';
    // Bind class methods
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.getPos = this.getPos.bind(this);
    this.getSize = this.getSize.bind(this);
    this.getSpeed = this.getSpeed.bind(this);
    this.bounce = this.bounce.bind(this);
    this.checkWallHit = this.checkWallHit.bind(this);
  }

  getPos() {
    return this.x;
  }

  getSize() {
    return {w: this.width, h: this.height}
  }

  getSpeed() {
    return this.dx;
  }

  update(input) {
    if(input.position != null) {
      this.x = input.position;
    }
    this.direction = input.direction;
    switch(this.direction) {
      case 'right':
        if (this.x < 0) break;
        this.ddx = this.ddxSet;
        this.brake = false;
        this.switch = true
        break;
      case 'left':
        if (this)
        this.ddx = -this.ddxSet;
        this.brake = false;
        this.switch = true;
        break;
      default:
        this.brake = true;
        break;
    }
    if(this.brake && this.switch) {
      this.ddx = -this.ddx;
      this.switch = false;
    }
    if((Math.abs(this.dx) < this.dxMax || this.dx*this.ddx < 0)) {
      if(!this.brake || (Math.abs(this.dx) > 0 && this.dx*this.ddx < 0)) {
        this.dx += this.ddx;
      } else {
        this.dx = 0;
      }
    }
    this.checkWallHit();
    this.x += this.dx;
  }

  bounce() {
    this.dx = -this.dx;
    this.ddx = -this.ddx;
  }

  checkWallHit() {
		if (this.x <= 0 || (this.x + this.width) >= this.windowWidth) {
		  this.bounce();
    }
	}

  /** @function render
    * Render the paddle
    */
  render(ctx) {
    ctx.save();
    ctx.fillStyle = "#0095DD";
    ctx.fillRect(this.x, this.windowHeight-this.height, this.width, this.height);
    ctx.restore();
  }
}
