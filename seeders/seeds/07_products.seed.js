// seeders/seeds/07_products.seed.js
const Product     = require('../../models/product.model');
const Category    = require('../../models/category.model');
const Brand       = require('../../models/brand.model');
const Subcategory = require('../../models/subcategory.model');

const name = '07 Products';

// Resolved at runtime — populated in up()
let catMap  = {};  // categoryName  → _id
let brandMap = {}; // brandName     → _id
let subMap  = {};  // subName       → _id

const productTemplates = [
    // ─── Electronics ──────────────────────────────────────────────────────────
    {
        name:             'Samsung Galaxy S24 Ultra',
        category:         'Electronics',
        subcategory:      'Mobile Phones',
        brand:            'Samsung',
        price:            149999,
        salePrice:        139999,
        stock:            50,
        shortDescription: 'Latest Samsung flagship with 200MP camera and S-Pen',
        description:      'The Samsung Galaxy S24 Ultra is the ultimate Android flagship featuring a built-in S Pen, 200MP main camera, 5000mAh battery, Snapdragon 8 Gen 3 processor, and a stunning 6.8-inch AMOLED display.',
        isFeatured:       true,
        isNewArrival:     true,
        tags:             ['smartphone', 'samsung', 'flagship', '5g'],
        attributes:       [
            { key: 'RAM', value: '12GB' },
            { key: 'Storage', value: '256GB' },
            { key: 'Display', value: '6.8" AMOLED' },
            { key: 'Battery', value: '5000mAh' },
        ],
    },
    {
        name:             'Apple iPhone 15 Pro',
        category:         'Electronics',
        subcategory:      'Mobile Phones',
        brand:            'Apple',
        price:            169999,
        salePrice:        159999,
        stock:            30,
        shortDescription: 'Apple iPhone 15 Pro with titanium design and A17 Pro chip',
        description:      'Experience the future with the iPhone 15 Pro. Featuring a titanium body, A17 Pro chip, 48MP main camera, USB-C connectivity, and the all-new Action Button for customizable shortcuts.',
        isFeatured:       true,
        isNewArrival:     true,
        tags:             ['iphone', 'apple', 'smartphone', '5g'],
        attributes:       [
            { key: 'RAM', value: '8GB' },
            { key: 'Storage', value: '128GB' },
            { key: 'Display', value: '6.1" Super Retina XDR' },
            { key: 'Chip', value: 'A17 Pro' },
        ],
    },
    {
        name:             'Dell XPS 15 Laptop',
        category:         'Electronics',
        subcategory:      'Laptops & Computers',
        brand:            'Dell',
        price:            189999,
        stock:            15,
        shortDescription: 'Premium Dell XPS 15 with OLED display and Intel Core i9',
        description:      'The Dell XPS 15 is a powerhouse laptop with a stunning 15.6-inch OLED display, Intel Core i9 processor, NVIDIA RTX 4070 GPU, 32GB RAM, and 1TB SSD storage — perfect for creators and professionals.',
        isFeatured:       true,
        isBestSeller:     false,
        tags:             ['laptop', 'dell', 'xps', 'premium'],
        attributes:       [
            { key: 'Processor', value: 'Intel Core i9' },
            { key: 'RAM', value: '32GB DDR5' },
            { key: 'Storage', value: '1TB NVMe SSD' },
            { key: 'GPU', value: 'NVIDIA RTX 4070' },
        ],
    },
    {
        name:             'Sony WH-1000XM5 Headphones',
        category:         'Electronics',
        subcategory:      'Audio & Headphones',
        brand:            'Sony',
        price:            39999,
        salePrice:        34999,
        stock:            80,
        shortDescription: 'Industry-leading noise cancelling wireless headphones',
        description:      'Sony WH-1000XM5 headphones deliver best-in-class noise cancellation with 30-hour battery life, multipoint connection, and crystal-clear call quality with 4 beamforming microphones.',
        isFeatured:       false,
        isBestSeller:     true,
        tags:             ['headphones', 'sony', 'noise-cancelling', 'wireless'],
    },
    {
        name:             'Xiaomi 13T Pro',
        category:         'Electronics',
        subcategory:      'Mobile Phones',
        brand:            'Xiaomi',
        price:            74999,
        salePrice:        69999,
        stock:            60,
        shortDescription: 'Xiaomi flagship with Leica camera system',
        description:      'The Xiaomi 13T Pro features a Leica-tuned 50MP camera system, Dimensity 9200+ chipset, 144Hz AMOLED display, and 120W HyperCharge — all at a competitive price point.',
        isNewArrival:     true,
        tags:             ['xiaomi', 'smartphone', '5g', 'leica'],
    },
    // ─── Fashion ─────────────────────────────────────────────────────────────
    {
        name:             'Nike Air Max 270',
        category:         'Fashion & Clothing',
        subcategory:      'Footwear',
        brand:            'Nike',
        price:            12999,
        salePrice:        10999,
        stock:            100,
        shortDescription: 'Iconic Nike Air Max 270 with large Air unit',
        description:      'The Nike Air Max 270 features the largest Air unit yet in a lifestyle shoe with 270 degrees of visibility. Engineered mesh upper provides lightweight breathability for all-day comfort.',
        isFeatured:       true,
        isBestSeller:     true,
        tags:             ['nike', 'shoes', 'sneakers', 'running'],
        hasVariants:      true,
        variants: [{
            name: 'Size',
            options: [
                { value: 'UK 7', stock: 20, price: 12999 },
                { value: 'UK 8', stock: 25, price: 12999 },
                { value: 'UK 9', stock: 30, price: 12999 },
                { value: 'UK 10', stock: 25, price: 12999 },
            ],
        }],
    },
    {
        name:             'Adidas Ultraboost 22',
        category:         'Fashion & Clothing',
        subcategory:      'Footwear',
        brand:            'Adidas',
        price:            14999,
        stock:            75,
        shortDescription: 'Premium Adidas running shoe with Boost cushioning',
        description:      'Adidas Ultraboost 22 features responsive Boost midsole cushioning, a Primeknit+ upper for adaptive support, and a Continental rubber outsole for excellent grip in all conditions.',
        isBestSeller:     true,
        tags:             ['adidas', 'shoes', 'running', 'ultraboost'],
    },
    // ─── Home & Living ────────────────────────────────────────────────────────
    {
        name:             'Walton Refrigerator 350L',
        category:         'Home & Living',
        subcategory:      'Kitchen Appliances',
        brand:            'Walton',
        price:            55000,
        salePrice:        49999,
        stock:            20,
        shortDescription: 'Walton frost-free refrigerator with inverter compressor',
        description:      'The Walton 350-litre frost-free refrigerator features an energy-efficient inverter compressor, multi-airflow system, LED lighting, and smart temperature control. Designed for Bangladeshi households.',
        isFeatured:       false,
        isNewArrival:     true,
        tags:             ['walton', 'refrigerator', 'appliance', 'kitchen'],
        attributes:       [
            { key: 'Capacity', value: '350 Litres' },
            { key: 'Energy Rating', value: 'A++' },
            { key: 'Compressor', value: 'Inverter' },
        ],
    },
    // ─── Sports ───────────────────────────────────────────────────────────────
    {
        name:             'Puma Training Shorts',
        category:         'Sports & Outdoors',
        subcategory:      'Gym & Fitness',
        brand:            'Puma',
        price:            1999,
        salePrice:        1499,
        stock:            200,
        shortDescription: 'Lightweight Puma shorts for gym and training',
        description:      'Puma Training Shorts are crafted from moisture-wicking fabric that keeps you dry during intense workouts. Elastic waistband with drawcord for a secure fit. Available in multiple sizes.',
        isBestSeller:     true,
        tags:             ['puma', 'shorts', 'training', 'gym'],
        hasVariants:      true,
        variants: [{
            name: 'Size',
            options: [
                { value: 'S',  stock: 50, price: 1999 },
                { value: 'M',  stock: 70, price: 1999 },
                { value: 'L',  stock: 50, price: 1999 },
                { value: 'XL', stock: 30, price: 1999 },
            ],
        }],
    },
    // ─── Health ───────────────────────────────────────────────────────────────
    {
        name:             'Whey Protein Gold Standard 2lb',
        category:         'Health & Beauty',
        subcategory:      'Health Supplements',
        brand:            'Sony', // reusing available brand for demo
        price:            5999,
        salePrice:        5499,
        stock:            150,
        shortDescription: 'Premium whey protein for muscle recovery and growth',
        description:      'Gold Standard 100% Whey delivers 24g of protein per serving to support muscle recovery. Made with whey protein isolates as the primary ingredient with minimal fat and sugar.',
        isNewArrival:     false,
        isBestSeller:     true,
        tags:             ['protein', 'supplements', 'fitness', 'gym'],
    },
];

