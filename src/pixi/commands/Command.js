export default class Command {
  constructor(player, manager) {
    this.player = player;
    this.manager = manager;
    this.executeTime = null;
  }

  addTime(time) {
    this.executeTime = time;
  }

  execute(shouldAddToReplay) {
    if (shouldAddToReplay) {
      this.manager.addCommand(this);
    }
  }
}