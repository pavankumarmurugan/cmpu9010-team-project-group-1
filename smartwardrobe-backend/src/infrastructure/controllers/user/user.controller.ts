import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  Request,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdatePasswordUserReqDTO } from 'src/core/dto/user/user-req-update-profile-password.dto';
import { UpdateProfileUserReqDTO } from 'src/core/dto/user/user-req-update-profile.dto';
import { UserReqDTO } from 'src/core/dto/user/user-req.dto';
import { RequestWithUser } from 'src/core/interface/request.interface';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { RolesGuard } from 'src/infrastructure/guards/roles/roles.guard';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { RefreshTokenUpdateInterceptor } from 'src/infrastructure/interceptors/refresh-token-update.interceptor';
import { UserUsecase } from 'src/use-cases/user/user.usecase';
import { CartCreateInterceptor } from 'src/infrastructure/interceptors/cart-add.interceptor';
import { UserResDTO } from 'src/core/dto/user/user-res.dto';
import { IResponse } from 'src/core/interface/response.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadProfilePictureService } from 'src/infrastructure/services/uploadProfilePicture/upload-profile-picture';
import { Multer } from 'multer';
import { ProfilePictureUploadDto } from 'src/core/dto/user/profile-picture-upload.dto';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(
    private userUsecase: UserUsecase,
    private uploadPicture: UploadProfilePictureService,
  ) {}

  // @Get('get-all')
  // @ApiBearerAuth()
  // @UseGuards(AccessTokenGuard, RolesGuard)
  // @Roles(ROLES.ADMIN)
  // async getAll() {
  //   try {
  //     return await this.userUsecase.getAllUsers();
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  @Post('create')
  @UseInterceptors(RefreshTokenUpdateInterceptor)
  @UseInterceptors(CartCreateInterceptor)
  async saveUser(@Body() dto: UserReqDTO) {
    try {
      return await this.userUsecase.create(dto);
    } catch (error) {
      throw error;
    }
  }

  @Patch('update')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.USER, ROLES.ADMIN, ROLES.OWNER)
  async update(
    @Request() request: RequestWithUser,
    @Body() dto: UpdateProfileUserReqDTO,
  ) {
    try {
      const {
        user: { userId },
      } = request;
      return await this.userUsecase.update(userId, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  async delete(@Param('id', ParseIntPipe) userId: number) {
    try {
      return await this.userUsecase.delete(userId);
    } catch (error) {
      throw error;
    }
  }

  @Get('get-my-profile')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.USER, ROLES.ADMIN, ROLES.OWNER)
  async getMyProfile(
    @Request() request: RequestWithUser,
  ): Promise<IResponse<UserResDTO>> {
    try {
      const {
        user: { userId },
      } = request;
      return await this.userUsecase.getMyProfile(userId);
    } catch (error) {
      throw error;
    }
  }

  @Patch('update-password')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.USER, ROLES.ADMIN, ROLES.OWNER)
  async updatePassword(
    @Request() request: RequestWithUser,
    @Body() dto: UpdatePasswordUserReqDTO,
  ) {
    try {
      const {
        user: { userId },
      } = request;
      return await this.userUsecase.updatePassword(userId, dto);
    } catch (error) {
      throw error;
    }
  }

  @Post('upload-profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.USER, ROLES.ADMIN, ROLES.OWNER)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User profile picture upload',
    type: ProfilePictureUploadDto,
  })
  async uploadProfilePicture(
    @UploadedFile() file: Multer.File,
    @Request() request: RequestWithUser,
  ) {
    const {
      user: { userId },
    } = request;

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const fileUrl = await this.uploadPicture.uploadFile(file, userId);

    return await this.userUsecase.uploadProfilePicture(userId, fileUrl);
  }

  @Get('search/:searchKey')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.ADMIN, ROLES.USER)
  async searchUser(@Param('searchKey') searchKey: string) {
    try {
      return await this.userUsecase.searchUser(searchKey);
    } catch (error) {
      throw error;
    }
  }
}
