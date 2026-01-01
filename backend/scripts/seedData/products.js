// 100 Products for Eyes Optical Management System
// Note: category IDs will be set dynamically in seed script

const brands = [
  'Hadadi', 'Ray-Ban', 'Oakley', 'Gucci', 'Prada', 'Versace', 'Tom Ford',
  'Warby Parker', 'Persol', 'Maui Jim', 'Costa Del Mar', 'Bolle', 'Smith',
  'Armani', 'Dior', 'Chanel', 'Burberry', 'Fendi', 'Dolce & Gabbana',
  'Hugo Boss', 'Ralph Lauren', 'Calvin Klein', 'Michael Kors', 'Kate Spade',
  'Tory Burch', 'Coach', 'Marc Jacobs', 'Saint Laurent', 'Balenciaga'
];

const frameTypes = ['full-rim', 'semi-rimless', 'rimless', 'sports', 'kids'];
const genders = ['men', 'women', 'unisex', 'kids'];
const materials = ['Acetate', 'Titanium', 'Stainless Steel', 'TR-90', 'Polycarbonate', 'Aluminum', 'Monel', 'Beryllium'];
const colors = [
  'Black', 'Brown', 'Tortoise', 'Silver', 'Gold', 'Gunmetal', 'Blue', 'Red',
  'Green', 'Purple', 'Pink', 'White', 'Grey', 'Amber', 'Crystal', 'Havana',
  'Matte Black', 'Shiny Black', 'Rose Gold', 'Copper', 'Navy', 'Burgundy'
];

const productNames = [
  'Classic Black Frames', 'Tortoise Shell Frames', 'Sleek Metal Frames', 'Rimless Designer Frames',
  'Sport Performance Frames', 'Kids Colorful Frames', 'Aviator Sunglasses', 'Cat-Eye Sunglasses',
  'Wayfarer Frames', 'Browline Frames', 'Round Frames', 'Square Frames', 'Oval Frames',
  'Rectangle Frames', 'Clubmaster Frames', 'Pilot Frames', 'Vintage Frames', 'Modern Frames',
  'Minimalist Frames', 'Bold Statement Frames', 'Oversized Frames', 'Petite Frames',
  'Gradient Lens Frames', 'Mirror Lens Frames', 'Polarized Sunglasses', 'Photochromic Frames',
  'Blue Light Blocking Frames', 'High Index Lenses', 'Progressive Lens Frames', 'Bifocal Frames',
  'Reading Glasses', 'Computer Glasses', 'Driving Glasses', 'Gaming Glasses', 'Swimming Goggles',
  'Ski Goggles', 'Cycling Glasses', 'Running Glasses', 'Golf Glasses', 'Fishing Glasses',
  'Tactical Glasses', 'Fashion Sunglasses', 'Luxury Sunglasses', 'Budget Frames', 'Designer Frames',
  'Vintage Sunglasses', 'Sports Sunglasses', 'Wrap-Around Sunglasses', 'Oversized Sunglasses',
  'Small Frame Sunglasses', 'Unisex Sunglasses', 'Men\'s Classic', 'Women\'s Elegant',
  'Teen Trendy', 'Senior Comfort', 'Professional Frames', 'Casual Frames', 'Formal Frames',
  'Party Frames', 'Beach Sunglasses', 'Urban Frames', 'Rural Frames', 'Tech Frames',
  'Artisan Frames', 'Handcrafted Frames', 'Eco-Friendly Frames', 'Recycled Material Frames',
  'Lightweight Frames', 'Durable Frames', 'Flexible Frames', 'Rigid Frames', 'Adjustable Frames',
  'Custom Fit Frames', 'Standard Frames', 'Premium Frames', 'Economy Frames', 'Deluxe Frames',
  'Signature Collection', 'Limited Edition', 'Seasonal Collection', 'Holiday Special',
  'Anniversary Edition', 'Celebration Frames', 'Commemorative Frames', 'Special Edition',
  'Collector\'s Item', 'Rare Find', 'Exclusive Design', 'One of a Kind', 'Unique Style',
  'Trending Now', 'Best Seller', 'Customer Favorite', 'Staff Pick', 'Top Rated',
  'New Arrival', 'Just In', 'Fresh Stock', 'Latest Design', 'Modern Classic'
];

