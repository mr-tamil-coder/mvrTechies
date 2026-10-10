const seedProducts = [
  {
    customId: 'asparagus',
    name: 'Exotic Green Asparagus',
    category: 'Exotic Vegetables',
    unit: 'kg',
    price: 320,
    emoji: '🥦',
    image: '/images/asparagus.jpeg',
    description: 'Tender, vibrant spears harvested at peak freshness for a delicate, nutty flavor. Perfectly graded for export and gourmet dining.',
    rating: 4.9,
    stock: 45
  },
  {
    customId: 'broccoli',
    name: 'Farm Fresh Broccoli',
    category: 'Exotic Vegetables',
    unit: 'kg',
    price: 150,
    emoji: '🥦',
    image: '/images/Broccoli.jpeg',
    description: 'Densely packed, deep green florets rich in antioxidants and vitamins. Flash-cooled to preserve crispness and vibrant color.',
    rating: 4.8,
    stock: 80
  },
  {
    customId: 'roman-lettuce',
    name: 'Crisp Roman Lettuce',
    category: 'Salad Greens',
    unit: 'kg',
    price: 180,
    emoji: '🥬',
    image: '/images/Roman lettuce.webp',
    description: 'Crisp, elongated heads with sweet, sturdy ribbed leaves — ideal for Caesar salads and premium culinary wraps.',
    rating: 4.7,
    stock: 60
  },
  {
    customId: 'red-lettuce',
    name: 'Burgundy Red Lettuce',
    category: 'Salad Greens',
    unit: 'kg',
    price: 195,
    emoji: '🥬',
    image: '/images/Red lettuce.jpeg',
    description: 'Deep burgundy leaves with a mild, buttery taste. Adds an artisanal pop of color and crisp texture to salads.',
    rating: 4.6,
    stock: 40
  },
  {
    customId: 'basil',
    name: 'Aromatic Italian Basil',
    category: 'Fresh Herbs',
    unit: 'kg',
    price: 240,
    emoji: '🌿',
    image: '/images/Basil.jpeg',
    description: 'Intensely fragrant, lush leaves freshly picked. An absolute staple for authentic pesto, pasta sauces, and Mediterranean cuisine.',
    rating: 4.9,
    stock: 35
  },
  {
    customId: 'brussels-sprouts',
    name: 'Mini Brussels Sprouts',
    category: 'Exotic Vegetables',
    unit: 'kg',
    price: 280,
    emoji: '🌱',
    image: '/images/Brussels sprouts.jpeg',
    description: 'Tight, uniform mini cabbage heads with a sweet, nutty profile when roasted or sautéed with garlic butter.',
    rating: 4.7,
    stock: 50
  },
  {
    customId: 'capsicum-tricolor',
    name: 'Bell Peppers (Tricolor Pack)',
    category: 'Exotic Vegetables',
    unit: 'kg',
    price: 160,
    emoji: '🫑',
    image: '/images/capsium.jpg',
    description: 'Vibrant mix of crunchy red, sun yellow, and crisp green bell peppers. High in vitamin C with natural sweetness.',
    rating: 4.8,
    stock: 90
  },
  {
    customId: 'coriander',
    name: 'Country Fresh Coriander',
    category: 'Fresh Herbs',
    unit: 'bunch',
    price: 25,
    emoji: '🌿',
    image: '/images/coriander.webp',
    description: 'Lush, aromatic bunches with a zesty citrusy punch. Essential for everyday garnishing, chutneys, and fine sauces.',
    rating: 4.9,
    stock: 200
  },
  {
    customId: 'ginger',
    name: 'Premium Washed Ginger',
    category: 'Roots & Aromatics',
    unit: 'kg',
    price: 110,
    emoji: '🫚',
    image: '/images/ginger.jpg',
    description: 'Plump, golden rhizomes packed with warm spice and aromatic essential oils. Low fiber and easy to grate or juice.',
    rating: 4.8,
    stock: 120
  },
  {
    customId: 'lemon',
    name: 'Sun-Kissed Juicy Lemons',
    category: 'Fresh Produce',
    unit: 'piece',
    price: 6,
    emoji: '🍋',
    image: '/images/lemon.jpg',
    description: 'Thin-skinned, extraordinarily juicy yellow lemons with bright acidity. Perfect for dressings, beverages, and seasonings.',
    rating: 4.9,
    stock: 500
  },
  {
    customId: 'onion-large',
    name: 'Graded Red Onion (Large)',
    category: 'Staples',
    unit: 'kg',
    price: 48,
    emoji: '🧅',
    image: '/images/onion.jpg',
    description: 'Well-cured, jumbo bulbs with balanced pungency and sweet undertones. Carefully sorted for prolonged shelf life.',
    rating: 4.7,
    stock: 350
  },
  {
    customId: 'french-beans',
    name: 'Tender French Beans',
    category: 'Fresh Vegetables',
    unit: 'kg',
    price: 75,
    emoji: '🫛',
    image: '/images/beans.webp',
    description: 'Slender, stringless, snap-fresh green beans picked young for guaranteed sweetness and crisp tenderness.',
    rating: 4.8,
    stock: 110
  },
  {
    customId: 'chilly-green',
    name: 'Spicy Green Chillies',
    category: 'Roots & Aromatics',
    unit: 'kg',
    price: 85,
    emoji: '🌶️',
    image: '/images/gchilli.jpg',
    description: 'Uniform, glossy chillies delivering consistent fiery heat and piquant flavor. Ideal for authentic spice pastes and curries.',
    rating: 4.8,
    stock: 75
  },
  {
    customId: 'cucumber',
    name: 'Crisp Seedless Cucumber',
    category: 'Salad Greens',
    unit: 'piece',
    price: 20,
    emoji: '🥒',
    image: '/images/cucumber.jpg',
    description: 'Ultra-hydrating, smooth dark skin cucumbers with crunchy seedless flesh. Hand-selected for salads and cold pressed juices.',
    rating: 4.7,
    stock: 150
  },
  {
    customId: 'lotus-stem',
    name: 'Clean Lotus Stem (Kamal Kakdi)',
    category: 'Exotic Vegetables',
    unit: 'kg',
    price: 210,
    emoji: '🪷',
    image: '/images/lotus stem.jpg',
    description: 'Crunchy, ivory lotus roots with delicate floral sweetness. Thoroughly cleaned and prepped for stir-fries, chips, or curries.',
    rating: 4.6,
    stock: 30
  },
  {
    customId: 'mushroom',
    name: 'White Button Mushrooms',
    category: 'Exotic Vegetables',
    unit: 'kg',
    price: 190,
    emoji: '🍄',
    image: '/images/mushroom.webp',
    description: 'Plump, firm snow-white button mushrooms grown in controlled sterile environments. Earthy, savory umami depth.',
    rating: 4.8,
    stock: 65
  },
  {
    customId: 'onion-small',
    name: 'Shallots / Small Pearl Onions',
    category: 'Staples',
    unit: 'kg',
    price: 95,
    emoji: '🧅',
    image: '/images/onion small.jpg',
    description: 'Petite pearl shallots bursting with rich caramelized sweetness. Ideal for traditional sambhar, pickling, and gourmet braises.',
    rating: 4.8,
    stock: 130
  },
  {
    customId: 'brinjal',
    name: 'Glossy Purple Brinjal',
    category: 'Fresh Vegetables',
    unit: 'kg',
    price: 55,
    emoji: '🍆',
    image: '/images/brinjal.jpg',
    description: 'Glossy, tender deep-purple eggplants with silky melt-in-your-mouth flesh and virtually no seeds.',
    rating: 4.6,
    stock: 140
  },
  {
    customId: 'cauliflower',
    name: 'Snow White Cauliflower',
    category: 'Fresh Vegetables',
    unit: 'piece',
    price: 45,
    emoji: '🥦',
    image: '/images/cauliflower.jpg',
    description: 'Dense, ivory-white heads tightly packed with crisp florets. Farm trimmed with fresh protective wrapper leaves.',
    rating: 4.7,
    stock: 110
  },
  {
    customId: 'curry-leaves',
    name: 'Fragrant Curry Leaves',
    category: 'Fresh Herbs',
    unit: 'bunch',
    price: 15,
    emoji: '🌿',
    image: '/images/curry leaves.webp',
    description: 'Deep green, intense aromatics harvested fresh each morning. Cracks with tantalizing scent when tempered in hot oil.',
    rating: 4.9,
    stock: 180
  },
  {
    customId: 'karela',
    name: 'Fresh Green Karela (Bitter Gourd)',
    category: 'Fresh Vegetables',
    unit: 'kg',
    price: 65,
    emoji: '🥒',
    image: '/images/karela.jpg',
    description: 'Crisp, dark green bitter gourds with prominent sharp ridges. Well recognized for medicinal properties and blood sugar health.',
    rating: 4.5,
    stock: 70
  },
  {
    customId: 'methi',
    name: 'Seasonal Methi (Fenugreek)',
    category: 'Fresh Herbs',
    unit: 'kg',
    price: 70,
    emoji: '🌿',
    image: '/images/Methi Seasonal.jpg',
    description: 'Delicate, small fenugreek leaves with a distinct pleasant herbal bitterness. Rich in iron, dietary fiber, and minerals.',
    rating: 4.7,
    stock: 90
  },
  {
    customId: 'potato',
    name: 'Table Top Clean Potatoes',
    category: 'Staples',
    unit: 'kg',
    price: 38,
    emoji: '🥔',
    image: '/images/potato.jpg',
    description: 'Clean-washed golden potatoes with thin peel and creamy starchy flesh. Super versatile for roasting, mashing, or chips.',
    rating: 4.8,
    stock: 400
  },
  {
    customId: 'cabbage',
    name: 'Crisp Round Cabbage',
    category: 'Fresh Vegetables',
    unit: 'piece',
    price: 35,
    emoji: '🥬',
    image: '/images/Cabbage.jpg',
    description: 'Heavy, firm heads with sweet tightly coiled light green leaves. Delivers unbeatable crunch to slaws and stir-fries.',
    rating: 4.7,
    stock: 130
  },
  {
    customId: 'carrot-pink',
    name: 'Sweet Pink Delhi Carrots',
    category: 'Roots & Aromatics',
    unit: 'kg',
    price: 60,
    emoji: '🥕',
    image: '/images/Carrot Pink.webp',
    description: 'Succulent, naturally sweet seasonal pink carrots with tender core. Ideal for halwa, fresh salads, and juicing.',
    rating: 4.9,
    stock: 220
  },
  {
    customId: 'drumstick',
    name: 'Tender Moringa Drumsticks',
    category: 'Fresh Vegetables',
    unit: 'kg',
    price: 80,
    emoji: '🥢',
    image: '/images/drumstick.webp',
    description: 'Long, slender moringa pods packed with gelatinous pulp and seeds. Legendary superfood prized in traditional cooking.',
    rating: 4.8,
    stock: 85
  },
  {
    customId: 'lady-finger',
    name: 'Tender Okra / Lady Finger',
    category: 'Fresh Vegetables',
    unit: 'kg',
    price: 65,
    emoji: '🫛',
    image: '/images/lady fingur.webp',
    description: 'Young, snap-tender okra pods with uniform green ridges and minimal seeds. Non-fibrous and quick cooking.',
    rating: 4.7,
    stock: 120
  },
  {
    customId: 'mint',
    name: 'Refreshing Field Mint (Pudina)',
    category: 'Fresh Herbs',
    unit: 'bunch',
    price: 20,
    emoji: '🌿',
    image: '/images/mint.webp',
    description: 'Cooling, aromatic mint leaves bursting with pure menthol freshness. Indispensable for mocktails, raita, and dips.',
    rating: 4.9,
    stock: 190
  },
  {
    customId: 'potato-sf',
    name: 'Low-GI Sugar-Free Potatoes',
    category: 'Staples',
    unit: 'kg',
    price: 52,
    emoji: '🥔',
    image: '/images/potato sugar free.jpg',
    description: 'Specially cultivated low glycemic index potato variety, catering to diabetes-conscious families without compromising on taste.',
    rating: 4.8,
    stock: 160
  }
];

