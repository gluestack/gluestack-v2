import { EOL } from 'os';
import colors from 'colors';
import semver from 'semver';
import { readFile, copy, ensureDir, writeFile, exists } from 'fs-extra';
import { execSync } from 'child_process';
import { resolve, basename, join } from 'path';

import packageJson from '../../package.json';
import checkVersion from '../helpers/check-version';
import { execute } from '../helpers/execute';

export default async (directoryName: string, template: string): Promise<void> => {
  checkVersion()
    .catch(async (): Promise<string> => {
      try {
        return execSync("npm view gluestack version")
          .toString()
          .trim();
      } catch (e) {
        return 'v0.0.1';
      }
    })
    .then(async (latest): Promise<void> => {
      const version: string = latest as string;

      if (version && semver.lt(packageJson.version, version)) {
        console.log();
        console.error(
          colors.yellow(
            `You are running "gluestack" ${packageJson.version}, which is behind the latest release (${version}).\n` +
              "We recommend always using the latest version of \"gluestack\" if possible.",
          ),
        );
        console.log();
      } else {
        await createApp(directoryName, template);
        console.log('createApp called..');
      }
    });;
};

const createApp = async (name: string, template: string) => {
  const root = resolve(name);
  const appName = basename(root);

  await ensureDir(name);

  console.log();

  console.log(`Creating a new gluestack app in ${colors.green(root)}.`);
  console.log();

  const packageJson = {
    name: appName,
    private: true,
  };

  await writeFile(
    join(root, "package.json"),
    JSON.stringify(packageJson, null, 2) + EOL,
  );

  await writeFile(
    join(root, ".npmrc"),
    `legacy-peer-deps=true\nengine-strict=true` + EOL,
  );

  const originalDirectory = process.cwd();

  process.chdir(root);

  await run(root, appName, originalDirectory, template);
};

const run = async (
  root: string, appName: string, originalDirectory: string, template: string
): Promise<void> => {
  const templateToInstall: string = await getTemplateInstallPackage(template, originalDirectory);

  return install([templateToInstall])
    .then(async () => {
      await copyToRoot(root, appName, templateToInstall);
    })
    .catch((reason) => {
      console.log();
      console.log("Aborting installation.");
      if (reason.command) {
        console.log(`  ${colors.cyan(reason.command)} has failed.`);
      } else {
        console.log(
          colors.red("Unexpected error. Please report it as a bug:"),
        );
        console.log(reason);
      }
      console.log();
    });
};

const copyToRoot = async (
  root: string, appName: string, template: string
): Promise<void> => {
  if (await exists(`${root}/node_modules/${template}`)) {
    await copy(`${root}/node_modules/${template}`, root);
  }

  if (await exists(`${root}/package.json`)) {
    const raw = await readFile(`${root}/package.json`, 'utf8');
    const json = JSON.parse(raw);

    json.name = appName;
    json.version = "0.0.1";
    json.private = true;

    await writeFile(
      join(root, "package.json"),
      JSON.stringify(json, null, 2) + EOL,
    );
  }
};

const install = async (
  dependencies: string[]
): Promise<void> => {
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

  await execute(command, args, { stdio: 'inherit' });
};

const getTemplateInstallPackage = async (
  template: string, originalDirectory: string
): Promise<string> => {
  let templateToInstall: string = "@gluestack/cgsa-template-v2";

  if (template) {
    if (template.match(/^file:/)) {
      templateToInstall = `file:${resolve(
        originalDirectory,
        template.match(/^file:(.*)?$/)![1],
      )}`;
    } else if (
      template.includes("://") ||
      template.match(/^.+\.(tgz|tar\.gz)$/)
    ) {
      // for tar.gz or alternative paths
      templateToInstall = template;
    } else {
      // Add prefix 'cgsa-template-' to non-prefixed templates, leaving any
      // @scope/ and @version intact.
      const packageMatch = template.match(/^(@[^/]+\/)?([^@]+)?(@.+)?$/)!;
      const scope = packageMatch[1] || "";
      const templateName = packageMatch[2] || "";
      const version = packageMatch[3] || "";

      if (
        templateName === templateToInstall ||
        templateName.startsWith(`${templateToInstall}-`)
      ) {
        // Covers:
        // - cgsa-template
        // - @SCOPE/cgsa-template
        // - cgsa-template-NAME
        // - @SCOPE/cgsa-template-NAME
        templateToInstall = `${scope}${templateName}${version}`;
      } else if (version && !scope && !templateName) {
        // Covers using @SCOPE only
        templateToInstall = `${version}/${templateToInstall}`;
      } else {
        // Covers templates without the `cgsa-template` prefix:
        // - NAME
        // - @SCOPE/NAME
        templateToInstall = `${scope}${templateName}${version}`;
      }
    }
  }

  return Promise.resolve(templateToInstall);
};
