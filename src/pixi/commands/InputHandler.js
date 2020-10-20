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
    this.nullCommand = new NullCommand();
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
    if (this.keyUp) {
      this.buttonB.execute();
    }
    if (this.keySpaceUp) {
      this.fireUp.execute();
    }
    if (this.keySpace) {
      this.buttonA.execute();
    }
    if (this.keyLeft) {
      this.padLeft.execute();
    }
    if (this.keyRight) {
      this.padRight.execute();
    }
    if (!this.keyLeft && !this.keyRight) {
      this.reset.execute();
    }
  }

  /**
   * @method initKeyboardControls
   */
  initKeyboardControl() {
    window.onkeydown = (evt) => {
      this.handleKey(evt, true);
    };
    window.onkeyup = (evt) => {
      this.handleKey(evt, false);
    };
  }

  /**
   * @mehood handleKey
   * @param evt {KeyboardEvent}
   * @param isDown {Boolean}
   */
  handleKey(evt, isDown) {
    let key = evt.code;
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