const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Inventory = require('./models/Inventory');
const Order = require('./models/Order');
require('dotenv').config();

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Inventory.deleteMany({});
        await Order.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminUser = await User.create({
            name: 'Admin User',
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Created admin user');

        // Create regular user
        const userPassword = await bcrypt.hash('user123', 10);
        const regularUser = await User.create({
            name: 'Regular User',
            username: 'user',
            email: 'user@example.com',
            password: userPassword,
            role: 'user'
        });
        console.log('Created regular user');

        // Create inventory items
        const inventoryItems = await Inventory.insertMany([
            {
                name: 'Apples',
                description: 'Fresh red apples',
                price: 2.99,
                quantity: 100,
                category: 'Fruits',
                unit: 'kg',
                threshold: 20,
                createdBy: adminUser._id,
                lastModifiedBy: adminUser._id
            },
            {
                name: 'Milk',
                description: 'Fresh whole milk',
                price: 3.99,
                quantity: 50,
                category: 'Dairy',
                unit: 'L',
                threshold: 10,
                createdBy: adminUser._id,
                lastModifiedBy: adminUser._id
            },
            {
                name: 'Bread',
                description: 'Fresh baked bread',
                price: 2.49,
                quantity: 75,
                category: 'Bakery',
                unit: 'pieces',
                threshold: 15,
                createdBy: adminUser._id,
                lastModifiedBy: adminUser._id
            },
            {
                name: 'Eggs',
                description: 'Farm fresh eggs',
                price: 4.99,
                quantity: 60,
                category: 'Dairy',
                unit: 'dozen',
                threshold: 12,
                createdBy: adminUser._id,
                lastModifiedBy: adminUser._id
            },
            {
                name: 'Rice',
                description: 'Long grain rice',
                price: 5.99,
                quantity: 80,
                category: 'Grains',
                unit: 'kg',
                threshold: 15,
                createdBy: adminUser._id,
                lastModifiedBy: adminUser._id
            }
        ]);
        console.log('Created inventory items');

        // Create sample orders
        const orders = await Order.insertMany([
            {
                user: regularUser._id,
                items: [
                    {
                        product: inventoryItems[0]._id,
                        quantity: 2,
                        price: Number(inventoryItems[0].price)
                    },
                    {
                        product: inventoryItems[1]._id,
                        quantity: 1,
                        price: Number(inventoryItems[1].price)
                    }
                ],
                totalAmount: Number((inventoryItems[0].price * 2) + inventoryItems[1].price),
                status: 'pending',
                paymentMethod: 'credit_card',
                paymentStatus: 'pending',
                shippingAddress: {
                    street: '123 Main St',
                    city: 'Sample City',
                    state: 'Sample State',
                    zipCode: '12345',
                    country: 'USA'
                }
            },
            {
                user: regularUser._id,
                items: [
                    {
                        product: inventoryItems[2]._id,
                        quantity: 3,
                        price: Number(inventoryItems[2].price)
                    }
                ],
                totalAmount: Number(inventoryItems[2].price * 3),
                status: 'delivered',
                paymentMethod: 'cash_on_delivery',
                paymentStatus: 'completed',
                shippingAddress: {
                    street: '456 Oak St',
                    city: 'Sample City',
                    state: 'Sample State',
                    zipCode: '12345',
                    country: 'USA'
                }
            }
        ]);
        console.log('Created sample orders');

        console.log('Data seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData(); 