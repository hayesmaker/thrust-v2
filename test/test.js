
import PixiLauncher from "../src/pixi/launcher";
import * as PIXI from "pixi.js";
// import { JSDOM } from "jsdom"
// const dom = new JSDOM(`<body></body>`)
// global.document = dom.window.document
// global.window = dom.window

jest.mock('pixi.js');

describe("noo", () => {
  beforeEach(() => {
    console.log("moo moo");
    console.log("autoDetectRender", PIXI.autoDetectRenderer);
    PIXI.autoDetectRenderer.mockClear();
  });

  it("Main instantiates ok", () => {
    console.log("body:", Node);
    let launcher = new PixiLauncher();
    // // let renderer = PIXI.autoDetectRenderer();
    // // console.log("renderer", renderer);
    //
    // expect(launcher).toBeTruthy();
  });
});
