export interface ProductDetails {
  name: string;
  price: number;
  imageUrl: string;
  link: string;
}

export interface EmailTemplateProps {
  inviterName: string;
  productDetails?: ProductDetails;
  joinUrl: string;
}
