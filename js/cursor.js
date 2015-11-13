/**
 * Class that contains the cursor used in the game. Self-explanatory for the
 * most part.
 */

function Cursor() {
	this.imageObject = new ImageObject ("images/cursor.png");
	this.x = 0;
	this.y = 0;
} Cursor.prototype.coor = function () {
	return new Coor(this.x, this.y);
}; Cursor.prototype.draw = function () {
	this.imageObject.drawOnGrid(cursor.coor());
}; Cursor.prototype.coorOnScreen = function () {
    return this.coor().screenify();
}; Cursor.prototype.up = function () {
    if(cursor.y != 0) {   //if the cursor isn't in the top row
        cursor.y -= 1;  //when you're going up, you're always decreasing the y value
    }
}; Cursor.prototype.down = function () {
    if(cursor.y != grid.height - 1) {
        cursor.y += 1;
    }
}; Cursor.prototype.left = function () {
    if(cursor.x != 0) {
        cursor.x -= 1;
    }
}; Cursor.prototype.right = function () {
    if(cursor.x != grid.width - 1) {
        cursor.x += 1;
    }
}; Cursor.prototype.jumpTo = function (coor) {
    this.x = coor.x;
    this.y = coor.y;
}; cursor = new Cursor();