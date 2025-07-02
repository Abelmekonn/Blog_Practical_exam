/**
 * Authentication and Authorization Usage Examples
 *
 * This file demonstrates how to use the authentication system
 * focused on author ownership and basic authentication.
 */

import { Controller, Get, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnershipGuard, Ownership } from '../auth/guards/ownership.guard';

@Controller('examples')
export class AuthExamplesController {
  // 1. Basic JWT Authentication - User must be logged in
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  protectedEndpoint() {
    return { message: 'This endpoint requires authentication' };
  }

  // 2. Read post details - Requires authentication
  @UseGuards(JwtAuthGuard)
  @Get('posts/:id')
  getPostDetails() {
    return { message: 'User must be logged in to read post details' };
  }

  // 3. Update own post - Only author can update
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Ownership('post')
  @Put('posts/:id')
  updateOwnPost() {
    return { message: 'Only the author can update this post' };
  }

  // 4. Delete own post - Only author can delete
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Ownership('post')
  @Delete('posts/:id')
  deleteOwnPost() {
    return { message: 'Only the author can delete this post' };
  }

  // 5. Delete own comment - Only author can delete
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Ownership('comment')
  @Delete('comments/:id')
  deleteOwnComment() {
    return { message: 'Only the author can delete this comment' };
  }

  // 6. Public endpoint - No authentication required (like listing posts)
  @Get('public')
  publicEndpoint() {
    return { message: 'This endpoint is public (like post listings)' };
  }
}

/**
 * CURRENT AUTHENTICATION RULES:
 *
 * 1. LIST POSTS (GET /posts):
 *    - ❌ No authentication required
 *    - Anyone can see the list of posts
 *
 * 2. READ POST DETAILS (GET /posts/:id):
 *    - ✅ JWT Authentication required
 *    - Users must be logged in to read full post content
 *
 * 3. CREATE POST (POST /posts):
 *    - ✅ JWT Authentication required
 *    - Automatically sets current user as author
 *
 * 4. UPDATE POST (PUT /posts/:id):
 *    - ✅ JWT Authentication required
 *    - ✅ Only the post author can update
 *
 * 5. DELETE POST (DELETE /posts/:id):
 *    - ✅ JWT Authentication required
 *    - ✅ Only the post author can delete
 *
 * 6. CREATE COMMENT (POST /comments):
 *    - ✅ JWT Authentication required
 *    - Automatically sets current user as author
 *
 * 7. READ COMMENTS (GET /comments/post/:postId):
 *    - ❌ No authentication required
 *    - Anyone can read comments
 *
 * 8. DELETE COMMENT (DELETE /comments/:id):
 *    - ✅ JWT Authentication required
 *    - ✅ Only the comment author can delete
 */

/**
 * SIMPLIFIED GUARD USAGE:
 *
 * For Authentication Only:
 * @UseGuards(JwtAuthGuard)
 *
 * For Author-Only Operations:
 * @UseGuards(JwtAuthGuard, OwnershipGuard)
 * @Ownership('post' | 'comment')
 */
