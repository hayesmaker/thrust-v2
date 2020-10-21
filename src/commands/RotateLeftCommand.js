import Command from './Command';

export default class RotateLeftCommand extends Command {

  constructor(player) {
    super(player, "Rotate Left");
  }

  execute() {
    super.execute();
    this.player.rotateLeft();
  }

}