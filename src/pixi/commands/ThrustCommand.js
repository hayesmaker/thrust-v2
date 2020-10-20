import Command from './Command';

export default class ThrustCommand extends Command {

  constructor(player, replay) {
    super(player, replay);
  }

  execute() {
    this.player.thrust();
  }

}