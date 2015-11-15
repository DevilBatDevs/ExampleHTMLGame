var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");	//canvas specifications
canvas.width = 500; canvas.height = 369;	//canvas specifications (size)
document.body.appendChild(canvas);			//place canvas in the main html code? woah?

attackMoveRange = [];
availableMoves = [];
function Game (numPlayers) {		//sets initial game parameters? woah?
	this.numPlayers = numPlayers;
	this.currentPlayer = 0;
	this.turnMode = 0;
	this.phase = "neutral";  // defines which phase user is in
} Game.prototype.switchPhase = function (newPhase) {
    this.phase = newPhase;
    
    menu.reset();
}; var game = new Game(2);
/**
 * Constants singleton, collection of a lot of magic numbers
 */
var CONSTANTS = new function () {
	this.hashedDirections = [-1000, -1, 1, 1000];
	this.tileWidth = 32;			//game map specifications
	this.mapWidth = 15;
	this.mapHeight = 10;
};
var unitClasses = {};
unitClasses["SwordLord"] = new UnitClass ("Lord", [0], [], ["SwordGreatLord"], 0, 3);
unitClasses["Paladin"] = new UnitClass ("Paladin", [0, 1], ["mounted", "promoted"], [], 60, 3);
unitClasses["Fighter"] = new UnitClass ("Fighter", [2], [], ["Warrior", "Hero"], 0, 3);

attackMoveRange = [];
availableMoves = [];

