# Medicine Store Backend

This is the backend for the medicine e-commerce platform built with Node.js, Express, and TypeScript. It provides APIs for user authentication, product management, order processing, and other key functionalities.

## Features

- **User Authentication**: JWT-based authentication with role management (Super admin, admin, user).
- **Product Management**: Create, update, delete, and fetch products, categories, and variants.
- **Order Management**: CRUD operations for orders, including order status updates.
- **Shipping Address Management**: Handle user shipping addresses during the checkout process.
- **Role-Based Access Control**: Different access levels for admins and regular users.
- **TypeScript**: Strongly typed code for improved reliability and scalability.
- **MongoDB with Mongoose**: Database for storing users, products, orders, and related information.
- **Email Notifications**: Automated email notifications using NodeMailer for account verification and order updates.

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT (JSON Web Token)
- **Environment Management**: dotenv
- **Validation**: express-validator
- **Email Handling**: NodeMailer


## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (running locally or using a service like MongoDB Atlas)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/mahbub-dev/medicine-ecommerce-backend
    ```

2. Navigate to the project directory:

    ```bash
    cd your-backend-repo
    ```

3. Install the dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

4. Run the project:

    ```bash
    npx nodemon
    
    ```
### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```bash
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
ORIGIN=your_frontend_origin_url
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=your_email_from_address
