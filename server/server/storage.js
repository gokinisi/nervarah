cat <<'EOF' > storage.js
import fs from "fs/promises";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || "./data";

function dataPath(filename) {
  return path.join(DATA_DIR, filename);
}

export async function readJson(filename) {
  const raw = await fs.readFile(dataPath(filename), "utf8");
  return JSON.parse(raw);
}

export async function writeJson(filename, value) {
  await fs.writeFile(dataPath(filename), JSON.stringify(value, null, 2), "utf8");
}

export async function appendJson(filename, item) {
  const arr = await readJson(filename);
  arr.push(item);
  await writeJson(filename, arr);
}

export function nowIso() {
  return new Date().toISOString();
}
EOF
