"use strict";
/**
 * @file helpers/typeof.ts
 * @description Helper function to returns the type of the value passed in
 * @author Faiz A. Farooqui <faizahmed.in@gmail.com> (https://faizahmed.in)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOf = void 0;
const typeOf = (value) => {
    return Object
        .prototype
        .toString
        .call(value)
        .slice(8, -1)
        .toLowerCase();
};
exports.typeOf = typeOf;
