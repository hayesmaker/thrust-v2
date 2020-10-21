import MockDate from 'mockdate'

import CommandManager from "../../src/commands/CommandManager";

describe("Command Manager", () => {
    beforeEach(() => {

    });

    it("Main instantiates ok", () => {
        let commandManager = new CommandManager();
        expect(commandManager).toBeTruthy();
    });

    it("Main initialises with defaults ok", () => {
        var currentTimestamp = 819170640000
        MockDate.set(currentTimestamp);
        let commandManager = new CommandManager();
        expect(commandManager.isPlaying).toEqual(false);
        expect(commandManager.oldTime).toEqual(currentTimestamp);
        expect(commandManager.replay).toEqual([]);
    });

    




});
