
import * as PIXI from "pixi.js";
jest.mock('pixi.js');

import PixiLauncher from "../src/pixi/launcher";

describe("noo", () => {
  beforeEach(() => {
    const fakeView = document.createElement('div');
    PIXI.autoDetectRenderer.mockImplementation(() => {
      return {
        view: fakeView,
        render: jest.fn()
      }
    });
    PIXI.Loader = {
      shared: {
        add: jest.fn(),
        load: jest.fn()
      }
    }
  });

  it("Main instantiates ok", () => {
    let launcher = new PixiLauncher();
    expect(launcher).toBeTruthy();
  });
});
