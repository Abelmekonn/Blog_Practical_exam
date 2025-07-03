import { Injectable, BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname: string;
}

export interface ImageUploadResult {
  publicId: string;
  imageUrl: string;
  width?: number;
  height?: number;
  format: string;
  bytes: number;
  filename: string;
}

@Injectable()
export class UploadService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'images');
  private readonly baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  constructor() {
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async uploadImage(
    file: UploadFile,
    folder: string = 'posts',
  ): Promise<ImageUploadResult> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG, and WebP images are allowed',
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    // Generate unique filename
    const fileExtension = this.getFileExtension(file.mimetype);
    const filename = `${folder}_${uuidv4()}.${fileExtension}`;
    const filePath = path.join(this.uploadDir, filename);

    try {
      // Save file to disk
      await fs.writeFile(filePath, file.buffer);

      // Generate public URL
      const imageUrl = `${this.baseUrl}/uploads/images/${filename}`;

      return {
        publicId: filename.replace(`.${fileExtension}`, ''), // Remove extension for publicId
        imageUrl,
        format: fileExtension,
        bytes: file.size,
        filename,
      };
    } catch (error) {
      throw new BadRequestException(
        `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      // Find file with any extension
      const files = await fs.readdir(this.uploadDir);
      const fileToDelete = files.find(
        (file) => file.startsWith(publicId) || file.includes(publicId),
      );

      if (fileToDelete) {
        const filePath = path.join(this.uploadDir, fileToDelete);
        await fs.unlink(filePath);
      }
    } catch (error) {
      // Log error but don't throw - deletion failure shouldn't break the flow
      console.error('Failed to delete image:', error);
    }
  }

  async replaceImage(
    oldPublicId: string | null,
    file: UploadFile,
    folder: string = 'posts',
  ): Promise<ImageUploadResult> {
    // Upload new image first
    const uploadResult = await this.uploadImage(file, folder);

    // Delete old image if it exists
    if (oldPublicId) {
      await this.deleteImage(oldPublicId);
    }

    return uploadResult;
  }

  private getFileExtension(mimetype: string): string {
    switch (mimetype) {
      case 'image/jpeg':
      case 'image/jpg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      default:
        return 'jpg';
    }
  }

  async getImageInfo(filename: string): Promise<any> {
    const filePath = path.join(this.uploadDir, filename);
    try {
      const stats = await fs.stat(filePath);
      return {
        exists: true,
        size: stats.size,
        modified: stats.mtime,
      };
    } catch {
      return { exists: false };
    }
  }
}
