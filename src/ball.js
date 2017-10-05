export default class Ball
{
	constructor(x, y, windowW, windowH) {
    this.size = 10;
    this.windowWidth = windowW;
    this.windowHeight = windowH;
    this.fire = true;
    this.bounced = false;
    this.dead = false;
		this.x = x;
		this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.jab = new Audio('sounds/Jab.wav');
    this.punch = new Audio('sounds/Punch.wav');

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.getPos = this.getPos.bind(this);
    this.checkDeath = this.checkDeath.bind(this);
    this.getDead = this.getDead.bind(this);
    this.checkWallHit = this.checkWallHit.bind(this);
    this.checkPaddleHit = this.checkPaddleHit.bind(this);
    this.checkTileHit = this.checkTileHit.bind(this);
    this.bounce = this.bounce.bind(this);
	}

	update(px, pdx, psize, released, tiles) {
    if(released && this.fire) {
      this.dx = pdx/2;
      this.dy = -1 + Math.abs(pdx/2);
      this.fire = false;
    } else if (this.fire) {
      this.x = px + 25;
    }
    this.checkDeath();
    this.checkWallHit();
    this.checkPaddleHit(px, pdx, psize.w, psize.h);
    this.checkTileHit(tiles);
    this.x += this.dx;
    this.y += this.dy;
	}

  getPos() {
    return {x: this.x, y: this.y};
  }

  getDead() {
    return this.dead;
  }

  bounce(bounceDir) {
    switch(bounceDir) {
      case 'right':
        this.dx = -this.dx;
        break;
      case 'left':
        this.dx = -this.dx;
        break;
      case 'down':
        this.dy = -this.dy;
        break;
      case 'up':
        this.dy = -this.dy;
        break;
    }
  }

  checkWallHit() {
		var bounceDir = '';
		if (this.x <= 0) {
			bounceDir = 'right';
      this.jab.play();
      this.bounced = true;
    }
		if (this.x + this.size >= this.windowWidth) {
			bounceDir = 'left';
      this.jab.play();
      this.bounced = true;
    }
		if (this.y <= 0) {
			bounceDir = 'down';
      this.jab.play();
      this.bounced = true;
    }
		this.bounce(bounceDir);
	}

  checkDeath() {
    if (this.y >= this.windowHeight) {
      this.dead = true;
    }
  }

  checkPaddleHit(px, pdx, pw, ph) {
		if (this.dy === 0)
			return;

    var yTop = this.y + this.size - this.windowHeight + ph - 1;
		if ((this.x + this.size) > px && this.x < (px + pw) && yTop >= 0 && yTop < 1 && this.dy > 0 && this.bounced) {
      this.bounced = false;
      var tmpdx = this.dx;
			this.dx = this.dx + pdx/2;
      if(this.dx > 0.9) {
        this.dx = 0.9;
      }
      if(this.dx < -0.9) {
        this.dx = -0.9;
      }
			this.bounce('up');
      this.punch.play();
      this.dy = this.dy - Math.abs(tmpdx) + Math.abs(this.dx);
		}
	}

	checkTileHit(tiles) {
    tiles.forEach((row) => {
      row.forEach((tile) => {
        if(tile.getState() > 0) {
          var tPos = tile.getPos();
          var tW = tile.getWidth();
          var tH = tile.getHeight();

          // top or bottom hit
          var xLeft = this.x + this.size - tPos.x;
          var xRight = tPos.x + tW - this.x;
          var yBottom = this.y - tPos.y - tH;
          var yTop = tPos.y - this.size - this.y;
          if (xLeft > 0 && xRight > 0) {
            // bottom hit
            if (yBottom <= 0 && yBottom > -1 && this.dy < 0) {
              this.bounce('down');
              this.bounced = true;
              this.jab.play();
              tile.update();
              return;
            }
            // top hit
            if (yTop <= 0 && yTop > -1 && this.dy > 0) {
              this.bounce('up');
              this.bounced = true;
              this.jab.play();
              tile.update();
              return;
            }
          }
          // left or right hit
          if (yTop < 0 && yBottom < 0) {
            // right hit
            if (xRight >= 0 && xRight < 1 && this.dx < 0) {
              this.bounce('left');
              this.bounced = true;
              this.jab.play();
              tile.update();
              return;
            }
            // left hit
            if(xLeft >= 0 && xLeft < 1 && this.dx > 0 ) {
              this.bounce('right');
              this.bounced = true;
              this.jab.play();
              tile.update();
              return;
            }
          }
        }
      })
    })
	}

	render(ctx) {
		ctx.save();
		ctx.fillStyle = 'red';
		ctx.fillRect(this.x, this.y, 10, 10);
		ctx.restore();
	}

}
