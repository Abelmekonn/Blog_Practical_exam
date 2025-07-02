import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { POST_REPOSITORY } from '../../domain/posts/post.repository.interface';
import { COMMENT_REPOSITORY } from '../../domain/comments/comment.repository.interface';
import { IPostRepository } from '../../domain/posts/post.repository.interface';
import { ICommentRepository } from '../../domain/comments/comment.repository.interface';
import { AuthenticatedRequest } from '../../types/request.types';

export const OWNERSHIP_KEY = 'ownership';
export const Ownership = (resourceType: 'post' | 'comment') =>
  Reflect.metadata(OWNERSHIP_KEY, resourceType);

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const resourceType = this.reflector.get<string>(
      OWNERSHIP_KEY,
      context.getHandler(),
    );
    if (!resourceType) {
      return true; // No ownership check required
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    const resourceId = request.params.id;

    if (!user || !resourceId) {
      throw new ForbiddenException('Access denied');
    }

    let resource;
    if (resourceType === 'post') {
      resource = await this.postRepository.findById(resourceId);
      if (!resource) {
        return true; // Let the handler throw NotFoundException
      }
      if (resource.author.id !== user.id) {
        throw new ForbiddenException('You can only modify your own posts');
      }
    } else if (resourceType === 'comment') {
      resource = await this.commentRepository.findById(resourceId);
      if (!resource) {
        return true; // Let the handler throw NotFoundException
      }
      if (resource.author.id !== user.id) {
        throw new ForbiddenException('You can only modify your own comments');
      }
    }

    return true;
  }
}
