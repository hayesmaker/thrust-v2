export default class Command {
  constructor(player, name) {
    this.name = name;
    this.player = player;
  }

  execute() {
    //console.log("Execute", this.toString());
  }

  toString() {
    return this.name;
  }
}