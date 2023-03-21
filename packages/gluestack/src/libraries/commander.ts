/**
 * @file libraries/commander.ts
 * @description CommanderJS library
 * @author Faiz A. Farooqui <faizahmed.in@gmail.com> (https://faizahmed.in)
 */

import { join } from 'path';
import { Command } from 'commander';
import { readdir } from 'fs/promises';

import packageJSON from '../../package.json';

export default class Commander {
  public cwd: string = process.cwd();
  public program: Command = new Command();

  public static async register() {
    const command = new Commander();
    await command.init();
    await command.addCommands();
    await command.close();
  }

  public async init() {
    this.program
      .name('gluestack')
      .version(packageJSON.version)
      .description('Gluestack V2 CLI tool');
  }

  public async addCommands () {
    const files: string[] = await readdir(join(__dirname, '../commands'));

    for await (const file of files) {
      if (!file.endsWith('.js')) {
        continue;
      }

      const commands = await import('../commands/' + file.replace('.js', ''));
      commands.default(this.program);
    }
  }

  public async close () {
    this.program.parseAsync();
  }
}
