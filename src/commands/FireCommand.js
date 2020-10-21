import Command from './Command';

export default class FireCommand extends Command {

  constructor(player) {
    super(player, "Player Fire");
  }

  execute() {
    super.execute();
    this.player.fire();
  }

}