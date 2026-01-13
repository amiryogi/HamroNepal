/**
 * Categories Service for Mobile
 *
 * Fetch categories from Appwrite.
 */

import { Query } from "appwrite";
import { databases, config } from "@/lib/appwrite";
import type { Category } from "@/types";

/**
 * Get all active categories
 */
export async function getCategories(): Promise<Category[]> {
  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.categories,
    [
      Query.equal("isActive", true),
      Query.orderAsc("sortOrder"),
      Query.limit(50),
    ]
  );

  return response.documents as unknown as Category[];
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.categories,
    [Query.equal("slug", slug), Query.limit(1)]
  );

  if (response.documents.length === 0) {
    return null;
  }

  return response.documents[0] as unknown as Category;
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const doc = await databases.getDocument(
      config.databaseId,
      config.collections.categories,
      id
    );
    return doc as unknown as Category;
  } catch {
    return null;
  }
}
