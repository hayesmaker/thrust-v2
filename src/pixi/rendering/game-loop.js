//import FPSStats from '../utils/fps-stats';

export default class GameLoop {
  constructor(renderer, stage, startState) {
    //this.meter = new FPSStats();
    this.renderer = renderer;
    this.stage = stage;
    this.currentState = startState;
    this.oldTime = null;
    this.isStopped = false;
  }
  start () {
    this.isStopped = false;
    // setup RAF
    this.oldTime = Date.now();
    this.loop();
  }
  stop () {
    this.isStopped = true;
  }
  loop () {
    // this.meter && this.meter.tickStart();
    if (this.stopped) {
      return;
    }

    var newTime = Date.now();
    var deltaTime = newTime - this.oldTime;
    this.oldTime = newTime;
    if (deltaTime < 0) deltaTime = 0;
    if (deltaTime > 1000) deltaTime = 1000;
    var deltaFrame = deltaTime * 60 / 1000; //1.0 is for single frame
    this.currentState.meter && this.currentState.meter.tickStart();
    if (this.currentState) {
      this.currentState.update(deltaFrame);
    }
    this.renderer.render(this.stage);
    window.requestAnimationFrame(this.loop.bind(this));

    //this.meter && this.meter.tickEnd();
  }
}