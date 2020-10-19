import {autoDetectRenderer, Container} from "pixi.js";

import GameLoop from './rendering/game-loop';
import Load from './states/load';
import Play from './states/play';
import Lookups from './lookups';

export default class PixiLauncher {
  constructor() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let colour = 0x000000;
    Lookups.init();
    let renderer = autoDetectRenderer(
      {
        width,
        height,
        backgroundColor : colour,
        transparent: false,
      },
    );
    window.document.body.appendChild(renderer.view);
    let stage = new Container();
    this.load = new Load(stage);
    this.play = new Play(stage, renderer);
    this.loop = new GameLoop(stage, renderer, this.load);
    this.loop.start();
    this.load.onComplete = this.startPlayState;
    this.load.onCompleteContext = this;
  }

  startPlayState() {
    this.loop.currentState = this.play;
  }
}