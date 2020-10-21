import Command from './Command';

export default class RotateRightCommand extends Command {

  constructor(player) {
    super(player, "Rotate Right");
  }

  execute() {
    super.execute();
    this.player.rotateRight();
  }

}