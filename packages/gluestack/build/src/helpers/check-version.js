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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            https_1.default
                .get("https://registry.npmjs.org/-/package/gluestack/dist-tags", (res) => {
                if (res.statusCode === 200) {
                    let body = "";
                    res.on("data", (data) => (body += data));
                    res.on("end", () => {
                        resolve(JSON.parse(body).latest);
                    });
                }
                else {
                    reject();
                }
            })
                .on("error", () => {
                reject();
            });
        });
    });
}
exports.default = default_1;
;
