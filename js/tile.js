function Tile (terrainType) {
	//this.walkable = walkable; // sets the terrain's traversible field to the value inputted, walkable or not walkable so you can toggle whether or not a character can go somewhere?
	this.unit = null;  //each tile has a unit
    this.type = terrainType;  // numeric representation of the type
    switch (this.type) {
        case 0:
            this.name = "Plain";
            this.walkable = true;
            this.flyable = true;
            this.defense = 0;
            this.avoid = 0;
            break;
        case 1:
            this.name = "Peak";
            this.walkable = false;
            this.flyable = true;
            this.defense = 2;
            this.avoid = 40;
            break;
        case 2:
            this.name = "River";
            this.walkable = false;
            this.flyable = true;
            this.defense = 0;
            this.avoid = 0;
            break;
        case 3:
            this.name = "Bridge";
            this.walkable = true;
            this.flyable = true;
            this.defense = 0;
            this.avoid = 0;
            break;
        case 4:
            this.name = "Forest";
            this.walkable = true;
            this.flyable = true;
            this.defense = 1;
            this.avoid = 20;
            break;
        default:
            this.name = "Plain";
            this.walkable = true;
            this.flyable = true;
            this.defense = 0;
            this.avoid = 0;
    }
} Tile.prototype.setUnit = function (unit) {
	this.unit = unit;
};