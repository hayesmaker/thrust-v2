import RotateLeftCommand from './RotateLeftCommand';
import PlayerFireCommand from './FireCommand';
import RotateRightCommand from './RotateRightCommand';
import ThrustCommand from './ThrustCommand';
import PlayerLoadCommand from './PlayerLoadCommand';
import RotateResetCommand from './RotateResetCommand';
import NullCommand from './NullCommand';
import MenuUpCommand from './MenuUpComand';
import MenuLeftCommand from './MenuLeftComand';
import MenuRightCommand from './MenuRightComand';
import MenuDownCommand from './MenuDownComand';
import MenuSelectCommand from './MenuSelectCommand';
import CommandManager from "./CommandManager";

const KEY_DOWN = "arrowdown";
const KEY_UP = "arrowup";
const KEY_LEFT = "arrowleft";
const KEY_RIGHT = "arrowright";
const KEY_SPACE = "space";

/**
 * Command driven InputHandler
 *
 * @class InputHandler
 */
export default class InputHandler {

  /**
   * @constructor
   * @param state
   * @param player
   */
  constructor(state, player) {
    this.state = state;
    this.player = player;
    this.keyLeft = false;
    this.keyRight = false;
    this.keyUp = false;
    this.keyDown = false;
    this.keySpace = false;
    this.keySpaceUp = true;
  }

  /**
   * @method inPlayCommands
   */
  initPlayCommands() {
    this.commandManager = new CommandManager();
    this.nullCommand = new NullCommand(null);
    this.buttonX = new PlayerFireCommand(this.player);
    this.buttonY = new ThrustCommand(this.player);
    this.buttonA = new PlayerFireCommand(this.player);
    this.buttonB = new ThrustCommand(this.player);
    this.padRight = new RotateRightCommand(this.player);
    this.padLeft = new RotateLeftCommand(this.player);
    this.fireUp = new PlayerLoadCommand(this.player);
    this.reset = new RotateResetCommand(this.player);
    this.padUp = this.nullCommand;
    this.padDown = this.nullCommand;
  }

  /**
   * @method handleInput
   */
  handleInput () {
    this.handleKeyInput();
  }

  /**
   * @method handleKeyInput
   */
  handleKeyInput() {
    if (this.commandManager.isPlaying) {
      console.log("handleKeyInput :: replay is playing");
      return;
    }
    if (this.keyUp) {
      this.commandManager.addCommand(this.buttonB);
      this.buttonB.execute(true);
    }
    if (this.keySpaceUp && !this.player.isLoaded) {
      this.commandManager.addCommand(this.fireUp);
      this.fireUp.execute(true);
    }
    if (this.keySpace && this.player.isLoaded) {
      this.commandManager.addCommand(this.buttonA);
      this.buttonA.execute(true);
    }
    if (this.keyLeft) {
      this.commandManager.addCommand(this.padLeft);
      this.padLeft.execute(true);
      return;
    }
    if (this.keyRight) {
      this.commandManager.addCommand(this.padRight);
      this.padRight.execute(true);
      return;
    }
    if (!this.keyLeft && !this.keyRight) {
      this.commandManager.addCommand(this.reset);
      this.reset.execute(true);
    }
  }

  /**
   * @method initKeyboardControls
   */
  initWindowEvents() {
    window.onkeydown = (evt) => {
      this.handleKey.call(this, evt, true);
    };
    window.onkeyup = (evt) => {
      this.handleKey.call(this, evt, false);
    };
    window.addEventListener('blur', this.pause.bind(this));
    window.addEventListener('focus', this.play.bind(this));
  }

  pause() {
    this.state.pause();
  }

  play() {
    this.state.play();
  }

  /**
   * @mehood handleKey
   * @param evt {KeyboardEvent}
   * @param isDown {Boolean}
   */
  handleKey(evt, isDown) {
    let key = evt.code;
    if (key.toLowerCase() === "f2" && !isDown) {
      this.player.resetPosition();
      this.commandManager.clearReplay();
      this.commandManager.init();
    }
    if (key.toLowerCase() === "f4" && !isDown) {
      this.player.resetPosition();
      this.commandManager.play();
      return;
    }
    switch (key.toLowerCase()) {
      case KEY_SPACE:
        this.keySpace = isDown;
        this.keySpaceUp = !isDown;
        break;
      case KEY_LEFT:
        this.keyLeft = isDown;
        break;
      case KEY_UP:
        this.keyUp = isDown;
        break;
      case KEY_RIGHT:
        this.keyRight = isDown;
        break;
      case KEY_DOWN:
        this.keyDown = isDown;
        break;
    }
  }

}