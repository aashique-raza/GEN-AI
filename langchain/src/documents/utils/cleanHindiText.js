export function cleanHindiText(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .normalize("NFC")
    .replaceAll("अधयाय", "अध्याय")
    .replaceAll("धयान", "ध्यान")
    .replaceAll("दूधा", "दूध")
    .replaceAll("वेफ", "के")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}