function generateMovementRange (unit) {
	availableMoves = [];
	availableMoves.push(hashCoor(unit.coor()));
	attackMoveRange = [];
	
	var startIndex = 0;
	var endIndex = availableMoves.length;
	for (i = 0; i < unit.move; i++) {
		for (j = startIndex; j < endIndex; j++) {
			for(k = 0; k < CONSTANTS.hashedDirections.length; k++){
				var hashedTile = CONSTANTS.hashedDirections[k] + availableMoves[j];
				if (availableMoves.indexOf(hashedTile) == -1) { // move not already in list
                    if (unhashCoor(hashedTile).x < 0 || unhashCoor(hashedTile).y < 0 || unhashCoor(hashedTile).x >= grid.width || unhashCoor(hashedTile).y >= grid.height) {
                        
                    } else if (grid.tileAt(unhashCoor(hashedTile)).walkable == true) {
						// line below says you can't move through other ppl's units
						if (grid.tileAt(unhashCoor(hashedTile)).unit == null || grid.tileAt(unhashCoor(hashedTile)).unit.playerID == game.currentPlayer) {
							availableMoves.push(hashedTile);
						}
					}
				}
			}
		}
		startIndex = endIndex;
		endIndex = availableMoves.length;
	}
	for (i = 0; i < availableMoves.length; i++) {
		for (j = 0; j < CONSTANTS.hashedDirections.length; j++) {
			var hashedTile = CONSTANTS.hashedDirections[j] + availableMoves[i];
			if (availableMoves.indexOf(hashedTile) == -1 && attackMoveRange.indexOf(hashedTile) == -1) {
				attackMoveRange.push(hashedTile);
			}
		}
	}
}
function populateActionMenu () {
    menu = new Menu();
    if (grid.selectedUnit.canAttack()) {
        menu.addOption("Attack", function () {
            game.switchPhase("unit attacking");
        });
    }
    if (grid.selectedUnit.hasItems()) {
        menu.addOption("Item", function () {
            game.switchPhase("inventory menu");
            populateInventoryMenu(grid.selectedUnit);
        });
    }
    if (grid.selectedUnit.canTrade()) {
        menu.addOption("Trade", function () {
            game.switchPhase("unit trading");
            for (j = 0; j < CONSTANTS.hashedDirections.length; j++) {
                attackMoveRange.push(CONSTANTS.hashedDirections[j] + hashCoor(grid.selectedUnit.coor()));
            }
        });
    }
    menu.addOption("Wait", function () {
        grid.selectedUnit.active = false;
        // TODO: should make this into a function
        var allInactive = true;
        for (i = 0; i < units.length; i++) {
            if (units[i].playerID == game.currentPlayer && units[i].active) {
                allInactive = false;
                break;
            }
        }
        if (allInactive) {
            game.currentPlayer = (game.currentPlayer + 1) % game.numPlayers;
            for (i = 0; i < units.length; i++) {
                if (units[i].playerID == game.currentPlayer) {
                    units[i].active = true;
                }
            }
            if (this.phase == "neutral") {
                for (i = 0; i < units.length; i++) {
                    if (units[i].playerID == game.currentPlayer) {
                        break;
                    }
                }
                if (i != units.length) {
                    cursor.jumpTo(units[i].coor());
                }
            }
        }
        grid.selectedUnit = null;
        game.switchPhase("neutral");
        availableMoves = [];
        attackMoveRange = [];
    });
    //return actionMenu;
}
function populateInventoryMenu (unit) {
    menu = new Menu();
	for (i = 0; i < unit.inventory.length; i++) {
		if (i == unit.equipped) {
			menu.addOption(unit.inventory[i].name.concat(" (E)"), function () {
                selectedItem = grid.selectedUnit.inventory[menu.index]
				game.switchPhase("item usage menu");
                populateItemUsageMenu(selectedItem);
            });
		} else {
            menu.addOption(unit.inventory[i].name, function () {
                selectedItem = grid.selectedUnit.inventory[menu.index]
				game.switchPhase("item usage menu");
                populateItemUsageMenu(selectedItem);
            });
		}
	}
	menu.addOption("Back", function () {
        game.switchPhase("action menu");
        populateActionMenu();
    });
}
function populateItemUsageMenu (item) {
	menu = new Menu();
	if (item.itemID == 0) {
		menu.addOption("Equip", function () {
			grid.selectedUnit.equipItem(grid.selectedUnit.inventory.indexOf(selectedItem));
			game.switchPhase("inventory menu");
			populateInventoryMenu(grid.selectedUnit);
		})
	} else if (item.itemID == 1){
		if (item.effectType == "Heal self") {
			menu.addOption("Heal", function () {
				healingFactor = selectedItem.effect;
				selectedItem.uses -= grid.selectedUnit.heal(healingFactor);
				
				grid.selectedUnit.updateInventory();
				grid.selectedUnit.active = false;
		        // TODO: should make this into a function
		        var allInactive = true;
		        for (i = 0; i < units.length; i++) {
		            if (units[i].playerID == game.currentPlayer && units[i].active) {
		                allInactive = false;
		                break;
		            }
		        }
		        if (allInactive) {
		            game.currentPlayer = (game.currentPlayer + 1) % game.numPlayers;
		            for (i = 0; i < units.length; i++) {
		                if (units[i].playerID == game.currentPlayer) {
		                    units[i].active = true;
		                }
		            }
		        }
		        grid.selectedUnit = null;
		        game.switchPhase("neutral");
		        availableMoves = [];
		        attackMoveRange = [];
			})
		}
	}
	//MORE TO COME
    menu.addOption("Back", function () {
        game.switchPhase("inventory menu");
        populateInventoryMenu(grid.selectedUnit);
    });
}
function populateTradeMenu1 (unit) { //TODO: Recode to actually be like the game
	menu = new Menu();
	menu.addOption(unit.name, function () {});
	for (i = 0; i < unit.inventory.length; i++) {
		menu.addOption(unit.inventory[i].name, function () {
            selectedItemIndex = menu.index - 1;
            game.switchPhase("trade menu 2");
            populateTradeMenu2(grid.unitAt(cursor.coor()));
        });
	}
    menu.addOption("Back", function () {
        game.switchPhase("action menu");
        populateActionMenu(); 
    });
}
function populateTradeMenu2 (unit) { //TODO: Recode to actually be like the game
     //currently badly implemented (this and the previous few) - Sung
     //even after my my refactoring, Sung's above comment applies - Jeff
	menu = new Menu();
	menu.addOption(unit.name, function () {});
	for (i = 0; i < unit.inventory.length; i++) {
		menu.addOption(unit.inventory[i].name, function () {
            selectedItem1 = grid.selectedUnit.inventory[selectedItemIndex];
            selectedItem2 = grid.unitAt(cursor.coor()).inventory[menu.index - 1];
            grid.selectedUnit.removeItem(selectedItemIndex, selectedItem2);
            grid.unitAt(cursor.coor()).removeItem(menu.index - 1, selectedItem1);
            
            grid.selectedUnit.updateInventory();
            grid.unitAt(cursor.coor()).updateInventory();
            game.switchPhase("action menu");
            populateActionMenu();
        });
	}
    menu.addOption("Back", function () {
        game.switchPhase("trade menu 1");
        populateTradeMenu1(grid.selectedUnit);
    });
}
//Weapon(name, price, imagePath, itemID, uses, range, weight, might, hit, crit, type, rank, wex)
var units = [];
units.push(new Unit("Seth", "Paladin", 30, 8, "images/seth.png", 0, 14, 13, 12, 13, 11, 8, 11, 14, null, "anima", null, 1, 0, 0, 0, 0, [], 90, 50, 45, 45, 25, 40, 30));
//Seth's items
units[0].giveItem(new Weapon("Silver Lance", 1200, "placeholder", 0, 20, 1, 10, 14, 0.75, 0, 1, 'A', 1)); //give seth silver lance, eirika rapier vulneraries, goblin bronze axe
units[0].giveItem(new Weapon("Steel Sword", 600, "placeholder", 0, 30, 1, 10, 8, 0.75, 0, 0, 'D', 1));
units[0].giveItem(new ConsumableItem("Vulnerary", 300, "placeholder", 1, 3, 0, 10, "Restores some HP."));
units.push(new Unit("Eirika", "SwordLord", 16, 5, "images/eirika.png", 0, 4, 8, 9, 5, 3, 1, 5, 4, null, "light", null, 1, 0, 0, 0, 0, ["boss"], 70, 40, 60, 60, 60, 30, 30));
//Eirika's items
units[1].giveItem(new Weapon("Rapier", 0, "placeholder", 0, 40, 1, 5, 7, 0.95, 10, 0, 'Prf', 2)); //TODO: add rapier's special shit
units[1].giveItem(new ConsumableItem("Vulnerary", 300, "placeholder", 1, 3, 0, 10, "Restores some HP."));
units.push(new Unit("Cutthroat", "Fighter", 22, 5, "images/axe_soldier.png", 1, 5, 1, 1, 0, 5, 0, 11, 10, null, null, null, 1, 0, 0, 0, 0, [], 20, 20, 20, 20, 20, 20, 20));
units.push(new Unit("Cutthroat", "Fighter", 21, 5, "images/axe_soldier.png", 1, 5, 2, 4, 0, 2, 0, 11, 10, null, null, null, 2, 0, 0, 0, 0, [], 20, 20, 20, 20, 20, 20, 20));
units.push(new Unit("O'Neill", "Fighter", 24, 5, "images/axe_soldier.png", 1, 6, 4, 8, 0, 2, 0, 11, 10, null, "fire", null, 4, 0, 0, 0, 0, ["boss"], 20, 20, 20, 20, 20, 20, 20));
//goblin's items
units[2].giveItem(new Weapon("Iron Axe", 270, "placeholder", 0, 45, 1, 10, 8, 0.75, 0, 2, "E", 1));
units[3].giveItem(new Weapon("Iron Axe", 270, "placeholder", 0, 45, 1, 10, 8, 0.75, 0, 2, "E", 1));
units[4].giveItem(new Weapon("Iron Axe", 270, "placeholder", 0, 45, 1, 10, 8, 0.75, 0, 2, "E", 1));

