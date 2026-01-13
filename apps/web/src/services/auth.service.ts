/**
 * Auth Service
 *
 * Handles authentication and role management.
 */

import { account, databases, config } from "@/lib/appwrite";
import type { Author } from "@/types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  $id: string;
  email: string;
  name: string;
}

/**
 * Login with email and password.
 */
export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  await account.createEmailPasswordSession(
    credentials.email,
    credentials.password
  );
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Login failed");
  }
  return user;
}

/**
 * Logout current session.
 */
export async function logout(): Promise<void> {
  await account.deleteSession("current");
}

/**
 * Get currently logged-in user.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const user = await account.get();
    return {
      $id: user.$id,
      email: user.email,
      name: user.name,
    };
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    await account.get();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get author profile for current user.
 */
export async function getAuthorProfile(userId: string): Promise<Author | null> {
  try {
    const { Query } = await import("appwrite");
    const response = await databases.listDocuments(
      config.databaseId,
      config.collections.authors,
      [Query.equal("userId", userId), Query.limit(1)]
    );

    if (response.documents.length === 0) {
      return null;
    }

    return response.documents[0] as unknown as Author;
  } catch {
    return null;
  }
}

/**
 * Check if user has required role.
 */
export function hasRole(
  author: Author | null,
  requiredRoles: string[]
): boolean {
  if (!author) return false;
  return requiredRoles.includes(author.role);
}

/**
 * Check if user can create articles.
 */
export function canCreateArticle(author: Author | null): boolean {
  return hasRole(author, ["admin", "editor", "reporter"]);
}

/**
 * Check if user can edit any article.
 */
export function canEditAnyArticle(author: Author | null): boolean {
  return hasRole(author, ["admin", "editor"]);
}

/**
 * Check if user can delete articles.
 */
export function canDeleteArticle(author: Author | null): boolean {
  return hasRole(author, ["admin"]);
}

/**
 * Check if user can manage categories.
 */
export function canManageCategories(author: Author | null): boolean {
  return hasRole(author, ["admin", "editor"]);
}

/**
 * Check if user is admin.
 */
export function isAdmin(author: Author | null): boolean {
  return hasRole(author, ["admin"]);
}
