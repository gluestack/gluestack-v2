"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const colors = require('colors');
const { yarn, node, tsc } = require('../helpers/dependencies');
const { info, error } = require('../helpers/print');
const runDoctorPlugin = () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield Promise.allSettled([node()]);
    let failed = false;
    results.forEach((result) => {
        if (result.status === 'rejected' && result.reason) {
            info(result.reason, 'NO'.brightRed);
            failed = true;
        }
        if (result.status === 'fulfilled') {
            info(result.value, 'YES'.brightGreen);
        }
    });
    if (failed) {
        error(`Pre-requisites check for plugin init failed.`);
        process.exit(0);
    }
});
module.exports = runDoctorPlugin;
