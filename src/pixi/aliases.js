import * as PIXI from 'pixi.js';

export default class Aliases {
  constructor() {}
  static init() {
    console.log('Aliases :: init');
    //Pixi Aliases
    global.DisplayObject = PIXI.DisplayObject;
    global.Container = PIXI.Container;
    global.Sprite = PIXI.Sprite;
    global.Graphics = PIXI.Graphics;
    global.TextureCache = PIXI.utils.TextureCache;
    global.loader = PIXI.Loader.shared;
    //global.resources = PIXI.loader.resources;
    global.autoDetectRenderer = PIXI.autoDetectRenderer;
    global.Point = PIXI.Point;
    global.Rectangle = PIXI.Rectangle;

    //Thrust Aliases
    global.ASSETS = {
      textureAtlasPath: 'assets/atlas/combined.json',
      levelDataPath: 'assets/levels/classic.json',
      level1PhysicsPath: 'assets/physics-new/level-1-phyics.json'
    };

    //Collision Groups
    /**
     * Forgotten why I made this Global.. why am i using Global at all!? WutFace
     * @type {{BULLET: number, LAND: number, SHIP: number, ORB: number}}
     */
    global.COLLISIONS = {
      SHIP:Math.pow(2,0),
      BULLET:Math.pow(2,1),
      LAND:Math.pow(2,2),
      ORB:Math.pow(2, 3),
      ORB_SENSOR:Math.pow(2, 4),
      SHIP_SENSOR:Math.pow(2, 5),
    };
  }
}