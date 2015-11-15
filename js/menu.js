function Menu () {
    this.index = 0;
    this.options = [];
    this.actions = {};
} Menu.prototype.up = function () {
    this.index++;
    if (this.index >= this.options.length) {
        this.index = this.options.length - 1;
    }
}; Menu.prototype.down = function () {
    this.index--;
    if (this.index < 0) {
        this.index = 0;
    }
}; Menu.prototype.reset = function () {
    this.index = 0;
}; Menu.prototype.addOption = function (text, action) {
    this.options.push(text);
    this.actions[text] = action;
}; Menu.prototype.go = function () {
    this.actions[this.options[this.index]]();
};