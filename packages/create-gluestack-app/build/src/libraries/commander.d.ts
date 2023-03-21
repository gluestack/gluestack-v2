/**
 * @file libraries/commander.ts
 * @description CommanderJS library
 * @author Faiz A. Farooqui <faizahmed.in@gmail.com> (https://faizahmed.in)
 */
import { Command } from 'commander';
export default class Commander {
    cwd: string;
    program: Command;
    static register(): Promise<void>;
    init(): Promise<void>;
    addCommands(): Promise<void>;
    close(): Promise<void>;
}
