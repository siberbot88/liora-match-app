import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    @ApiOperation({ summary: 'Get my profile' })
    @ApiResponse({ status: 200, description: 'User profile retrieved' })
    async getProfile(@CurrentUser() user: any) {
        return this.usersService.findOne(user.userId);
    }

    @Patch('me')
    @ApiOperation({ summary: 'Update my profile' })
    @ApiResponse({ status: 200, description: 'Profile updated successfully' })
    async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
        return this.usersService.update(user.userId, dto);
    }
}
