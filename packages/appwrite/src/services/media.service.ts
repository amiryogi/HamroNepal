/**
 * Media (Storage) Service
 *
 * Handles file uploads and image management.
 */

import { ID, ImageGravity, ImageFormat } from "appwrite";
import { getStorage } from "../client";
import { getConfig } from "../config";
import type { UploadedFile, ImagePreviewOptions } from "../types";

/**
 * Map string gravity to Appwrite ImageGravity enum.
 */
function mapGravity(
  gravity?: ImagePreviewOptions["gravity"]
): ImageGravity | undefined {
  if (!gravity) return undefined;
  const gravityMap: Record<string, ImageGravity> = {
    center: ImageGravity.Center,
    "top-left": ImageGravity.Topleft,
    top: ImageGravity.Top,
    "top-right": ImageGravity.Topright,
    left: ImageGravity.Left,
    right: ImageGravity.Right,
    "bottom-left": ImageGravity.Bottomleft,
    bottom: ImageGravity.Bottom,
    "bottom-right": ImageGravity.Bottomright,
  };
  return gravityMap[gravity] || ImageGravity.Center;
}

/**
 * Map string output format to Appwrite ImageFormat enum.
 */
function mapFormat(
  format?: ImagePreviewOptions["output"]
): ImageFormat | undefined {
  if (!format) return undefined;
  const formatMap: Record<string, ImageFormat> = {
    jpg: ImageFormat.Jpg,
    jpeg: ImageFormat.Jpeg,
    png: ImageFormat.Png,
    gif: ImageFormat.Gif,
    webp: ImageFormat.Webp,
  };
  return formatMap[format];
}

// ============================================
// ARTICLE IMAGES
// ============================================

/**
 * Upload an article image (featured or inline).
 */
export async function uploadArticleImage(file: File): Promise<UploadedFile> {
  const config = getConfig();
  const storage = getStorage();

  const result = await storage.createFile(
    config.buckets.articleImages,
    ID.unique(),
    file
  );

  return result as unknown as UploadedFile;
}

/**
 * Get article image preview URL.
 */
export function getArticleImageUrl(
  fileId: string,
  options?: ImagePreviewOptions
): string {
  const config = getConfig();
  const storage = getStorage();

  // Build URL with preview options
  const result = storage.getFilePreview(
    config.buckets.articleImages,
    fileId,
    options?.width,
    options?.height,
    mapGravity(options?.gravity),
    options?.quality,
    options?.borderWidth,
    options?.borderColor,
    options?.borderRadius,
    options?.opacity,
    options?.rotation,
    options?.background,
    mapFormat(options?.output)
  );

  return result.toString();
}

/**
 * Get article image download URL.
 */
export function getArticleImageDownloadUrl(fileId: string): string {
  const config = getConfig();
  const storage = getStorage();

  return storage
    .getFileDownload(config.buckets.articleImages, fileId)
    .toString();
}

/**
 * Get article image view URL (original).
 */
export function getArticleImageViewUrl(fileId: string): string {
  const config = getConfig();
  const storage = getStorage();

  return storage.getFileView(config.buckets.articleImages, fileId).toString();
}

/**
 * Delete an article image.
 */
export async function deleteArticleImage(fileId: string): Promise<void> {
  const config = getConfig();
  const storage = getStorage();

  await storage.deleteFile(config.buckets.articleImages, fileId);
}

/**
 * Get article image file details.
 */
export async function getArticleImageDetails(
  fileId: string
): Promise<UploadedFile> {
  const config = getConfig();
  const storage = getStorage();

  const result = await storage.getFile(config.buckets.articleImages, fileId);

  return result as unknown as UploadedFile;
}

// ============================================
// AVATAR IMAGES
// ============================================

/**
 * Upload a user avatar.
 */
export async function uploadAvatar(file: File): Promise<UploadedFile> {
  const config = getConfig();
  const storage = getStorage();

  const result = await storage.createFile(
    config.buckets.avatars,
    ID.unique(),
    file
  );

  return result as unknown as UploadedFile;
}

/**
 * Get avatar preview URL.
 */
export function getAvatarUrl(fileId: string, size = 100): string {
  const config = getConfig();
  const storage = getStorage();

  const result = storage.getFilePreview(
    config.buckets.avatars,
    fileId,
    size,
    size,
    ImageGravity.Center,
    90,
    undefined,
    undefined,
    size / 2 // Circular avatar
  );

  return result.toString();
}

