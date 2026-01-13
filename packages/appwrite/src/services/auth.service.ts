/**
 * Authentication Service
 *
 * Handles user authentication, sessions, and account management.
 */

import { ID, type Models } from "appwrite";
import { getAccount, getTeams, resetClient } from "../client";
import type {
  User,
  Session,
  LoginCredentials,
  RegisterData,
  UserRole,
} from "../types";

/**
 * Create a new user account.
 */
export async function register(data: RegisterData): Promise<User> {
  const account = getAccount();
  const user = await account.create(
    ID.unique(),
    data.email,
    data.password,
    data.name
  );
  return user as unknown as User;
}

/**
 * Login with email and password.
 * Creates a new session.
 */
export async function login(credentials: LoginCredentials): Promise<Session> {
  const account = getAccount();
  const session = await account.createEmailPasswordSession(
    credentials.email,
    credentials.password
  );
  return session as unknown as Session;
}

/**
 * Logout current session.
 */
export async function logout(): Promise<void> {
  const account = getAccount();
  await account.deleteSession("current");
  resetClient();
}

/**
 * Logout all sessions for current user.
 */
export async function logoutAll(): Promise<void> {
  const account = getAccount();
  await account.deleteSessions();
  resetClient();
}

/**
 * Get currently logged-in user.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const account = getAccount();
    const user = await account.get();
    return user as unknown as User;
  } catch {
    return null;
  }
}

/**
 * Get current active session.
 * Returns null if no active session.
 */
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const account = getAccount();
    const session = await account.getSession("current");
    return session as unknown as Session;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Send password recovery email.
 */
export async function sendPasswordRecovery(
  email: string,
  redirectUrl: string
): Promise<void> {
  const account = getAccount();
  await account.createRecovery(email, redirectUrl);
}

/**
 * Complete password recovery with token.
 */
export async function confirmPasswordRecovery(
  userId: string,
  secret: string,
  newPassword: string
): Promise<void> {
  const account = getAccount();
  await account.updateRecovery(userId, secret, newPassword);
}

/**
 * Send email verification.
 */
export async function sendEmailVerification(
  redirectUrl: string
): Promise<void> {
  const account = getAccount();
  await account.createVerification(redirectUrl);
}

/**
 * Confirm email verification.
 */
export async function confirmEmailVerification(
  userId: string,
  secret: string
): Promise<void> {
  const account = getAccount();
  await account.updateVerification(userId, secret);
}

/**
 * Update user name.
 */
export async function updateName(name: string): Promise<User> {
  const account = getAccount();
  const user = await account.updateName(name);
  return user as unknown as User;
}

/**
 * Update user email.
 * Requires current password for security.
 */
export async function updateEmail(
  email: string,
  password: string
): Promise<User> {
  const account = getAccount();
  const user = await account.updateEmail(email, password);
  return user as unknown as User;
}

/**
 * Update user password.
 * Requires current password for security.
 */
export async function updatePassword(
  newPassword: string,
  currentPassword: string
): Promise<User> {
  const account = getAccount();
  const user = await account.updatePassword(newPassword, currentPassword);
  return user as unknown as User;
}

/**
 * Update user preferences.
 */
export async function updatePreferences(
  prefs: Record<string, unknown>
): Promise<User> {
  const account = getAccount();
  const user = await account.updatePrefs(prefs);
  return user as unknown as User;
}

/**
 * Get all active sessions.
 */
export async function getSessions(): Promise<Session[]> {
  const account = getAccount();
  const response = await account.listSessions();
  return response.sessions as unknown as Session[];
}

/**
 * Delete a specific session by ID.
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const account = getAccount();
  await account.deleteSession(sessionId);
}

/**
 * Get user's team memberships to determine role.
 */
export async function getUserTeams(): Promise<
  Models.TeamList<Models.Preferences>
> {
  const teams = getTeams();
  return await teams.list();
}

/**
 * Check if current user has a specific role.
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  try {
    const teamList = await getUserTeams();
    return teamList.teams.some((team) => team.name.toLowerCase() === role);
  } catch {
    return false;
  }
}

/**
 * Get current user's role.
 * Returns the highest privilege role if user has multiple.
 */
export async function getUserRole(): Promise<UserRole | null> {
  try {
    const teamList = await getUserTeams();
    const teamNames = teamList.teams.map((t) => t.name.toLowerCase());

    // Return highest privilege role
    if (teamNames.includes("admin")) return "admin" as UserRole;
    if (teamNames.includes("editor")) return "editor" as UserRole;
    if (teamNames.includes("reporter")) return "reporter" as UserRole;

    return null;
  } catch {
    return null;
  }
}

/**
 * Check if user can create articles.
 */
export async function canCreateArticle(): Promise<boolean> {
  const role = await getUserRole();
  return role !== null; // Any authenticated staff can create
}

/**
 * Check if user can edit any article (not just their own).
 */
export async function canEditAnyArticle(): Promise<boolean> {
  const role = await getUserRole();
  return role === "admin" || role === "editor";
}

/**
 * Check if user can delete articles.
 */
export async function canDeleteArticle(): Promise<boolean> {
  const role = await getUserRole();
  return role === "admin";
}

/**
 * Check if user can manage categories.
 */
export async function canManageCategories(): Promise<boolean> {
  const role = await getUserRole();
  return role === "admin" || role === "editor";
}

/**
 * Check if user is admin.
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("admin" as UserRole);
}
