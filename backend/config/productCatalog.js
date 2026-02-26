const PRODUCT_CATEGORIES = [
  {
    value: "grocery-daily-essentials",
    label: "Grocery & Daily Essentials",
    variantFields: ["brand", "type", "packSize", "grade"],
    subcategories: [
      { value: "fruits-vegetables", label: "Fruits & Vegetables" },
      { value: "dairy-bakery", label: "Dairy & Bakery" },
      { value: "staples", label: "Staples (Rice, Atta, Pulses)" },
      { value: "snacks-beverages", label: "Snacks & Beverages" },
      { value: "frozen-foods", label: "Frozen Foods" },
      { value: "organic-products", label: "Organic Products" },
    ],
  },
  {
    value: "fashion-apparel",
    label: "Fashion & Apparel",
    variantFields: ["size", "color", "material"],
    subcategories: [
      { value: "mens-wear", label: "Men's Wear" },
      { value: "womens-wear", label: "Women's Wear" },
      { value: "kids-wear", label: "Kids Wear" },
      { value: "footwear", label: "Footwear" },
      { value: "accessories", label: "Accessories" },
      { value: "ethnic-wear", label: "Ethnic Wear" },
    ],
  },
  {
    value: "electronics",
    label: "Electronics",
    variantFields: ["brand", "model", "ram", "storage", "color"],
    subcategories: [
      { value: "mobiles", label: "Mobiles" },
      { value: "laptops", label: "Laptops" },
      { value: "electronics-accessories", label: "Accessories" },
      { value: "home-appliances", label: "Home Appliances" },
      { value: "smart-devices", label: "Smart Devices" },
      { value: "wearables", label: "Wearables" },
    ],
  },
  {
    value: "books-stationery",
    label: "Books & Stationery",
    variantFields: ["author", "publisher", "language", "edition"],
    subcategories: [
      { value: "educational-books", label: "Educational Books" },
      { value: "novels", label: "Novels" },
      { value: "competitive-exam-books", label: "Competitive Exam Books" },
      { value: "office-supplies", label: "Office Supplies" },
      { value: "school-supplies", label: "School Supplies" },
    ],
  },
  {
    value: "home-living",
    label: "Home & Living",
    variantFields: ["brand", "material", "color"],
    subcategories: [
      { value: "furniture", label: "Furniture" },
      { value: "home-decor", label: "Home Decor" },
      { value: "kitchenware", label: "Kitchenware" },
      { value: "lighting", label: "Lighting" },
      { value: "storage-organization", label: "Storage & Organization" },
    ],
  },
  {
    value: "beauty-personal-care",
    label: "Beauty & Personal Care",
    variantFields: ["brand", "type", "material"],
    subcategories: [
      { value: "skincare", label: "Skincare" },
      { value: "haircare", label: "Haircare" },
      { value: "grooming", label: "Grooming" },
      { value: "cosmetics", label: "Cosmetics" },
      { value: "wellness-products", label: "Wellness Products" },
    ],
  },
  {
    value: "toys-sports-baby-care",
    label: "Toys, Sports & Baby Care",
    variantFields: ["brand", "material", "color"],
    subcategories: [
      { value: "toys-games", label: "Toys & Games" },
      { value: "baby-products", label: "Baby Products" },
      { value: "fitness-equipment", label: "Fitness Equipment" },
      { value: "outdoor-sports", label: "Outdoor Sports" },
    ],
  },
];

const PRODUCT_CATEGORY_VALUES = PRODUCT_CATEGORIES.map((category) => category.value);

const PRODUCT_SUBCATEGORY_VALUES = PRODUCT_CATEGORIES.flatMap((category) =>
  category.subcategories.map((subcategory) => subcategory.value),
);

const CATEGORY_SUBCATEGORY_MAP = PRODUCT_CATEGORIES.reduce((acc, category) => {
  acc[category.value] = new Set(category.subcategories.map((subcategory) => subcategory.value));
  return acc;
}, {});

const isValidSubcategoryForCategory = (category, subcategory) =>
  Boolean(
    category &&
      subcategory &&
      CATEGORY_SUBCATEGORY_MAP[category] &&
      CATEGORY_SUBCATEGORY_MAP[category].has(subcategory),
  );

module.exports = {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_VALUES,
  PRODUCT_SUBCATEGORY_VALUES,
  isValidSubcategoryForCategory,
};
