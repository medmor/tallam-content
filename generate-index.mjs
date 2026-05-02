#!/usr/bin/env node

import { readdir, stat, writeFile } from "fs/promises";
import { join, relative } from "path";

const CONTENT_DIR = import.meta.dirname;

function dirNameToId(dirName) {
  const stripped = dirName.replace(/^\d+_/, "");
  const numPrefix = dirName.match(/^(\d+)_/)?.[1] || "";
  const slug = stripped.replace(/_/g, "-");
  return numPrefix ? `${numPrefix}-${slug}` : slug;
}

async function scanDir() {
  const results = [];

  const levelDirs = await readdir(CONTENT_DIR);
  for (const level of levelDirs) {
    const levelPath = join(CONTENT_DIR, level);
    const levelStat = await stat(levelPath).catch(() => null);
    if (!levelStat?.isDirectory()) continue;
    if (level.startsWith(".")) continue;

    const levelId = dirNameToId(level);

    const subjects = await readdir(levelPath);
    for (const subject of subjects) {
      const subjectPath = join(levelPath, subject);
      const subjectStat = await stat(subjectPath).catch(() => null);
      if (!subjectStat?.isDirectory()) continue;

      const semesters = await readdir(subjectPath);
      for (const semester of semesters) {
        const semesterPath = join(subjectPath, semester);
        const semesterStat = await stat(semesterPath).catch(() => null);
        if (!semesterStat?.isDirectory()) continue;

        const lessons = await readdir(semesterPath);
        for (const lesson of lessons) {
          const lessonPath = join(semesterPath, lesson);
          const lessonStat = await stat(lessonPath).catch(() => null);
          if (!lessonStat?.isDirectory()) continue;

          const lessonJsonPath = join(lessonPath, "lesson.json");
          const exists = await stat(lessonJsonPath).then(() => true).catch(() => false);
          if (!exists) continue;

          const id = `${levelId}/${dirNameToId(subject)}/${dirNameToId(semester)}/${dirNameToId(lesson)}`;
          const relPath = relative(CONTENT_DIR, lessonJsonPath);
          results.push({ id, relPath });
        }
      }
    }
  }

  return results;
}

const index = await scanDir();
await writeFile(join(CONTENT_DIR, "index.json"), JSON.stringify(index, null, 2) + "\n");
console.log(`Generated index.json with ${index.length} lessons`);