import Command from "./Command";

export default class NullCommand extends Command{
  constructor(player, replay) {
    super(player, replay);
  }

  execute() {

  }
}