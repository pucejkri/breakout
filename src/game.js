// game.js

import Paddle from './paddle';
import Tile from './tile';
import Ball from './ball';

/** @class Game
  * Represents a Breakout game
  */
export default class Game {
  constructor() {
    this.width = 480;
    this.height = 320;
    this.tileRowCnt = 6;
    this.tileColumnCnt = 1;
    this.over = false;
    this.victory = false;
    this.tiles = [];
    this.balls = 1;
    this.score = 0;
    this.songPlayed = false;
    for(var c=0; c<this.tileColumnCnt; c++) {
        this.tiles[c] = [];
        for(var r=0; r<this.tileRowCnt; r++) {
            this.tiles[c][r] = new Tile(48*c, 50 + 10*r, 1);
        }
    }
    this.gong = new Audio('sounds/Gong.wav');
    this.trombone = new Audio('sounds/trombone.wav');
    this.cena = new Audio('sounds/cena.mp3');
    this.input = { direction: 'none', position: null};
    this.mouseX = 0;
    // Create the back buffer canvas
    this.backBufferCanvas = document.createElement('canvas');
    this.backBufferCanvas.width = this.width;
    this.backBufferCanvas.height = this.height;
    this.backBufferContext = this.backBufferCanvas.getContext('2d');
    // Create the screen buffer canvas
    this.screenBufferCanvas = document.createElement('canvas');
    this.screenBufferCanvas.width = 480;
    this.screenBufferCanvas.height = 320;
    document.body.appendChild(this.screenBufferCanvas);
    this.screenBufferContext = this.screenBufferCanvas.getContext('2d');
    // Bind class methods
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.loop = this.loop.bind(this);
    this.initGame = this.initGame.bind(this);
    this.reload = this.reload.bind(this);
    this.countScore = this.countScore.bind(this);
    this.renderScore = this.renderScore.bind(this);
    this.renderBalls = this.renderBalls.bind(this);
    this.renderOver = this.renderOver.bind(this);

    window.onkeydown = this.keyDownHandler.bind(this);
    window.onkeyup = this.keyUpHandler.bind(this);
    //window.onmousemove = this.mouseMoveHandler.bind(this);
    this.initGame();
    // Start the game loop
    this.interval = setInterval(this.loop, 3)
  }

  initGame() {
    this.gong.play();
    this.paddle = new Paddle(this.width/2 - 30, 60, this.width, this.height);
    this.ball = new Ball(this.width/2 - 5, this.height - 10 - 10, this.width, this.height);
    this.ballReleased = false;
  }

  reload() {
    this.over = false;
    this.victory = false;
    this.tiles = [];
    this.balls = 2;
    this.score = 0;
    for(var c=0; c<this.tileColumnCnt; c++) {
        this.tiles[c] = [];
        for(var r=0; r<this.tileRowCnt; r++) {
            this.tiles[c][r] = new Tile(48*c, 50 + 10*r, 1);
        }
    }
    this.input = { direction: 'none', position: null};
    this.initGame();
    this.songPlayed = false;
  }

  countScore() {
    var cnt = 0
    this.tiles.forEach((row) => {
      row.forEach((tile) => {
        if (tile.getState() === 0) {
          cnt += 1;
        }
      })
    })
    return cnt;
  }

  keyDownHandler(event) {
    event.preventDefault();
    var code = event.keyCode
    if(code === 39) {
      this.input.direction = 'right';
    }
    else if(code === 37) {
      this.input.direction = 'left';
    }
  }

  keyUpHandler(event) {
    event.preventDefault();
    var code = event.keyCode
    if(code === 39 || code === 37) {
      this.input.direction = 'none';
    } else if(code === 38 || code === 32) {
      this.ballReleased = true;
    }
  }

  mouseMoveHandler(event) {
    event.preventDefault;
    var relativeX = event.clientX - this.screenBufferCanvas.offsetLeft;
    if(relativeX > 0 && relativeX < this.screenBufferCanvas.width && relativeX !== this.mouseX) {
      this.input.position = relativeX-30;
      this.mouseX = relativeX;
    }
  }

  update(input) {
    if(this.over) return;
    if (this.ball.getDead()) {
      if (this.balls > 0) {
        this.initGame();
        this.balls -= 1;
      } else {
        this.over = true;
        window.addEventListener('keyup', ()=>{
          this.reload();
        }, {once: true})
      }
    }
    if(this.score === (this.tileRowCnt * this.tileColumnCnt)){
      this.victory = true;
      this.over = true;
      window.addEventListener('keyup', ()=>{
        this.reload();
      }, {once: true})
    }
    this.paddle.update(input);
    this.ball.update(this.paddle.getPos(), this.paddle.getSpeed(), this.paddle.getSize(), this.ballReleased, this.tiles);
    this.input.position = null;
    this.score = this.countScore();

  }

  renderScore(ctx) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+this.score, 8, 20);
  }

  renderBalls(ctx) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Balls: "+this.balls, this.width-65, 20);
  }

  renderOver(ctx) {
    var text = '';
    if(this.victory){
      text = '  You won! '
      if (!this.songPlayed) {
        this.cena.play();
        this.songPlayed = true;
      }
      ctx.fillStyle = 'red';
    } else {
      text = 'Game over!'
      if (!this.songPlayed) {
        this.trombone.play();
        this.songPlayed = true;
      }
      ctx.fillStyle = 'black';
    }
    ctx.globalAlpha = 0.7;
    ctx.fillRect(0,0,this.width,this.height);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "ivory";
    ctx.font = '60px Arial';
    ctx.fillText(text, 80, 150);
    ctx.font = '40px Arial';
    ctx.fillText("Your score: " + this.score.toString(), 120, 230);
    ctx.font = '20px Arial';
    ctx.fillText("-Press any key for new game-", 110, 300);
    return;
  }

  render() {
    this.backBufferContext.fillStyle = '#ccc';
    this.backBufferContext.fillRect(0, 0, 480, 320);
    this.renderScore(this.backBufferContext);
    this.renderBalls(this.backBufferContext);
    this.paddle.render(this.backBufferContext);
    this.ball.render(this.backBufferContext);
    this.tiles.forEach((row) => {
      row.forEach((tile) => {
        if (tile.getState() > 0) {
          tile.render(this.backBufferContext);
        }
      })
    })
    if (this.over) {
      this.renderOver(this.backBufferContext);
    }
    // Flip buffers
    this.screenBufferContext.drawImage(this.backBufferCanvas, 0, 0)

  }
  loop() {
    this.update(this.input);
    this.render();
  }
}
