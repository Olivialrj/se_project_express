# Project Name: WTWR (What to Wear?) : Back End

# Frontend Project Link: https://github.com/Olivialrj/se_project_react

# Domain Name: http://project15-wtwr.jumpingcrab.com

# Project Description:

- This project is a backend API for managing a clothing item collection. The API is built using Node.js, Express.js, and MongoDB, providing functionality to handle users, clothing items, and interactions like likes and dislikes. it is a foundational project for understanding backend development, handling RESTful requests, and implementing error handling and authentication.

# Functionality:

- User Management
- Clothing Item MAnagement
- Item Interactions
- Error Handling
- Middleware for User Authentication
- Modular Architecture

# Techonologies used:

1. Backend Framework: Express.js
2. Database: MongoDB and Mongoose
3. Development Tools: Node.js and npm
4. Error handling: Custom Error Management
5. Routing and Controllers: Router Abstraction and Controller Functions
6. Middleware: Custom Middleware and Express Middleware
7. Code Quality Tools: ESLint and Prettier
8. API Testing: Postman, Compass and Github Actions.

# Techniques used:

1. Modular Architecture

- Separates concerns into distinct components: Routes for API paths, controllers for business logic, and models for database schema defintions.
- Enhances scalability and maintainability

2. RESTful API Design

- Adheres to REST principles:
  - uses HTTP methods like GET, POST, PUT, DELETE.
    -Leverages meaningful endpoints like /item/:id/likes.

3. Validation

- Data validation is embedded within Mongoose Schemas: Enforces data types, required fields, and constraints.

4. Environment Variables

- Uses environment variables to configure the app

5. Error Logging

- Logs Error to the console for debugging

6. Versoning and Dependency Management

- Track depencies using package.json and package-lock.json
- Ensures consistency across environments.
