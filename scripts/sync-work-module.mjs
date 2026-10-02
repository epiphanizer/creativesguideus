import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const sourcePath = path.join(rootDir, "data", "work", "module.json");
const targetRoot = process.env.SEANHALLS_ONLINE_DIR ?? path.resolve(rootDir, "..", "seanhalls_online");
const targetSrcDir = path.join(targetRoot, "src", "data");
const targetPublicDir = path.join(targetRoot, "public");
const targetSrcPath = path.join(targetSrcDir, "cgu-work-module.json");
const targetPublicModulePath = path.join(targetPublicDir, "cgu-work-module.json");
const targetProjectsPath = path.join(targetPublicDir, "projects.json");

async function syncWorkModule() {
  const source = await readFile(sourcePath, "utf8");
  const moduleData = JSON.parse(source);
  const nowIso = new Date().toISOString();

  const output = {
    ...moduleData,
    syncedFrom: sourcePath,
    syncedAt: nowIso
  };

  await mkdir(targetSrcDir, { recursive: true });
  await mkdir(targetPublicDir, { recursive: true });

  const formattedOutput = `${JSON.stringify(output, null, 2)}\n`;

  // 1. Sync to seanhalls_online/src/data/cgu-work-module.json
  await writeFile(targetSrcPath, formattedOutput, "utf8");
  console.log(`Synced work module to ${targetSrcPath}`);

  // 2. Sync to seanhalls_online/public/cgu-work-module.json
  await writeFile(targetPublicModulePath, formattedOutput, "utf8");
  console.log(`Synced public work module to ${targetPublicModulePath}`);

  // 3. Sync to seanhalls_online/public/projects.json
  const publicProjects = {
    generatedAt: nowIso,
    count: Array.isArray(moduleData.studies) ? moduleData.studies.length : 0,
    projects: (moduleData.studies || []).map((study, idx) => ({
      slug: study.slug,
      title: study.title,
      eyebrow: study.eyebrow || "",
      helperText: study.workIndexDescription ?? study.description ?? "",
      hasCaseStudy: Boolean(study.caseStudyUrl && study.caseStudyUrl.trim()),
      caseStudyUrl: study.caseStudyUrl || "",
      siteHref: study.siteHref || "",
      siteLabel: study.siteLabel || (study.siteHref ? `Visit ${study.slug}` : ""),
      sortOrder: idx + 1,
      published: true
    }))
  };

  await writeFile(targetProjectsPath, `${JSON.stringify(publicProjects, null, 2)}\n`, "utf8");
  console.log(`Synced public projects feed to ${targetProjectsPath}`);
}

syncWorkModule().catch((error) => {
  console.error("Failed to sync work module.");
  console.error(error);
  process.exitCode = 1;
});