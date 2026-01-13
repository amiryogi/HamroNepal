/**
 * TypeScript Types for HamroNepal Mobile App
 */

// Article Status
export type ArticleStatus = "draft" | "pending" | "published" | "archived";

// Base document with Appwrite fields
export interface BaseDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

// Category
export interface Category extends BaseDocument {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
}

// Article
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

// Author
export interface Author extends BaseDocument {
  userId: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  socialLinks?: string;
  role: "admin" | "editor" | "reporter";
  isActive: boolean;
}

// Pagination
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  documents: T[];
  total: number;
}
