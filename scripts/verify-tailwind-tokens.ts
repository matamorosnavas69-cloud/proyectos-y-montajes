import fs from "fs";
import path from "path";

const REPO_ROOT = path.resolve(__dirname, "..");
const APP_DIR = path.join(REPO_ROOT, "app");
const TAILWIND_CONFIG = path.join(REPO_ROOT, "tailwind.config.js");

// Read tailwind config content
const configContent = fs.readFileSync(TAILWIND_CONFIG, "utf-8");

// Scan all TSX/TS files in app/
function getAllFiles(dir: string, ext = [".tsx", ".ts"]): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, ext));
    } else if (ext.some((e) => file.endsWith(e))) {
      results.push(filePath);
    }
  }
  return results;
}

const files = getAllFiles(APP_DIR);
const unsupportedTextRegex = /\btext-(\d{2})\b/g;
const numericSpacingRegex = /\b(p|m|gap|w|h)-(\d+)\b/g;

const foundTextTokens = new Set<string>();
const foundSpacingTokens = new Set<string>();

for (const file of files) {
  const content = fs.readFileSync(file, "utf-8");
  let match;
  while ((match = unsupportedTextRegex.exec(content)) !== null) {
    foundTextTokens.add(match[1]);
  }
  while ((match = numericSpacingRegex.exec(content)) !== null) {
    foundSpacingTokens.add(`${match[1]}-${match[2]}`);
  }
}

console.log("====================================================");
console.log("TAILWIND TOKEN INTEGRITY & REGRESSION CHECK");
console.log("====================================================");

// Check if found typography tokens are registered in tailwind.config.js
let typographyErrors = 0;
for (const token of Array.from(foundTextTokens).sort()) {
  const regex = new RegExp(`["']?${token}["']?\\s*:`);
  if (!regex.test(configContent)) {
    console.error(`❌ REGRESSION: text-${token} is used in app/ but NOT declared in tailwind.config.js fontSize!`);
    typographyErrors++;
  } else {
    console.log(`✅ [PASS] text-${token}: formally registered in tailwind.config.js fontSize`);
  }
}

// Summary
if (typographyErrors === 0) {
  console.log("\n🎉 ALL TYPOGRAPHY TOKENS FORMALLY GENERATED AND COMPLIANT!");
} else {
  console.error(`\n❌ Found ${typographyErrors} unsupported typography token(s)!`);
  process.exit(1);
}
