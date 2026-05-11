import { createRequire } from "module";

const require = createRequire(import.meta.url);
const kru2uni = require("@anthro-ai/krutidev-unicode");

const garbledText = "jklk;fud vfHkfØ;k,¡ ,oa lehdj.k";

const unicodeText = kru2uni(garbledText);

console.log("\n--- ORIGINAL PDF EXTRACTED TEXT ---");
console.log(garbledText);

console.log("\n--- AFTER KRUTIDEV TO UNICODE ---");
console.log(unicodeText);