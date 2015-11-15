function Grid () {
    this.grid = [];
	this.width = 15;  this.height = 10;
	this.xDisplace = 0;  this.yDisplace = 0;
	this.selectedUnit = null;
	data = [[0, 0, 4, 1, 0, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
        [2, 3, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 3, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 4, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 4, 0, 0, 4, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 4],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]];
    this.grid = [];
    for (i = 0; i < this.width; i++) {
        this.grid.push([]);
        for (j = 0; j < this.height; j++) {
            this.grid[i].push(new Tile(data[j][i]));
        }
    }
    this.placeUnitAt(units[0], 4, 4);
    this.placeUnitAt(units[1], 4, 5);
    this.placeUnitAt(units[2], 8, 6);
	this.placeUnitAt(units[3], 9, 6);
    this.placeUnitAt(units[4], 10, 8);
} Grid.prototype.placeUnitAt = function (unit, x, y) {
	if (this.grid[unit.x][unit.y].unit == unit) {
		this.grid[unit.x][unit.y].unit = null;
	}
	unit.x = x;
	unit.y = y;
	this.grid[x][y].unit = unit;
}; Grid.prototype.unitAt = function (coor) {
	return this.grid[coor.x][coor.y].unit;
}; Grid.prototype.tileAt = function (coor) {
	return this.grid[coor.x][coor.y];
}; Grid.prototype.tileOnScreen = function (coor) {
	return this.grid[coor.x + this.xDisplace][coor.y + this.yDisplace];
}; Grid.prototype.unitOnScreen = function (coor) {
	return this.grid[coor.x + this.xDisplace][coor.y + this.yDisplace].unit;
}; Grid.prototype.iterateScreen = function (runnable) {
	for (i = 0; i < CONSTANTS.mapWidth; i++) {
		for (j = 0; j < CONSTANTS.mapHeight; j++) {
			runnable(new Coor(i, j));
		}
	}
}; Grid.prototype.adjust = function () {
    if (grid.yDisplace > 0 && cursor.y - grid.yDisplace == 2) {
        grid.yDisplace--;
    }
    if (grid.yDisplace < grid.height - CONSTANTS.mapHeight && cursor.y - grid.yDisplace == CONSTANTS.mapHeight - 3) {
        grid.yDisplace++;
    }
    if (grid.xDisplace > 0 && cursor.x - grid.xDisplace == 2) {
        grid.xDisplace--;
    }
    if (grid.xDisplace < grid.width - CONSTANTS.mapWidth && cursor.x - grid.xDisplace == CONSTANTS.mapWidth - 3) {
        grid.xDisplace++;
    }
};