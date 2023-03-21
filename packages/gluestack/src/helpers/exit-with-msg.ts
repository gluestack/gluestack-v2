/**
 * @file helpers/exit-with-msg.ts
 * @description Helper function to print a message and exit the CLI with a code
 * @author Faiz A. Farooqui <faizahmed.in@gmail.com> (https://faizahmed.in)
 */

export const exitWithMsg = async (
  msg: unknown, code: number = -1
): Promise<void> => {
  console.log(msg);
  process.exit(code);
};
