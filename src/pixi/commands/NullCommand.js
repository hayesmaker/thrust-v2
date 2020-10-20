import Command from "./Command";

export default class NullCommand extends Command{
  constructor(player, manager) {
    super(player, manager);
  }

  execute() {

  }
}