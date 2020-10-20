import Command from './Command';

export default class FireCommand extends Command {

  constructor(player, replay) {
    super(player, replay);
  }

  execute() {
    this.player.fire();
  }

}