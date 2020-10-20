import Command from './Command';

export default class FireCommand extends Command {

  constructor(player, commandManager) {
    super(player, commandManager);
  }

  execute(shouldAddToReplay) {
    super.execute(shouldAddToReplay);
    this.player.fire();
  }

}