# Nathan-Mrx Portfolio

![Nathan-Mrx Banner](https://img.shields.io/badge/Status-Online-00ff66?style=for-the-badge) ![Version](https://img.shields.io/badge/Version-2.0.0-00ff66?style=for-the-badge) ![License](https://img.shields.io/badge/License-Proprietary-00ff66?style=for-the-badge)

A cutting-edge, cyber-themed portfolio website built with **Next.js 16** and **Symfony 8**. Designed to showcase projects, articles, and professional experience with an immersive "hacker console" aesthetic.

## 🚀 Key Features

*   **Cyber Aesthetic**: Custom-built UI with CRT scanlines, neon glows, and interactive particle backgrounds (`framer-motion`).
*   **Full Localization**: Complete English (`en`) and French (`fr`) support using `next-intl`.
*   **Admin Dashboard**: secure area to manage Projects, Articles, and Profile data (powered by JWT Authentication).
*   **Printable Resume**: A dedicated `/resume` page that transforms into a clean, white-paper format when printing.
*   **Interactive Contact**: Terminal-style contact form that logs messages to the backend.
*   **SEO Optimized**: Server-side rendering and dynamic metadata for all content.

## 🛠️ Tech Stack

### Frontend (`/frontend`)
*   **Framework**: Next.js 16 (App Router)
*   **UI Library**: React 19
*   **Styling**: CSS Modules (Cyberpunk/Neon theme)
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **I18n**: Next-Intl

### Backend (`/backend`)
*   **Framework**: Symfony 8
*   **API**: API Platform 4.2 (JSON-LD / Hydra)
*   **Database**: PostgreSQL 15
*   **ORM**: Doctrine
*   **Admin**: EasyAdmin
*   **Auth**: Lexik JWT Authentication

## ⚙️ Installation

### Prerequisites
*   Docker & Docker Compose
*   Node.js 20+
*   PHP 8.4+ & Composer (optional, if running backend locally)

### 1. Backend Setup
The backend runs in a Docker container with PostgreSQL.

```bash
cd backend
# Install dependencies
composer install

# Start Docker containers (Database + API)
docker-compose up -d

# Run migrations to set up the database
php bin/console doctrine:migrations:migrate
```
*The API will be available at `http://localhost:8000`.*

### 2. Frontend Setup
The frontend is a Next.js application that connects to the backend API.

```bash
cd frontend
# Install dependencies
npm install

# Run development server
npm run dev
```
*The website will be available at `http://localhost:3000`.*

## 🔒 Environment Variables

### Backend (`backend/.env`)
Ensure `DATABASE_URL` is configured for the Docker PostgreSQL instance:
```ini
DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=15&charset=utf8"
```

### Frontend (`frontend/.env.local`)
Create a `.env.local` file to point to your API:
```ini
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🎮 Usage

*   **Public Access**: Visit `http://localhost:3000`.
*   **Admin Access**: Navigate to `http://localhost:3000/admin`.
    *   *Note: You may need to create a user via the backend console first:*
    *   `php bin/console app:create-user admin@nathan-mrx.dev password` (If command implemented) or manually via database.

## 📄 License
© 2026 Nathan Merieux. All Rights Reserved.
