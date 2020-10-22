
export default class CommandManager {
  constructor() {
    this.init();
  }

  init() {
    this.isSaving = false;
    this.isPlaying = false;
    this.replay = [];
    this.replayIndex = 0;
    this.frameCommands = [];
    this.executeFrameIndex = -1;
  }

  beginRecord() {
    this.init();
    this.isSaving = true;
  }

  update() {
    if (this.isPlaying || this.isSaving) {
      this.replayIndex++;
      if (this.executeFrameIndex === this.replayIndex) {
        this.frameCommands.forEach((commandObj) => {
          commandObj.command.execute();
        });
        this.frameCommands = [];
        this.play(false);
      }
    }
  }

  addCommand(command) {
    if (this.isSaving) {
      let replay = {
        command,
        frame: this.replayIndex
      }
      this.replay.push(replay);
    }
  }

  play(isFirst) {
    if (isFirst) {
      this.isSaving = false;
      this.replayIndex = 0;
      this.isPlaying = true;
    }
    if (this.replay.length) {
      let commandObj = this.replay.shift();
      this.frameCommands.push(commandObj);
      this.executeFrameIndex = commandObj.frame;
      let shouldCheckAgain = true;
      let checkNext = () => {
        if (this.replay.length && this.replay[0].frame === this.executeFrameIndex) {
          commandObj = this.replay.shift();
          this.frameCommands.push(commandObj);
          checkNext();
        } else {
          shouldCheckAgain = false;
        }
      }
      if (shouldCheckAgain) {
        checkNext();
      }
    } else {
      console.log("CommandManager :: replay finished");
    }
  }
}