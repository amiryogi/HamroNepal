/**
 * Appwrite Configuration for React Native
 */

import { Client, Databases, Storage, Account } from "appwrite";
import Constants from "expo-constants";

// Get environment variables (Expo)
const getEnv = (key: string, fallback: string = ""): string => {
  // Try expo-constants first (for EAS builds)
  const expoConfig = Constants.expoConfig?.extra;
  if (expoConfig?.[key]) return expoConfig[key];

  // Fallback to process.env for local development
  return (
    (process.env as Record<string, string>)[`EXPO_PUBLIC_${key}`] || fallback
  );
};

// Appwrite configuration
const config = {
  endpoint: getEnv("APPWRITE_ENDPOINT", "https://cloud.appwrite.io/v1"),
  projectId: getEnv("APPWRITE_PROJECT_ID", ""),
  databaseId: getEnv("APPWRITE_DATABASE_ID", "hamronepal_db"),
  collections: {
    articles: "articles",
    categories: "categories",
    authors: "authors",
    tags: "tags",
    comments: "comments",
    analytics: "analytics",
  },
  buckets: {
    articleImages: "article-images",
    authorAvatars: "avatars",
  },
};

// Validate configuration
if (!config.projectId) {
  console.warn(
    "⚠️ Appwrite Project ID not configured. Set EXPO_PUBLIC_APPWRITE_PROJECT_ID in .env"
  );
}

// Initialize Appwrite client
const client = new Client();

client.setEndpoint(config.endpoint).setProject(config.projectId);

// Initialize services
const databases = new Databases(client);
const storage = new Storage(client);
const account = new Account(client);

export { client, databases, storage, account, config };
