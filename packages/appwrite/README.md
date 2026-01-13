# @hamronepal/appwrite

Shared Appwrite service layer for HamroNepal news portal.

## Installation

This is a local package. Add to your app's package.json:

```json
{
  "dependencies": {
    "@hamronepal/appwrite": "file:../packages/appwrite",
    "appwrite": "^15.0.0"
  }
}
```

## Usage

### Initialize (do this once at app startup)

```typescript
import { initializeConfig } from "@hamronepal/appwrite";

// For Vite (web)
initializeConfig({
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
});

// For Expo (mobile)
initializeConfig({
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
});
```

### Authentication

```typescript
import { authService } from "@hamronepal/appwrite";

// Login
const session = await authService.login({
  email: "user@example.com",
  password: "password123",
});

// Get current user
const user = await authService.getCurrentUser();

// Check role
const isAdmin = await authService.isAdmin();
const role = await authService.getUserRole();

// Logout
await authService.logout();
```

### News Articles

```typescript
import { newsService, ArticleStatus } from "@hamronepal/appwrite";

// Get published articles
const { documents, total } = await newsService.getPublishedArticles({
  limit: 20,
  offset: 0,
});

// Get featured articles
const featured = await newsService.getFeaturedArticles(5);

// Get breaking news
const breaking = await newsService.getBreakingNews();

// Get article by slug
const article = await newsService.getArticleBySlug("news-slug");

// Create article (for reporters)
const newArticle = await newsService.createArticle({
  title: "समाचार शीर्षक",
  slug: "samachar-shirshak",
  excerpt: "छोटो विवरण",
  content: "<p>पूर्ण समाचार...</p>",
  categoryId: "category-id",
  authorId: "user-id",
  authorName: "पत्रकार नाम",
  status: ArticleStatus.DRAFT,
  createdAtBS: "२०८२-०९-२९",
});

// Submit for review
await newsService.submitForReview(newArticle.$id);

// Publish (for editors)
await newsService.publishArticle(article.$id, "२०८२-०९-२९");
```

### Categories

```typescript
import { categoriesService } from "@hamronepal/appwrite";

// Get active categories
const categories = await categoriesService.getCategories();

// Get category by slug
const category = await categoriesService.getCategoryBySlug("rajniti");

// Get root categories (for navigation)
const rootCategories = await categoriesService.getRootCategories();

// Create category (admin/editor only)
const newCategory = await categoriesService.createCategory({
  name: "राजनीति",
  slug: "rajniti",
  order: 1,
  isActive: true,
});
```

### Media

```typescript
import { mediaService } from "@hamronepal/appwrite";

// Validate before upload
const validation = mediaService.validateArticleImage(file);
if (!validation.valid) {
  console.error(validation.error);
  return;
}

// Upload article image
const uploaded = await mediaService.uploadArticleImage(file);

// Get image URLs
const thumbnailUrl = mediaService.getArticleImageWithSize(
  uploaded.$id,
  "thumbnail"
);
const cardUrl = mediaService.getArticleImageWithSize(uploaded.$id, "card");
const fullUrl = mediaService.getArticleImageWithSize(uploaded.$id, "full");

// Custom size
const customUrl = mediaService.getArticleImageUrl(uploaded.$id, {
  width: 600,
  height: 400,
  quality: 85,
  output: "webp",
});

// Delete image
await mediaService.deleteArticleImage(uploaded.$id);
```

## Environment Variables

### Web (Vite)

Create `.env` file:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
```

### Mobile (Expo)

Create `.env` file:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
```

## Project Structure

```
packages/appwrite/
├── src/
│   ├── index.ts          # Main exports
│   ├── config.ts         # Configuration
│   ├── client.ts         # Appwrite client
│   ├── types/
│   │   └── index.ts      # TypeScript types
│   └── services/
│       ├── index.ts
│       ├── auth.service.ts
│       ├── news.service.ts
│       ├── categories.service.ts
│       └── media.service.ts
├── package.json
├── tsconfig.json
└── README.md
```
