export const bannerLinkTypes = [
    "category",
    "product",
    "discount",
    "custom",
] as const;

export type BannerLinkType =
    (typeof bannerLinkTypes)[number];