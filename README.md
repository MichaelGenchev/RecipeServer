# 🍳 AI Recipe Generator API

## 🌟 Overview

Welcome to the AI Recipe Generator API! This cutting-edge server leverages the power of artificial intelligence to create unique, personalized recipes based on user preferences, dietary restrictions, and available ingredients. Built with Node.js, Express, and TypeScript, this API offers a robust, scalable, and type-safe backend for your recipe generation needs.

## 🚀 Features

- 🤖 AI-powered recipe generation
- 👤 User authentication and authorization
- 📁 CRUD operations for recipes
- 🔍 Advanced recipe search functionality
- 📊 Nutritional information calculation
- 🔒 Secure data handling and storage
- 📱 RESTful API design for easy integration

## 🛠 Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **TypeScript** - Typed superset of JavaScript
- **PostgreSQL** - Relational database
- **Zod** - Schema validation
- **JWT** - Authentication
- **Winston** - Logging
- **Jest** - Testing framework

## 📋 Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (v12 or later)

## 🔧 Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ai-recipe-generator-api.git
   ```

2. Navigate to the project directory:
   ```
   cd ai-recipe-generator-api
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables

5. Set up the database:
   - Create a PostgreSQL database

6. Build the project:
   ```
   npm run build
   ```

## 🚀 Running the Server

- For development:
  ```
  npm run dev
  ```

- For production:
  ```
  npm start
  ```

The server will start running on `http://localhost:3000` (or the port specified in your .env file).

## 📚 API Documentation

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and receive JWT

### Recipes

- `POST /api/recipes/generate` - Generate a new recipe
- `GET /api/recipes` - Get all recipes for the authenticated user
- `GET /api/recipes/:id` - Get a specific recipe
- `POST /api/recipes` - Save a new recipe
- `PUT /api/recipes/:id` - Update an existing recipe
- `DELETE /api/recipes/:id` - Delete a recipe
- `GET /api/recipes/search` - Search recipes


## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 📞 Contact

For any queries or support, please contact us at [your-email@example.com](mailto:michaelgenchev24l@gmail.com).

---

Happy Cooking with AI! 🍽️🤖