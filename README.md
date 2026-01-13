# हाम्रो नेपाल (HamroNepal)

नेपाली समाचार पोर्टल - Nepali News Portal

A modern, full-stack news portal application built with React, React Native, TypeScript, and Appwrite Cloud. Similar to [Ratopati.com](https://ratopati.com).

## 📋 Features

### 🌐 Public Website (`apps/web`)

- **गृहपृष्ठ** - Featured articles, breaking news, category sections
- **श्रेणी पृष्ठ** - Filter news by category with pagination
- **समाचार विवरण** - Full article view with BS/AD dates, related articles
- **खोज** - Search articles by title
- **Responsive Design** - Mobile-first UI with Tailwind CSS

### 📱 Mobile App (`apps/mobile`)

- **News List** - Featured, breaking, and latest news
- **Category Filter** - Filter by category with chips
- **News Detail** - Full article with share functionality
- **Search** - Find articles by keyword
- **Nepali UI** - All text in Nepali language

### 🔐 Admin Dashboard

- **Login** - Secure authentication with Appwrite
- **Dashboard** - Stats overview (articles, views, categories)
- **Article Management** - Create, edit, publish, archive articles
- **Category Management** - CRUD for news categories
- **Image Upload** - Upload featured images to Appwrite Storage
- **Role-based Access** - Admin, Editor, Reporter roles

### 📅 Bikram Sambat Support

- **AD to BS Conversion** - Accurate date conversion
- **Dual Date Display** - Shows both BS and AD dates
- **Nepali Formatting** - Nepali digits and month names
- **Relative Time** - "३ घण्टा अघि" format

## 🏗️ Project Structure

```
hamronepal/
├── apps/
│   ├── web/                 # React + Vite + Tailwind (Public + Admin)
│   │   ├── src/
│   │   │   ├── components/  # UI components
│   │   │   ├── contexts/    # React contexts (Auth)
│   │   │   ├── lib/         # Appwrite client, BS date utils
│   │   │   ├── pages/       # Public pages + Dashboard pages
│   │   │   ├── services/    # API service layer
│   │   │   └── types/       # TypeScript types
│   │   └── .env.example
│   │
│   └── mobile/              # React Native + Expo
│       ├── app/             # Expo Router screens
│       ├── src/
│       │   ├── components/  # RN components
│       │   ├── constants/   # Theme constants
│       │   ├── lib/         # Appwrite client, BS date utils
│       │   ├── services/    # API service layer
│       │   └── types/       # TypeScript types
│       └── .env.example
│
└── packages/
    ├── appwrite/            # Shared Appwrite service layer
    └── bs-date/             # Bikram Sambat date utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [Appwrite Cloud](https://cloud.appwrite.io) account
- Expo Go app (for mobile development)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hamronepal.git
cd hamronepal
```

### 2. Setup Appwrite Backend

#### Create Project

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Create a new project named "HamroNepal"
3. Copy the **Project ID**

#### Create Database

Create a database named `hamronepal_db` with these collections:

| Collection   | Attributes                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `categories` | `name` (string), `slug` (string, unique), `description` (string), `icon` (string), `color` (string), `sortOrder` (integer), `isActive` (boolean)                                                                                                                                                                                                                                                          |
| `articles`   | `title` (string), `slug` (string, unique), `excerpt` (string), `content` (string), `featuredImage` (string), `categoryId` (string), `tagIds` (string[]), `authorId` (string), `authorName` (string), `status` (enum: draft/pending/published/archived), `isFeatured` (boolean), `isBreaking` (boolean), `viewCount` (integer), `publishedAt` (datetime), `publishedAtBS` (string), `createdAtBS` (string) |
| `authors`    | `name` (string), `email` (string), `bio` (string), `avatar` (string), `role` (enum: admin/editor/reporter), `userId` (string)                                                                                                                                                                                                                                                                             |
| `tags`       | `name` (string), `slug` (string, unique)                                                                                                                                                                                                                                                                                                                                                                  |
| `comments`   | `articleId` (string), `userId` (string), `userName` (string), `content` (string), `isApproved` (boolean)                                                                                                                                                                                                                                                                                                  |

#### Create Storage Buckets

| Bucket ID        | Name           | Max File Size |
| ---------------- | -------------- | ------------- |
| `article-images` | Article Images | 5MB           |
| `avatars`        | User Avatars   | 2MB           |

#### Configure Permissions

**Collection Permissions:**

- `categories`: Read (Any), Write (Team: admin, editor)
- `articles`: Read (Any), Write (Team: admin, editor, reporter)
- `authors`: Read (Any), Write (Team: admin)

**Bucket Permissions:**

- `article-images`: Read (Any), Write (Users)
- `avatars`: Read (Any), Write (Users)

#### Create Teams

Create these teams in Authentication > Teams:

- `admin` - Full access
- `editor` - Can publish articles
- `reporter` - Can create/edit own articles

### 3. Configure Environment Variables

#### Web App

```bash
cd apps/web
cp .env.example .env
```

Edit `.env`:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=hamronepal_db
```

#### Mobile App

```bash
cd apps/mobile
cp .env.example .env
```

Edit `.env`:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_APPWRITE_DATABASE_ID=hamronepal_db
```

### 4. Install Dependencies

```bash
# Web app
cd apps/web
npm install

# Mobile app
cd ../mobile
npm install

# Shared packages (optional)
cd ../../packages/bs-date
npm install
npm run build
```

### 5. Run the Applications

#### Web App

```bash
cd apps/web
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

#### Mobile App

```bash
cd apps/mobile
npx expo start
```

Scan QR code with Expo Go app

## 🔒 Security

### Architecture

- **Service Layer Abstraction**: Appwrite SDK is only used in `/services` files
- **No Direct SDK in UI**: Components use service functions only
- **Environment Variables**: Sensitive IDs stored in `.env` files
- **Role-Based Permissions**: Document-level access control

### Permissions Model

```typescript
// Article permissions example
const permissions = [
  Permission.read(Role.any()), // Public can read
  Permission.update(Role.user(authorId)), // Author can edit
  Permission.update(Role.team("admin")), // Admin can edit
  Permission.update(Role.team("editor")), // Editor can edit
  Permission.delete(Role.team("admin")), // Only admin can delete
];
```

## 📅 Bikram Sambat (BS) Date Utilities

### Usage

```typescript
import {
  adToBS,
  formatBSDate,
  formatDualDate,
  toNepaliDigits,
} from "@/lib/bs-date";

// Convert AD to BS
const bsDate = adToBS(new Date("2025-12-29"));
// { year: 2082, month: 9, day: 14 }

// Format BS date
formatBSDate(bsDate);
// "१४ पुष २०८२"

// Get both BS and AD
const dual = formatDualDate("2025-12-29");
// { bs: "१४ पुष २०८२", ad: "२९ डिसेम्बर २०२५", relative: "३ दिन अघि" }

// Convert to Nepali digits
toNepaliDigits(2025);
// "२०२५"
```

## 🛠️ Tech Stack

| Layer                   | Technology                               |
| ----------------------- | ---------------------------------------- |
| **Frontend (Web)**      | React 18, Vite, TypeScript, Tailwind CSS |
| **Frontend (Mobile)**   | React Native, Expo SDK 52, TypeScript    |
| **Navigation (Mobile)** | Expo Router (file-based routing)         |
| **Backend**             | Appwrite Cloud                           |
| **Database**            | Appwrite Database                        |
| **Storage**             | Appwrite Storage                         |
| **Authentication**      | Appwrite Auth                            |

## 📱 App Screens

### Web Routes

| Route                      | Page                                |
| -------------------------- | ----------------------------------- |
| `/`                        | Home (Featured + Breaking + Latest) |
| `/category/:slug`          | Category page with pagination       |
| `/news/:slug`              | Article detail                      |
| `/admin`                   | Dashboard home                      |
| `/admin/articles`          | Article list                        |
| `/admin/articles/new`      | Create article                      |
| `/admin/articles/:id/edit` | Edit article                        |
| `/admin/categories`        | Category management                 |
| `/admin/login`             | Admin login                         |

### Mobile Screens

| Screen              | Description                              |
| ------------------- | ---------------------------------------- |
| `(tabs)/index`      | Home with featured, breaking, categories |
| `(tabs)/categories` | Category grid                            |
| `(tabs)/search`     | Search articles                          |
| `category/[slug]`   | Category articles list                   |
| `news/[id]`         | Article detail with share                |

## 🌐 Deployment

### Web (Vercel/Netlify)

```bash
cd apps/web
npm run build
# Deploy the dist/ folder
```

Set environment variables in your hosting dashboard:

- `VITE_APPWRITE_ENDPOINT`
- `VITE_APPWRITE_PROJECT_ID`
- `VITE_APPWRITE_DATABASE_ID`

### Mobile (EAS Build)

```bash
cd apps/mobile
npx eas build --platform all
```

Configure secrets in `eas.json` or EAS dashboard.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ for Nepal 🇳🇵
