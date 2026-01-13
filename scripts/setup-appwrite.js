#!/usr/bin/env node
/**
 * HamroNepal Appwrite Setup Script
 *
 * Run this after logging into Appwrite CLI:
 *   appwrite login
 *   node scripts/setup-appwrite.js
 */

const { execSync } = require("child_process");

const PROJECT_NAME = "HamroNepal";
const DATABASE_ID = "hamronepal_db";
const DATABASE_NAME = "HamroNepal Database";

// Collection schemas
const collections = {
  categories: {
    name: "Categories",
    attributes: [
      { key: "name", type: "string", size: 100, required: true },
      { key: "slug", type: "string", size: 100, required: true },
      { key: "description", type: "string", size: 500, required: false },
      { key: "icon", type: "string", size: 50, required: false },
      { key: "color", type: "string", size: 20, required: false },
      { key: "sortOrder", type: "integer", required: false, default: 0 },
      { key: "isActive", type: "boolean", required: false, default: true },
    ],
    indexes: [
      { key: "slug_idx", type: "unique", attributes: ["slug"] },
      { key: "sort_idx", type: "key", attributes: ["sortOrder"] },
    ],
  },
  articles: {
    name: "Articles",
    attributes: [
      { key: "title", type: "string", size: 300, required: true },
      { key: "slug", type: "string", size: 300, required: true },
      { key: "excerpt", type: "string", size: 500, required: false },
      { key: "content", type: "string", size: 100000, required: false },
      { key: "featuredImage", type: "string", size: 500, required: false },
      { key: "categoryId", type: "string", size: 36, required: true },
      { key: "authorId", type: "string", size: 36, required: true },
      { key: "authorName", type: "string", size: 100, required: true },
      {
        key: "status",
        type: "enum",
        elements: ["draft", "pending", "published", "archived"],
        required: true,
        default: "draft",
      },
      { key: "isFeatured", type: "boolean", required: false, default: false },
      { key: "isBreaking", type: "boolean", required: false, default: false },
      { key: "viewCount", type: "integer", required: false, default: 0 },
      { key: "publishedAt", type: "datetime", required: false },
      { key: "publishedAtBS", type: "string", size: 50, required: false },
      { key: "createdAtBS", type: "string", size: 50, required: false },
    ],
    indexes: [
      { key: "slug_idx", type: "unique", attributes: ["slug"] },
      { key: "status_idx", type: "key", attributes: ["status"] },
      { key: "category_idx", type: "key", attributes: ["categoryId"] },
      { key: "author_idx", type: "key", attributes: ["authorId"] },
      { key: "featured_idx", type: "key", attributes: ["isFeatured"] },
      { key: "breaking_idx", type: "key", attributes: ["isBreaking"] },
      { key: "published_idx", type: "key", attributes: ["publishedAt"] },
      { key: "title_search", type: "fulltext", attributes: ["title"] },
    ],
  },
  authors: {
    name: "Authors",
    attributes: [
      { key: "name", type: "string", size: 100, required: true },
      { key: "email", type: "string", size: 255, required: true },
      { key: "bio", type: "string", size: 1000, required: false },
      { key: "avatar", type: "string", size: 500, required: false },
      {
        key: "role",
        type: "enum",
        elements: ["admin", "editor", "reporter"],
        required: true,
        default: "reporter",
      },
      { key: "userId", type: "string", size: 36, required: true },
      { key: "isActive", type: "boolean", required: false, default: true },
    ],
    indexes: [
      { key: "email_idx", type: "unique", attributes: ["email"] },
      { key: "userId_idx", type: "key", attributes: ["userId"] },
      { key: "role_idx", type: "key", attributes: ["role"] },
    ],
  },
  tags: {
    name: "Tags",
    attributes: [
      { key: "name", type: "string", size: 50, required: true },
      { key: "slug", type: "string", size: 50, required: true },
    ],
    indexes: [{ key: "slug_idx", type: "unique", attributes: ["slug"] }],
  },
  comments: {
    name: "Comments",
    attributes: [
      { key: "articleId", type: "string", size: 36, required: true },
      { key: "userId", type: "string", size: 36, required: false },
      { key: "userName", type: "string", size: 100, required: true },
      { key: "content", type: "string", size: 2000, required: true },
      { key: "isApproved", type: "boolean", required: false, default: false },
    ],
    indexes: [
      { key: "article_idx", type: "key", attributes: ["articleId"] },
      { key: "approved_idx", type: "key", attributes: ["isApproved"] },
    ],
  },
};

