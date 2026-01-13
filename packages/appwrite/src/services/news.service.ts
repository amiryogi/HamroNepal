/**
 * News (Articles) Service
 *
 * Handles CRUD operations for news articles.
 */

import { ID, Query, Permission, Role } from "appwrite";
import { getDatabases } from "../client";
import { getConfig } from "../config";
import type {
  Article,
  CreateArticleInput,
  UpdateArticleInput,
  ArticleFilters,
  ArticleStatus,
  PaginatedResponse,
  PaginationParams,
} from "../types";

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Get published articles with pagination.
 * For public-facing news listing.
 */
export async function getPublishedArticles(
  pagination?: PaginationParams
): Promise<PaginatedResponse<Article>> {
  const config = getConfig();
  const databases = getDatabases();

  const queries = [
    Query.equal("status", "published"),
    Query.orderDesc("publishedAt"),
  ];

  if (pagination?.limit) {
    queries.push(Query.limit(pagination.limit));
  } else {
    queries.push(Query.limit(20));
  }

  if (pagination?.offset) {
    queries.push(Query.offset(pagination.offset));
  }

  if (pagination?.cursor) {
    if (pagination.cursorDirection === "before") {
      queries.push(Query.cursorBefore(pagination.cursor));
    } else {
      queries.push(Query.cursorAfter(pagination.cursor));
    }
  }

  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.articles,
    queries
  );

  return {
    documents: response.documents as unknown as Article[],
    total: response.total,
  };
}

/**
 * Get articles with filters (for admin/editor).
 */
export async function getArticles(
  filters?: ArticleFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Article>> {
  const config = getConfig();
  const databases = getDatabases();

  const queries: string[] = [Query.orderDesc("$createdAt")];

  // Apply filters
  if (filters?.status) {
    queries.push(Query.equal("status", filters.status));
  }
  if (filters?.categoryId) {
    queries.push(Query.equal("categoryId", filters.categoryId));
  }
  if (filters?.authorId) {
    queries.push(Query.equal("authorId", filters.authorId));
  }
  if (filters?.isFeatured !== undefined) {
    queries.push(Query.equal("isFeatured", filters.isFeatured));
  }
  if (filters?.isBreaking !== undefined) {
    queries.push(Query.equal("isBreaking", filters.isBreaking));
  }
  if (filters?.tagId) {
    queries.push(Query.contains("tagIds", [filters.tagId]));
  }
  if (filters?.searchQuery) {
    queries.push(Query.search("title", filters.searchQuery));
  }

  // Apply pagination
  if (pagination?.limit) {
    queries.push(Query.limit(pagination.limit));
  } else {
    queries.push(Query.limit(20));
  }

  if (pagination?.offset) {
    queries.push(Query.offset(pagination.offset));
  }

  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.articles,
    queries
  );

  return {
    documents: response.documents as unknown as Article[],
    total: response.total,
  };
}

/**
 * Get a single article by ID.
 */
export async function getArticleById(id: string): Promise<Article> {
  const config = getConfig();
  const databases = getDatabases();

  const doc = await databases.getDocument(
    config.databaseId,
    config.collections.articles,
    id
  );

  return doc as unknown as Article;
}

/**
 * Get a published article by slug.
 * For public article page.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const config = getConfig();
  const databases = getDatabases();

  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.articles,
    [
      Query.equal("slug", slug),
      Query.equal("status", "published"),
      Query.limit(1),
    ]
  );

  if (response.documents.length === 0) {
    return null;
  }

  return response.documents[0] as unknown as Article;
}

/**
 * Get featured articles for homepage.
 */
export async function getFeaturedArticles(limit = 5): Promise<Article[]> {
  const config = getConfig();
  const databases = getDatabases();

  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.articles,
    [
      Query.equal("status", "published"),
      Query.equal("isFeatured", true),
      Query.orderDesc("publishedAt"),
      Query.limit(limit),
    ]
  );

  return response.documents as unknown as Article[];
}

/**
 * Get breaking news articles.
 */
export async function getBreakingNews(limit = 10): Promise<Article[]> {
  const config = getConfig();
  const databases = getDatabases();

  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.articles,
    [
      Query.equal("status", "published"),
      Query.equal("isBreaking", true),
      Query.orderDesc("publishedAt"),
      Query.limit(limit),
    ]
  );

  return response.documents as unknown as Article[];
}

/**
 * Get articles by category.
 */
