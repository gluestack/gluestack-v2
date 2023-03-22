(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "child_process"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.run = void 0;
    const path_1 = require("path");
    const child_process_1 = require("child_process");
    // run:service website -p docker --ports 9001:3000
    const run = (command) => {
        const path = (0, path_1.join)(process.cwd(), '.glue/seal/scripts');
        return new Promise((resolve, reject) => {
            (0, child_process_1.execSync)(command, { cwd: path, stdio: 'inherit' });
        });
    };
    exports.run = run;
});