async function up() {
    // Build lookup maps
    const categories    = await Category.find({});
    const brands        = await Brand.find({});
    const subcategories = await Subcategory.find({});

    catMap   = Object.fromEntries(categories.map(c    => [c.name, c._id]));
    brandMap = Object.fromEntries(brands.map(b        => [b.name, b._id]));
    subMap   = Object.fromEntries(subcategories.map(s => [s.name, s._id]));

    for (const tpl of productTemplates) {
        const exists = await Product.findOne({ name: tpl.name });
        if (exists) continue;

        const categoryId    = catMap[tpl.category];
        const brandId       = brandMap[tpl.brand];
        const subcategoryId = subMap[tpl.subcategory];

        if (!categoryId) {
            console.warn(`  ⚠ Category not found: ${tpl.category} — skipping ${tpl.name}`);
            continue;
        }

        const { category: _c, subcategory: _s, brand: _b, ...rest } = tpl;

        await Product.create({
            ...rest,
            category:    categoryId,
            subcategory: subcategoryId || undefined,
            brand:       brandId       || undefined,
            isActive:    true,
            stockStatus: rest.stock > 0 ? 'in_stock' : 'out_of_stock',
        });
    }
}

async function down() {
    await Product.deleteMany({ name: { $in: productTemplates.map(p => p.name) } });
}

module.exports = { name, up, down };
