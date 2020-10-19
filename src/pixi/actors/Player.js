import {Graphics, Sprite, Loader} from "pixi.js";
import p2  from 'p2';

import BodyDebug from '../rendering/body-debug';
import {mpx, pxm, mpxi, pxmi} from '../utils/Pixi2P2';
const TURN_SPEED = 5;
const DEBUG = false;
const INITIAL_X = 800;
const INITIAL_Y = 500;

export default class Player {

  constructor(camera, world) {
    this.camera = camera;
    this.world = world;
    this.bullets = null;
    this.isLoaded = true;
    this.activeBullets = [];
    this.hasGrabbed = false;
    this.debug = true;
    this.isAlive = true;
    this.isCleanLeft = true;  //if orb is being redrawn the other side of the map, dont draw tractorbeam
    this.isCleanRight = true;  //if orb is being redrawn the other side of the map, dont draw tractorbeam
    let loader = Loader.shared;
    let gameData = loader.resources[global.ASSETS.levelDataPath].data;
    let levelData = gameData.data[0];
    this.levelWidth = levelData.world.width;
    this.renderSprite();
  }

  setBullets(bulletPool) {
    this.bullets = bulletPool;
  }

  setOrb(orb) {
    this.orb = orb;
  }

  renderSprite() {
    let loader = Loader.shared;
    let combinedAtlas = loader.resources[global.ASSETS.textureAtlasPath].textures;
    let x = INITIAL_X + this.levelWidth;
    let y = INITIAL_Y;
    this.sprite = new Sprite(combinedAtlas['player.png']);
    this.sprite.scale.set(1,1);
    this.sprite.anchor.set(0.5, 0.5);
    let shape = new p2.Box({width: pxm(this.sprite.width), height: pxm(this.sprite.height)});
    shape.collisionGroup = global.COLLISIONS.SHIP;
    shape.collisionMask = global.COLLISIONS.LAND | global.COLLISIONS.ORB;
    this.body = new p2.Body({mass: 1, position: [pxm(x), pxm(y)]});
    this.world.addBody(this.body);
    let shape2 = new p2.Circle({radius: pxm(1)});
    shape2.collisionGroup = global.COLLISIONS.SHIP_SENSOR;
    shape2.collisionMask = global.COLLISIONS.ORB_SENSOR;
    this.body.addShape(shape2);
    this.body.addShape(shape);
    this.camera.world.addChild(this.sprite);
    this.camera.follow(this.sprite);
    if (DEBUG) {
      let dubugSpr = new Sprite();
      let graphics = new Graphics();
      this.playerDebug = new BodyDebug(dubugSpr, graphics, this.body, {});
      this.camera.world.addChild(dubugSpr);
      dubugSpr.addChild(graphics);
    }
  }

  /**
   *
   * @param deltaFrame
   */
  update(deltaFrame) {
    this.isCleanLeft = true;
    this.isCleanRight = true;
    this.orb.isClean = true;
    let px = mpx(this.body.position[0]);
    let py = mpx(this.body.position[1]);
    if (px < this.levelWidth) {
      this.isCleanLeft = false;
      this.body.position[0] = pxm(this.levelWidth * 2);
      if (this.hasGrabbed) {
        this.orb.isClean = false;
        this.orb.body.position[0] = this.orb.body.position[0] + pxm(this.levelWidth);
      }
    }
    if (px > this.levelWidth * 2) {
      this.isCleanRight = false;
      this.body.position[0] = pxm(this.levelWidth);
      if (this.hasGrabbed) {
        this.orb.isClean = false;
        this.orb.body.position[0] = this.orb.body.position[0] - pxm(this.levelWidth);
      }
    }
    this.sprite.position.x = px;
    this.sprite.position.y = py;
    this.sprite.rotation = this.body.angle;
    if (DEBUG) {
      this.playerDebug.updateSpriteTransform();
    }
    let activeBullet;
    let len = this.activeBullets.length;
    for (let i = 0; i < len; i++) {
      activeBullet = this.activeBullets[i];
      activeBullet && activeBullet.update();
    }
    for (let i = 0; i < len; i++) {
      activeBullet = this.activeBullets[i];
      if (activeBullet && !activeBullet.active) {
        this.activeBullets.splice(i, 1);
      }
    }
  }
  thrust() {
    this.body.applyForceLocal([0, -4]);
  }

  rotateLeft() {
    this.body.angularVelocity = -TURN_SPEED;
  }

  rotateRight() {
    this.body.angularVelocity = TURN_SPEED;
  }

  fire() {
    if (this.isLoaded) {
      this.isLoaded = false;
      let bullet = this.bullets.get();
      bullet.fire(this);
      bullet.index = this.activeBullets.length;
      this.activeBullets.push(bullet);
    }
  }

  loadGun() {
    this.isLoaded = true;
  }

  resetAngularForces() {
    this.body.angularVelocity = 0;
  }
}