// Storage buckets
const buckets = [
  { id: "article-images", name: "Article Images", maxSize: 5242880 }, // 5MB
  { id: "avatars", name: "User Avatars", maxSize: 2097152 }, // 2MB
];

// Teams
const teams = [
  { id: "admin", name: "Administrators" },
  { id: "editor", name: "Editors" },
  { id: "reporter", name: "Reporters" },
];

function run(cmd, silent = false) {
  try {
    const result = execSync(cmd, {
      encoding: "utf8",
      stdio: silent ? "pipe" : "inherit",
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function runJson(cmd) {
  try {
    const result = execSync(`${cmd} --json`, {
      encoding: "utf8",
      stdio: "pipe",
    });
    return JSON.parse(result);
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log("🚀 HamroNepal Appwrite Setup");
  console.log("============================\n");

  // Check login
  console.log("📋 Checking Appwrite login...");
  const whoami = run("appwrite whoami", true);
  if (!whoami.success) {
    console.error("❌ Not logged in. Please run: appwrite login");
    process.exit(1);
  }
  console.log("✅ Logged in\n");

  // Initialize project
  console.log("📁 Initializing project...");
  run("appwrite init project");

  // Get project ID
  console.log(
    "\n📊 Please enter your Project ID from appwrite.json or console:"
  );
  const fs = require("fs");
  let projectId = "";

  if (fs.existsSync("appwrite.json")) {
    const config = JSON.parse(fs.readFileSync("appwrite.json", "utf8"));
    projectId = config.projectId;
    console.log(`   Found project ID: ${projectId}`);
  }

  if (!projectId) {
    console.log("❌ No project found. Please run: appwrite init project");
    process.exit(1);
  }

  // Create database
  console.log("\n🗄️  Creating database...");
  run(
    `appwrite databases create --databaseId "${DATABASE_ID}" --name "${DATABASE_NAME}"`
  );
  console.log("✅ Database created\n");

  // Create collections
  console.log("📚 Creating collections...");
  for (const [collectionId, schema] of Object.entries(collections)) {
    console.log(`   Creating ${schema.name}...`);

    // Create collection
    run(
      `appwrite databases createCollection --databaseId "${DATABASE_ID}" --collectionId "${collectionId}" --name "${schema.name}" --permissions "read(\\"any\\")" "create(\\"users\\")" "update(\\"users\\")" "delete(\\"users\\")"`
    );

    // Create attributes
    for (const attr of schema.attributes) {
      let cmd = `appwrite databases create${capitalize(
        attr.type
      )}Attribute --databaseId "${DATABASE_ID}" --collectionId "${collectionId}" --key "${
        attr.key
      }"`;

      if (attr.type === "string") {
        cmd += ` --size ${attr.size}`;
      }
      if (attr.type === "enum") {
        cmd += ` --elements ${attr.elements.map((e) => `"${e}"`).join(" ")}`;
      }
      if (attr.required !== undefined) {
        cmd += ` --required ${attr.required}`;
      }
      if (attr.default !== undefined) {
        cmd += ` --default "${attr.default}"`;
      }

      run(cmd, true);
    }

    // Wait for attributes to be ready
    await sleep(2000);

    // Create indexes
    for (const idx of schema.indexes || []) {
      const attrs = idx.attributes.map((a) => `"${a}"`).join(" ");
      run(
        `appwrite databases createIndex --databaseId "${DATABASE_ID}" --collectionId "${collectionId}" --key "${idx.key}" --type "${idx.type}" --attributes ${attrs}`,
        true
      );
    }

    console.log(`   ✅ ${schema.name} created`);
  }

  // Create buckets
  console.log("\n📦 Creating storage buckets...");
  for (const bucket of buckets) {
    run(
      `appwrite storage createBucket --bucketId "${bucket.id}" --name "${bucket.name}" --maximumFileSize ${bucket.maxSize} --permissions "read(\\"any\\")" "create(\\"users\\")" "update(\\"users\\")" "delete(\\"users\\")"`
    );
    console.log(`   ✅ ${bucket.name} created`);
  }

  // Create teams
  console.log("\n👥 Creating teams...");
  for (const team of teams) {
    run(
      `appwrite teams create --teamId "${team.id}" --name "${team.name}"`,
      true
    );
    console.log(`   ✅ ${team.name} created`);
  }

  console.log("\n🎉 Setup complete!");
  console.log("\nNext steps:");
  console.log("1. Copy the Project ID to your .env files");
  console.log("2. Add team members in Appwrite Console");
  console.log("3. Run: npm run dev");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch(console.error);
