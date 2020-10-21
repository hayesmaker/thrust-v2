
export default class CommandManager {
  constructor() {
    this.replay = [];
    this.isPlaying = false;
    this.oldTime = Date.now();
  }

  init() {
    this.oldTime = Date.now();
  }

  addCommand(command) {
    var newTime = Date.now();
    var deltaTime = newTime - this.oldTime;
    this.oldTime = newTime;

    console.log("addCommand", command, deltaTime);

    let replay = {
      command,
      time: deltaTime,
    }
    this.replay.push(replay);
  }

  play() {
    if (this.replay.length) {
      let commandObj = this.replay.shift();
      setTimeout(() => {
        console.log("Expecute :: command", commandObj);
        commandObj.command.execute();
        this.play();
      }, commandObj.time);
    } else {
      this.isPlaying = false;
    }
  }

  clearReplay() {
    this.replay = [];
  }




}