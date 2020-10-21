import Command from './Command';

export default class PlayerLoadCommand extends Command {

  constructor(player) {
    super(player, "Player Load");
  }

  execute() {
    super.execute();
    this.player.loadGun();
  }
}