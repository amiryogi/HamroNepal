/**
 * Common Types & Enums for HamroNepal
 */

// ============================================
// ENUMS
// ============================================

export enum ArticleStatus {
  DRAFT = "draft",
  PENDING = "pending",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export enum CommentStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  SPAM = "spam",
}

export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  REPORTER = "reporter",
}

export enum AdPosition {
  HEADER = "header",
  SIDEBAR = "sidebar",
  INLINE = "inline",
  FOOTER = "footer",
  POPUP = "popup",
}

export enum SettingType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  JSON = "json",
}

export enum NotificationTarget {
  ALL = "all",
  SUBSCRIBERS = "subscribers",
  SPECIFIC = "specific",
}

export enum NotificationStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  SENT = "sent",
}

// ============================================
// BASE TYPES
// ============================================

/**
 * Base document type with Appwrite system fields.
 */
export interface BaseDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
}

/**
 * Pagination parameters for list queries.
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
  cursor?: string;
  cursorDirection?: "before" | "after";
}

/**
 * Paginated response wrapper.
 */
export interface PaginatedResponse<T> {
  documents: T[];
  total: number;
}

// ============================================
// CATEGORY
// ============================================

export interface Category extends BaseDocument {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

// ============================================
// TAG
// ============================================

export interface Tag extends BaseDocument {
  name: string;
  slug: string;
}

export interface CreateTagInput {
  name: string;
  slug: string;
}

// ============================================
// ARTICLE
// ============================================

export interface Article extends BaseDocument {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  categoryId: string;
  tagIds: string[];
  authorId: string;
  authorName: string;
  status: ArticleStatus;
  isFeatured: boolean;
  isBreaking: boolean;
  viewCount: number;
  publishedAt?: string;
  publishedAtBS?: string;
  createdAtBS: string;
}

export interface CreateArticleInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  categoryId: string;
  tagIds?: string[];
  authorId: string;
  authorName: string;
  status: ArticleStatus;
  isFeatured?: boolean;
  isBreaking?: boolean;
  createdAtBS: string;
}

export interface UpdateArticleInput
  extends Partial<Omit<CreateArticleInput, "authorId">> {
  publishedAt?: string;
  publishedAtBS?: string;
}

export interface ArticleFilters {
  status?: ArticleStatus;
  categoryId?: string;
  authorId?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  tagId?: string;
  searchQuery?: string;
}

// ============================================
// AUTHOR
// ============================================

export interface Author extends BaseDocument {
  userId: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  socialLinks?: string;
  role: UserRole;
  isActive: boolean;
}

export interface CreateAuthorInput {
  userId: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  socialLinks?: string;
  role: UserRole;
  isActive: boolean;
}

export interface UpdateAuthorInput
  extends Partial<Omit<CreateAuthorInput, "userId">> {}

// ============================================
// COMMENT
// ============================================

export interface Comment extends BaseDocument {
  articleId: string;
  userId: string;
  userName: string;
  content: string;
  parentId?: string;
  status: CommentStatus;
  createdAtBS: string;
}

export interface CreateCommentInput {
  articleId: string;
  userId: string;
  userName: string;
  content: string;
  parentId?: string;
  status: CommentStatus;
  createdAtBS: string;
}

export interface UpdateCommentInput {
  content?: string;
  status?: CommentStatus;
}

// ============================================
// PAGE
// ============================================

export interface Page extends BaseDocument {
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  order: number;
}

export interface CreatePageInput {
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  order: number;
}

export interface UpdatePageInput extends Partial<CreatePageInput> {}

// ============================================
// ADVERTISEMENT
// ============================================

export interface Advertisement extends BaseDocument {
  name: string;
  position: AdPosition;
  imageId: string;
  linkUrl?: string;
  impressions: number;
  clicks: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

export interface CreateAdvertisementInput {
  name: string;
  position: AdPosition;
  imageId: string;
  linkUrl?: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

export interface UpdateAdvertisementInput
  extends Partial<CreateAdvertisementInput> {}

// ============================================
// SETTINGS
// ============================================

export interface Setting extends BaseDocument {
  key: string;
  value: string;
  type: SettingType;
}

export interface CreateSettingInput {
  key: string;
  value: string;
  type: SettingType;
}

// ============================================
// NOTIFICATION
// ============================================

export interface Notification extends BaseDocument {
  title: string;
  body: string;
  linkUrl?: string;
  targetAudience: NotificationTarget;
  sentAt?: string;
  status: NotificationStatus;
}

// ============================================
// AUTH TYPES
// ============================================

export interface User {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  email: string;
  phone?: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  status: boolean;
  labels: string[];
  prefs: Record<string, unknown>;
}

export interface Session {
  $id: string;
  $createdAt: string;
  userId: string;
  expire: string;
  provider: string;
  providerUid: string;
  providerAccessToken: string;
  ip: string;
  osCode: string;
  osName: string;
  osVersion: string;
  clientType: string;
  clientCode: string;
  clientName: string;
  clientVersion: string;
  clientEngine: string;
  deviceName: string;
  deviceBrand: string;
  deviceModel: string;
  countryCode: string;
  countryName: string;
  current: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// ============================================
// MEDIA TYPES
// ============================================

export interface UploadedFile {
  $id: string;
  bucketId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  name: string;
  signature: string;
  mimeType: string;
  sizeOriginal: number;
  chunksTotal: number;
  chunksUploaded: number;
}

export interface ImagePreviewOptions {
  width?: number;
  height?: number;
  gravity?:
    | "center"
    | "top-left"
    | "top"
    | "top-right"
    | "left"
    | "right"
    | "bottom-left"
    | "bottom"
    | "bottom-right";
  quality?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  opacity?: number;
  rotation?: number;
  background?: string;
  output?: "jpg" | "jpeg" | "png" | "gif" | "webp";
}
