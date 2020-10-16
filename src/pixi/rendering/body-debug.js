import p2 from 'p2';
import {mpx, pxm, mpxi, pxmi} from '../utils/Pixi2P2';
import _ from 'lodash';

export default class BodyDebug {

   constructor(sprite, graphics, body, settings) {
     this.sprite = sprite;
     /**
      * @property {object} defaultSettings - Default debug settings.
      * @private
      */
     var defaultSettings = {
       pixelsPerLengthUnit: mpx(1),
       debugPolygons: false,
       lineWidth: 1,
       alpha: 0.25
     };

     this.settings = _.merge(defaultSettings, settings);
     this.ppu = this.settings.pixelsPerLengthUnit;
     // this.ppu = -1 * this.ppu;
     this.body = body;
     this.canvas = graphics;
     this.canvas.alpha = this.settings.alpha;
     this.draw();
     this.updateSpriteTransform();
   }

  /**
   * Core update.
   *
   * @method Phaser.Physics.P2.BodyDebug#updateSpriteTransform
   */
  updateSpriteTransform () {
    this.sprite.position.x = Math.round(this.body.position[0] * this.ppu);
    this.sprite.position.y = Math.round(this.body.position[1] * this.ppu);
    this.sprite.rotation = this.body.angle;
  }

  /**
   * Draws the P2 shapes to the Graphics object.
   *
   * @method Phaser.Physics.P2.BodyDebug#draw
   */
  draw () {
    let angle, child, color, graphics, i, j, lineColor, lw, obj, offset, v, verts, vrot, _j, _ref1;
    obj = this.body;
    graphics = this.canvas;
    graphics.clear();
    color = parseInt(this.randomPastelHex(), 16);
    lineColor = 0xff0000;
    lw = this.lineWidth;

    if (obj instanceof p2.Body && obj.shapes.length)
    {
      var l = obj.shapes.length;

      i = 0;

      while (i !== l)
      {
        child = obj.shapes[i];
        offset = child.position || 0;
        angle = child.angle || 0;

        if (child instanceof p2.Circle)
        {
          this.drawCircle(graphics, offset[0] * this.ppu, offset[1] * this.ppu, angle, child.radius * this.ppu, color, lw);
        }
        else if (child instanceof p2.Capsule)
        {
          this.drawCapsule(graphics, offset[0] * this.ppu, offset[1] * this.ppu, angle, child.length * this.ppu, child.radius * this.ppu, lineColor, color, lw);
        }
        else if (child instanceof p2.Plane)
        {
          this.drawPlane(graphics, offset[0] * this.ppu, -offset[1] * this.ppu, color, lineColor, lw * 5, lw * 10, lw * 10, this.ppu * 100, angle);
        }
        else if (child instanceof p2.Line)
        {
          this.drawLine(graphics, child.length * this.ppu, lineColor, lw);
        }
        else if (child instanceof p2.Box)
        {
          this.drawRectangle(graphics, offset[0] * this.ppu, offset[1] * this.ppu, angle, child.width * this.ppu, child.height * this.ppu, lineColor, color, lw);
        }
        else if (child instanceof p2.Convex)
        {
          verts = [];
          vrot = p2.vec2.create();

          for (j = _j = 0, _ref1 = child.vertices.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j)
          {
            v = child.vertices[j];
            p2.vec2.rotate(vrot, v, angle);
            verts.push([(vrot[0] + offset[0]) * this.ppu, -(vrot[1] + offset[1]) * this.ppu]);
          }

          this.drawConvex(graphics, verts, child.triangles, lineColor, color, lw, this.settings.debugPolygons, [offset[0] * this.ppu, -offset[1] * this.ppu]);
        }

        i++;
      }
    }

  }

