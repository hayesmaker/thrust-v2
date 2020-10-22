import MockDate from 'mockdate'
import {times} from 'lodash';

import CommandManager from "../../src/commands/CommandManager";

describe("Command Manager", () => {
    beforeEach(() => {

    });

    it("Main instantiates ok", () => {
        let commandManager = new CommandManager();
        expect(commandManager).toBeTruthy();
    });

    it("Main initialises with defaults ok", () => {
        let commandManager = new CommandManager();
        expect(commandManager.isPlaying).toEqual(false);
        expect(commandManager.isSaving).toEqual(false);
        expect(commandManager.replay).toEqual([]);
        expect(commandManager.replayIndex).toBe(0);
        expect(commandManager.frameCommands).toEqual([]);
        expect(commandManager.executeFrameIndex).toBe(-1);
    });

    it("beginRecord should re-initialise defaults and init saving", () => {
        let commandManager = new CommandManager();
        commandManager.beginRecord();
        expect(commandManager.isPlaying).toEqual(false);
        expect(commandManager.isSaving).toEqual(true);
        expect(commandManager.replay).toEqual([]);
        expect(commandManager.replayIndex).toBe(0);
        expect(commandManager.frameCommands).toEqual([]);
        expect(commandManager.executeFrameIndex).toBe(-1);
    });

    it("Adding Command should populate a replay given isSaving", () =>{
        let commandManager = new CommandManager();
        commandManager.isSaving =true;
        let command1 = {
            execute: jest.fn(),
        }
        times(20, commandManager.update.bind(commandManager));
        commandManager.addCommand(command1);
        expect(commandManager.replay.length).toBe(1);
        expect(commandManager.replay[0]).toEqual({
            command: command1,
            frame: 20
        });
    });
    
    it("Adding 4000 commands should populate a replay array with correct commands", () => {
        let commandManager = new CommandManager();
        commandManager.isSaving = true;
        let command1 = {
            execute: jest.fn(),
        }
        for (let i = 0; i < 40000; i++) {
            commandManager.addCommand(command1);
        }
        expect(commandManager.replay.length).toBe(40000);
    });





});
