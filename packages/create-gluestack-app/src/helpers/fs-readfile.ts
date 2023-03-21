/**
 * @file helpers/fs-readfiile.ts
 * @description Helper function to read file contents
 * @author Faiz A. Farooqui <faizahmed.in@gmail.com> (https://faizahmed.in)
 */

import { readFile } from 'fs/promises';

export const readfile = async (filepath: string): Promise<string> => {
  return await readFile(filepath, 'utf8');
};
