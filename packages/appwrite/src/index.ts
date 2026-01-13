/**
 * @hamronepal/appwrite
 *
 * Shared Appwrite service layer for HamroNepal news portal.
 * Used by both web (React/Vite) and mobile (React Native/Expo) apps.
 *
 * @example
 * ```typescript
 * import { initializeConfig, authService, newsService } from '@hamronepal/appwrite';
 *
 * // Initialize at app startup
 * initializeConfig({
 *   projectId: 'your-project-id',
 * });
 *
 * // Use services
 * const user = await authService.login({ email, password });
 * const articles = await newsService.getPublishedArticles();
 * ```
 */

// Configuration
export { initializeConfig, getConfig, defaultConfig } from "./config";
export type { AppwriteConfig } from "./config";

// Client utilities
export {
  getClient,
  getAccount,
  getDatabases,
  getStorage,
  getTeams,
  getFunctions,
  resetClient,
} from "./client";

// Services
export {
  authService,
  newsService,
  categoriesService,
  mediaService,
} from "./services";

// Types
export type {
  // Base
  BaseDocument,
  PaginationParams,
  PaginatedResponse,

  // Category
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,

  // Tag
  Tag,
  CreateTagInput,

  // Article
  Article,
  CreateArticleInput,
  UpdateArticleInput,
  ArticleFilters,

  // Author
  Author,
  CreateAuthorInput,
  UpdateAuthorInput,

  // Comment
  Comment,
  CreateCommentInput,
  UpdateCommentInput,

  // Page
  Page,
  CreatePageInput,
  UpdatePageInput,

  // Advertisement
  Advertisement,
  CreateAdvertisementInput,
  UpdateAdvertisementInput,

  // Settings
  Setting,
  CreateSettingInput,

  // Notification
  Notification,

  // Auth
  User,
  Session,
  LoginCredentials,
  RegisterData,

  // Media
  UploadedFile,
  ImagePreviewOptions,
} from "./types";

// Enums
export {
  ArticleStatus,
  CommentStatus,
  UserRole,
  AdPosition,
  SettingType,
  NotificationTarget,
  NotificationStatus,
} from "./types";
