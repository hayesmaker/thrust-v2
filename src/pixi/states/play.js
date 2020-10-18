import p2 from 'p2';
import Camera from '../rendering/camera';
import TiledLevelMap from '../levels/TiledLevelMap';
import BulletPool from '../utils/BulletPool';
import Player from '../actors/Player';
import KlystronPod from "../actors/KlystronPod"
import TractorBeam from "../actors/TractorBeam";
import InputHandler from '../commands/InputHandler';

import {TweenLite, TimelineLite, Elastic, Power1} from 'gsap';

const LEVEL_WORLD_HEIGHT = 1000;
const LEVEL_WIDTH = 768;
const INITIAL_ZOOM = 1;
const FURTHER_ZOOM = 2;
const REQUIRED_FPS = 30;
const REQUIRED_GRAVITY = 1;

export default class Play {
  constructor(stage, renderer) {
    this.stage = stage;
    this.renderer = renderer;
    this.camera = new Camera(this.stage, this.renderer);
    this.hasStarted = false;
    this.isPaused = false;
  }

  start() {
    this.hasStarted = true;
    this.create();
  }

  create() {
    //initialise physics world
    this.world = new p2.World({gravity: [0, REQUIRED_GRAVITY]});
    this.world.setGlobalStiffness(1e18);
    this.world.defaultContactMaterial.restitution = 0.1;
    this.addDebugBg();
    //create actors
    this.bulletPool = new BulletPool(this.camera, this.world);
    this.map = new TiledLevelMap(this.camera, this.world);
    this.player = new Player(this.camera, this.world);
    this.player.setBullets(this.bulletPool);
    this.klystronPod = new KlystronPod(this.camera, this.world);
    this.tractorBeam = new TractorBeam({camera: this.camera, world: this.world, player: this.player, orb: this.klystronPod});


    //init collisions
    //impact
    this.world.on(
        "impact", (evt) => {
          let bodyA = evt.bodyA;
          let bodyB = evt.bodyB;
          let aGroup = bodyA.shapes[0].collisionGroup;
          let bGroup = bodyB.shapes[0].collisionGroup;
          if (aGroup ===global.COLLISIONS.LAND && bGroup === global.COLLISIONS.BULLET) {
            this.checkBulletToGround(bodyB, bodyA);
          }
          if (aGroup ===global.COLLISIONS.ORB && bGroup === global.COLLISIONS.BULLET) {
            this.checkBulletToGround(bodyB, bodyA);
          }
        });
    //overlap
    this.world.on(
        "beginContact", (evt) => {
          let bodyA = evt.bodyA;
          let bodyB = evt.bodyB;
          let aGroup = bodyA.shapes[0].collisionGroup;
          let bGroup = bodyB.shapes[0].collisionGroup;
          if ((aGroup === global.COLLISIONS.ORB_SENSOR && bGroup === global.COLLISIONS.SHIP_SENSOR) ||
              (aGroup === global.COLLISIONS.SHIP_SENSOR && bGroup === global.COLLISIONS.ORB_SENSOR)) {
            console.log("play :: world.on (beginContact) :: evt", evt);
            this.tractorBeam.beginConnect();
          }
        }
    )
    this.world.on(
        "endContact", (evt) => {
          let bodyA = evt.bodyA;
          let bodyB = evt.bodyB;
          let aGroup = bodyA.shapes[0].collisionGroup;
          let bGroup = bodyB.shapes[0].collisionGroup;
          if ((aGroup === global.COLLISIONS.ORB_SENSOR && bGroup === global.COLLISIONS.SHIP_SENSOR) ||
              (aGroup === global.COLLISIONS.SHIP_SENSOR && bGroup === global.COLLISIONS.ORB_SENSOR)) {
            console.log("play :: world.on (endContact) :: evt", evt);
            this.tractorBeam.endConnect();
          }
        }
    )

    //init controls
    this.inputHanlder = new InputHandler(this, this.player);
    this.inputHanlder.initPlayCommands();
    this.inputHanlder.initKeyboardControl();
  }

  checkBulletToGround(bullet, impact) {
    let impactGroup = impact.shapes[0].collisionGroup;
    //Bullet hits terrain
    if (impactGroup === global.COLLISIONS.LAND) {
      if (bullet.parent.active) {
        this.bulletPool.release(bullet.parent);
      }
    }
    //Bullet hits klystron pod
    if (impactGroup === global.COLLISIONS.ORB) {
      if (bullet.parent.active) {
        this.bulletPool.release(bullet.parent);
      }
    }
  }

  addDebugBg() {
    let graphics = new Graphics();
    graphics.lineStyle(2, 0x00ff00, 0.25);
    let spr = new Sprite();
    this.camera.world.addChild(spr);
    spr.x = 0;
    spr.y = 0;
    spr.addChild(graphics);
    let x = 0,
      y = 0,
      w = (LEVEL_WIDTH * INITIAL_ZOOM) * 2,
      h = LEVEL_WORLD_HEIGHT,
      hSpc = 100,
      vSpc = 100;
    let numCols = w / hSpc;
    let numRows = h / vSpc;
    graphics.moveTo(x, y);
    for (let i = 0; i < numCols; i++) {
      graphics.moveTo(i * hSpc, y);
      graphics.lineTo(i * hSpc, h);
    }
    graphics.moveTo(x, y);
    for (let i = 0; i < numRows; i++) {
      graphics.moveTo(x, 1000 - i * vSpc);
      graphics.lineTo(w, 1000 - i * vSpc);
    }
  }

  /**
   * @method play.update
   * @param deltaFrame
   */
  update(deltaFrame) {
    if (this.isPaused) {
      return;
    }
    if (!this.hasStarted) {
      this.start();
    }
    this.inputHanlder.handleInput();
    if (this.player.sprite.position.y >= 600) {
      TweenLite.to(this.camera, 2.5, {zoomLevel: FURTHER_ZOOM});
    } else {
      TweenLite.to(this.camera, 2.5, {zoomLevel: INITIAL_ZOOM});
    }
    this.camera.update();
    this.world.step(1 / 60, deltaFrame, 1);
    //this.world.step(deltaFrame / REQUIRED_FPS);
    if (this.player) {
      this.player.update(deltaFrame);
    }
    if (this.klystronPod)
    {
      this.klystronPod.update(deltaFrame);
    }
    if (this.tractorBeam) {
      this.tractorBeam.update(deltaFrame);
    }
  }


  /**
   * @deprecated
   * @returns {number}
   */
  calculateSpeed() {
    return Math.sqrt(
      Math.pow(this.boxBody.velocity[0], 2) +
      Math.pow(this.boxBody.velocity[1], 2)
    );
  }
}
