// Make the AI Judge Laugh: Developer Excuses
// One funny single-line excuse a developer gives when code breaks in production.
// The line turns the worn "works on my machine" excuse around: the developer
// shipped the machine itself, so production is now their laptop.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const ENTRY =
  "It worked on my machine, so I shipped my machine. Production is my laptop now.";

// Gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// a single line, not only white space.
function checkGate(text: string): void {
  const points = [...text].length;
  if (points < 1 || points > 200) {
    throw new Error(`gate failed: entry is ${points} code points, must be 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry is only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate failed: entry must be a single line");
  }
}

checkGate(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, ENTRY, "utf8");

// Read-back verification: what was written is byte-identical to the entry.
const written = readFileSync(`${outDir}/entry.txt`, "utf8");
if (written !== ENTRY) {
  throw new Error("verification failed: written entry differs from ENTRY");
}
checkGate(written);

const sha256 = createHash("sha256").update(ENTRY, "utf8").digest("hex");
console.log(
  `wrote ${outDir}/entry.txt (${[...ENTRY].length} code points, sha256 ${sha256}), verified: ${JSON.stringify(ENTRY)}`,
);
