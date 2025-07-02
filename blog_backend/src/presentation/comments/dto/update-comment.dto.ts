import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({ example: 'Updated comment content', required: true })
  @IsNotEmpty()
  @IsString()
  content: string;
}