#!/usr/bin/env ts-node

/** biome-ignore-all lint/suspicious/noExplicitAny: *** */

import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";

type FlagSpec = { isFlag: true; default?: boolean; required?: boolean };

type StringSpec<T extends readonly string[]> = {
  allowedValues?: T;
  default: T[number]; // mandatory
  required?: boolean;
};

type ArgSpec<T extends readonly string[] = readonly string[]> =
  | FlagSpec
  | StringSpec<T>;
type ArgSpecs = Record<string, ArgSpec<any>>;

type ParsedArgs<T extends ArgSpecs> = {
  [K in keyof T]: T[K] extends FlagSpec
    ? boolean
    : T[K] extends StringSpec<infer U>
      ? U extends readonly string[]
        ? U[number]
        : string
      : never;
};

function parseArgs<T extends ArgSpecs>(options: T): ParsedArgs<T> {
  const args: Record<string, string | boolean> = {};
  const argv = process.argv.slice(2);

  // Validate default values at runtime
  for (const key in options) {
    const opt = options[key] as any;
    if (opt.allowedValues && !opt.allowedValues.includes(opt.default)) {
      console.error(
        `Error: default value of --${key} ('${opt.default}') is not in allowed values: ${opt.allowedValues.join(", ")}`,
      );
      process.exit(1);
    }
  }

  // Parse CLI arguments
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      let value: string | boolean = true; // default for flags or empty

      // Check if next value exists and is not another flag
      if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) {
        value = argv[i + 1];
        i++; // consume next arg as value
      }

      args[key] = value;
    }
  }

  // Apply defaults and validate allowed values
  for (const key in options) {
    const opt = options[key] as any;
    const val = args[key];

    // If value is missing or flag-style, use default
    if (val === undefined || val === true) {
      if ("default" in opt) {
        args[key] = opt.default;
        continue;
      }
      if (opt.required) {
        console.error(`Error: --${key} argument is required.`);
        process.exit(1);
      }
    }

    // Validate allowed values
    if (
      opt.allowedValues &&
      typeof val === "string" &&
      !opt.allowedValues.includes(val)
    ) {
      console.warn(
        `Warning: --${key} value '${val}' is invalid. Using default '${opt.default}'.`,
      );
      args[key] = opt.default;
    }

    if (opt.isFlag) {
      args[key] = Boolean(args[key]);
    }
  }

  return args as ParsedArgs<T>;
}

async function createDirectory(path: string) {
  try {
    await fs.ensureDir(path);
    console.log(`Folder ${path} created successfully!`);
  } catch (err) {
    console.error("Error creating directory:", err);
    throw err;
  }
}

async function copyFolder(source: string, destination: string): Promise<void> {
  try {
    await fs.copy(source, destination, { overwrite: true }); // overwrite: true will replace existing files/folders
    console.log(`Folder '${source}' copied successfully to '${destination}'`);
  } catch (err) {
    console.error(`Error copying folder: ${err}`);
    throw err;
  }
}

async function copyFile(source: string, destination: string): Promise<void> {
  try {
    await fs.copyFile(source, destination);
    console.log(`File '${source}' copied successfully to '${destination}'`);
  } catch (err) {
    console.error(`Error copying file: ${err}`);
    throw err;
  }
}

function updateServerFile(serverFilePath: string) {
  let content = fs.readFileSync(serverFilePath, "utf8");

  content = content.split(
    `const currentPort = parseInt(process.env.PORT, 10) || 3000`,
  )[1];

  let newConfigBlock = "";
  newConfigBlock += `const path = require('path');\n`;
  newConfigBlock += `const nextEnv = require("@next/env");\n\n`;
  newConfigBlock += `const dir = path.join(__dirname);\n\n`;
  newConfigBlock += `process.chdir(__dirname);\n\n`;
  // newConfigBlock += `const dir = process.cwd();\n\n`;
  newConfigBlock += `nextEnv.loadEnvConfig(dir);\n\n`;
  newConfigBlock += `console.log(process.env);\n\n`;
  newConfigBlock += `process.env.NODE_ENV = "production";\n\n`;
  newConfigBlock += `const currentPort = process.env.PORT || 3000;\n\n`;

  content = newConfigBlock + content;

  // Final Cleanup ---
  // Remove consecutive blank lines to match the desired clean formatting
  content = content.replace(/\ns*\ns*\n/g, "\n\n");

  content += "\n";

  // Write the modified content back to server.js
  fs.writeFileSync(serverFilePath, content.trim(), "utf8");
}

function cleanDirectoryExcept(
  directoryPath: string,
  itemsToKeep: string[] = [],
) {
  const items = fs.readdirSync(directoryPath);

  for (const item of items) {
    const itemPath = path.join(directoryPath, item);
    const stats = fs.statSync(itemPath);

    if (!itemsToKeep.includes(item)) {
      if (stats.isFile()) {
        // If it's a file and not in the filesToKeep list, delete it
        fs.unlinkSync(itemPath);
        console.log(`Deleted file: ${itemPath}`);
      } else if (stats.isDirectory()) {
        // If it's a directory and not in the foldersToKeep list, delete it recursively
        fs.rmSync(itemPath, { recursive: true, force: true });
        console.log(`Deleted folder: ${itemPath}`);
      }
    }
  }
  console.log(`Directory cleanup completed for: ${directoryPath}`);
}

const args = parseArgs({
  platform: {
    allowedValues: ["iisnode", "http"] as const,
    default: "iisnode",
    required: true,
  },
});

const platformValue = args.platform as string;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
process.chdir(__dirname);

const publishDir = path.join(__dirname, "dist-server");
const standaloneDir = path.join(__dirname, ".next", "standalone");

const publishStaticDir = path.join(publishDir, ".next", "static");
const standaloneStaticDir = path.join(__dirname, ".next", "static");

const fromWebConfig = path.join(__dirname, `web.${platformValue}.config`);

const toWebConfig = path.join(publishDir, "web.config");

await createDirectory(publishDir);

await copyFile(fromWebConfig, toWebConfig);

cleanDirectoryExcept(publishDir, ["public", "web.config"]);

await copyFolder(standaloneDir, publishDir);
await copyFolder(standaloneStaticDir, publishStaticDir);

updateServerFile(path.join(publishDir, "server.js"));

await copyFile(fromWebConfig, toWebConfig);
