import Command from './Command';

export default class RotateResetCommand extends Command {

  constructor(player, replay) {
    super(player, replay);
  }

  execute() {
    this.player.resetAngularForces();
  }

}