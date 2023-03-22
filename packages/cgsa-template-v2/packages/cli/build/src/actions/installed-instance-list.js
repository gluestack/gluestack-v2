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
const { info, newline, warning } = require('../helpers/print');
const { getTopToBottomPluginTree, } = require('../helpers/meta/plugins');
const { getTopToBottomPluginInstanceTree, } = require('../helpers/meta/plugin-instances');
function printPlugins(plugins) {
    const arr = {};
    plugins.map((plugin) => {
        if (!arr[plugin.key]) {
            arr[plugin.key] = {
                version: plugin.plugin.getVersion(),
            };
        }
    });
    if (Object.keys(arr).length) {
        info('Installed Plugins');
        console.table(arr);
        return;
    }
    warning('No plugins are installed in your app.');
}
function printInstalledPlugins() {
    return __awaiter(this, void 0, void 0, function* () {
        const plugins = yield getTopToBottomPluginTree(process.cwd());
        printPlugins(plugins);
        newline();
    });
}
function printPluginInstances(plugins) {
    const arr = [];
    plugins.forEach(({ key, plugin }) => {
        if (plugin.getInstances) {
            plugin.getInstances().forEach((pluginInstance) => {
                arr.push({
                    plugin: key,
                    instance: pluginInstance.getName(),
                    version: plugin.getVersion(),
                });
            });
        }
    });
    if (Object.keys(arr).length) {
        info('Installed Instances');
        console.table(arr);
        return;
    }
    warning('No plugins are installed in your app.');
}
function printInstalledPluginInstances() {
    return __awaiter(this, void 0, void 0, function* () {
        const plugins = yield getTopToBottomPluginInstanceTree(process.cwd());
        printPluginInstances(plugins);
        newline();
    });
}
module.exports = () => __awaiter(void 0, void 0, void 0, function* () {
    yield printInstalledPlugins();
    yield printInstalledPluginInstances();
});
