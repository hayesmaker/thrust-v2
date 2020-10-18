import  _ from 'lodash';
import {Loader, Sprite} from "pixi.js";
import p2 from 'p2';
import {mpx, pxm, mpxi, pxmi} from '../utils/Pixi2P2';
import BodyDebug from '../rendering/body-debug';
import {degToRad} from '../utils/maths';

const LEVEL_WORLD_HEIGHT = 1000;
const LEVEL_WIDTH = 768;
const LEVEL_HEIGHT = 270;
const TILE_SIZE = 96;
const INITIAL_ZOOM = 2;
const DEBUG = false;

export default class TiledLevelMap {

  constructor(camera, world) {
    this.camera = camera;
    this.world = world;
    this.renderSprites();
    this.initPhysics(0);
    this.initPhysics(1);
  }

  renderSprites() {
    let loader = Loader.shared;
    let combinedAtlas = loader.resources[global.ASSETS.textureAtlasPath].textures;
    let textureData = loader.resources[global.ASSETS.textureAtlasPath].data;
    let gameData = loader.resources[global.ASSETS.levelDataPath].data;
    let level1Data = gameData.data[0];
    let frames = this.getFramesArr(level1Data, textureData);
    let x, y, tileWidth, tileHeight;
    let tile;
    let tile2;
    let zoom = INITIAL_ZOOM;
    tileWidth = tileHeight = TILE_SIZE * zoom;
    let worldWidth = LEVEL_WIDTH * zoom;
    let worldHeight = LEVEL_WORLD_HEIGHT;
    let numTilesWide = worldWidth / tileWidth;
    let h = LEVEL_HEIGHT;
    _.each(frames, (frame, index) => {
      x = Math.floor(index % numTilesWide) * tileWidth;
      y = Math.floor(index / numTilesWide) * tileHeight;
      tile = new Sprite(combinedAtlas[frame.key]);
      tile.x = x;
      tile.y = y + worldHeight-h;
      tile.scale.set(zoom, zoom);
      this.camera.world.addChild(tile);

      tile2 = new Sprite(combinedAtlas[frame.key]);
      tile2.x = tile.x + worldWidth;
      tile2.y = tile.y;
      tile2.scale.set(zoom, zoom);
      this.camera.world.addChild(tile2);
    });
  }

  initPhysics(xOffset) {
    let loader = Loader.shared;
    let data = loader.resources[global.ASSETS.level1PhysicsPath].data['level-1'];
    let w = LEVEL_WIDTH * INITIAL_ZOOM;
    let h = LEVEL_HEIGHT;
    let cm = p2.vec2.create();
    let c,v;
    let body = new p2.Body({
      position: [
        pxm(w * xOffset + (w / 2)),
        pxm(LEVEL_WORLD_HEIGHT-h/2)
      ],
      mass: 0
    });
    body.angle = degToRad(180);
    for(let i = 0; i < data.length; i++) {
      let vertices = [];
      for (let s = 0; s < data[i].shape.length; s += 2) {
        vertices.push([pxmi(data[i].shape[s]) * 2, pxmi(data[i].shape[s+1]) * 2]);
      }
      c = new p2.Convex({vertices: vertices});
      for (let j = 0; j !== c.vertices.length; j++) {
        v = c.vertices[j];
        p2.vec2.sub(v, v, c.centerOfMass);
      }
      p2.vec2.scale(cm, c.centerOfMass, 1);
      cm[0] -= pxmi(w/2);
      cm[1] -= pxmi(h/2);
      // c.sensor = true;
      c.collisionGroup = global.COLLISIONS.LAND;
      c.collisionMask = global.COLLISIONS.SHIP | global.COLLISIONS.BULLET | global.COLLISIONS.ORB;
      c.updateTriangles();
      c.updateCenterOfMass();
      c.updateBoundingRadius();
      body.addShape(c, cm);
    }
    body.aabbNeedsUpdate = true;
    this.world.addBody(body);

    if (DEBUG) {
      let spr = new Sprite();
      let graphics = new Graphics();
      new BodyDebug(spr, graphics, body, {});
      this.camera.world.addChild(spr);
      spr.addChild(graphics);
    }
  }

  getFramesArr(level1Data, textureData) {
    let result = _.pickBy(textureData.frames, function(value, key) {
      return _.startsWith(key, level1Data.atlasData.levelKey);
    });
    return _.map(result, (value, key) => {
      return {
        frame:value,
        key: key
      };
    });
  }
}
