import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
process.chdir(__dirname);

const publishDir = path.join(__dirname, "dist-server");
const standaloneDir = path.join(__dirname, ".next", "standalone");

const publishStaticDir = path.join(publishDir, ".next", "static");
const standaloneStaticDir = path.join(__dirname, ".next", "static");

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
  newConfigBlock += `process.chdir(__dirname);\n\n`;
  newConfigBlock += `const dir = process.cwd();\n\n`;
  newConfigBlock += `nextEnv.loadEnvConfig(dir);\n\n`;
  newConfigBlock += `console.log(process.env.BETTER_AUTH_URL);\n\n`;
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

const fromWebConfig = path.join(__dirname, "web.iisnode.config");
// const fromWebConfig = path.join(__dirname, "web.http.config");

const toWebConfig = path.join(publishDir, "web.config");

await copyFile(fromWebConfig, toWebConfig);

cleanDirectoryExcept(publishDir, ["public", "web.config"]);

await copyFolder(standaloneDir, publishDir);
await copyFolder(standaloneStaticDir, publishStaticDir);

updateServerFile(path.join(publishDir, "server.js"));

await copyFile(fromWebConfig, toWebConfig);
