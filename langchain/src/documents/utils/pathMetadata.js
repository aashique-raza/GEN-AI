import path from "path";

export function normalizePath(filePath) {
  return filePath.replaceAll("\\", "/");
}

export function extractMetadataFromPath(filePath) {
  const normalizedPath = normalizePath(filePath);
  const parts = normalizedPath.split("/");

  const dataIndex = parts.indexOf("data");
  const classFolder = parts[dataIndex + 1];
  const subject = parts[dataIndex + 2];

  const extension = path.extname(normalizedPath);
  const fileName = path.basename(normalizedPath, extension);

  return {
    classLevel: classFolder?.replace("class-", ""),
    subject,
    chapter: fileName,
    board: "bihar-board",
    source: normalizedPath,
    fileType: extension.replace(".", ""),
  };
}