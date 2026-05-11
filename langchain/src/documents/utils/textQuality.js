export function analyzeTextQuality(text) {
  const totalChars = text.length;

  const devanagariChars = (text.match(/\p{Script=Devanagari}/gu) || []).length;
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
  const weirdChars = (text.match(/[�]/g) || []).length;

  const devanagariRatio = totalChars ? devanagariChars / totalChars : 0;
  const latinRatio = totalChars ? latinChars / totalChars : 0;

  let status = "UNKNOWN";

  if (totalChars < 50) {
    status = "EMPTY_OR_SCANNED";
  } else if (devanagariRatio < 0.05 && latinRatio > 0.3) {
    status = "BAD_HINDI_ENCODING";
  } else if (devanagariRatio > 0.2 || latinRatio > 0.2) {
    status = "USABLE";
  }

  return {
    totalChars,
    devanagariChars,
    latinChars,
    weirdChars,
    devanagariRatio: Number(devanagariRatio.toFixed(4)),
    latinRatio: Number(latinRatio.toFixed(4)),
    status,
  };
}