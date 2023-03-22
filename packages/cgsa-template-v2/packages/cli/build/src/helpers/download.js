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
const getPlugin = require('./getPlugin');
const { info } = require('./print');
// const { copyFolder } = require('../helpers/file');
const exec = require('child_process').exec;
function execute(steps) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const step of steps) {
            yield new Promise((resolve, reject) => {
                exec(step, (error, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        reject(error);
                        return;
                    }
                    info(stdout);
                    resolve(true);
                }));
            });
        }
    });
}
module.exports = (pluginName, packageName) => __awaiter(void 0, void 0, void 0, function* () {
    info(`Installing '${pluginName}' from '${packageName}'`);
    yield execute([`npm install --save ${packageName}`]);
});
