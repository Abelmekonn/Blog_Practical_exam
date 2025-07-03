# 🌱 Database Seed Data

This document explains how to use the database seeding functionality to populate your blog application with realistic test data.

## 📋 What's Included

The seed data includes:

### 👥 Users (5 total)
- **johndoe** (john@example.com)
- **janesmith** (jane@example.com)
- **alexjohnson** (alex@example.com)
- **emilybrown** (emily@example.com)
- **michaelwilson** (michael@example.com)

All users use the password: `password123`

### 📝 Blog Posts (6 total)
1. **Getting Started with React and TypeScript** - Comprehensive guide to TypeScript with React
2. **Building Scalable Node.js APIs with Clean Architecture** - Explains Clean Architecture principles
3. **Modern CSS: Grid, Flexbox, and Beyond** - Modern CSS layout techniques
4. **Database Design Best Practices for Web Applications** - Database design principles
5. **The Future of Web Development: Trends to Watch in 2024** - Web development trends
6. **Mastering API Design: RESTful Principles and Beyond** - API design best practices

All posts use the same image: `https://res.cloudinary.com/detxtubji/image/upload/v1722631227/cld-sample-2.jpg`

### 💬 Comments (18 total)
- Realistic comments from various users on different posts
- 3-4 comments per post to simulate community engagement

## 🚀 How to Run Seeding

### Method 1: Using npm script (Recommended)
```bash
cd blog_backend
npm run seed
```

### Method 2: Direct execution
```bash
cd blog_backend
npx ts-node src/database/seeds/seed.command.ts
```

## ⚙️ How It Works

1. **Clears existing data**: Removes all comments, posts, and users
2. **Creates users**: Inserts 5 users with hashed passwords
3. **Creates posts**: Inserts 6 blog posts with the specified image
4. **Creates comments**: Adds realistic comments to posts

## 🔧 Configuration

The seeding service is located in:
- `src/database/seeds/seed.service.ts` - Main seeding logic
- `src/database/seeds/seed.module.ts` - NestJS module configuration
- `src/database/seeds/seed.command.ts` - Standalone command runner

## 📸 Image Details

All posts use a sample image from Cloudinary:
- **URL**: https://res.cloudinary.com/detxtubji/image/upload/v1722631227/cld-sample-2.jpg
- **Public ID**: cld-sample-2

## 🧪 Testing with Seed Data

After running the seed command, you can:

1. **Login with any user**:
   - Email: any of the user emails listed above
   - Password: `password123`

2. **Browse posts**: All 6 posts will be available with content and images

3. **View comments**: Each post has 3-4 realistic comments

4. **Test API endpoints**: Use Swagger docs at `/api/docs` to test all endpoints

## 🔄 Re-seeding

The seed command can be run multiple times. It will:
- Clear all existing data first
- Insert fresh seed data
- Maintain referential integrity

## 🚨 Important Notes

- **Production Warning**: Only run seeding in development/testing environments
- **Data Loss**: Seeding clears ALL existing data before inserting new data
- **Database Required**: Ensure your database is running and connected before seeding
- **Environment**: Make sure your `.env` file is configured correctly

## 🎯 Next Steps

After seeding:
1. Start your backend: `npm run start:dev`
2. Start your frontend: `cd ../blog_frontend && npm run dev`
3. Test the login flow with seeded users
4. Browse posts and comments
5. Test the API using Swagger at http://localhost:3000/api/docs
