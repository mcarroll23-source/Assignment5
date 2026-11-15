// Import the packages needed for the restaurant API
const express = require('express');
const { body, validationResult } = require('express-validator');

// Create the Express application
const app = express();

// Set the port number
const PORT = 3000;

// Allow the server to receive JSON data
app.use(express.json());

// Data for the server
const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and cheese on a sesame seed bun",
    price: 12.99,
    category: "entree",
    ingredients: ["beef", "lettuce", "tomato", "cheese", "bun"],
    available: true
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast over romaine lettuce with parmesan and croutons",
    price: 11.50,
    category: "entree",
    ingredients: ["chicken", "romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"],
    available: true
  },
  {
    id: 3,
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella served with marinara sauce",
    price: 8.99,
    category: "appetizer",
    ingredients: ["mozzarella cheese", "breadcrumbs", "marinara sauce"],
    available: true
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 7.99,
    category: "dessert",
    ingredients: ["chocolate", "flour", "eggs", "butter", "vanilla ice cream"],
    available: true
  },
  {
    id: 5,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons and mint",
    price: 3.99,
    category: "beverage",
    ingredients: ["lemons", "sugar", "water", "mint"],
    available: true
  },
  {
    id: 6,
    name: "Fish and Chips",
    description: "Beer-battered cod with seasoned fries and coleslaw",
    price: 14.99,
    category: "entree",
    ingredients: ["cod", "beer batter", "potatoes", "coleslaw", "tartar sauce"],
    available: false
  }
];

// Log information about incoming requests
const requestLogger = (req, res, next) => {
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.url);
  console.log("Timestamp:", new Date().toISOString());

  // Log the request body for POST and PUT requests
  if (req.method === "POST" || req.method === "PUT") {
    console.log("Request Body:", req.body);
  }

  next();
};

// Use the request logger for incoming requests
app.use(requestLogger);

// Validate menu item information
const menuValidation = [
  body('name').isString().isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),

  body('description').isString().isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),

  body('price').isFloat({ gt: 0 })
    .withMessage('Price must be a number greater than 0'),

  body('category').isIn(['appetizer', 'entree', 'dessert', 'beverage'])
    .withMessage('Invalid menu category'),

  body('ingredients').isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),

  body('available').optional().isBoolean()
    .withMessage('Available must be true or false')
];

// Check for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  next();
};

// Get all menu items
app.get('/api/menu', (req, res) => {
  res.status(200).json(menuItems);
});

// Add a new menu item
app.post('/api/menu', menuValidation, handleValidationErrors, (req, res) => {
  const newMenuItem = {
    id: menuItems.length > 0
      ? Math.max(...menuItems.map(item => item.id)) + 1
      : 1,
    name: req.body.name,
    description: req.body.description,
    price: Number(req.body.price),
    category: req.body.category,
    ingredients: req.body.ingredients,
    available: req.body.available === undefined ? true : req.body.available
  };

  menuItems.push(newMenuItem);

  res.status(201).json(newMenuItem);
});

// Update an existing menu item
app.put('/api/menu/:id', menuValidation, handleValidationErrors, (req, res) => {
  const id = Number(req.params.id);

  const menuItem = menuItems.find(item => item.id === id);

  if (!menuItem) {
    return res.status(404).json({
      error: "Menu item not found"
    });
  }

  menuItem.name = req.body.name;
  menuItem.description = req.body.description;
  menuItem.price = Number(req.body.price);
  menuItem.category = req.body.category;
  menuItem.ingredients = req.body.ingredients;
  menuItem.available = req.body.available === undefined ? true : req.body.available;

  res.status(200).json(menuItem);
});

// Get a menu item by ID
app.get('/api/menu/:id', (req, res) => {
  const id = Number(req.params.id);

  const menuItem = menuItems.find(item => item.id === id);

  if (!menuItem) {
    return res.status(404).json({
      error: "Menu item not found"
    });
  }

  res.status(200).json(menuItem);
});

// Delete a menu item
app.delete('/api/menu/:id', (req, res) => {
  const id = Number(req.params.id);

  const menuIndex = menuItems.findIndex(item => item.id === id);

  if (menuIndex === -1) {
    return res.status(404).json({
      error: "Menu item not found"
    });
  }

  const deletedItem = menuItems.splice(menuIndex, 1);

  res.status(200).json({
    message: "Menu item deleted successfully",
    deletedItem: deletedItem[0]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Restaurant API is running on port ${PORT}`);
});