const seedUsers = [
  {
    name: 'Administrator',
    phone: '+91 98401 00000',
    email: 'admin@abchtraders.com',
    password: 'adminPass123',
    businessName: 'ABCH Traders HQ',
    location: 'Chennai Central, TN',
    role: 'admin'
  },
  {
    name: 'Rajesh Kumar',
    phone: '+91 98401 23456',
    email: 'rajesh.kumar@greenharvest.in',
    password: 'password123',
    businessName: 'Green Harvest Mart',
    location: 'Chennai, TN',
    role: 'customer'
  },
  {
    name: 'Priya Sundaram',
    phone: '+91 98765 43210',
    email: 'priya@thefreshbistro.com',
    password: 'password123',
    businessName: 'The Fresh Bistro',
    location: 'Bangalore, KA',
    role: 'customer'
  }
];

const seedInquiries = [
  {
    name: 'Suresh Raina',
    phone: '+91 98840 99881',
    email: 'suresh@rainafoods.com',
    businessName: 'Raina Bulk Foods Ltd',
    businessType: 'Wholesaler / Distributor',
    message: 'We require a weekly supply of 500kg Broccoli, 200kg Asparagus, and bell peppers for our export packing unit.',
    status: 'New'
  },
  {
    name: 'Dr. Meenakshi Iyer',
    phone: '+91 97910 44552',
    email: 'meenakshi@ayurwellness.org',
    businessName: 'Ayur Wellness Resorts',
    businessType: 'Hospitality & Wellness',
    message: 'Interested in daily farm-to-table organic delivery of seasonal herbs (curry leaves, mint, basil, methi) and sugar-free potatoes.',
    status: 'In Review'
  }
];

