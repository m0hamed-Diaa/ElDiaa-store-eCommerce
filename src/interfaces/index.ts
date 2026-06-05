export interface IRegisterInput {
  name: "email" | "username" | "password";
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
  };
}

export interface ILoginInput {
  name: "identifier" | "password";
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
  };
}

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
  products: IProduct[];
}

export interface IProduct {
  id: number;
  documentId: string;

  title: string;
  description: string;

  price: number;
  stock: number;

  rating: number;
  reviewCount: number;
  discount: number;

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