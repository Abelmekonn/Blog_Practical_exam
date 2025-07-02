import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

// User-related exceptions
export class UserNotFoundException extends BaseException {
  constructor(userId: string) {
    super(
      `User with ID ${userId} not found`,
      'USER_NOT_FOUND',
      HttpStatus.NOT_FOUND,
      { userId },
    );
  }
}

export class UserAlreadyExistsException extends BaseException {
  constructor(email: string) {
    super(
      `User with email ${email} already exists`,
      'USER_ALREADY_EXISTS',
      HttpStatus.CONFLICT,
      { email },
    );
  }
}

// Post-related exceptions
export class PostNotFoundException extends BaseException {
  constructor(postId: string) {
    super(
      `Post with ID ${postId} not found`,
      'POST_NOT_FOUND',
      HttpStatus.NOT_FOUND,
      { postId },
    );
  }
}

export class UnauthorizedPostAccessException extends BaseException {
  constructor(postId: string, userId: string) {
    super(
      'You are not authorized to access this post',
      'UNAUTHORIZED_POST_ACCESS',
      HttpStatus.FORBIDDEN,
      { postId, userId },
    );
  }
}

// Comment-related exceptions
export class CommentNotFoundException extends BaseException {
  constructor(commentId: string) {
    super(
      `Comment with ID ${commentId} not found`,
      'COMMENT_NOT_FOUND',
      HttpStatus.NOT_FOUND,
      { commentId },
    );
  }
}

export class UnauthorizedCommentAccessException extends BaseException {
  constructor(commentId: string, userId: string) {
    super(
      'You are not authorized to access this comment',
      'UNAUTHORIZED_COMMENT_ACCESS',
      HttpStatus.FORBIDDEN,
      { commentId, userId },
    );
  }
}

// Auth-related exceptions
export class InvalidCredentialsException extends BaseException {
  constructor() {
    super(
      'Invalid email or password',
      'INVALID_CREDENTIALS',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class TokenExpiredException extends BaseException {
  constructor() {
    super(
      'Authentication token has expired',
      'TOKEN_EXPIRED',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

// Validation exceptions
export class ValidationException extends BaseException {
  constructor(field: string, value: unknown, reason: string) {
    super(
      `Validation failed for field '${field}': ${reason}`,
      'VALIDATION_ERROR',
      HttpStatus.BAD_REQUEST,
      { field, value, reason },
    );
  }
}
