"use strict";
/**
 * @file helpers/fs-readfiile.ts
 * @description Helper function to read file contents
 * @author Faiz A. Farooqui <faizahmed.in@gmail.com> (https://faizahmed.in)
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readfile = void 0;
const promises_1 = require("fs/promises");
const readfile = (filepath) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, promises_1.readFile)(filepath, 'utf8');
});
exports.readfile = readfile;