const seedInvoices = [
  {
    invoiceNumber: 'INV-2026-0038',
    date: '2026-10-04',
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 98401 23456',
    customerEmail: 'rajesh.kumar@greenharvest.in',
    customerAddress: 'Shop #12, Koyambedu Wholesale Market, Chennai - 600092',
    items: [
      { productName: 'Exotic Green Asparagus', quantity: 20, price: 320, total: 6400 },
      { productName: 'Farm Fresh Broccoli', quantity: 40, price: 150, total: 6000 },
      { productName: 'Bell Peppers (Tricolor Pack)', quantity: 25, price: 160, total: 4000 }
    ],
    subtotal: 16400,
    taxRate: 5,
    taxAmount: 820,
    shipping: 350,
    grandTotal: 17570,
    status: 'Paid'
  },
  {
    invoiceNumber: 'INV-2026-0039',
    date: '2026-10-03',
    customerName: 'Priya Sundaram',
    customerPhone: '+91 98765 43210',
    customerEmail: 'priya@thefreshbistro.com',
    customerAddress: '42 Indiranagar 100ft Road, Bangalore - 560038',
    items: [
      { productName: 'Crisp Roman Lettuce', quantity: 15, price: 180, total: 2700 },
      { productName: 'Burgundy Red Lettuce', quantity: 10, price: 195, total: 1950 },
      { productName: 'Aromatic Italian Basil', quantity: 8, price: 240, total: 1920 }
    ],
    subtotal: 6570,
    taxRate: 5,
    taxAmount: 328.5,
    shipping: 250,
    grandTotal: 7148.5,
    status: 'Paid'
  }
];

module.exports = {
  seedProducts,
  seedUsers,
  seedInquiries,
  seedInvoices
};