const descriptions = [
  'Timeless design perfect for any occasion',
  'Modern style with classic appeal',
  'Lightweight and comfortable for all-day wear',
  'Durable construction built to last',
  'Fashion-forward design that stands out',
  'Professional appearance suitable for work',
  'Casual style for everyday wear',
  'Premium materials and craftsmanship',
  'Comfortable fit with adjustable features',
  'Stylish design that complements any face shape',
  'High-quality lenses with excellent clarity',
  'Protective features for eye health',
  'Trendy design for fashion-conscious individuals',
  'Classic style that never goes out of fashion',
  'Innovative technology for enhanced vision',
  'Eco-friendly materials and sustainable design',
  'Customizable options for personalized fit',
  'Affordable quality without compromising style',
  'Luxury design with attention to detail',
  'Versatile frame suitable for multiple occasions'
];

// Mapping of product names with colors to local image files
const productImageMap = {
  "Bold Statement Frames - Navy": "/Bold Statement Frames - Navy.jpg",
  "Collector's Item - Havana": "/Collector's Item - Havana.jpg",
  "Fishing Glasses - Purple": "/Fishing Glasses - Purple.jpg",
  "Ski Goggles - Grey": "/Ski Goggles - Grey.jpg",
  "Best Seller - Amber": "/Best Seller - Amber.jpg",
  "Rare Find - Blue": "/Rare Find - Blue.jpg",
  "Celebration Frames - Rose Gold": "/Celebration Frames - Rose Gold.jpg",
  "Latest Design - White": "/Latest Design - White.jpg",
  "Modern Classic - White": "/Modern Classic - White.jpg",
  "Eco-Friendly Frames - Green": "/Eco-Friendly Frames - Green.jpg",
  "Women's Elegant - Shiny Black": "/Women's Elegant - Shiny Black.jpg"
};

export const generateProducts = (categoryIds) => {
  const products = [];
  const usedSKUs = new Set();
  
  for (let i = 0; i < 100; i++) {
    const name = productNames[Math.floor(Math.random() * productNames.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const frameType = frameTypes[Math.floor(Math.random() * frameTypes.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
    
    // Generate unique SKU
    let sku = `${brand.substring(0, 3).toUpperCase()}-${frameType.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(4, '0')}`;
    let counter = 1;
    while (usedSKUs.has(sku)) {
      sku = `${brand.substring(0, 3).toUpperCase()}-${frameType.substring(0, 3).toUpperCase()}-${String(i + 1000 + counter).padStart(4, '0')}`;
      counter++;
    }
    usedSKUs.add(sku);
    
    const basePrice = Math.floor(Math.random() * 400) + 50; // $50-$450
    const comparePrice = basePrice + Math.floor(Math.random() * 100) + 20; // 20-120 more
    const stock = Math.floor(Math.random() * 100);
    const isFeatured = Math.random() > 0.7; // 30% featured
    
    const productName = `${name} - ${color}`;
    
    // Check if this product has a local image, otherwise use placeholder
    const localImage = productImageMap[productName];
    const images = localImage 
      ? [localImage]
      : [
          'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500',
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'
        ];
    
    products.push({
      name: productName,
      description: `${descriptions[Math.floor(Math.random() * descriptions.length)]}. Available in ${color} with ${material} construction.`,
      sku,
      price: basePrice,
      comparePrice: comparePrice,
      category: categoryId,
      brand,
      frameType,
      gender,
      material,
      color,
      images,
      stock,
      lowStockThreshold: 10,
      isFeatured,
      isActive: Math.random() > 0.05, // 95% active
      specifications: {
        lensWidth: Math.floor(Math.random() * 20) + 50, // 50-70mm
        bridgeWidth: Math.floor(Math.random() * 10) + 16, // 16-26mm
        templeLength: Math.floor(Math.random() * 20) + 130 // 130-150mm
      }
    });
  }
  
  return products;
};

