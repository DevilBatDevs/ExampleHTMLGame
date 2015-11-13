/** ITEMS: (i actually dont think inheritance helps whatsoever with this)*/

function Item(name, price, imagePath, itemID){
	this.name = name;
	this.price = price;
	this.image = new ImageObject (imagePath);
	this.itemID = itemID;
	this.usable = false;
}
function QuestItem(){
	QuestItem.prototype = Object.create(Item.prototype);
}
function SellableItem(name, price, imagePath, itemID, uses){
	SellableItem.prototype = Object.create(Item.prototype);
	this.uses = uses
}
function Weapon(name, price, imagePath, itemID, uses, range, weight, might, hit, crit, type, rank, wex){
	this.name = name;
	this.price = price;
	this.image = new ImageObject (imagePath);
	this.itemID = itemID;
	this.uses = uses;
	this.range = range;
	this.weight = weight;
	this.might = might;
	this.hit = hit;
	this.crit = crit;
	this.rank = rank;
	this.wex = wex;
	this.type = type;

	switch (this.type) { //TODO: add weapon triangle and all that
        case 0:
            this.weaponType = "Sword";
            break;
        case 1:
        	this.weaponType = "Lance";
        	break;
        case 2:
        	this.weaponType = "Axe";
        	break;
        case 3:
        	this.weaponType = "Bow";
        	break;
        case 4:
        	this.weaponType = "Dark Tome";
        	break;
        case 5:
        	this.weaponType = "Light Tome";
        	break;
        case 6:
        	this.weaponType = "Anima Tome";
        	break;
        case 7:
        	this.weaponType = "Staff";
        	break;
        default:
            this.weaponType = "Sword";
        	break;
    }
    this.itemType = "Weapon";
} Weapon.prototype.triangleBonus = function (defendingWeapon) {
    switch (this.type) { //TODO: add weapon triangle and all that
        case 0:
            switch (defendingWeapon.type) {
                case 0:
                    return 0;
                case 1:
                    return -1;
                case 2:
                    return 1;
                default:
                    return 0;
            }
        case 1:
        	switch (defendingWeapon.type) {
                case 0:
                    return 1;
                case 1:
                    return 0;
                case 2:
                    return -1;
                default:
                    return 0;
            }
        case 2:
        	switch (defendingWeapon.type) {
                case 0:
                    return -1;
                case 1:
                    return 1;
                case 2:
                    return 0;
                default:
                    return 0;
            }
        default:
            return 0;
    }
}; Weapon.prototype.effectiveBonus = function (targetUnit) {
    return 1;
};

function ConsumableItem(name, price, imagePath, itemID, uses, type, effect, description){
	ConsumableItem.prototype = Object.create(SellableItem.prototype);
	this.name = name;
	this.price = price;
	this.image = new ImageObject(imagePath);
	this.itemID = itemID;
	this.usable = true;
	this.uses = uses;
	this.type = type;
	this.effect = effect;
	switch (this.type) {	//probably will have to change this later
		case 0:
			this.effectType = "Heal self";

			break;
        case 1:
            this.effectType = "Heal other";
            
            break;
        default:
            this.effectType = "Sword"

        	break;
    }
    this.itemType = "ConsumableItem";
    this.description = description;
}