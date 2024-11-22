import { Injectable } from '@nestjs/common';
import { EmailTemplateProps, ProductDetails } from './email.types';

@Injectable()
export class EmailTemplateService {
  private getProductTemplate(
    productDetails: ProductDetails,
    inviterName: string,
  ): string {
    return `
      <div style="margin: 32px 0;">
        <p style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; color: #333; margin-bottom: 20px; letter-spacing: 0.3px;">
          <strong>${inviterName}</strong> shared a product with you! Check it out and help your friend decide.
        </p>
        <div style="border: 1px solid #f0f0f0; border-radius: 12px; padding: 24px; background-color: white; max-width: 500px; font-family: 'Helvetica Neue', Arial, sans-serif;">
          <div style="display: grid; grid-template-columns: 1fr;">
            <!-- Image Container -->
            <div style="text-align: center; margin-bottom: 24px;">
              <img 
                src="${productDetails.imageUrl}" 
                alt="${productDetails.name}" 
                style="width: 100%; max-width: 280px; height: auto; border-radius: 8px; object-fit: contain;"
                onerror="this.style.display='none'"
              />
            </div>
            <!-- Product Details -->
            <div style="text-align: center; padding: 0 16px;">
              <h3 style="margin: 0 0 12px 0; font-size: 20px; color: #1a1a1a; font-weight: 500; letter-spacing: 0.5px;">
                ${productDetails.name}
              </h3>
              <p style="margin: 0 0 20px 0; font-size: 18px; color: #4a4a4a; font-weight: 400;">
                €${productDetails.price}
              </p>
              <a 
                href="${productDetails.link}" 
                style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 24px; font-size: 14px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase;">
                View Product
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  public getEmailTemplate({
    inviterName,
    productDetails,
    joinUrl,
  }: EmailTemplateProps): string {
    const productHtml = productDetails
      ? this.getProductTemplate(productDetails, inviterName)
      : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 16px; background-color: #fafafa; font-family: 'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <p style="font-size: 16px; color: #1a1a1a; margin-bottom: 20px; line-height: 1.5;">Hi there,</p>
            
            <p style="font-size: 16px; color: #1a1a1a; margin-bottom: 24px; line-height: 1.5;">
              Your friend <strong>${inviterName}</strong> has invited you to join them on <strong>SmartWardrobe</strong>, a clothing fashion website.
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a 
                href="${joinUrl}" 
                style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 24px; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                Join Now
              </a>
            </div>

            ${productHtml}

            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f0f0f0;">
              <p style="font-size: 14px; color: #8a8a8a; text-align: center; margin: 0; font-style: italic;">
                If you're not interested, simply ignore this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
