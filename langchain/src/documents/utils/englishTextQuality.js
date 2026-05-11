/**
 * English PDF quality checker.
 *
 * Do not use Hindi quality checker for English PDFs.
 */

function countMatches(text, regex) {
  return (text.match(regex) || []).length;
}

export function analyzeEnglishTextQuality(text = "") {
  const value = String(text);

  const totalChars = value.length;
  const latinChars = countMatches(value, /[A-Za-z]/g);
  const privateUseChars = countMatches(value, /[\uF000-\uF8FF]/g);
  const replacementChars = countMatches(value, /�/g);

  const latinRatio = totalChars === 0 ? 0 : latinChars / totalChars;
  const privateUseRatio = totalChars === 0 ? 0 : privateUseChars / totalChars;
  const replacementRatio = totalChars === 0 ? 0 : replacementChars / totalChars;

  let status = "READABLE_ENGLISH";

  if (totalChars < 50) {
    status = "EMPTY_OR_SCANNED";
  } else if (privateUseRatio > 0.02) {
    status = "PRIVATE_FONT_NOT_FIXED";
  } else if (replacementRatio > 0.01) {
    status = "BROKEN_TEXT";
  } else if (latinRatio < 0.35) {
    status = "LOW_ENGLISH_RATIO";
  }

  return {
    totalChars,
    latinChars,
    privateUseChars,
    replacementChars,
    latinRatio: Number(latinRatio.toFixed(4)),
    privateUseRatio: Number(privateUseRatio.toFixed(4)),
    replacementRatio: Number(replacementRatio.toFixed(4)),
    status,
  };
}

export default analyzeEnglishTextQuality;