import {pxm} from "../utils/Pixi2P2";


export default class Actor {

    constructor(params) {
        this.world = params.world;
        this.camera = params.camera;
        this.body = null;
        this.sprite = null;
    }

    createSprite() {

    }

    createBody() {


    }

    resetPosition(x, y, angle) {
        this.body.position = [pxm(x), pxm(y)];
        this.body.angle = angle;
        this.body.angularVelocity = 0;
        this.body.velocity = [0,0];
        this.body.setZeroForce();
    }

    update() {

    }


}