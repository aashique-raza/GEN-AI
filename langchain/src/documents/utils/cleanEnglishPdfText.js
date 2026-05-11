/**
 * Cleans English PDF text extracted from private-use font PDFs.
 *
 * Example:
 *  = A
 *  = c
 *  = 2
 *  = space
 */

function protectKnownSymbols(text = "") {
  return String(text)
    // In this PDF, this symbol is used as bullet when followed by spacing/text.
    .replace(/\uF06E(?=\s{2,}|\s+[A-Z])/g, "•");
}

function decodePrivateUseAscii(text = "") {
  return String(text).replace(/[\uF000-\uF0FF]/g, (char) => {
    const asciiCode = char.charCodeAt(0) - 0xf000;

    if (asciiCode >= 32 && asciiCode <= 126) {
      return String.fromCharCode(asciiCode);
    }

    return "";
  });
}

function normalizeEnglishSpacing(text = "") {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")

    // Fix section numbers like 2 . 1 -> 2.1
    .replace(/(\d)\s+\.\s+(\d)/g, "$1.$2")

    // Fix repeated spaces
    .replace(/[ \t]+/g, " ")

    // Normalize too many blank lines
    .replace(/\n{3,}/g, "\n\n")

    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function collapseRepeatedActivities(text = "") {
  return String(text).replace(
    /\b(Activity\s+\d+\.\d+)(?:\s+\1){1,}/g,
    "$1"
  );
}

export function cleanEnglishPdfText(inputText = "") {
  const originalText = String(inputText);

  let text = protectKnownSymbols(originalText);
  text = decodePrivateUseAscii(text);
  text = normalizeEnglishSpacing(text);
  text = collapseRepeatedActivities(text);

  const changed = text !== originalText;

  return {
    text,
    cleaned: changed,
    encodingFixed: changed,
  };
}

export default cleanEnglishPdfText;