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
const os_1 = require("os");
const colors_1 = __importDefault(require("colors"));
const semver_1 = __importDefault(require("semver"));
const fs_extra_1 = require("fs-extra");
const child_process_1 = require("child_process");
const path_1 = require("path");
const package_json_1 = __importDefault(require("../../package.json"));
const check_version_1 = __importDefault(require("../helpers/check-version"));
const execute_1 = require("../helpers/execute");
exports.default = (directoryName, template) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('> here in run..', directoryName, template);
    (0, check_version_1.default)()
        .catch(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return (0, child_process_1.execSync)("npm view gluestack version")
                .toString()
                .trim();
        }
        catch (e) {
            return 'v0.0.1';
        }
    }))
        .then((latest) => __awaiter(void 0, void 0, void 0, function* () {
        const version = latest;
        if (version && semver_1.default.lt(package_json_1.default.version, version)) {
            console.log();
            console.error(colors_1.default.yellow(`You are running "gluestack" ${package_json_1.default.version}, which is behind the latest release (${version}).\n` +
                "We recommend always using the latest version of \"gluestack\" if possible."));
            console.log();
        }
        else {
            yield createApp(directoryName, template);
            console.log('createApp called..');
        }
    }));
    ;
});
const createApp = (name, template) => __awaiter(void 0, void 0, void 0, function* () {
    const root = (0, path_1.resolve)(name);
    const appName = (0, path_1.basename)(root);
    yield (0, fs_extra_1.ensureDir)(name);
    console.log();
    console.log(`Creating a new gluestack app in ${colors_1.default.green(root)}.`);
    console.log();
    const packageJson = {
        name: appName,
        private: true,
    };
    yield (0, fs_extra_1.writeFile)((0, path_1.join)(root, "package.json"), JSON.stringify(packageJson, null, 2) + os_1.EOL);
    yield (0, fs_extra_1.writeFile)((0, path_1.join)(root, ".npmrc"), `legacy-peer-deps=true\nengine-strict=true` + os_1.EOL);
    const originalDirectory = process.cwd();
    process.chdir(root);
    yield run(root, appName, originalDirectory, template);
});
const run = (root, appName, originalDirectory, template) => __awaiter(void 0, void 0, void 0, function* () {
    const templateToInstall = yield getTemplateInstallPackage(template, originalDirectory);
    return install([templateToInstall])
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield copyToRoot(root, appName, templateToInstall);
    }))
        .catch((reason) => {
        console.log();
        console.log("Aborting installation.");
        if (reason.command) {
            console.log(`  ${colors_1.default.cyan(reason.command)} has failed.`);
        }
        else {
            console.log(colors_1.default.red("Unexpected error. Please report it as a bug:"));
            console.log(reason);
        }
        console.log();
    });
});
const copyToRoot = (root, appName, template) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield (0, fs_extra_1.exists)(`${root}/node_modules/${template}`)) {
        yield (0, fs_extra_1.copy)(`${root}/node_modules/${template}`, root);
    }
    if (yield (0, fs_extra_1.exists)(`${root}/package.json`)) {
        const raw = yield (0, fs_extra_1.readFile)(`${root}/package.json`, 'utf8');
        const json = JSON.parse(raw);
        json.name = appName;
        json.version = "0.0.1";
        json.private = true;
        yield (0, fs_extra_1.writeFile)((0, path_1.join)(root, "package.json"), JSON.stringify(json, null, 2) + os_1.EOL);
    }
});
const install = (dependencies) => __awaiter(void 0, void 0, void 0, function* () {
    let command;
    let args;
    command = "npm";
    args = [
        "install",
        "--no-audit",
        "--save",
        "--save-exact",
        "--loglevel",
        "error",
    ].concat(dependencies);
    yield (0, execute_1.execute)(command, args, { stdio: 'inherit' });
});
const getTemplateInstallPackage = (template, originalDirectory) => __awaiter(void 0, void 0, void 0, function* () {
    let templateToInstall = "cgsa-template-v2";
    if (template) {
        if (template.match(/^file:/)) {
            templateToInstall = `file:${(0, path_1.resolve)(originalDirectory, template.match(/^file:(.*)?$/)[1])}`;
        }
        else if (template.includes("://") ||
            template.match(/^.+\.(tgz|tar\.gz)$/)) {
            // for tar.gz or alternative paths
            templateToInstall = template;
        }
        else {
            // Add prefix 'cgsa-template-' to non-prefixed templates, leaving any
            // @scope/ and @version intact.
            const packageMatch = template.match(/^(@[^/]+\/)?([^@]+)?(@.+)?$/);
            const scope = packageMatch[1] || "";
            const templateName = packageMatch[2] || "";
            const version = packageMatch[3] || "";
            if (templateName === templateToInstall ||
                templateName.startsWith(`${templateToInstall}-`)) {
                // Covers:
                // - cgsa-template
                // - @SCOPE/cgsa-template
                // - cgsa-template-NAME
                // - @SCOPE/cgsa-template-NAME
                templateToInstall = `${scope}${templateName}${version}`;
            }
            else if (version && !scope && !templateName) {
                // Covers using @SCOPE only
                templateToInstall = `${version}/${templateToInstall}`;
            }
            else {
                // Covers templates without the `cgsa-template` prefix:
                // - NAME
                // - @SCOPE/NAME
                templateToInstall = `${scope}${templateToInstall}-${templateName}${version}`;
            }
        }
    }
    return Promise.resolve(templateToInstall);
});
