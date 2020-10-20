
export default class CommandManager {



  constructor() {
    this.replay = [];
  }

  addCommand(command) {
    this.replay.push(command);
  }

  clearReplay() {
    this.replay = [];
  }




}