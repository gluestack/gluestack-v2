/**
 * @file helpers/fs-exists.ts
 * @description Helper function to check if a file exists
 * @author Faiz A. Farooqui <faizahmed.in@gmail.com> (https://faizahmed.in)
 */

import { access } from 'fs/promises';

export const exists = async (path: string): Promise<boolean | string> => {
  try {
    await access(path);
    return path;
  } catch (error) {
    return false;
  }
};