var grid = new Grid();
var menu = new Menu();
function processInputs () {
    if (88 in keysDown) {  //pressed "B"
        console.log("go back a menu");
    }
    if (game.phase.indexOf("menu") > -1) {  // in a menu
        if (38 in keysDown) { // Player holding the up button
            menu.down();
        }
        if (40 in keysDown) { // Player holding down
            menu.up();
        }
        if (90 in keysDown) {
            menu.go();
        }
    } else if (game.phase == "stats page") {  // in a menu
        if (88 in keysDown) { // Player holding the "x" which is really "b" button
            game.switchPhase("neutral");
        }
    } else {  // not a menu
        if(Object.keys(keysDown).length != 0) console.log(keysDown);
        if (game.phase == "neutral" && 83 in keysDown) { //player pressed down "s" which is "R" for our emulator
            if (grid.unitAt(cursor.coor()) != null) {
                game.switchPhase("stats page");
            }
        }
        if (38 in keysDown) { // Player holding the up button
            cursor.up();
			grid.adjust();
        }
        if (40 in keysDown) { // Player holding down
            cursor.down();
            grid.adjust();
        }
        if (37 in keysDown) { // Player holding left
            cursor.left();
            grid.adjust();
        }
        if (39 in keysDown) { // Player holding right
			cursor.right();
			grid.adjust();
        }
        if (90 in keysDown) { // pressed "z" which is actually "a" for our emulator
            if (game.phase == "neutral") {//if (grid.selectedUnit == null) { // no unit selected yet and "a" just pressed
                if (grid.unitAt(cursor.coor()) != null
                        && grid.unitAt(cursor.coor()).playerID == game.currentPlayer
                        && grid.unitAt(cursor.coor()).active) { // cursor is on an active unit belonging to the current player
                    grid.selectedUnit = grid.unitAt(cursor.coor());
                    generateMovementRange(grid.selectedUnit);
                    game.switchPhase("unit selected");
                }
            } else if (game.phase == "unit selected") { //moving
                if (availableMoves.indexOf(hashCoor(cursor.coor())) != -1 && (grid.unitAt(cursor.coor()) == null || grid.unitAt(cursor.coor()) == grid.selectedUnit)) {
                    grid.placeUnitAt(grid.selectedUnit, cursor.x, cursor.y);
                    availableMoves = [];
                    attackMoveRange = [];
                    if (grid.selectedUnit.canAttack()) {
                        for (j = 0; j < CONSTANTS.hashedDirections.length; j++) {
                            attackMoveRange.push(CONSTANTS.hashedDirections[j] + hashCoor(cursor.coor()));
                        }
                    }
                    game.switchPhase("action menu");
                    populateActionMenu();
                    menu.reset();
                    // unit just moved
                } else {
                    console.log("invalid click");	
                }
            } else if (game.phase == "unit attacking") { //attacking
                if (attackMoveRange.indexOf(hashCoor(cursor.coor())) != -1 || hashCoor(cursor.coor()) == hashCoor(grid.selectedUnit.coor())) { //clicked in range
                    var defender = grid.unitAt(cursor.coor());
                    var attacker = grid.selectedUnit;
                    if (defender != null && defender.playerID != game.currentPlayer) { //attacking the enemy unit
                        var damageByAttacker = (attacker.physicalAttack(defender) - defender.physicalDefense()) * attacker.criticalBonus(defender);
                        var battleResult = defender.damage(damageByAttacker);
                        
                        //grid.unitAt(cursor.coor()).currentHP -= grid.selectedUnit.attack; // subtract hp from attacked unit
                        
                        attacker.inventory[attacker.equipped].uses -= 1;
                        attacker.updateInventory();
                        
                        //TODO implement wex (weapon experience)
                        if (battleResult == 0) {  // if enemy died
                            units.splice(units.indexOf(grid.unitAt(cursor.coor())), 1);
                            grid.grid[defender.x][defender.y].unit = null;
                            //[31 + (enemy's Level + enemy's Class bonus A) - (Level + Class bonus A)] / Class power
                            attacker.gainExpFromDamage(defender, damageByAttacker);
                            attacker.gainExpFromKill(defender);
                            
                        } else {
                            var damageByDefender = (defender.physicalAttack(attacker) - attacker.physicalDefense()) * defender.criticalBonus(attacker);
                            battleResult = attacker.damage(damageByDefender);
                            if (battleResult == 0) {
                                units.splice(units.indexOf(attacker), 1);
                                grid.grid[attacker.x][attacker.y].unit = null;
                                defender.gainExpFromDamage(attacker, damageByDefender);
                                defender.gainExpFromKill(attacker);
                            } else {
                                defender.gainExpFromDamage(attacker, damageByDefender);
                                attacker.gainExpFromDamage(defender, damageByAttacker);
                            }
                        }
                        attacker.active = false;
                        var allInactive = true;
                        for (i = 0; i < units.length; i++) {
                            if (units[i].playerID == game.currentPlayer && units[i].active) {
                                allInactive = false;
                                break;
                            }
                        }
                        if (allInactive) {
                            game.currentPlayer = (game.currentPlayer + 1) % game.numPlayers;
                            for (i = 0; i < units.length; i++) {
                                if (units[i].playerID == game.currentPlayer) {
                                    units[i].active = true;
                                }
                            }
                        }
                        grid.selectedUnit = null;
                        game.switchPhase("neutral");
                        availableMoves = [];
                        attackMoveRange = [];
                    } else { //didn't attack anyone and just waited (by clicking on ally or ground)
                        //do nothing
                    }
                    
                } else {
                    console.log("invalid click");
                }
                // unit needs to perform action or wait
                // check to see if there are any other units of the current player who is active, if none exist, end turn
            } else if (game.phase == "unit trading") { //trading, currently can trade with yourself and trade multiple times in one turn
                if (attackMoveRange.indexOf(hashCoor(cursor.coor())) != -1 || hashCoor(cursor.coor()) == hashCoor(grid.selectedUnit.coor())) { //clicked in range
                    if (grid.unitAt(cursor.coor()) != null && grid.unitAt(cursor.coor()).playerID == game.currentPlayer) { 
                        game.switchPhase("trade menu 1");
                        attackMoveRange = [];
                        populateTradeMenu1(grid.selectedUnit);
                    } else { //didn't attack anyone and just waited (by clicking on ally or ground)
                        game.switchPhase("action menu");
                        populateActionMenu();
                    }
                } else {
                    console.log("invalid click");
                }
            }
        }
    }
    keysDown = {};
}
function drawActionMenu (listOfOptions) {
    var xStart = 0; var yStart = 20;
    if (cursor.coorOnScreen().x < 8) {
        xStart = 340;
    } else {
        xStart = 20;
    }
    context.font = "bold 18px Verdana";
    context.fillStyle = "#ffffff";
    for (i = 0; i < listOfOptions.length; i++) {
        if (i == 0) {
            IMAGES.menu_top.drawOnScreen(xStart, yStart);
        } else {
            IMAGES.menu_mid.drawOnScreen(xStart, yStart + 20 + i * 38);
        }
        context.fillText(listOfOptions[i], xStart + 31, yStart + 85 + i * 38);
    }
    IMAGES.menu_bot.drawOnScreen(xStart, yStart + i * 38 + 20);
    IMAGES.menu_cursor.drawOnScreen(xStart - 20, yStart + 25 + 38 * (menu.index));
}
function drawInventoryPanel (inventory) {
    var xStart = 22; var yStart = 16;
    
    context.font = "18px Arial";
    context.fillStyle = "#ffffff";
    for (i = 0; i < inventory.length + 1; i++) {
        if (i != inventory.length) {
            IMAGES.inventory_mid.drawOnScreen(xStart, 15 + yStart + i * 30);
        } else {
            IMAGES.inventory_mid.drawOnScreen(xStart, 15 + yStart + i * 30);
        }
    }
    IMAGES.inventory_highlight.drawOnScreen(xStart + 15, yStart + 30 + 30 * (menu.index));
    for (i = 0; i < inventory.length + 1; i++) {
        if (i != inventory.length) {
            if (i == grid.selectedUnit.equipped) {
                context.fillText(inventory[i].name + " (E)", xStart + 50, yStart + 77 + i * 30);
            } else {
                context.fillText(inventory[i].name, xStart + 50, yStart + 77 + i * 30);
            }
            
        } else {
            context.fillText("BACK", xStart + 50, yStart + 77 + i * 30);
        }
    }
    IMAGES.inventory_top.drawOnScreen(xStart, yStart);
    IMAGES.inventory_bot.drawOnScreen(xStart, yStart + i * 30 + 15);
    IMAGES.menu_cursor.drawOnScreen(xStart - 20, yStart + 16 + 30 * (menu.index));
    
    
    grid.selectedUnit.image.drawOnScreenScaled(270, 60, 130, 130);
    IMAGES.inventory_description.drawOnScreen(230, 165);
    context.font = "16px Arial";
    if (menu.index != inventory.length) {
        if (inventory[menu.index].itemType == "Weapon") {
            context.fillText("Type: " + inventory[menu.index].weaponType, 295, 240);
            context.fillText("Atk", 265, 270);
            context.fillText("???", 265 + 45, 270);
            context.fillText("Hit", 265, 300);
            context.fillText("???", 265 + 45, 300);
            context.fillText("Crit", 355, 270);
            context.fillText("???", 355 + 45, 270);
            context.fillText("Avoid", 355, 300);
            context.fillText("???", 355 + 45, 300);
            // find formulas to determine these pl0x.
        } else {
            context.fillText(inventory[menu.index].description, 255, 240);
        }
    } else {
        context.fillText("Return to Action Menu", 255, 240);
    }
}
function drawAll () {
	IMAGES.wrapperImage.draw(0, 0);
	/*
	grid.iterateScreen(function (coor) {
		IMAGES.terrainMapObjects[grid.tileOnScreen(coor).type].drawOnGrid(coor.unscreenify());
	});
	*/
    IMAGES.levelBackgrounds[0].drawOnScreen(0, 0);
    
	grid.iterateScreen(function (coor) {  // highlights the available moves in blue after looping through every spot on the visible grid
		if(availableMoves.indexOf(hashCoor(coor.unscreenify())) != -1) {
			IMAGES.blueHighlight.drawOnGrid(coor);
		}
	});
	
	grid.iterateScreen(function (coor) {  // highlights the attack range in red after looping through every spot on the visible grid
		if(attackMoveRange.indexOf(hashCoor(coor.unscreenify())) != -1) {
			IMAGES.redHighlight.drawOnGrid(coor);
		}
	});
	grid.iterateScreen(function (coor) {  // highlights the available moves in blue after looping through every spot on the grid
		if (grid.unitOnScreen(coor)) {
			if(grid.unitOnScreen(coor).active){
				grid.unitOnScreen(coor).image.drawOnGrid(coor.unscreenify());
			}else{
				grid.unitOnScreen(coor).image_grey.drawOnGrid(coor.unscreenify());
			}
		}
	});
	cursor.draw(); // draws the cursor
    if (game.phase == "inventory menu") {
        drawInventoryPanel(grid.selectedUnit.inventory);
    } else if (game.phase.indexOf("menu") > -1) {
		drawActionMenu(menu.options);
	} else if (game.phase == "stats page") {
        IMAGES.stats_page.drawOnScreen(0, 0);
        var unit = grid.unitAt(cursor.coor());
        unit.image.drawOnScreenScaled(30, 30, 130, 130);
        context.font = "bold 18px Verdana";
        context.fillStyle = "#ffffff";
        context.fillText(unit.name, 30, 275);
        context.fillText(unit.level, 67, 305);
        context.fillText(unit.experience, 110, 305);
        context.fillText(unit.currentHP, 67, 335);
        context.fillText(unit.maxHP, 110, 335);
        context.fillStyle = "#ff0000";
        context.fillText(unit.strength, 270, 115);
        context.fillText(unit.skill, 270, 147);
        context.fillText(unit.speed, 270, 179);
        context.fillText(unit.luck, 270, 211);
        context.fillText(unit.defense, 270, 243);
        context.fillText(unit.resistance, 270, 275);
        
        context.fillText(unit.move, 400, 115);
        context.fillText(unit.constitution, 400, 147);
        context.fillText(unit.aid, 400, 179);
        if (unit.affinity != null) context.fillText(unit.affinity, 400, 243);
        
    } else if (game.phase == "neutral") {	// shows stats during neutral phase?
        if (cursor.coorOnScreen().x < 8) {
            IMAGES.terrainPane.drawOnScreen(380, 220);
            context.font = "bold 17px Verdana";
            context.fillStyle = "#ffffff";
            context.fillText(grid.tileAt(cursor.coor()).name, 426 - 3.5 * grid.tileAt(cursor.coor()).name.length, 220 + 40 + 17 + 20);
            context.font = "bold 14px Verdana";
            context.fillText("DEF.", 395, 320);
            context.fillText("AVO.", 395, 336);
            var avoid = grid.tileAt(cursor.coor()).avoid;
            context.fillText(grid.tileAt(cursor.coor()).defense, 460, 320);
            context.fillText(avoid, 470 - 10 * avoid.toString().length, 336);
        } else {
            IMAGES.terrainPane.drawOnScreen(380 - 370, 220);
            context.font = "bold 17px Verdana";
            context.fillStyle = "#ffffff";
            context.fillText(grid.tileAt(cursor.coor()).name, 426 - 3.5 * grid.tileAt(cursor.coor()).name.length - 370, 220 + 40 + 17 + 20);
            context.font = "bold 14px Verdana";
            context.fillText("DEF.", 395 - 370, 320);
            context.fillText("AVO.", 395 - 370, 336);
            var avoid = grid.tileAt(cursor.coor()).avoid;
            context.fillText(grid.tileAt(cursor.coor()).defense, 460 - 370, 320);
            context.fillText(avoid, 470 - 370 - 10 * avoid.toString().length, 336);
        }
        
		if (grid.unitAt(cursor.coor()) != null) {
			if (cursor.coorOnScreen().x < 8 && cursor.coorOnScreen().y < 5) {
				IMAGES.characterPane.drawOnScreen(0, 224);
				context.font = "bold 17px Verdana";
				context.fillStyle = "#000000";
				currentHPString = "" + grid.unitAt(cursor.coor()).currentHP;
				context.fillText(currentHPString, 148 - 10 * currentHPString.length, 224 + 103);
				context.fillText("" + grid.unitAt(cursor.coor()).maxHP, 173, 224 + 103);
				context.font = "bold 18px Courier";
				context.fillText(grid.unitAt(cursor.coor()).name, 172 - grid.unitAt(cursor.coor()).name.length * 7.4, 224 + 81);
				
				context.fillStyle = "#f8f7f5";
				context.fillRect(10 + 86, 40 + 70 + 224, 100 * grid.unitAt(cursor.coor()).currentHP / grid.unitAt(cursor.coor()).maxHP, 1);
				context.fillStyle = "#f6f4e9";
				context.fillRect(10 + 86, 40 + 71 + 224, 100 * grid.unitAt(cursor.coor()).currentHP / grid.unitAt(cursor.coor()).maxHP, 1);
				context.fillStyle = "#f2ecc7";
				context.fillRect(10 + 86, 40 + 72 + 224, 100 * grid.unitAt(cursor.coor()).currentHP / grid.unitAt(cursor.coor()).maxHP, 1);
				context.fillStyle = "#f0e9bb";
				context.fillRect(10 + 86, 40 + 73 + 224, 100 * grid.unitAt(cursor.coor()).currentHP / grid.unitAt(cursor.coor()).maxHP, 1);
				grid.unitAt(cursor.coor()).image.drawOnScreenScaled(20, 21 + 224, 56, 56);
			} else {
				IMAGES.characterPane.drawOnScreen(0, 0);
				context.font = "bold 17px Verdana";
				context.fillStyle = "#000000";
				currentHPString = "" + grid.unitAt(cursor.coor()).currentHP;
				context.fillText(currentHPString, 148 - 10 * currentHPString.length, 103);
				context.fillText("" + grid.unitAt(cursor.coor()).maxHP, 173, 103);
				context.font = "bold 18px Courier";
				context.fillText(grid.unitAt(cursor.coor()).name, 172 - grid.unitAt(cursor.coor()).name.length * 7.4, 81);
				
				context.fillStyle = "#f8f7f5";
				context.fillRect(10 + 86, 40 + 70, 100 * grid.unitAt(cursor.coor()).currentHP / grid.unitAt(cursor.coor()).maxHP, 1);
				context.fillStyle = "#f6f4e9";
				context.fillRect(10 + 86, 40 + 71, 100 * grid.unitAt(cursor.coor()).currentHP / grid.unitAt(cursor.coor()).maxHP, 1);
				context.fillStyle = "#f2ecc7";
				context.fillRect(10 + 86, 40 + 72, 100 * grid.unitAt(cursor.coor()).currentHP / grid.unitAt(cursor.coor()).maxHP, 1);
				context.fillStyle = "#f0e9bb";
				context.fillRect(10 + 86, 40 + 73, 100 * grid.unitAt(cursor.coor()).currentHP / grid.unitAt(cursor.coor()).maxHP, 1);
				grid.unitAt(cursor.coor()).image.drawOnScreenScaled(20, 21, 56, 56);
			}
		}
	}
};
if (game.phase == "neutral") {
    for (i = 0; i < units.length; i++) {
        if (units[i].playerID == game.currentPlayer) {
            break;
        }
    }
    if (i != units.length) {
        cursor.jumpTo(units[i].coor());
    }
}
var main = function () {
	processInputs();
	drawAll();
    requestAnimationFrame(main);
}; main();
