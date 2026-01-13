/**
 * News Service for Mobile
 *
 * Fetch articles from Appwrite.
 */

import { Query } from "appwrite";
import { databases, config, storage } from "@/lib/appwrite";
import type { Article, Category, PaginatedResponse } from "@/types";

/**
 * Get published articles
 */
export async function getArticles(
  limit = 20,
  offset = 0,
  categoryId?: string
): Promise<PaginatedResponse<Article>> {
  const queries: string[] = [
    Query.equal("status", "published"),
    Query.orderDesc("$createdAt"),
    Query.limit(limit),
    Query.offset(offset),
  ];

  if (categoryId) {
    queries.push(Query.equal("categoryId", categoryId));
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
 * Get featured articles
 */
export async function getFeaturedArticles(limit = 5): Promise<Article[]> {
  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.articles,
    [
      Query.equal("status", "published"),
      Query.equal("isFeatured", true),
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
    ]
  );

  return response.documents as unknown as Article[];
}

/**
 * Get breaking news
 */
export async function getBreakingNews(limit = 5): Promise<Article[]> {
  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.articles,
    [
      Query.equal("status", "published"),
      Query.equal("isBreaking", true),
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
    ]
  );

  return response.documents as unknown as Article[];
}

/**
 * Get article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.articles,
    [Query.equal("slug", slug), Query.limit(1)]
  );

  if (response.documents.length === 0) {
    return null;
  }

  return response.documents[0] as unknown as Article;
}

/**
 * Get article by ID
 */
export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const doc = await databases.getDocument(
      config.databaseId,
      config.collections.articles,
      id
    );
    return doc as unknown as Article;
  } catch {
    return null;
  }
}

/**
 * Increment view count
 */
export async function incrementViewCount(articleId: string): Promise<void> {
  try {
    const article = await getArticleById(articleId);
    if (article) {
      await databases.updateDocument(
        config.databaseId,
        config.collections.articles,
        articleId,
        { viewCount: article.viewCount + 1 }
      );
    }
  } catch (error) {
    console.error("Failed to increment view count:", error);
  }
}

/**
 * Get image URL from storage
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

  return storage
    .getFilePreview(config.buckets.articleImages, fileId, width, height)
    .toString();
}

/**
 * Search articles
 */
export async function searchArticles(
  query: string,
  limit = 20
): Promise<Article[]> {
  const response = await databases.listDocuments(
    config.databaseId,
    config.collections.articles,
    [
      Query.equal("status", "published"),
      Query.search("title", query),
      Query.limit(limit),
    ]
  );

  return response.documents as unknown as Article[];
}
