import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { ForgotPasswordReqDto } from 'src/core/dto/auth/forgot-password-dto.class';
import { EmailService } from 'src/infrastructure/services/sendgrid/sendgrid.service';
import { IResponse } from 'src/core/interface/response.interface';
import { BcryptService } from 'src/infrastructure/frameworks/bcrypt/bcrypt.service';
import { ForgotUpdatePasswordReqDto } from 'src/core/dto/auth/forgot-password-update.dto';
import { emailHtml } from 'src/infrastructure/services/sendgrid/otp.template';

@Injectable()
export class ForgotPasswordUsecase {
  constructor(
    private databaseService: IDataServices,
    private emailService: EmailService,
    private bcryptService: BcryptService,
  ) {}

  async sendOtp(
    forgotPasswordReqDto: ForgotPasswordReqDto,
  ): Promise<IResponse<null>> {
    const { email } = forgotPasswordReqDto;

    const user = await this.databaseService.users.get({ email });
    if (!user) {
      throw new NotFoundException(MESSAGES.USER.USER_NOT_FOUND);
    }

    const otp = this.generateOTP();

    await this.databaseService.otp.deleteByProperties({ email });
    await this.databaseService.otp.create({
      email,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiration
    });
    const { username } = user;
    const emailSubject = 'Forgot Password - OTP Verification';

    await this.emailService.sendEmail(
      email,
      emailSubject,
      emailHtml(username, otp),
      emailHtml(username, otp),
    );

    return {
      data: null,
      message: MESSAGES.PASSWORD.FORGOT_SUCCESS,
    };
  }

  generateOTP(): string {
    return Math.random().toString().slice(2, 8);
  }

  async updatePassword(
    dto: ForgotUpdatePasswordReqDto,
  ): Promise<IResponse<null>> {
    const { email, otp, password } = dto;

    const otpRecord = await this.databaseService.otp.get({ email, otp });
    if (!otpRecord) {
      throw new BadRequestException(MESSAGES.OTP.INVALID);
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      throw new BadRequestException(MESSAGES.OTP.EXPIRED);
    }

    const hashedPassword: string = await this.bcryptService.hash(password);

    await this.databaseService.users.update(
      { email },
      { password: hashedPassword },
    );

    const { id } = otpRecord;
    await this.databaseService.otp.delete(id);

    return {
      data: null,
      message: MESSAGES.PASSWORD.UPDATE_SUCCESS,
    };
  }
}
