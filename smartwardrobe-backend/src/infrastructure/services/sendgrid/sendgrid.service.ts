import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';
import { EmailTemplateService } from './email-template.service';
import { ProductDetails } from './email.types';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail = 'smartwardrobe.store@gmail.com';
  private readonly joinUrl = 'https://smartwardrobe.store/';

  constructor(
    private readonly configService: ConfigService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {}

  onModuleInit() {
    const sendgridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!sendgridApiKey) {
      throw new Error(
        'SENDGRID_API_KEY is not defined in environment variables',
      );
    }
    sgMail.setApiKey(sendgridApiKey);
  }

  async sendInvitationWithProduct(
    friendEmail: string,
    inviterName: string,
    productDetails?: ProductDetails,
  ): Promise<void> {
    try {
      const html = this.emailTemplateService.getEmailTemplate({
        inviterName,
        productDetails,
        joinUrl: this.joinUrl,
      });

      const msg = {
        to: friendEmail,
        from: this.fromEmail,
        subject: `${inviterName} wants to chat with you on SmartWardrobe!`,
        html,
      };

      await sgMail.send(msg);
      this.logger.log(`Invitation email sent successfully to ${friendEmail}`);
    } catch (error) {
      this.logger.error(
        `Failed to send invitation email to ${friendEmail}`,
        error.response?.body || error,
      );
      throw new Error(
        'Failed to send invitation email. Please try again later.',
      );
    }
  }

  async sendInvitationForChat(
    friendEmail: string,
    inviterName: string,
  ): Promise<void> {
    try {
      const html = this.emailTemplateService.getEmailTemplateForChat({
        inviterName,
        joinUrl: this.joinUrl,
      });

      const msg = {
        to: friendEmail,
        from: this.fromEmail,
        subject: `${inviterName} wants to chat with you on SmartWardrobe!`,
        html,
      };

      await sgMail.send(msg);
      this.logger.log(`Invitation email sent successfully to ${friendEmail}`);
    } catch (error) {
      this.logger.error(
        `Failed to send invitation email to ${friendEmail}`,
        error.response?.body || error,
      );
      throw new Error(
        'Failed to send invitation email. Please try again later.',
      );
    }
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    try {
      const msg = {
        to,
        from: this.fromEmail,
        subject,
        text,
        ...(html && { html }), // Add HTML content if provided
      };

      await sgMail.send(msg);
      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}`,
        error.response?.body || error,
      );
      throw new Error('Failed to send email. Please try again later.');
    }
  }
}
