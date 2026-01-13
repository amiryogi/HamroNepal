/**
 * Appwrite Configuration for Web App
 *
 * Initializes the shared Appwrite service layer with environment variables.
 */

import { Client, Account, Databases, Storage } from "appwrite";

// Environment variables
const APPWRITE_ENDPOINT =
  import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || "";
const APPWRITE_DATABASE_ID =
  import.meta.env.VITE_APPWRITE_DATABASE_ID || "hamronepal_db";

// Validate configuration
if (!APPWRITE_PROJECT_ID) {
  console.warn(
    "Appwrite Project ID not configured. Set VITE_APPWRITE_PROJECT_ID in .env"
  );
}

// Create client
const client = new Client();
client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

// Export services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export config
export const config = {
  endpoint: APPWRITE_ENDPOINT,
  projectId: APPWRITE_PROJECT_ID,
  databaseId: APPWRITE_DATABASE_ID,
  collections: {
    categories: "categories",
    tags: "tags",
    articles: "articles",
    authors: "authors",
    comments: "comments",
    pages: "pages",
    advertisements: "advertisements",
    settings: "settings",
  },
  buckets: {
    articleImages: "article-images",
    avatars: "avatars",
    advertisements: "advertisements",
  },
};

export { client };
