export default class Tile
{
	constructor(x, y, state) {
		this.x = x;
		this.y = y;
		this.width = 48;
		this.height = 10;
		this.state = state;
		this.render = this.render.bind(this);
		this.getPos = this.getPos.bind(this);
		this.getState = this.getState.bind(this);
		this.getWidth = this.getWidth.bind(this);
		this.getHeight = this.getHeight.bind(this);
		this.update = this.update.bind(this);
	}

	getPos() {
		return {x: this.x, y: this.y};
	}

	getState() {
		return this.state;
	}

	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
	}

	update() {
		this.state -= 1;
	}

	render(ctx) {
		ctx.save();
		switch(this.state) {
			case 1:
				ctx.fillStyle = '#0095DD';
				break;

			case 2:

				break;

			case 3:

				break;

			case 4:

				break;

			case 5:

				break;
		}
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.strokeStyle = 'black';
		ctx.strokeRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}

}