export async function getArticlesByCategory(
  categoryId: string,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Article>> {
  return getArticles(
    { categoryId, status: "published" as ArticleStatus },
    pagination
  );
}

/**
 * Get articles by author.
 */
export async function getArticlesByAuthor(
  authorId: string,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Article>> {
  return getArticles(
    { authorId, status: "published" as ArticleStatus },
    pagination
  );
}

/**
 * Get articles pending review.
 */
export async function getPendingArticles(
  pagination?: PaginationParams
): Promise<PaginatedResponse<Article>> {
  return getArticles({ status: "pending" as ArticleStatus }, pagination);
}

/**
 * Get related articles (same category, excluding current).
 */
export async function getRelatedArticles(
  articleId: string,
  categoryId: string,
  limit = 5
): Promise<Article[]> {
  const config = getConfig();
  const databases = getDatabases();

  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.articles,
    [
      Query.equal("status", "published"),
      Query.equal("categoryId", categoryId),
      Query.notEqual("$id", articleId),
      Query.orderDesc("publishedAt"),
      Query.limit(limit),
    ]
  );

  return response.documents as unknown as Article[];
}

/**
 * Search articles by title.
 */
export async function searchArticles(
  query: string,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Article>> {
  return getArticles(
    { searchQuery: query, status: "published" as ArticleStatus },
    pagination
  );
}

// ============================================
// WRITE OPERATIONS
// ============================================

/**
 * Create a new article.
 * Sets document-level permissions for author to edit their own article.
 */
export async function createArticle(
  data: CreateArticleInput
): Promise<Article> {
  const config = getConfig();
  const databases = getDatabases();

  // Set default values
  const articleData = {
    ...data,
    tagIds: data.tagIds || [],
    isFeatured: data.isFeatured || false,
    isBreaking: data.isBreaking || false,
    viewCount: 0,
  };

  // Document-level permissions: author can update their own article
  const permissions = [
    Permission.read(Role.any()),
    Permission.update(Role.user(data.authorId)),
    Permission.update(Role.team("admin")),
    Permission.update(Role.team("editor")),
    Permission.delete(Role.team("admin")),
  ];

  const doc = await databases.createDocument(
    config.databaseId,
    config.collections.articles,
    ID.unique(),
    articleData,
    permissions
  );

  return doc as unknown as Article;
}

/**
 * Update an existing article.
 */
export async function updateArticle(
  id: string,
  data: UpdateArticleInput
): Promise<Article> {
  const config = getConfig();
  const databases = getDatabases();

  const doc = await databases.updateDocument(
    config.databaseId,
    config.collections.articles,
    id,
    data
  );

  return doc as unknown as Article;
}

/**
 * Delete an article.
 */
export async function deleteArticle(id: string): Promise<void> {
  const config = getConfig();
  const databases = getDatabases();

  await databases.deleteDocument(
    config.databaseId,
    config.collections.articles,
    id
  );
}

/**
 * Publish an article.
 * Sets publishedAt timestamp and changes status to published.
 */
export async function publishArticle(
  id: string,
  publishedAtBS: string
): Promise<Article> {
  return updateArticle(id, {
    status: "published" as ArticleStatus,
    publishedAt: new Date().toISOString(),
    publishedAtBS,
  });
}

/**
 * Unpublish an article (set to draft).
 */
export async function unpublishArticle(id: string): Promise<Article> {
  return updateArticle(id, {
    status: "draft" as ArticleStatus,
  });
}

/**
 * Archive an article.
 */
export async function archiveArticle(id: string): Promise<Article> {
  return updateArticle(id, {
    status: "archived" as ArticleStatus,
  });
}

/**
 * Submit article for review.
 */
export async function submitForReview(id: string): Promise<Article> {
  return updateArticle(id, {
    status: "pending" as ArticleStatus,
  });
}

/**
 * Toggle featured status.
 */
export async function toggleFeatured(id: string): Promise<Article> {
  const article = await getArticleById(id);
  return updateArticle(id, { isFeatured: !article.isFeatured });
}

/**
 * Toggle breaking news status.
 */
export async function toggleBreaking(id: string): Promise<Article> {
  const article = await getArticleById(id);
  return updateArticle(id, { isBreaking: !article.isBreaking });
}

/**
 * Increment view count.
 * Note: For high-traffic sites, consider using an Appwrite Function
 * to handle this more efficiently.
 */
export async function incrementViewCount(id: string): Promise<void> {
  const config = getConfig();
  const databases = getDatabases();

  const article = await getArticleById(id);

  await databases.updateDocument(
    config.databaseId,
    config.collections.articles,
    id,
    { viewCount: article.viewCount + 1 }
  );
}

// ============================================
// VALIDATION
// ============================================

/**
 * Check if a slug is unique.
 */
export async function isSlugUnique(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const config = getConfig();
  const databases = getDatabases();

  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.articles,
    [Query.equal("slug", slug), Query.limit(1)]
  );

  if (response.documents.length === 0) {
    return true;
  }

  if (excludeId && response.documents[0].$id === excludeId) {
    return true;
  }

  return false;
}

/**
 * Generate a unique slug from title.
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  // Convert Nepali/English title to URL-safe slug
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0900-\u097F-]/g, "") // Keep alphanumeric, spaces, hyphens, Devanagari
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .substring(0, 200); // Limit length

  let slug = baseSlug;
  let counter = 1;

  while (!(await isSlugUnique(slug))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// ============================================
// STATISTICS
// ============================================

/**
 * Get article count by status.
 */
export async function getArticleCountByStatus(): Promise<
  Record<string, number>
> {
  const config = getConfig();
  const databases = getDatabases();

  const statuses: ArticleStatus[] = [
    "draft",
    "pending",
    "published",
    "archived",
  ] as ArticleStatus[];
  const counts: Record<string, number> = {};

  await Promise.all(
    statuses.map(async (status) => {
      const response = await databases.listDocuments(
        config.databaseId,
        config.collections.articles,
        [Query.equal("status", status), Query.limit(1)]
      );
      counts[status] = response.total;
    })
  );

  return counts;
}

/**
 * Get total published article count.
 */
export async function getPublishedCount(): Promise<number> {
  const config = getConfig();
  const databases = getDatabases();

  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.articles,
    [Query.equal("status", "published"), Query.limit(1)]
  );

  return response.total;
}
