import Command from './Command';

export default class ThrustCommand extends Command {

  constructor(player) {
    super(player, "Thrust");
  }

  execute() {
    super.execute();
    this.player.thrust();
  }

}