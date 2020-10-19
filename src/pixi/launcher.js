import {autoDetectRenderer, Container} from "pixi.js";

import GameLoop from './rendering/game-loop';
import Load from './states/load';
import Play from './states/play';
import Aliases from './aliases';

export default class PixiLauncher {
  constructor() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let colour = 0x000000;
    Aliases.init();
    let renderer = autoDetectRenderer(
      {
        width,
        height,
        backgroundColor : colour,
        transparent: false,
      },
    );
    console.log("autoDetectRenderer", autoDetectRenderer);
    console.log("launcher :: body", window.document, global.document.body);
    console.log("renderer view", renderer);
    window.document.body.appendChild(renderer.view);
    let stage = new Container();
    stage.scale.y = 1;
    stage.scale.x = 1;    //FPSStats.init();
    this.load = new Load(stage);
    this.play = new Play(stage, renderer);
    this.loop = new GameLoop(renderer, stage, this.load);
    this.loop.start();
    this.load.onComplete = this.startPlayState;
    this.load.onCompleteContext = this;
  }

  startPlayState() {
    this.loop.currentState = this.play;
  }
}