
/**
 * Class for each controllable unit. Initializes at (0, 0), must be changed.
 */
function Unit (name, unitClass, maxHP, move, imagePath, playerID, strength, skill, speed, luck, defense, resistance, constitution, aid, traveler, affinity, condition, level, experience, numWins, numLosses, numBattles, specialLabels, HPGrowth, SMGrowth, SklGrowth, SpdGrowth, LckGrowth, DefGrowth, ResGrowth) {
	this.name = name;
    this.unitClass = unitClass;
	this.inventory = [];
	this.maxHP = maxHP;
	this.currentHP = maxHP;
	this.move = move;
	this.image = new ImageObject (imagePath);
	this.image_grey = new ImageObject (imagePath.substring(0, imagePath.indexOf(".png")) + "_grey.png");
	this.active = true; // turns to false after it moves.
	this.playerID = playerID;
	this.x = 0;
	this.y = 0;
	this.equipped = null;
	this.strength = strength;
	this.skill = skill;
	this.speed = speed;
	this.luck = luck;
	this.defense = defense;
	this.resistance = resistance;
	this.constitution = constitution;
	this.aid = aid;
	this.traveler = traveler;
	this.affinity = affinity;
	this.condition = condition;
    this.level = level;
    this.experience = experience;
    this.numWins = numWins;
    this.numLosses = numLosses;
    this.numBattles = numBattles
    this.HPGrowth = HPGrowth;
    this.SMGrowth = SMGrowth;
    this.SklGrowth = SklGrowth;
    this.SpdGrowth = SpdGrowth;
    this.LckGrowth = LckGrowth;
    this.DefGrowth = DefGrowth;
    this.ResGrowth = ResGrowth;
    this.specialLabels = specialLabels;
} Unit.prototype.coor = function () {
	return new Coor(this.x, this.y);
}; Unit.prototype.gainExp = function (experience) {
    this.experience += experience;
    while (this.experience >= 100) {
        this.experience -= 100;
        this.levelUp();
    }
}; Unit.prototype.gainExpFromDamage = function (defender, damage) {
    var experience = 0;
    if (damage == 0) {
        experience = 1;
    } else {
        experience = Math.floor((31 + defender.level + unitClasses[defender.unitClass].damageExpBonus - this.level - unitClasses[this.unitClass].damageExpBonus) / unitClasses[this.unitClass].classPower);
    }
    this.gainExp(experience);
}; Unit.prototype.gainExpFromKill = function (defender) {
    //[(enemy's Level x enemy's Class power) + enemy's Class bonus B] - { [(Level x Class power) + Class bonus B] / Mode coefficient }
    var experience = Math.floor(defender.level * unitClasses[defender.unitClass].classPower + unitClasses[defender.unitClass].killExpBonus - this.level * unitClasses[this.unitClass].classPower - unitClasses[this.unitClass].killExpBonus);
    if (experience <= 0) {
        experience = Math.floor(defender.level * unitClasses[defender.unitClass].classPower + unitClasses[defender.unitClass].killExpBonus + (-1 * this.level * unitClasses[this.unitClass].classPower - unitClasses[this.unitClass].killExpBonus) / 2) + 1;
    }
    experience += 20;
    if (defender.specialLabels.indexOf("boss") != -1) {
        experience += 40;
    }
    if (experience < 0) {
        experience = 0;
    }
    
    this.gainExp(experience);
}; Unit.prototype.levelUp = function () {
    this.level++;
    if (Math.random() * 100 < this.HPGrowth) {
        this.maxHP++;
        this.currentHP++;
    }
    if (Math.random() * 100 < this.SMGrowth) {
        this.strength++;
    }
    if (Math.random() * 100 < this.SklGrowth) {
        this.skill++;
    }
    if (Math.random() * 100 < this.SpdGrowth) {
        this.speed++;
    }
    if (Math.random() * 100 < this.LckGrowth) {
        this.luck++;
    }
    if (Math.random() * 100 < this.DefGrowth) {
        this.defense++;
    }
    if (Math.random() * 100 < this.ResGrowth) {
        this.resistance++;
    }
}; Unit.prototype.canAttack = function () {
    if (this.equipped == null){
        return false;
    }
    for (var i = 0; i < CONSTANTS.hashedDirections.length; i++) {
        var hashedTile = CONSTANTS.hashedDirections[i] + hashCoor(this.coor());
        if (grid.unitAt(unhashCoor(hashedTile)) && grid.unitAt(unhashCoor(hashedTile)).playerID != this.playerID) {
            return true;
        }
    }
    return false;
}; Unit.prototype.canTrade = function () {
    for (var i = 0; i < CONSTANTS.hashedDirections.length; i++) {
        var hashedTile = CONSTANTS.hashedDirections[i] + hashCoor(this.coor());
        if (grid.unitAt(unhashCoor(hashedTile)) && grid.unitAt(unhashCoor(hashedTile)).playerID == this.playerID) {
            if (grid.selectedUnit.hasItems() && grid.unitAt(unhashCoor(hashedTile)).hasItems()) {
				return true;
			}
        }
    }
    return false;
}; Unit.prototype.hasItems = function () {
    return this.inventory.length != 0;
}; Unit.prototype.giveItem = function (item) {
	if (this.inventory.length < 6){
		this.inventory.push(item);
	}
	if (this.equipped == null){	//TODO: check if equippable
		this.equipItem(this.inventory.length - 1);
	}
}; Unit.prototype.removeItem = function (index, item) { //either needs to be renamed or changed (currently replaces item)
	this.inventory.splice(index, 1, item);
	if (this.equipped == index) {
		this.equipped = null;
	} 
}; Unit.prototype.updateInventory = function () {
	temp = []
	for (i = 0; i < this.inventory.length; i++) {
		if (this.inventory[i].uses > 0) {
			temp.push(this.inventory[i]);
		} else if (i == this.equipped) {
			//this.attack -= this.inventory[this.equipped].might; //probably badly coded but will be deprecated soon anyway since we're revamping how stats figure into attacks
			this.equipped = null;
		}
	}
	this.inventory = temp;
	if (this.equipped == null) { 
		for (i = 0; i < this.inventory.length; i++) {
			if (this.inventory[i].itemID == 0) {
				this.equipItem(i);
				break;
			}
		}
	}
}; Unit.prototype.equipItem = function (index) {
	//if (this.equipped != null) {
		//this.attack -= this.inventory[this.equipped].might;
	//}
	this.equipped = index;
	//this.attack += this.inventory[this.equipped].might;
}; Unit.prototype.weapon = function () {
    if (this.equipped == null) {
        return null;
    } else {
        return this.inventory[this.equipped];
    }
}; Unit.prototype.heal = function (amount) {
    if (this.currentHP >= this.maxHP) {
        return 0;
    }
    
    this.currentHP += amount;
	if (this.currentHP > this.maxHP) {
		this.currentHP = this.maxHP;
	}
	return 1;
}; Unit.prototype.damage = function (amount) {
    this.currentHP -= amount;
    if (this.currentHP <= 0) {
        this.currentHP = 0;
        return 0;
    } else {
        return 1;
    }
}; Unit.prototype.physicalAttack = function (targetUnit) {
    return this.strength + ((this.weapon().might + this.weapon().triangleBonus(targetUnit.weapon())) * this.weapon().effectiveBonus(targetUnit));
}; Unit.prototype.physicalDefense = function () {
    return this.defense + grid.tileAt(this.coor()).defense;
}; Unit.prototype.criticalBonus = function (targetUnit) {
    var criticalRate = this.weapon().crit + this.skill / 2; // = Weapon Critical + (Skill / 2) + Support bonus + Class Critical bonus + S Rank bonus 
    var criticalEvade = targetUnit.luck;
    if (Math.random() * 100 <= criticalRate - criticalEvade) {
        console.log("Critical Attack!");
        return 3;
    } else {
        console.log("Normal Attack!");
        return 1;
    }
};

function UnitClass (name, weaponUsage, specialClassifications, possiblePromotions, killExpBonus, classPower) {
    this.name = name;
    this.weaponUsage = weaponUsage;
    this.specialClassifications = specialClassifications;
    this.possiblePromotions = possiblePromotions;
    if (specialClassifications.indexOf("promoted") != -1) {
        this.damageExpBonus = 20;
    } else {
        this.damageExpBonus = 0;
    }
    this.killExpBonus = killExpBonus;
    this.classPower = classPower;
}