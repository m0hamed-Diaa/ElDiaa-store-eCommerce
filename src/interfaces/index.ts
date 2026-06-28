export interface IErrorResponse {
  error: {
    details?: {
      errors: {
        message: string;
      }[];
    };
    message?: string;
  };
}




export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
}

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
  size: number;
  sizeInBytes?: number;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  url: string;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
}

export interface StrapiLocalization {
  id: number;
  documentId: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  rating?: number;
  reviewCount?: number;
  discount?: number;
  locale: string;
}

export interface StrapiCategory {
  id: number;
  documentId: string;
  title: string;
  locale?: string;
  products: IProduct[];
}

export interface IProduct {
  id: number;
  documentId: string;

  title: string;
  description: string;

  price: number;
  stock: number;

  rating?: number | undefined;
  reviewCount?: number | undefined;
  discount?: number | undefined;

  locale: string;

  createdAt: string;
  updatedAt: string;
  publishedAt: string;

  thumbnail: StrapiImage;

  categories: StrapiCategory[];

  localizations: StrapiLocalization[];
}


export interface IHeroSlide {
  id: number;
  documentId: string;

  title: string;
  subtitle?: string;

  linkType: "category" | "product" | "discount" | "custom";

  discountOnly?: boolean;

  customUrl?: string | null;

  image: {
    url: string;
    width?: number;
    height?: number;
  };
  category?: {
    documentId: string;
    title: string;
  };

  locale: string;
  createdAt: string;
  publishedAt?: string;
}


export interface ICustomerProfile {
  fullName: string | undefined;
  id: number;
  documentId: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  avater: StrapiImage;
  username: string;
  user: {
    id: number;
    documentId: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface IUserProfile {
  id: number;
  documentId: string;
  accountType?: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/**
 {
  customerName,
  email,
  phone,
  address,

  items: [
    {
      productId,
      title,
      quantity,
      price,
      finalPrice
    }
  ],

  totalPrice,
  totalQuantity,

  paymentMethod,
  status
}
 */