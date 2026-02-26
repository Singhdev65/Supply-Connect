export const USER_ROLES = {
  BUYER: "buyer",
  VENDOR: "vendor",
  ADMIN: "admin",
  OPS_MANAGER: "ops_manager",
  SUPPORT: "support",
  FINANCE: "finance",
};

export const PAYMENT_METHODS = {
  COD: "COD",
  RAZORPAY: "RAZORPAY",
  UPI: "UPI",
};

export const APP_TITLES = {
  BUYER_LAYOUT: "Supply Connect - Buyer",
  VENDOR_LAYOUT: "Supply Connect - Vendor",
  CHAT_LAYOUT: "Supply Connect - Chat",
};

export const PRODUCT_SORT_OPTIONS = {
  NAME: "name",
  STOCK: "stock",
  NEWEST: "newest",
  OLDEST: "oldest",
};

export const PRODUCT_CATEGORY_OPTIONS = [
  { value: "grocery-daily-essentials", label: "Grocery & Daily Essentials" },
  { value: "fashion-apparel", label: "Fashion & Apparel" },
  { value: "electronics", label: "Electronics" },
  { value: "books-stationery", label: "Books & Stationery" },
  { value: "home-living", label: "Home & Living" },
  { value: "beauty-personal-care", label: "Beauty & Personal Care" },
  { value: "toys-sports-baby-care", label: "Toys, Sports & Baby Care" },
];

export const PRODUCT_SUBCATEGORY_OPTIONS = {
  "grocery-daily-essentials": [
    { value: "fruits-vegetables", label: "Fruits & Vegetables" },
    { value: "dairy-bakery", label: "Dairy & Bakery" },
    { value: "staples", label: "Staples (Rice, Atta, Pulses)" },
    { value: "snacks-beverages", label: "Snacks & Beverages" },
    { value: "frozen-foods", label: "Frozen Foods" },
    { value: "organic-products", label: "Organic Products" },
  ],
  "fashion-apparel": [
    { value: "mens-wear", label: "Men's Wear" },
    { value: "womens-wear", label: "Women's Wear" },
    { value: "kids-wear", label: "Kids Wear" },
    { value: "footwear", label: "Footwear" },
    { value: "accessories", label: "Accessories" },
    { value: "ethnic-wear", label: "Ethnic Wear" },
  ],
  electronics: [
    { value: "mobiles", label: "Mobiles" },
    { value: "laptops", label: "Laptops" },
    { value: "electronics-accessories", label: "Accessories" },
    { value: "home-appliances", label: "Home Appliances" },
    { value: "smart-devices", label: "Smart Devices" },
    { value: "wearables", label: "Wearables" },
  ],
  "books-stationery": [
    { value: "educational-books", label: "Educational Books" },
    { value: "novels", label: "Novels" },
    { value: "competitive-exam-books", label: "Competitive Exam Books" },
    { value: "office-supplies", label: "Office Supplies" },
    { value: "school-supplies", label: "School Supplies" },
  ],
  "home-living": [
    { value: "furniture", label: "Furniture" },
    { value: "home-decor", label: "Home Decor" },
    { value: "kitchenware", label: "Kitchenware" },
    { value: "lighting", label: "Lighting" },
    { value: "storage-organization", label: "Storage & Organization" },
  ],
  "beauty-personal-care": [
    { value: "skincare", label: "Skincare" },
    { value: "haircare", label: "Haircare" },
    { value: "grooming", label: "Grooming" },
    { value: "cosmetics", label: "Cosmetics" },
    { value: "wellness-products", label: "Wellness Products" },
  ],
  "toys-sports-baby-care": [
    { value: "toys-games", label: "Toys & Games" },
    { value: "baby-products", label: "Baby Products" },
    { value: "fitness-equipment", label: "Fitness Equipment" },
    { value: "outdoor-sports", label: "Outdoor Sports" },
  ],
};

export const PRODUCT_CATEGORY_META = {
  "grocery-daily-essentials": {
    namePlaceholder: "Fresh Grocery Product",
    descriptionPlaceholder: "Freshness, source, shelf life, weight details...",
    pricingLabel: "Price (per unit)",
  },
  "fashion-apparel": {
    namePlaceholder: "Premium Apparel Item",
    descriptionPlaceholder: "Fabric, fit, occasion, style details...",
    pricingLabel: "Price (per item)",
  },
  electronics: {
    namePlaceholder: "Wireless Headphones",
    descriptionPlaceholder: "Specs, warranty, compatibility...",
    pricingLabel: "Price (per unit)",
  },
  "books-stationery": {
    namePlaceholder: "Educational Book / Office Item",
    descriptionPlaceholder: "Author/specification, edition, utility...",
    pricingLabel: "Price (per item)",
  },
  "home-living": {
    namePlaceholder: "Modern Home Item",
    descriptionPlaceholder: "Material, dimensions, care instructions...",
    pricingLabel: "Price (per unit)",
  },
  "beauty-personal-care": {
    namePlaceholder: "Personal Care Product",
    descriptionPlaceholder: "Ingredients, skin/hair type, usage details...",
    pricingLabel: "Price (per unit)",
  },
  "toys-sports-baby-care": {
    namePlaceholder: "Sports / Baby Care Item",
    descriptionPlaceholder: "Age suitability, material, safety details...",
    pricingLabel: "Price (per item)",
  },
};

export const PRODUCT_CATEGORY_LABEL_MAP = PRODUCT_CATEGORY_OPTIONS.reduce(
  (acc, item) => ({ ...acc, [item.value]: item.label }),
  {},
);

export const PRODUCT_SUBCATEGORY_LABEL_MAP = Object.values(PRODUCT_SUBCATEGORY_OPTIONS)
  .flat()
  .reduce((acc, item) => ({ ...acc, [item.value]: item.label }), {});

export const VENDOR_ORDER_STATUSES = [
  "Accepted by Vendor",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];
