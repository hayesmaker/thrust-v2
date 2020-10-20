import Command from './Command';

export default class RotateRightCommand extends Command {

  constructor(player, replay) {
    super(player, replay);
  }

  execute() {
    this.player.rotateRight();
  }

}