const { isEmpty } = require('lodash');
const { readFile, writeFile } = require('../file');
const getPlugin = require('../getPlugin');
const isGluePackage = require('../isGluePackage');
const { error } = require('../print');

const writePlugin = async (
	pluginFilePath,
	packageName,
	pluginName,
	plugin
) => {
	let data = await readFile(pluginFilePath);
	if (!data) {
		error('.glue/internals plugins file is corrupted.');
		process.exit(0);
	}

	if (!data[pluginName]) {
		data[pluginName] = {
			package: packageName,
		};
		// write plugins in file
		await writeFile(pluginFilePath, JSON.stringify(data, null, 2));
	}
};

const getPluginTree = async (app, path, depth = 0, tree = {}) => {
	let key = depth ? 'peerDependencies' : 'dependencies';
	const pluginFilePath = `${path}/package.json`;

	// const data = await readFile(pluginFilePath);
	const data = await require(pluginFilePath);
	if (!data[key] || isEmpty(data[key])) {
		return null;
	}

	const plugins = Object.keys(data[key]).filter((_package) => {
		if (isGluePackage(_package)) return _package;
	});

	if (!plugins || !plugins.length) {
		return null;
	}

	/**
	 * @TODO: remove node_modules path from the plugin
	 * path and use workspaces package name instead
	 */
	for (const plugin of plugins) {
		tree[plugin] = {
			plugin: await getPlugin(
				app,
				plugin,
				plugin
			),
			dependencies: await getPluginTree(
				app,
				plugin,
				++depth
			),
		};
	}

	return tree;
};

async function getTopToBottomPluginTree(app, path) {
	const tree = await getPluginTree(app, path);

	function recursivelyJoinArray(tree, arr = []) {
		if (tree && !isEmpty(tree)) {
			Object.keys(tree).forEach((key) => {
				if (tree[key].plugin) {
					arr.push({
						key: key,
						plugin: tree[key].plugin,
					});
				}
			});
			Object.keys(tree).forEach((key) => {
				if (tree[key].dependencies) {
					recursivelyJoinArray(tree[key].dependencies, arr);
				}
			});
		}
		return arr;
	}

	return recursivelyJoinArray(tree, []);
}

async function getBottomToTopPluginTree(app, path) {
	const array = await getTopToBottomPluginTree(app, path);
	return array.reverse();
}

module.exports = {
	writePlugin,
	getPluginTree,
	getTopToBottomPluginTree,
	getBottomToTopPluginTree,
};
