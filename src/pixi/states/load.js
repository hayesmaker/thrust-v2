import {Loader} from "pixi.js";

export default class Load {
  constructor(stage) {
    this.hasStarted = false;
    this.stage = stage;
    this.onComplete = null;
    this.onCompleteContext = null;
  }


  start () {
    this.hasStarted = true;
    this.load();
  }

  preload () {

  }

  create () {
    this.complete();
  }

  load () {
    let loader = Loader.shared;
    loader.add(global.ASSETS.levelDataPath);
    loader.add(global.ASSETS.textureAtlasPath);
    loader.add(global.ASSETS.level1PhysicsPath);
    loader.load(this.create.bind(this));
  }

  update () {
    if (!this.hasStarted) {
      this.start();
    }
  }

  complete () {
    this.nextState();
  }

  nextState() {
    if (this.onComplete && this.onCompleteContext) {
      this.onComplete.call(this.onCompleteContext);
    }

  }
}