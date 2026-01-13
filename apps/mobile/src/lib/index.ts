export { client, databases, storage, account, config } from "./appwrite";
export * from "./bs-date";

/**
 * Get image URL from storage or return URL as-is
 */
export function getImageUrl(
  fileId: string,
  width?: number,
  height?: number
): string {
  if (!fileId) return "";

  // If it's already a URL, return as is
  if (fileId.startsWith("http")) {
    return fileId;
  }

  // Import storage from appwrite
  const { storage, config } = require("./appwrite");

  return storage
    .getFilePreview(config.buckets.articleImages, fileId, width, height)
    .toString();
}
