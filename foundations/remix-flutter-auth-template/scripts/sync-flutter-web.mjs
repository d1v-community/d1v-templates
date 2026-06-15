import fs from "node:fs";
import path from "node:path";

const templateRoot = process.cwd();
const sourceDir = path.join(templateRoot, "apps/flutter_app/build/web");
const targetDir = path.join(templateRoot, "public/app");

if (!fs.existsSync(sourceDir)) {
  console.error(`Flutter web build output not found: ${sourceDir}`);
  process.exit(1);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log(`Synced Flutter web build to ${targetDir}`);
