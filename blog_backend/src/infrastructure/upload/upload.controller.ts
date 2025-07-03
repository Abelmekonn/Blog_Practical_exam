import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UploadService, ImageUploadResult, UploadFile } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({
    summary: 'Upload an image',
    description:
      'Upload an image file to local storage. Supports JPEG, PNG, and WebP formats up to 5MB.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload (JPEG, PNG, WebP, max 5MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      example: {
        publicId: 'posts_123e4567-e89b-12d3-a456-426614174000',
        imageUrl:
          'http://localhost:3000/uploads/images/posts_123e4567-e89b-12d3-a456-426614174000.jpg',
        format: 'jpg',
        bytes: 245760,
        filename: 'posts_123e4567-e89b-12d3-a456-426614174000.jpg',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file or file too large',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: UploadFile,
  ): Promise<ImageUploadResult> {
    return this.uploadService.uploadImage(file, 'posts');
  }

  @ApiOperation({
    summary: 'Delete an image',
    description: 'Delete an image from local storage by its public ID',
  })
  @ApiParam({
    name: 'publicId',
    description: 'Public ID of the image to delete',
    example: 'posts_123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Image deleted successfully',
    schema: {
      example: {
        message: 'Image deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete('image/:publicId')
  async deleteImage(
    @Param('publicId') publicId: string,
  ): Promise<{ message: string }> {
    // Decode the public ID (it might be URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);
    await this.uploadService.deleteImage(decodedPublicId);
    return { message: 'Image deleted successfully' };
  }
}