  /**
   * Draws a p2.Convex to the Graphics object.
   *
   * @method Phaser.Physics.P2.BodyDebug#drawConvex
   * @private
   */
  drawConvex (g, verts, triangles, color, fillColor, lineWidth, debug, offset) {
    var colors, i, v, v0, v1, x, x0, x1, y, y0, y1;

    if (lineWidth === undefined) { lineWidth = 1; }
    if (color === undefined) { color = 0x000000; }

    if (!debug)
    {
      g.lineStyle(lineWidth, color, 1);
      g.beginFill(fillColor);
      i = 0;

      while (i !== verts.length)
      {
        v = verts[i];
        x = v[0];
        y = v[1];

        if (i === 0)
        {
          g.moveTo(x, -y);
        }
        else
        {
          g.lineTo(x, -y);
        }

        i++;
      }

      g.endFill();

      if (verts.length > 2)
      {
        g.moveTo(verts[verts.length - 1][0], -verts[verts.length - 1][1]);
        return g.lineTo(verts[0][0], -verts[0][1]);
      }
    }
    else
    {
      colors = [0xff0000, 0x00ff00, 0x0000ff];
      i = 0;

      while (i !== verts.length + 1)
      {
        v0 = verts[i % verts.length];
        v1 = verts[(i + 1) % verts.length];
        x0 = v0[0];
        y0 = v0[1];
        x1 = v1[0];
        y1 = v1[1];
        g.lineStyle(lineWidth, colors[i % colors.length], 1);
        g.moveTo(x0, -y0);
        g.lineTo(x1, -y1);
        g.drawCircle(x0, -y0, lineWidth * 2);
        i++;
      }

      g.lineStyle(lineWidth, 0x000000, 1);
      return g.drawCircle(offset[0], offset[1], lineWidth * 2);
    }

  }

  /**
   * Picks a random pastel color.
   *
   * @method Phaser.Physics.P2.BodyDebug#randomPastelHex
   * @private
   */
  randomPastelHex () {
    let blue, green, mix, red;
    mix = [255, 255, 255];
    red = Math.floor(Math.random() * 256);
    green = Math.floor(Math.random() * 256);
    blue = Math.floor(Math.random() * 256);
    red = Math.floor((red + 3 * mix[0]) / 4);
    green = Math.floor((green + 3 * mix[1]) / 4);
    blue = Math.floor((blue + 3 * mix[2]) / 4);
    return this.rgbToHex(red, green, blue);
  }

  /**
   * Converts from RGB to Hex.
   *
   * @method Phaser.Physics.P2.BodyDebug#rgbToHex
   * @private
   */
  rgbToHex (r, g, b) {
    return this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }

  /**
   * Component to hex conversion.
   *
   * @method Phaser.Physics.P2.BodyDebug#componentToHex
   * @private
   */
  componentToHex (c) {

    var hex;
    hex = c.toString(16);

    if (hex.length === 2)
    {
      return hex;
    }
    else
    {
      return hex + '0';
    }

  }

  /**
   * Draws a p2.Box to the Graphics object.
   *
   * @method drawRectangle
   * @private
   */
  drawRectangle (g, x, y, angle, w, h, color, fillColor, lineWidth) {

    if (lineWidth === undefined) { lineWidth = 1; }
    if (color === undefined) { color = 0x000000; }

    g.lineStyle(lineWidth, color, 1);
    g.beginFill(fillColor);
    g.drawRect(x - w / 2, y - h / 2, w, h);

  }


  /**
   * Draws a p2.Line to the Graphics object.
   *
   * @method drawLine
   * @private
   */
  drawLine (g, len, color, lineWidth) {

    if (lineWidth === undefined) { lineWidth = 1; }
    if (color === undefined) { color = 0x000000; }

    g.lineStyle(lineWidth * 5, color, 1);
    g.moveTo(-len / 2, 0);
    g.lineTo(len / 2, 0);

  }

  /**
   * Draws a p2.Circle to the Graphics object.
   *
   * @method Phaser.Physics.P2.BodyDebug#drawCircle
   * @private
   */
  drawCircle (g, x, y, angle, radius, color, lineWidth) {

    if (lineWidth === undefined) { lineWidth = 1; }
    if (color === undefined) { color = 0xffffff; }
    g.lineStyle(lineWidth, 0x000000, 1);
    g.beginFill(color, 1.0);
    g.drawCircle(x, y, radius);
    g.endFill();
    g.moveTo(x, y);
    g.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));

  }


}

