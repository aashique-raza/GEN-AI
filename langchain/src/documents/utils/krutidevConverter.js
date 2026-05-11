import krutiDevPackage from "@anthro-ai/krutidev-unicode";

const krutiDevConverter =
  typeof krutiDevPackage === "function"
    ? krutiDevPackage
    : krutiDevPackage.default;

export function convertKrutiDevToUnicode(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  if (typeof krutiDevConverter !== "function") {
    throw new Error("KrutiDev converter function not found.");
  }

  return krutiDevConverter(text);
}