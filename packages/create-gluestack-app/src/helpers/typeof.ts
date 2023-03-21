/**
 * @file helpers/typeof.ts
 * @description Helper function to returns the type of the value passed in
 * @author Faiz A. Farooqui <faizahmed.in@gmail.com> (https://faizahmed.in)
 */

export const typeOf = (value: any): string => {
  return Object
    .prototype
    .toString
    .call(value)
    .slice(8, -1)
    .toLowerCase();
};
