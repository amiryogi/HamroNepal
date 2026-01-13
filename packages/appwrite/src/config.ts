/**
 * Appwrite Configuration
 *
 * These values should be set via environment variables in each app:
 * - Web: import.meta.env.VITE_APPWRITE_*
 * - Mobile: process.env.EXPO_PUBLIC_APPWRITE_*
 */

export interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  databaseId: string;
  buckets: {
    articleImages: string;
    avatars: string;
    advertisements: string;
    documents: string;
  };
  collections: {
    categories: string;
    tags: string;
    articles: string;
    authors: string;
    comments: string;
    pages: string;
    advertisements: string;
    settings: string;
    notifications: string;
  };
}

/**
 * Default configuration with placeholder IDs.
 * Override these in your app's initialization.
 */
export const defaultConfig: AppwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "",
  databaseId: "hamronepal_db",
  buckets: {
    articleImages: "article-images",
    avatars: "avatars",
    advertisements: "advertisements",
    documents: "documents",
  },
  collections: {
    categories: "categories",
    tags: "tags",
    articles: "articles",
    authors: "authors",
    comments: "comments",
    pages: "pages",
    advertisements: "advertisements",
    settings: "settings",
    notifications: "notifications",
  },
};

let currentConfig: AppwriteConfig = { ...defaultConfig };

/**
 * Initialize Appwrite configuration.
 * Call this once at app startup before using any services.
 */
export function initializeConfig(config: Partial<AppwriteConfig>): void {
  currentConfig = {
    ...defaultConfig,
    ...config,
    buckets: {
      ...defaultConfig.buckets,
      ...config.buckets,
    },
    collections: {
      ...defaultConfig.collections,
      ...config.collections,
    },
  };
}

/**
 * Get current Appwrite configuration.
 */
export function getConfig(): AppwriteConfig {
  if (!currentConfig.projectId) {
    throw new Error(
      "Appwrite not configured. Call initializeConfig() with your projectId first."
    );
  }
  return currentConfig;
}
