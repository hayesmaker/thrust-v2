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

    it("Adding Command should populate a replay with correct timestamp", () =>{
        var currentTimestamp = 819170640000
        MockDate.set(currentTimestamp);
        let commandManager = new CommandManager();
        let command1 = {
            execute: jest.fn(),
        }
        currentTimestamp = 819170640020;
        MockDate.set(currentTimestamp);

        commandManager.addCommand(command1);
        expect(commandManager.replay.length).toBe(1);
        expect(commandManager.replay[0]).toEqual({
            command: command1,
            time: 20
        });
    });
    
    it("Adding 4000 commands should populate a replay array with correct commands", () => {
        var currentTimestamp = 819170640000;
        MockDate.set(currentTimestamp);
        let commandManager = new CommandManager();
        let command1 = {
            execute: jest.fn(),
        }
        for (let i = 0; i < 40000; i++) {
            currentTimestamp += 20;    //80000
            MockDate.set(currentTimestamp);
            commandManager.addCommand(command1);
        }
        expect(commandManager.replay.length).toBe(40000);
        expect(commandManager.oldTime).toBe(819171440000);
    });





});
