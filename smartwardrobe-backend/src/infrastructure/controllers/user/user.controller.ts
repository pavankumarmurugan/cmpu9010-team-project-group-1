import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from 'src/domain/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/domain/guards/auth/accessToken.guard';
import { RolesGuard } from 'src/domain/guards/roles/roles.guard';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { UserUsecase } from 'src/use-cases/user/user.usecase';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private userUsecase: UserUsecase) {}

  @Get('get-all')
  @ApiBearerAuth()
  // @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @Throttle(3, 60)
  async getAll() {
    try {
      return await this.userUsecase.getAllUsers();
    } catch (error) {
      throw error;
    }
  }
}
