const { Sequelize, DataTypes } = require('sequelize');

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

// Define Inventory model
const Inventory = sequelize.define('Inventory', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  },
  minStockLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

// Base inventory items
const baseInventory = [
  {
    name: "Rice",
    description: "Long grain white rice",
    price: 1.99,
    quantity: 100,
    unit: "kg",
    category: "Grains",
    minStockLevel: 20
  },
  {
    name: "Milk",
    description: "Fresh whole milk",
    price: 3.49,
    quantity: 50,
    unit: "liters",
    category: "Dairy",
    minStockLevel: 10
  },
  {
    name: "Bread",
    description: "Whole wheat bread",
    price: 2.49,
    quantity: 30,
    unit: "loaves",
    category: "Bakery",
    minStockLevel: 5
  },
  {
    name: "Eggs",
    description: "Fresh large eggs",
    price: 4.99,
    quantity: 60,
    unit: "dozen",
    category: "Dairy",
    minStockLevel: 8
  },
  {
    name: "Tomatoes",
    description: "Fresh roma tomatoes",
    price: 2.99,
    quantity: 40,
    unit: "kg",
    category: "Produce",
    minStockLevel: 10
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    // Sync database
    await sequelize.sync({ force: true }); // This will recreate the table

    // Insert base inventory
    await Inventory.bulkCreate(baseInventory);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 