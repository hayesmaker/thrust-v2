import Command from './Command';

export default class RotateLeftCommand extends Command {

  constructor(player, replay) {
    super(player, replay);
  }

  execute() {
    this.player.rotateLeft();
  }

}