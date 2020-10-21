
export default class CommandManager {
  constructor() {
    this.init();
  }

  init() {
    this.isPlaying = false;
    this.oldTime = Date.now();
    this.replay = [];
  }

  addCommand(command) {
    if (this.isPlaying) {
      return;
    }
    var newTime = Date.now();
    var deltaTime = newTime - this.oldTime;
    this.oldTime = newTime;
    //console.log("CommandManager :: addCommand=", command, deltaTime);
    let replay = {
      command,
      time: deltaTime,
    }
    this.replay.push(replay);
  }

  play() {
    this.isPlaying = true;
    if (this.replay.length) {
      let commandObj = this.replay.shift();
      setTimeout(() => {
        //console.log("CommandManager :: play :: command=", commandObj);
        commandObj.command.execute();
        this.play();
      }, commandObj.time);
    } else {

    }
  }
}