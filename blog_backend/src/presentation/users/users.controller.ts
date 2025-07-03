import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

// Command Handlers
import { UpdateUserHandler } from '../../application/users/commands/update-user.handler';

// Query Handlers
import { GetUserHandler } from '../../application/users/queries/get-user.handler';

// Commands and Queries
import { UpdateUserCommand } from '../../application/users/commands/update-user.command';
import { GetUserQuery } from '../../application/users/queries/get-user.query';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly updateUserHandler: UpdateUserHandler,
    private readonly getUserHandler: GetUserHandler,
  ) {}

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Returns the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const query = new GetUserQuery(id);
    const user = await this.getUserHandler.execute(query);
    const { password, ...result } = user;
    return result;
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    // Check if user is updating their own profile
    if (id !== req.user.id) {
      return { message: 'You can only update your own profile' };
    }

    const command = new UpdateUserCommand(
      id,
      updateUserDto.name,
      updateUserDto.email,
    );
    await this.updateUserHandler.execute(command);
    return { message: 'User updated successfully' };
  }
}
