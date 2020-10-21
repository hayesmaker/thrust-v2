export const LOOKUPS = {
  /**
   *
   */
  ASSETS: {
    textureAtlasPath: 'assets/atlas/combined.json',
    levelDataPath: 'assets/levels/classic.json',
    level1PhysicsPath: 'assets/physics-new/level-1-phyics.json'
  },
  /**
   *
   */
  COLLISIONS: {
    SHIP:Math.pow(2,0),
    BULLET:Math.pow(2,1),
    LAND:Math.pow(2,2),
    ORB:Math.pow(2, 3),
    ORB_SENSOR:Math.pow(2, 4),
    SHIP_SENSOR:Math.pow(2, 5),
  }
}

/**
 * @deprecated
 */
export default class Lookups {
  constructor() {}
  static init() {

    global.ASSETS = {
      textureAtlasPath: 'assets/atlas/combined.json',
      levelDataPath: 'assets/levels/classic.json',
      level1PhysicsPath: 'assets/physics-new/level-1-phyics.json'
    };

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