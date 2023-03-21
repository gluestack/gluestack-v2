#!/usr/bin/env node
"use strict";
/**
 * @file index.ts
 * @description Entry point for the CLI
 * @author Faiz A. Farooqui <faizahmed.in@gmail.com> (https://faizahmed.in)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("./libraries/commander"));
commander_1.default.register();
