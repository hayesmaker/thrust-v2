
export default class CommandManager {



  constructor() {
    this.replay = [];
    this.executeTime = Date.now();
  }

  addCommand(command) {
    this.executeTime = Date.now() - this.executeTime;
    command.addTime(this.executeTime);
    this.replay.push(command);
  }

  playReplay() {



  }

  clearReplay() {
    this.replay = [];
  }




}