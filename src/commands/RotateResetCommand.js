import Command from './Command';

export default class RotateResetCommand extends Command {

  constructor(player) {
    super(player, "Reset");
  }

  execute() {
    super.execute();
    this.player.resetAngularForces();
  }

}