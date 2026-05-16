import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const sourcePath = path.join(rootDir, "data", "work", "module.json");
const targetRoot = process.env.SEANHALLS_ONLINE_DIR ?? path.resolve(rootDir, "..", "seanhalls_online");
const targetDir = path.join(targetRoot, "src", "data");
const targetPath = path.join(targetDir, "cgu-work-module.json");

async function syncWorkModule() {
  const source = await readFile(sourcePath, "utf8");
  const moduleData = JSON.parse(source);

  const output = {
    ...moduleData,
    syncedFrom: sourcePath,
    syncedAt: new Date().toISOString()
  };

  await mkdir(targetDir, { recursive: true });
  await writeFile(targetPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log(`Synced work module to ${targetPath}`);
}

syncWorkModule().catch((error) => {
  console.error("Failed to sync work module.");
  console.error(error);
  process.exitCode = 1;
});