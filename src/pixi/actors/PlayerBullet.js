import {mpx, pxm, mpxi, pxmi} from '../utils/Pixi2P2';
import p2  from 'p2';
import BodyDebug from '../rendering/body-debug';

const DEBUG = false;
const MAX_LIFESPAN = 60;

export default class PlayerBullet {
  constructor(camera, world) {
    this.camera = camera;
    this.world = world;
    /**
     * 350 is the previous firing magnitude default
     * trying 400 now to see if it plays better
     *
     * @property bulletSpeed
     * @type {number}
     * @default 350
     */
    this.bulletSpeed = 10;
    this.index = -1;
    /**
     * @property lifespan
     * @type {number}
     */
    this.lifespan = MAX_LIFESPAN;
    /**
     * @property halfPi
     * @type {number}
     */
    this.halfPi = Math.PI * 0.5;
    this.active = false;
    this.sprite = null;
    this.debugSpr = null;
    this.createSprite();
    this.createBody();
    if (DEBUG) {
      this.initDebug();
    }
    this.w = 15;
    this.h = 2;
  }

  createSprite() {
    let graphics = new Graphics();
    graphics.lineStyle(1, 0x4affff, 1);
    graphics.drawRect(-7.5,-0.5, 15, 1);
    this.sprite = new Sprite();
    this.sprite.addChild(graphics);
    this.sprite.anchor.set(0.5,0.5);
  }

  createBody() {
    let shape = new p2.Box({
      width: pxm(15), height: pxm(2)
    });
    shape.collisionGroup = global.COLLISIONS.BULLET;
    shape.collisionMask = global.COLLISIONS.LAND | global.COLLISIONS.ORB;
    this.body = new p2.Body({
      gravityScale: 0,
      mass: 1,
      angularVelocity: 0
    });
    this.body.addShape(shape);
    this.body.parent = this;
  }

  initDebug(camera) {
    this.debugSpr = new Sprite();
    let graphics = new Graphics();
    this.debug = new BodyDebug(spr, graphics, this.body, {});
    this.debugSpr.addChild(graphics);
  }

  update() {
    console.log("Bullet active", this.lifespan);
    this.sprite.position.x = mpx(this.body.position[0]);
    this.sprite.position.y = mpx(this.body.position[1]);
    this.sprite.rotation = this.body.angle;
    //this.sprite.visible = this.active;
    this.lifespan--
    if (this.lifespan < 0) {
      this.destroy();
    }
    if (DEBUG) {
      this.debug.updateSpriteTransform();
    }
  }

  fire(player) {
    this.active = true;
    this.camera.world.addChild(this.sprite);
    this.world.addBody(this.body);
    this.lifespan = MAX_LIFESPAN;
    let angle = player.body.angle - this.halfPi;
    let r = player.sprite.width * 0.5;
    let x = player.sprite.position.x + Math.cos(angle) * r;
    let y = player.sprite.position.y + Math.sin(angle) * r;
    this.body.position = [pxm(x), pxm(y)];
    this.body.velocity = [this.bulletSpeed * Math.cos(angle), this.bulletSpeed * Math.sin(angle)];
    this.body.angle = angle;
    if (DEBUG) {
      camera.world.addChild(this.debugSpr);
    }
  }

  destroy() {
    this.world.removeBody(this.body);
    this.camera.world.removeChild(this.sprite);
    this.body.setZeroForce();
    this.body.angularVelocity = 0
    this.lifespan = 0;
    this.active = false;
  }


}