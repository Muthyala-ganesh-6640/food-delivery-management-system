const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');
const DeliveryPartner = require('../models/DeliveryPartner');
const Offer = require('../models/Offer');

const categoriesData = [
  { name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80', description: 'Aromatic & flavorful rice dishes' },
  { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', description: 'Freshly baked cheesy pizzas' },
  { name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', description: 'Juicy loaded burgers' },
  { name: 'North Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80', description: 'Rich curries & tandoori naan' },
  { name: 'South Indian', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=400&q=80', description: 'Crispy dosas & fluffy idlis' },
  { name: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80', description: 'Noodles, dimsums & manchurian' },
  { name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80', description: 'Sweet treats & ice creams' },
  { name: 'Beverages', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80', description: 'Refreshing shakes & drinks' },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodexpress');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collection data
    await User.deleteMany();
    await Restaurant.deleteMany();
    await Food.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();
    await Review.deleteMany();
    await DeliveryPartner.deleteMany();
    await Offer.deleteMany();

    console.log('Cleared existing data.');

    // 1. Create Admin User
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@foodexpress.com',
      password: 'password123',
      phone: '9876543210',
      role: 'ADMIN',
    });

    // 2. Create 5 Restaurant Owners
    const owners = [];
    for (let i = 1; i <= 5; i++) {
      const owner = await User.create({
        name: `Restaurant Owner ${i}`,
        email: `owner${i}@foodexpress.com`,
        password: 'password123',
        phone: `980000000${i}`,
        role: 'RESTAURANT',
      });
      owners.push(owner);
    }

    // 3. Create 10 Customer Accounts
    const customers = [];
    for (let i = 1; i <= 10; i++) {
      const customer = await User.create({
        name: `Customer User ${i}`,
        email: `customer${i}@foodexpress.com`,
        password: 'password123',
        phone: `990000000${i}`,
        role: 'CUSTOMER',
      });
      customers.push(customer);
    }

    // 4. Create 5 Delivery Partners
    const deliveryUsers = [];
    for (let i = 1; i <= 5; i++) {
      const delUser = await User.create({
        name: `Delivery Rider ${i}`,
        email: `delivery${i}@foodexpress.com`,
        password: 'password123',
        phone: `970000000${i}`,
        role: 'DELIVERY',
      });
      deliveryUsers.push(delUser);

      await DeliveryPartner.create({
        user: delUser._id,
        vehicleType: i % 2 === 0 ? 'Scooter' : 'Bike',
        vehicleNumber: `DL-0${i}-FE-${1000 + i}`,
        licenseNumber: `LIC-EXPRESS-${9000 + i}`,
        status: 'ONLINE',
        isApproved: true,
        rating: (4.5 + (i % 5) * 0.1).toFixed(1),
        totalDeliveries: i * 15,
      });
    }

    // 5. Create Categories
    await Category.insertMany(categoriesData);

    // 6. Create 5 Restaurants
    const restaurantsData = [
      {
        owner: owners[0]._id,
        name: 'Royal Biryani House',
        description: 'Authentic Hyderabadi & Lucknowi Dum Biryani cooked with pure ghee and secret spices.',
        logo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80',
        banner: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        cuisine: ['Biryani', 'North Indian', 'Mughlai'],
        address: { street: 'Connaught Place', area: 'Central Delhi', city: 'New Delhi', pincode: '110001' },
        rating: 4.8,
        deliveryTime: '20-30 min',
        deliveryFee: 35,
        minimumOrder: 200,
      },
      {
        owner: owners[1]._id,
        name: 'Pizza Italiana & Cafe',
        description: 'Wood-fired artisanal pizzas, garlic breadsticks & handmade pasta.',
        logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80',
        banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        cuisine: ['Pizza', 'Italian', 'Fast Food'],
        address: { street: 'Cyber Hub', area: 'DLF Phase 2', city: 'Gurugram', pincode: '122002' },
        rating: 4.6,
        deliveryTime: '25-35 min',
        deliveryFee: 40,
        minimumOrder: 250,
      },
      {
        owner: owners[2]._id,
        name: 'Burger Bistro & Grill',
        description: 'Gourmet smashed burgers, crispy french fries, and thick milkshake combos.',
        logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
        banner: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80',
        cuisine: ['Burger', 'Fast Food', 'Beverages'],
        address: { street: 'Hauz Khas Village', area: 'South Delhi', city: 'New Delhi', pincode: '110016' },
        rating: 4.7,
        deliveryTime: '15-25 min',
        deliveryFee: 30,
        minimumOrder: 150,
      },
      {
        owner: owners[3]._id,
        name: 'Dosa Junction',
        description: 'Traditional South Indian crispy dosas, steamed idlis & filter coffee.',
        logo: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=300&q=80',
        banner: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80',
        cuisine: ['South Indian', 'Breakfast'],
        address: { street: 'Indiranagar 100ft Road', area: 'Indiranagar', city: 'Bengaluru', pincode: '560038' },
        rating: 4.5,
        deliveryTime: '20-30 min',
        deliveryFee: 25,
        minimumOrder: 100,
      },
      {
        owner: owners[4]._id,
        name: 'Dragon Wok Asian Kitchen',
        description: 'Sizzling Hakka noodles, dim sums, Manchurian curries & fried rice.',
        logo: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80',
        banner: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
        cuisine: ['Chinese', 'Fast Food'],
        address: { street: 'Bandra West', area: 'Bandra', city: 'Mumbai', pincode: '400050' },
        rating: 4.4,
        deliveryTime: '30-40 min',
        deliveryFee: 45,
        minimumOrder: 300,
      },
    ];

    const createdRestaurants = await Restaurant.insertMany(restaurantsData);

    // 7. Create 20 Food Items
    const foodsData = [
      // Royal Biryani House
      {
        restaurant: createdRestaurants[0]._id,
        name: 'Hyderabadi Chicken Dum Biryani',
        description: 'Tender chicken marinated in yogurt and spices layered with long-grain basmati rice.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
        category: 'Biryani',
        price: 340,
        discount: 15,
        isVeg: false,
        rating: 4.9,
      },
      {
        restaurant: createdRestaurants[0]._id,
        name: 'Paneer Butter Masala',
        description: 'Soft cottage cheese cubes cooked in a creamy tomato and cashew butter gravy.',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
        category: 'North Indian',
        price: 280,
        discount: 10,
        isVeg: true,
        rating: 4.7,
      },
      {
        restaurant: createdRestaurants[0]._id,
        name: 'Butter Naan (2 Pcs)',
        description: 'Soft fluffy clay-oven baked naan brushed with melted butter.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
        category: 'North Indian',
        price: 80,
        discount: 0,
        isVeg: true,
        rating: 4.6,
      },
      {
        restaurant: createdRestaurants[0]._id,
        name: 'Gulab Jamun (2 Pcs)',
        description: 'Classic fried milk dumplings soaked in cardamom sugar syrup.',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
        category: 'Desserts',
        price: 90,
        discount: 0,
        isVeg: true,
        rating: 4.8,
      },

      // Pizza Italiana & Cafe
      {
        restaurant: createdRestaurants[1]._id,
        name: 'Farmhouse Loaded Veggie Pizza',
        description: 'Capsicum, fresh tomatoes, crunchy onion, black olives & extra mozzarella cheese.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        category: 'Pizza',
        price: 450,
        discount: 20,
        isVeg: true,
        rating: 4.8,
      },
      {
        restaurant: createdRestaurants[1]._id,
        name: 'BBQ Chicken Feast Pizza',
        description: 'Smoky BBQ glazed chicken chunks, sweet corn, red paprika & herbs.',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
        category: 'Pizza',
        price: 520,
        discount: 15,
        isVeg: false,
        rating: 4.9,
      },
      {
        restaurant: createdRestaurants[1]._id,
        name: 'Cheesy Garlic Breadsticks',
        description: 'Freshly baked dough brushed with garlic butter and melted mozzarella.',
        image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=80',
        category: 'Snacks',
        price: 180,
        discount: 0,
        isVeg: true,
        rating: 4.6,
      },
      {
        restaurant: createdRestaurants[1]._id,
        name: 'Cold Coffee Shake',
        description: 'Thick blended espresso coffee with vanilla ice cream and chocolate drizzle.',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
        category: 'Beverages',
        price: 140,
        discount: 0,
        isVeg: true,
        rating: 4.7,
      },

      // Burger Bistro & Grill
      {
        restaurant: createdRestaurants[2]._id,
        name: 'Classic Double Cheeseburger',
        description: 'Double grilled chicken patty with cheddar cheese slice, lettuce & secret bistro sauce.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        category: 'Burger',
        price: 240,
        discount: 10,
        isVeg: false,
        rating: 4.8,
      },
      {
        restaurant: createdRestaurants[2]._id,
        name: 'Crispy Veggie Supreme Burger',
        description: 'Crispy potato patty filled with jalapenos, corn, melted cheese slice & mayo.',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
        category: 'Burger',
        price: 180,
        discount: 10,
        isVeg: true,
        rating: 4.6,
      },
      {
        restaurant: createdRestaurants[2]._id,
        name: 'Peri Peri Loaded Fries',
        description: 'Golden crispy potato fries tossed in spicy peri-peri seasoning and cheese dip.',
        image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80',
        category: 'Fast Food',
        price: 130,
        discount: 0,
        isVeg: true,
        rating: 4.7,
      },
      {
        restaurant: createdRestaurants[2]._id,
        name: 'Oreo Fudge Thickshake',
        description: 'Rich chocolate milkshake blended with crunchy Oreo cookies.',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
        category: 'Beverages',
        price: 160,
        discount: 0,
        isVeg: true,
        rating: 4.9,
      },

      // Dosa Junction
      {
        restaurant: createdRestaurants[3]._id,
        name: 'Masala Butter Dosa',
        description: 'Crispy rice crepe filled with spiced potato masala and served with coconut chutney & sambar.',
        image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
        category: 'South Indian',
        price: 150,
        discount: 0,
        isVeg: true,
        rating: 4.8,
      },
      {
        restaurant: createdRestaurants[3]._id,
        name: 'Steamed Idli Sambar (2 Pcs)',
        description: 'Soft & fluffy rice cakes served with hot lentil sambar and tomato chutney.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
        category: 'South Indian',
        price: 90,
        discount: 0,
        isVeg: true,
        rating: 4.7,
      },
      {
        restaurant: createdRestaurants[3]._id,
        name: 'Medu Vada (2 Pcs)',
        description: 'Crispy deep fried lentil fritters with chutney.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
        category: 'Breakfast',
        price: 100,
        discount: 0,
        isVeg: true,
        rating: 4.6,
      },
      {
        restaurant: createdRestaurants[3]._id,
        name: 'Authentic Filter Coffee',
        description: 'Strong hot South Indian decoction coffee brewed with fresh milk.',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
        category: 'Beverages',
        price: 60,
        discount: 0,
        isVeg: true,
        rating: 4.9,
      },

      // Dragon Wok Asian Kitchen
      {
        restaurant: createdRestaurants[4]._id,
        name: 'Chicken Hakka Noodles',
        description: 'Wok-tossed noodles with shredded chicken, bell peppers, spring onions & soy sauce.',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
        category: 'Chinese',
        price: 220,
        discount: 10,
        isVeg: false,
        rating: 4.6,
      },
      {
        restaurant: createdRestaurants[4]._id,
        name: 'Veg Manchurian Gravy',
        description: 'Deep fried vegetable dumplings in spicy garlic soy gravy.',
        image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=600&q=80',
        category: 'Chinese',
        price: 200,
        discount: 10,
        isVeg: true,
        rating: 4.5,
      },
      {
        restaurant: createdRestaurants[4]._id,
        name: 'Steamed Chicken Momos (6 Pcs)',
        description: 'Juicy chicken filled dumplings served with spicy Schezwan chutney.',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
        category: 'Snacks',
        price: 160,
        discount: 0,
        isVeg: false,
        rating: 4.8,
      },
      {
        restaurant: createdRestaurants[4]._id,
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate sponge cake filled with oozing hot chocolate sauce.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
        category: 'Desserts',
        price: 110,
        discount: 0,
        isVeg: true,
        rating: 4.9,
      },
    ];

    await Food.insertMany(foodsData);

    // 8. Create Sample Coupons
    const couponsData = [
      {
        code: 'WELCOME50',
        description: 'Get 50% OFF on your first food order',
        discountType: 'PERCENTAGE',
        discountAmount: 50,
        minOrderValue: 199,
        maxDiscount: 150,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'FOODEXPRESS100',
        description: 'Flat ₹100 OFF on orders above ₹399',
        discountType: 'FIXED',
        discountAmount: 100,
        minOrderValue: 399,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'SUPERDEAL',
        description: '30% OFF on gourmet meals',
        discountType: 'PERCENTAGE',
        discountAmount: 30,
        minOrderValue: 299,
        maxDiscount: 120,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ];
    await Coupon.insertMany(couponsData);

    // 9. Create Promotional Offers
    const offersData = [
      {
        title: '50% OFF on First Order',
        description: 'Use promo code WELCOME50 on checkout',
        banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
        code: 'WELCOME50',
        discount: '50% OFF',
      },
      {
        title: 'Biryani Special Weekend',
        description: 'Get complimentary Gulab Jamun with every biryani combo',
        banner: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
        code: 'BIRYANI20',
        discount: 'FREE DESSERT',
      },
      {
        title: 'Pizza Craze Party',
        description: 'Buy 1 Large Pizza & Get 1 Garlic Bread Free',
        banner: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
        code: 'PIZZAPARTY',
        discount: 'BUY 1 GET 1',
      },
    ];
    await Offer.insertMany(offersData);

    console.log('Database seeded successfully! 🎉');
    console.log('Sample Logins:');
    console.log('Admin: admin@foodexpress.com / password123');
    console.log('Restaurant Owner: owner1@foodexpress.com / password123');
    console.log('Customer: customer1@foodexpress.com / password123');
    console.log('Delivery Partner: delivery1@foodexpress.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
