/**
 * Centralized Appwrite Client
 *
 * Single instance shared across all services.
 * Supports both web and React Native platforms.
 */

import {
  Client,
  Account,
  Databases,
  Storage,
  Teams,
  Functions,
} from "appwrite";
import { getConfig } from "./config";

let client: Client | null = null;
let account: Account | null = null;
let databases: Databases | null = null;
let storage: Storage | null = null;
let teams: Teams | null = null;
let functions: Functions | null = null;

/**
 * Get or create the Appwrite Client instance.
 */
export function getClient(): Client {
  if (!client) {
    const config = getConfig();
    client = new Client();
    client.setEndpoint(config.endpoint).setProject(config.projectId);
  }
  return client;
}

/**
 * Get the Account service instance.
 */
export function getAccount(): Account {
  if (!account) {
    account = new Account(getClient());
  }
  return account;
}

/**
 * Get the Databases service instance.
 */
export function getDatabases(): Databases {
  if (!databases) {
    databases = new Databases(getClient());
  }
  return databases;
}

/**
 * Get the Storage service instance.
 */
export function getStorage(): Storage {
  if (!storage) {
    storage = new Storage(getClient());
  }
  return storage;
}

/**
 * Get the Teams service instance.
 */
export function getTeams(): Teams {
  if (!teams) {
    teams = new Teams(getClient());
  }
  return teams;
}

/**
 * Get the Functions service instance.
 */
export function getFunctions(): Functions {
  if (!functions) {
    functions = new Functions(getClient());
  }
  return functions;
}

/**
 * Reset all client instances.
 * Useful for logout or switching accounts.
 */
export function resetClient(): void {
  client = null;
  account = null;
  databases = null;
  storage = null;
  teams = null;
  functions = null;
}
