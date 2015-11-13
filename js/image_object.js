/**
 * ImageObject encapsulates the necessary functions to load and print an
 * image. Only after an image loads does it actually display on the screen.
 * If an image does not load, you can assume either image is missing or name
 * is misspelled. (when you set the src for an image, it begins loading)
 */
function ImageObject (imagePath) {
	this.image = new Image();
	this.image.ready = false;
	this.image.onload = function () {
		this.ready = true;
	}
	this.image.src = imagePath;
} ImageObject.prototype.draw = function (x, y) {
    /**
     * Draws self with upper-left corner at x, y.
     * TODO: Should not draw if not on canvas or not on VBA screen (if relevant)
     */
	if (this.image.ready) {
		context.drawImage(this.image, x, y);
	}
}; ImageObject.prototype.drawScaled = function (x, y, width, height) {
	//TODO: Should not draw if not on canvas or not on VBA screen (if relevant)
	if (this.image.ready) {
		context.drawImage(this.image, x, y, width, height);
	}
}; ImageObject.prototype.drawWithDisplacement = function (x, y, displaceX, displaceY) {
    /**
     * Draws with displacement.
     */
	this.draw(x + displaceX, y + displaceY);
}; ImageObject.prototype.drawOnScreen = function (x, y) {
	this.drawWithDisplacement(x, y, 10, 40);
}; ImageObject.prototype.drawOnGrid = function (coor) { // draws the background?
	this.drawOnScreen((coor.x - grid.xDisplace) * CONSTANTS.tileWidth, (coor.y - grid.yDisplace) * CONSTANTS.tileWidth); //KAR is this making the background?
}; ImageObject.prototype.drawOnScreenScaled = function (x, y, width, height) {
	this.drawScaled(x + 10, y + 40, width, height);
};