import {times} from 'lodash';
import CommandManager from "../../src/commands/CommandManager";

describe("Command Manager", () => {
    beforeEach(() => {

    });

    it("Main constructor returns ok", () => {
        let commandManager = new CommandManager();
        expect(commandManager).toBeTruthy();
    });

    it("Main constructor initialises correct vars", () => {
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

    it("addCommand :: Adding Command should populate a replay given isSaving", () => {
        let commandManager = new CommandManager();
        commandManager.isSaving = true;
        let command1 = {
            execute: jest.fn(),
        }
        times(20, () => {
            commandManager.update();
        });
        commandManager.addCommand(command1);
        expect(commandManager.replay.length).toBe(1);
        expect(commandManager.replay[0]).toEqual({
            command: command1,
            frame: 20
        });
    });

    it("addCommand (multiple) :: Adding 4000 commands should populate a replay array with correct commands", () => {
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

    it("update :: given is playing and frame reached should execute command", () => {
        let commandManager = new CommandManager();
        commandManager.beginRecord();
        times(100, () => {
            commandManager.update();
        });
        let command = {
            execute: jest.fn(),
        }
        commandManager.addCommand(command);
        expect(commandManager.replay[0].frame).toEqual(100);
        commandManager.play(true);
        times(100, () => {
            commandManager.update();
        });
        expect(command.execute).toHaveBeenCalled();
    });

    it("update :: given is playing and frame not reached should not execute command", () => {
        let commandManager = new CommandManager();
        commandManager.beginRecord();
        times(100, () => {
            commandManager.update();
        });
        let command = {
            execute: jest.fn(),
        }
        commandManager.addCommand(command);
        expect(commandManager.replay[0].frame).toEqual(100);
        commandManager.play(true);
        times(99, () => {
            commandManager.update();
        });
        expect(command.execute).not.toHaveBeenCalled();
    });

    it("update :: given multiple commands should be able to execute on a single frame", () => {
        let commandManager = new CommandManager();
        commandManager.beginRecord();
        times(300, () => {
            commandManager.update();
        });
        let command1 = {execute: jest.fn()}
        let command2 = {execute: jest.fn()}
        let command3 = {execute: jest.fn()}
        let command4 = {execute: jest.fn()}
        let command5 = {execute: jest.fn()}
        commandManager.addCommand(command1);
        commandManager.addCommand(command2);
        commandManager.addCommand(command3);
        commandManager.addCommand(command4);
        times(1, () => {
            commandManager.update();
        });
        commandManager.addCommand(command5);
        commandManager.play(true);
        times(300, () => {
            commandManager.update();
        });
        expect(command1.execute).toHaveBeenCalled();
        expect(command2.execute).toHaveBeenCalled();
        expect(command3.execute).toHaveBeenCalled();
        expect(command4.execute).toHaveBeenCalled();
        expect(command5.execute).not.toHaveBeenCalled();
    });



});
