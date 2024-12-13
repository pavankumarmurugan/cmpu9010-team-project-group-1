import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { UpdateLikesReqDto } from 'src/core/dto/likes/likes.req-update-dto';
import { RequestWithUser } from 'src/core/interface/request.interface';
import { IResponse } from 'src/core/interface/response.interface';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { RolesGuard } from 'src/infrastructure/guards/roles/roles.guard';
import { EmailService } from '../../services/sendgrid/sendgrid.service';
import { IDataServices } from 'src/core/abstracts';
import { InviteReqDTO } from 'src/core/dto/invite/invite.req-dto';
import { capitalize } from 'lodash';
import { InviteChatReqDTO } from 'src/core/dto/invite/invite.chat.req-dto';

@Controller('invite')
@ApiTags('Invite')
@UseGuards(AccessTokenGuard, RolesGuard)
export class InviteController {
  constructor(
    private emailService: EmailService,
    private databaseService: IDataServices,
  ) {}

  @Post('user')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async invite(
    @Request() request: RequestWithUser,
    @Body() inviteDto: InviteReqDTO,
  ): Promise<IResponse<void>> {
    try {
      const {
        user: { userId },
      } = request;

      const { email, productId } = inviteDto;
      const [{ imageUrl, price, name }, { firstname, lastname }] =
        await Promise.all([
          this.databaseService.product.get({ id: productId }),
          this.databaseService.users.get({
            userId,
          }),
        ]);
      await await this.emailService.sendInvitationWithProduct(
        email,
        `${capitalize(firstname)} ${capitalize(lastname)}`,
        {
          name,
          price,
          imageUrl,
          link: `https://smartwardrobe.store/productdetails/${productId}`,
        },
      );
      return {
        data: null,
        message: 'Invitation email sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('chat')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async inviteChat(
    @Request() request: RequestWithUser,
    @Body() inviteDto: InviteChatReqDTO,
  ): Promise<IResponse<void>> {
    try {
      const {
        user: { userId },
      } = request;

      const { email } = inviteDto;
      const { firstname, lastname } = await this.databaseService.users.get({
        userId,
      });
      await await this.emailService.sendInvitationForChat(
        email,
        `${capitalize(firstname)} ${capitalize(lastname)}`,
      );
      return {
        data: null,
        message: 'Invitation for chat email sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
