/**
 * Cleans Hindi text extracted from legacy-font / broken Hindi PDFs.
 *
 * Goal:
 * - Fix known repeated artifacts.
 * - Keep cleanup controlled.
 * - Report what was changed.
 * - Report suspicious leftovers.
 */

const EXACT_WORD_FIXES = [
  // visible artifacts from current PDF output
  ["अधयाय", "अध्याय"],
  ["धयान", "ध्यान"],
  ["दूधा", "दूध"],
  ["चुवेफ", "चुके"],
  ["वैफसे", "कैसे"],
  ["उनवेफ", "उनके"],
  ["करवेफ", "करके"],
  ["वफी", "की"],
  ["वेफ", "के"],

  // common broken half-letter forms
  ["मधय", "मध्य"],
  ["अधययन", "अध्ययन"],
  ["विदयुत", "विद्युत"],
  ["उददेश्य", "उद्देश्य"],
  ["वयक्ति", "व्यक्ति"],
  ["शकित", "शक्ति"],
  ["गरहण", "ग्रहण"],

  // repeated spelling artifacts from this textbook extraction
  ["आधाार", "आधार"],
  ["निर्धाारित", "निर्धारित"],
  ["विधिा", "विधि"],
  ["अधिाक", "अधिक"],
  ["सूत्रा", "सूत्र"],
  ["चित्रा", "चित्र"],
  ["विविधा", "विविध"],

  // oxygen/oxide style artifacts
  ["आॅक्सीजन", "ऑक्सीजन"],
  ["आॅक्साइड", "ऑक्साइड"],
  ["सल्फ्ऱयूरिक", "सल्फ्यूरिक"],
];

const SYMBOL_FIXES = [
  // old PDF font artifacts
  [/(\d)ण्(\d)/g, "$1.$2"],

  // badly extracted bracket symbols from PDF
  [/;\$द्ध/g, "(+)"],
  [/;स्भै,द्ध/g, "(LHS)"],
  [/;त्भै,द्ध/g, "(RHS)"],

  // spacing around symbols
  [/\s+\)/g, ")"],
  [/\(\s+/g, "("],
];

const SUSPICIOUS_PATTERNS = [
  "वेफ",
  "वफी",
  "वैफ",
  "चुवेफ",
  "करवेफ",
  "उनवेफ",
  "धय",
  "ण्",
  ";$द्ध",
  ";स्भै",
  ";त्भै",
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceExactHindiWord(text, wrongWord, correctWord) {
  const pattern = new RegExp(
    `(?<![\\p{Script=Devanagari}])${escapeRegExp(wrongWord)}(?![\\p{Script=Devanagari}])`,
    "gu"
  );

  let count = 0;

  const cleanedText = text.replace(pattern, () => {
    count += 1;
    return correctWord;
  });

  return { cleanedText, count };
}

function applySymbolFixes(text) {
  const appliedFixes = [];
  let resultText = text;

  for (const [pattern, replacement] of SYMBOL_FIXES) {
    let count = 0;

    resultText = resultText.replace(pattern, () => {
      count += 1;
      return replacement;
    });

    if (count > 0) {
      appliedFixes.push({
        from: String(pattern),
        to: replacement,
        count,
      });
    }
  }

  return {
    text: resultText,
    appliedFixes,
  };
}

function normalizeSpacing(text) {
  return text
    // normalize Windows / mixed line endings
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")

    // remove repeated spaces/tabs
    .replace(/[ \t]+/g, " ")

    // remove spaces before punctuation
    .replace(/\s+([।,;:?!])/g, "$1")

    // keep one space after comma/colon if text continues
    .replace(/([,;:?!])(?=\S)/g, "$1 ")

    // normalize too many blank lines
    .replace(/\n{3,}/g, "\n\n")

    // clean each line
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

function findSuspiciousLeftovers(text) {
  return SUSPICIOUS_PATTERNS
    .map((pattern) => {
      const count = text.split(pattern).length - 1;

      return {
        pattern,
        count,
      };
    })
    .filter((item) => item.count > 0);
}

export function cleanHindiText(inputText = "") {
  let text = String(inputText);
  const appliedFixes = [];

  text = normalizeSpacing(text);

  const symbolResult = applySymbolFixes(text);
  text = symbolResult.text;
  appliedFixes.push(...symbolResult.appliedFixes);

  for (const [wrongWord, correctWord] of EXACT_WORD_FIXES) {
    const result = replaceExactHindiWord(text, wrongWord, correctWord);

    if (result.count > 0) {
      appliedFixes.push({
        from: wrongWord,
        to: correctWord,
        count: result.count,
      });
    }

    text = result.cleanedText;
  }

  text = normalizeSpacing(text);

  const suspiciousLeftovers = findSuspiciousLeftovers(text);

  return {
    text,
    cleaned: appliedFixes.length > 0,
    appliedFixes,
    suspiciousLeftovers,
    readableEnough: suspiciousLeftovers.length === 0,
  };
}

export default cleanHindiText;