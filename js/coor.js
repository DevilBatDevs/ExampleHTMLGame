/**
 * Class that encapsulates coordinates. Screenify and unscreenify change
 * the displacements from the top left of the screen to the top left of the
 * entire map.
 */
function Coor (x, y) {
	this.x = x;
	this.y = y;
} Coor.prototype.equals = function (coor) {
	if (coor instanceof Coor) return this.x == coor.x && this.y == coor.y;
	return false;
}; Coor.prototype.unscreenify = function () {
	return new Coor(this.x + grid.xDisplace, this.y + grid.yDisplace);
}; Coor.prototype.screenify = function () {
	return new Coor(this.x - grid.xDisplace, this.y - grid.yDisplace);
};
/**
 * We hash coordinates to integers so that we can store them in arrays and
 * use array methods without programming our own. As long as x and y are both
 * between 0 and 999 inclusive, the coordinates and the hash are 1-to-1
 */
function hashCoor (coor) {
	return coor.x * 1000 + coor.y;
}
function unhashCoor (hashedCoor) {
	return new Coor(parseInt(hashedCoor / 1000), hashedCoor % 1000);
}