/**
 * Delete an avatar.
 */
export async function deleteAvatar(fileId: string): Promise<void> {
  const config = getConfig();
  const storage = getStorage();

  await storage.deleteFile(config.buckets.avatars, fileId);
}

// ============================================
// ADVERTISEMENT IMAGES
// ============================================

/**
 * Upload an advertisement image.
 */
export async function uploadAdImage(file: File): Promise<UploadedFile> {
  const config = getConfig();
  const storage = getStorage();

  const result = await storage.createFile(
    config.buckets.advertisements,
    ID.unique(),
    file
  );

  return result as unknown as UploadedFile;
}

/**
 * Get advertisement image URL.
 */
export function getAdImageUrl(
  fileId: string,
  options?: ImagePreviewOptions
): string {
  const config = getConfig();
  const storage = getStorage();

  const result = storage.getFilePreview(
    config.buckets.advertisements,
    fileId,
    options?.width,
    options?.height,
    mapGravity(options?.gravity),
    options?.quality
  );

  return result.toString();
}

/**
 * Delete an advertisement image.
 */
export async function deleteAdImage(fileId: string): Promise<void> {
  const config = getConfig();
  const storage = getStorage();

  await storage.deleteFile(config.buckets.advertisements, fileId);
}

// ============================================
// DOCUMENTS
// ============================================

/**
 * Upload a document (PDF, DOC, etc.).
 */
export async function uploadDocument(file: File): Promise<UploadedFile> {
  const config = getConfig();
  const storage = getStorage();

  const result = await storage.createFile(
    config.buckets.documents,
    ID.unique(),
    file
  );

  return result as unknown as UploadedFile;
}

/**
 * Get document download URL.
 */
export function getDocumentDownloadUrl(fileId: string): string {
  const config = getConfig();
  const storage = getStorage();

  return storage.getFileDownload(config.buckets.documents, fileId).toString();
}

/**
 * Get document view URL.
 */
export function getDocumentViewUrl(fileId: string): string {
  const config = getConfig();
  const storage = getStorage();

  return storage.getFileView(config.buckets.documents, fileId).toString();
}

/**
 * Delete a document.
 */
export async function deleteDocument(fileId: string): Promise<void> {
  const config = getConfig();
  const storage = getStorage();

  await storage.deleteFile(config.buckets.documents, fileId);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Predefined image sizes for articles.
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 100 },
  card: { width: 400, height: 250 },
  featured: { width: 800, height: 450 },
  full: { width: 1200, height: 675 },
  og: { width: 1200, height: 630 }, // Open Graph
} as const;

/**
 * Get article image URL with predefined size.
 */
export function getArticleImageWithSize(
  fileId: string,
  size: keyof typeof IMAGE_SIZES
): string {
  return getArticleImageUrl(fileId, {
    ...IMAGE_SIZES[size],
    quality: 85,
    output: "webp",
  });
}

/**
 * Validate file type for images.
 */
export function isValidImageType(file: File): boolean {
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  return validTypes.includes(file.type);
}

/**
 * Validate file size (in bytes).
 */
export function isValidFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes;
}

/**
 * Validate article image.
 */
export function validateArticleImage(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!isValidImageType(file)) {
    return {
      valid: false,
      error: "अमान्य फाइल प्रकार। JPG, PNG, WEBP मात्र अनुमति छ।",
    };
  }

  if (!isValidFileSize(file, maxSize)) {
    return { valid: false, error: "फाइल साइज ५ MB भन्दा कम हुनुपर्छ।" };
  }

  return { valid: true };
}

/**
 * Validate avatar image.
 */
export function validateAvatar(file: File): { valid: boolean; error?: string } {
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!isValidImageType(file)) {
    return {
      valid: false,
      error: "अमान्य फाइल प्रकार। JPG, PNG, WEBP मात्र अनुमति छ।",
    };
  }

  if (!isValidFileSize(file, maxSize)) {
    return { valid: false, error: "फाइल साइज २ MB भन्दा कम हुनुपर्छ।" };
  }

  return { valid: true };
}

/**
 * Get file extension from filename.
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

/**
 * Generate a readable file size string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
