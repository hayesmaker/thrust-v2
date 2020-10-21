import PlayerBullet from '../actors/PlayerBullet';
import Pool from './Pool';

export default class BulletPool extends Pool {

  constructor(camera, world) {
    super({size: 100, camera, world});
  }

  create(camera, world) {
    return new PlayerBullet(camera, world);
  }

  destroy(bullet) {
    bullet.destroy();
    return this;
  }
};
