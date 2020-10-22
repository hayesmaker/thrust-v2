import {Loader, Graphics, Sprite} from "pixi.js";
import p2  from 'p2';

import {mpx, pxm} from '../utils/Pixi2P2';
import BodyDebug from '../rendering/body-debug';
import Actor from "./Actor";

const RADIUS = 16;
const DEBUG = true;

export default class KlystronPod extends Actor {
  /**
   * Klystron Pod - Creates an orb and a surrounding sensor area
   * For the Player to make contact with the orb - he must be in the sensor
   * area for a duration.
   *
   * When successful locking contact is made - the sensor is destroyed, and the orb
   * released and constrained to the player with a p2 revolute joint.
   *
   * @constructor
   * @param params
   */
  constructor(params) {
    super(params);
    this.sprite = null;
    this.body = null;
    this.sensorBody = null;
    this.active = false;
    this.isClean = true;
    let loader = Loader.shared;
    this.gameData = loader.resources[global.ASSETS.levelDataPath].data;
    this.levelData = this.gameData.data[0];
    this.createPod();
    this.createSensor();
    if (DEBUG) {
      this.initDebug();
    }
  }

  createSensor() {
    let x = this.levelData.orb.x + this.levelData.world.width;
    let y = this.levelData.orb.y;
    let radius = RADIUS * 6;
    let shape = new p2.Circle({
      radius: pxm(radius),
    });
    shape.collisionResponse = true;
    shape.sensor = true;
    shape.collisionGroup = global.COLLISIONS.ORB_SENSOR;
    shape.collisionMask = global.COLLISIONS.SHIP_SENSOR;
    this.sensorBody = new p2.Body({
      position: [pxm(x), pxm(y)],
    });
    this.sensorBody.addShape(shape);
    this.sensorBody.parent = this;
    this.world.addBody(this.sensorBody);
    if (DEBUG) {
      let spr = new Sprite();
      let sensorDbg = new Graphics();
      this.debugSensor = new BodyDebug(spr, sensorDbg, this.sensorBody, {});
      this.camera.world.addChild(spr);
      spr.addChild(sensorDbg);
    }
  }

  createPod() {
    let graphics = new Graphics();
    graphics.lineStyle(3, 0x00ff00, 1);
    graphics.drawCircle(0, 0, RADIUS);
    this.sprite = new Sprite();
    this.sprite.addChild(graphics);
    this.sprite.anchor.set(0.5,0.5);
    this.camera.world.addChild(this.sprite);
    this.active = true;
    let x = this.levelData.orb.x + this.levelData.world.width;
    let y = this.levelData.orb.y;
    let shape = new p2.Circle({
      radius: pxm(RADIUS)
    });
    shape.collisionGroup = global.COLLISIONS.ORB;
    shape.collisionMask = global.COLLISIONS.LAND | global.COLLISIONS.SHIP | global.COLLISIONS.BULLET;
    this.body = new p2.Body({
      gravityScale: 0,
      mass: 1,
      angularVelocity: 0,
      position: [pxm(x), pxm(y)]
    });
    this.body.addShape(shape);
    this.body.parent = this;
    this.world.addBody(this.body);
  }

  initDebug() {
    let spr = new Sprite();
    let graphics = new Graphics();
    this.debug = new BodyDebug(spr, graphics, this.body, {});
    this.camera.world.addChild(spr);
    spr.addChild(graphics);
  }

  update() {
    if (this.isClean) {
      this.sprite.position.x = mpx(this.body.position[0]);
      this.sprite.position.y = mpx(this.body.position[1]);
    }
    this.sprite.rotation = this.body.angle;
    this.sprite.visible = this.active;
    if (DEBUG) {
      this.debug.updateSpriteTransform();
    }
  }

  destroySensor() {
    this.world.removeBody(this.sensorBody);
    this.sensorBody = null;
    if (DEBUG) {
      this.camera.world.removeChild(this.debugSensor.sprite);
      this.debugSensor = null;
    }
  }

  connect() {
    this.body.gravityScale = 1;
    this.destroySensor();
  }

  resetPosition() {
    let x = this.levelData.orb.x + this.levelData.world.width;
    let y = this.levelData.orb.y;
    let angle = 0;
    this.body.gravityScale = 0;
    super.resetPosition(x, y, angle);
    if (this.sensorBody) {
      this.sensorBody.position = [pxm(x), pxm(y)];
      this.sensorBody.angle = angle;
      this.sensorBody.angularVelocity = 0;
      this.sensorBody.velocity = [0,0];
      this.sensorBody.setZeroForce();
    } else {
      this.createSensor();
    }
    this.update();
  }

  destroy() {
    this.active = false;
    this.world.removeBody(this.body);
    this.body.setZeroForce();
    this.body.angularVelocity = 0;
  }


}