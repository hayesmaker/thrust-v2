import {Graphics, Loader} from "pixi.js";
import p2  from 'p2';
import {pxm} from '../utils/Pixi2P2';

const LOCKING_DURATION = 800;
const LINE_WIDTH = 3;
const LINE_COLOUR = 0xff0000;
const LINE_ALPHA = 0.4;
const LINE_ALPHA_GRABBED = 0.6;
const LINE_COLOUR_GRABBED = 0x4affff;

/**
 * @class TractorBeam
 */
export default class TractorBeam {
    /**
     * TractorBeam - Links an orb to the player when in the surrounding sensor area
     * @constructor
     * @param params
     */
    constructor(params) {
        this.camera = params.camera;
        this.world = params.world;
        this.player = params.player;
        this.orb = params.orb;

        this.isLocking = false;
        this.isLocked = false;
        this.hasGrabbed = false;
        this.timeout = null;
        this.constraint = null;

        let loader = Loader.shared;
        let gameData = loader.resources[global.ASSETS.levelDataPath].data;
        let levelData = gameData.data[0];
        this.levelWidth = levelData.world.width;

        this.graphics = new Graphics();
        this.camera.world.addChild(this.graphics);
    }

    update() {
        if (this.player && this.player.body) {
            if (this.isLocking || this.hasGrabbed) {
                this.drawBeam();
            }
        }
    }

    unlock() {
        this.isLocked = false;
    }

    lock() {
        this.player.hasGrabbed = true;
        this.hasGrabbed = true;
        this.isLocked = true;
    }

    beginConnect() {
        if (!this.isLocking) {
            this.isLocking = true;
            this.timeout = setTimeout(this.lock.bind(this), LOCKING_DURATION);
        }
    }

    endConnect() {
        clearTimeout(this.timeout);
        if (!this.isLocked) {
            //connection unsuccessful clear graphics
            this.isLocking = false;
            this.hasGrabbed = false;
            this.graphics.clear();
        } else if (this.player.isAlive) {
            //Klystron Pod connection successful - lock constraint to ship
            var maxForce = 200000;
            var diffX = this.player.sprite.position.x - this.orb.sprite.position.x;
            var diffY = this.player.sprite.position.y - this.orb.sprite.position.y;
            this.constraint = new p2.RevoluteConstraint(this.player.body, this.orb.body, {
                localPivotA: [0,0],
                localPivotB: [pxm(diffX), pxm(diffY)],
                maxForce,
            });
            this.world.addConstraint(this.constraint);
            this.orb.body.mass = 1;
            this.orb.body.gravityScale = 1;
            this.orb.destroySensor();
            // this.orb.body.velocity = 0;
            // this.orb.body.angularVelocity = 0;
            // this.orb.body.angle = 0;

        }
    }

    drawBeam() {
        this.graphics.clear();
        if (this.hasGrabbed) {
            this.graphics.lineStyle(LINE_WIDTH, LINE_COLOUR_GRABBED, LINE_ALPHA_GRABBED);
        } else {
            this.graphics.lineStyle(LINE_WIDTH, LINE_COLOUR, LINE_ALPHA);
        }

        /*
        if (px < this.levelWidth) {
              this.isCleanLeft = false;
              this.body.position[0] = pxm(this.levelWidth * 2);
              this.orb.body.position[0] = this.orb.body.position[0] + pxm(this.levelWidth);
            }
            if (px > this.levelWidth * 2) {
              this.isCleanRight = false;
              this.body.position[0] = pxm(this.levelWidth);
              this.orb.body.position[0] = this.orb.body.position[0] - pxm(this.levelWidth);
    }
         */

        this.graphics.moveTo(this.orb.sprite.position.x, this.orb.sprite.position.y);
        this.graphics.lineTo(this.player.sprite.position.x, this.player.sprite.position.y);

        /*
        if (this.player.isCleanLeft && this.player.isCleanRight) {
            this.graphics.moveTo(this.orb.sprite.position.x, this.orb.sprite.position.y);
            this.graphics.lineTo(this.player.sprite.position.x, this.player.sprite.position.y);
        } else if (!this.player.isCleanLeft) {
            //player has been warped to the right of the map
            this.graphics.moveTo(this.orb.sprite.position.x - this.levelWidth, this.orb.sprite.position.y);
            this.graphics.lineTo(this.player.sprite.position.x, this.player.sprite.position.y);
        } else if (!this.player.isCleanRight) {
            this.graphics.moveTo(this.orb.sprite.position.x + this.levelWidth, this.orb.sprite.position.y);
            this.graphics.lineTo(this.player.sprite.position.x, this.player.sprite.position.y);
        }*/
    }




}