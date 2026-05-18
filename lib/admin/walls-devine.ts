import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { AdminMarkdownCollection, AdminMarkdownFile, ReleasePlan, WallsDevineAdminData } from "./types";
import { defaultBookingBoard } from "./booking-engine";

import { defaultLinkHubContent } from "@/lib/link-hub/content";
import { defaultWallsDevineCollectorHeroNote } from "@/lib/walls-devine/public-content";

const releasePlanPath = path.join(process.cwd(), "data", "walls-devine", "release-plan.json");
const instagramPostsDir = path.join(process.cwd(), "app", "walls-devine", "instagram-posts");
const journalsDir = path.join(process.cwd(), "public", "walls-devine", "journals");

function toRelativePath(filePath: string) {
  return path.relative(process.cwd(), filePath).split(path.sep).join("/");
}

function getMarkdownTitle(content: string, fallback: string) {
  const match = content.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? fallback;
}

function getMarkdownPreview(content: string) {
  const sections = content
    .split("\n\n")
    .map((section) => section.trim())
    .filter(Boolean)
    .filter((section) => !section.startsWith("#") && !section.startsWith("##"));

  return sections[0] ?? "";
}

async function readMarkdownCollection(directoryPath: string) {
  const fileNames = (await readdir(directoryPath)).filter((fileName) => fileName.endsWith(".md") && fileName !== "README.md").sort();

  return Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(directoryPath, fileName);
      const content = await readFile(filePath, "utf8");

      return {
        slug: fileName.replace(/\.md$/, ""),
        title: getMarkdownTitle(content, fileName),
        filePath: toRelativePath(filePath),
        content,
        preview: getMarkdownPreview(content)
      } satisfies AdminMarkdownFile;
    })
  );
}

function getMarkdownDirectory(collection: AdminMarkdownCollection) {
  switch (collection) {
    case "instagram-posts":
      return instagramPostsDir;
    case "journals":
      return journalsDir;
    default:
      return null;
  }
}

function getMarkdownFilePath(collection: AdminMarkdownCollection, slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  const directory = getMarkdownDirectory(collection);

  if (!directory) {
    return null;
  }

  return path.join(directory, `${slug}.md`);
}

export async function getReleasePlan() {
  const content = await readFile(releasePlanPath, "utf8");
  return JSON.parse(content) as ReleasePlan;
}

export async function updateReleasePlanItem(itemId: string, completed: boolean) {
  const plan = await getReleasePlan();
  const checklistItem = plan.checklist.find((item) => item.id === itemId);

  if (!checklistItem) {
    return;
  }

  checklistItem.completed = completed;
  plan.updatedAt = new Date().toISOString();

  await writeFile(releasePlanPath, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
}

export async function updateAdminMarkdownFile(collection: AdminMarkdownCollection, slug: string, content: string) {
  const filePath = getMarkdownFilePath(collection, slug);

  if (!filePath) {
    throw new Error("Invalid admin markdown target.");
  }

  await writeFile(filePath, content.trimEnd() ? `${content.trimEnd()}\n` : "", "utf8");
}

export async function getInstagramDrafts() {
  return readMarkdownCollection(instagramPostsDir);
}

export async function getJournalEntries() {
  return readMarkdownCollection(journalsDir);
}

export async function getWallsDevineAdminData() {
  const [plan, instagramDrafts, journalEntries] = await Promise.all([getReleasePlan(), getInstagramDrafts(), getJournalEntries()]);

  return {
    plan,
    bookingBoard: defaultBookingBoard,
    instagramDrafts,
    journalEntries,
    collectorHeroNote: defaultWallsDevineCollectorHeroNote,
    linkHub: defaultLinkHubContent
  } satisfies WallsDevineAdminData;
}
