# social-media-app

This is a full-stack web application that allows you to create social media posts containing text and an image, similar to Twitter.

You can try it [here](https://social-media-app-gules-nine.vercel.app/).

<img src="/public/hero-image.png" alt="Header image" width="500" height="500">

## Features

- **Dark Mode**: Users can toggle between a dark mode and a light mode
- **Image Storage Buckets**: User profile pictures and post images are contained in public storage buckets
- **User Reactions and Comments**: Users can like, dislike, and comment on any post

## Core Technologies

- **Front End**: Next.js, Tailwind CSS
- **Back End**: Supabase, PostgreSQL, Server Actions
- **CI/CD and Deployment**: GitHub Actions, ESLint, Vercel

## Installation

### Prerequisites

In order to run this project locally, you must have the following installed/set up:

- [Node.js](https://nodejs.org/en)
- pnpm (`npm install -g pnpm`)
- [Docker Desktop Installation](https://docs.docker.com/desktop) (Necessary for using Supbase CLI)

### Instructions

1. Clone the repository

```bash
git clone https://github.com/tmatth11/social-media-app.git
```

2. Navigate to the project's directory

```bash
cd social-media-app
```

3. Install dependencies

```bash
pnpm install
```

4. Open Docker Desktop
5. Start Supabase services

```bash
pnpm supabase start
```

6. Apply existing migrations

```bash
pnpm supabase db reset
```

7. Create local `.env.local` file
8. Add this template to the `.env.local` file and insert the necessary values

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

9. Start the development server

```bash
pnpm dev
```
