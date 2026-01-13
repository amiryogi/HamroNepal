/**
 * Categories Service
 *
 * Handles CRUD operations for news categories.
 */

import { ID, Query } from "appwrite";
import { getDatabases } from "../client";
import { getConfig } from "../config";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  PaginatedResponse,
  PaginationParams,
} from "../types";

/**
 * Get all active categories.
 * Sorted by order field.
 */
export async function getCategories(): Promise<Category[]> {
  const config = getConfig();
  const databases = getDatabases();

  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.categories,
    [
      Query.equal("isActive", true),
      Query.orderAsc("sortOrder"),
      Query.limit(100),
    ]
  );

  return response.documents as unknown as Category[];
}

/**
 * Get all categories (including inactive) for admin.
 */
export async function getAllCategories(
  pagination?: PaginationParams
): Promise<PaginatedResponse<Category>> {
  const config = getConfig();
  const databases = getDatabases();

  const queries = [Query.orderAsc("sortOrder")];

  if (pagination?.limit) {
    queries.push(Query.limit(pagination.limit));
  }
  if (pagination?.offset) {
    queries.push(Query.offset(pagination.offset));
  }

  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.categories,
    queries
  );

  return {
    documents: response.documents as unknown as Category[],
    total: response.total,
  };
}

/**
 * Get a single category by ID.
 */
export async function getCategoryById(id: string): Promise<Category> {
  const config = getConfig();
  const databases = getDatabases();

  const doc = await databases.getDocument(
    config.databaseId,
    config.collections.categories,
    id
  );

  return doc as unknown as Category;
}

/**
 * Get a category by slug.
 */
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const config = getConfig();
  const databases = getDatabases();

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
 * Get child categories of a parent.
 */
export async function getChildCategories(
  parentId: string
): Promise<Category[]> {
  const config = getConfig();
  const databases = getDatabases();

  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.categories,
    [
      Query.equal("parentId", parentId),
      Query.equal("isActive", true),
      Query.orderAsc("sortOrder"),
    ]
  );

  return response.documents as unknown as Category[];
}

/**
 * Get top-level categories (no parent).
 */
export async function getRootCategories(): Promise<Category[]> {
  const config = getConfig();
  const databases = getDatabases();

  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.categories,
    [
      Query.isNull("parentId"),
      Query.equal("isActive", true),
      Query.orderAsc("sortOrder"),
    ]
  );

  return response.documents as unknown as Category[];
}

/**
 * Create a new category.
 */
export async function createCategory(
  data: CreateCategoryInput
): Promise<Category> {
  const config = getConfig();
  const databases = getDatabases();

  const doc = await databases.createDocument(
    config.databaseId,
    config.collections.categories,
    ID.unique(),
    data
  );

  return doc as unknown as Category;
}

/**
 * Update an existing category.
 */
export async function updateCategory(
  id: string,
  data: UpdateCategoryInput
): Promise<Category> {
  const config = getConfig();
  const databases = getDatabases();

  const doc = await databases.updateDocument(
    config.databaseId,
    config.collections.categories,
    id,
    data
  );

  return doc as unknown as Category;
}

/**
 * Delete a category.
 * Note: Consider checking for articles in this category first.
 */
export async function deleteCategory(id: string): Promise<void> {
  const config = getConfig();
  const databases = getDatabases();

  await databases.deleteDocument(
    config.databaseId,
    config.collections.categories,
    id
  );
}

/**
 * Toggle category active status.
 */
export async function toggleCategoryStatus(id: string): Promise<Category> {
  const category = await getCategoryById(id);
  return updateCategory(id, { isActive: !category.isActive });
}

/**
 * Reorder categories.
 */
export async function reorderCategories(orderedIds: string[]): Promise<void> {
  const config = getConfig();
  const databases = getDatabases();

  const updates = orderedIds.map((id, index) =>
    databases.updateDocument(
      config.databaseId,
      config.collections.categories,
      id,
      { order: index }
    )
  );

  await Promise.all(updates);
}

/**
 * Check if a slug is unique.
 */
export async function isSlugUnique(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const config = getConfig();
  const databases = getDatabases();

  const queries = [Query.equal("slug", slug), Query.limit(1)];

  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.categories,
    queries
  );

  if (response.documents.length === 0) {
    return true;
  }

  // If we're updating, the existing doc with same slug should be the one we're updating
  if (excludeId && response.documents[0].$id === excludeId) {
    return true;
  }

  return false;
}

/**
 * Get category with its parent chain (breadcrumb).
 */
export async function getCategoryBreadcrumb(id: string): Promise<Category[]> {
  const breadcrumb: Category[] = [];
  let currentId: string | undefined = id;

  while (currentId) {
    const category = await getCategoryById(currentId);
    breadcrumb.unshift(category);
    currentId = category.parentId;
  }

  return breadcrumb;
}
