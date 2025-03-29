
## Prerequisites

*   Node.js (v16 or higher recommended)
*   npm or yarn
*   MongoDB instance (local or cloud-based like MongoDB Atlas)

## Getting Started

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd ofs-backend-v2
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Variables

1.  Create a `.env` file in the root directory.
2.  Copy the contents of `.env.example` into `.env`.
3.  Fill in the required environment variables:

    ```env
    PORT=8000
    MONGODB_URL=mongodb://localhost:27017/ofs-database # Your MongoDB connection string
    JWT_SECRET=YOUR_STRONG_JWT_SECRET_KEY             # Strong secret for access tokens
    JWT_EXPIRATION=1d                                 # Access token expiry (e.g., 15m, 1h, 1d)
    REFRESH_TOKEN_SECRET=YOUR_STRONG_REFRESH_TOKEN_SECRET # Strong secret for refresh tokens
    REFRESH_TOKEN_EXPIRATION=7d                       # Refresh token expiry (e.g., 7d, 30d)

    # Nodemailer Configuration (e.g., using Gmail)
    NODEMAILER_SERVICE=gmail
    NODEMAILER_EMAIL_SENDER=your_email@gmail.com
    NODEMAILER_PASSWORD=your_gmail_app_password # Use App Password if 2FA is enabled
    NODEMAILER_ADMIN_EMAIL=admin_email@example.com # Email for admin notifications

    # AUTH_TOKEN_DELETE= # REMOVE THIS LINE - DO NOT USE
    ```

### Running the Application

1.  **Development Mode (with hot-reloading):**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The server will start, typically on `http://localhost:8000`.

2.  **Production Mode:**
    *   First, build the TypeScript code:
        ```bash
        npm run build
        # or
        yarn build
        ```
    *   Then, run the compiled JavaScript:
        ```bash
        npm start
        # or
        yarn start
        ```

## API Endpoints

The API is structured by feature. The base URL is typically `http://localhost:8000`.

*   `/` - Home route
*   `/brand` - Brand management endpoints (Admin only for CUD)
*   `/category` - Category & Subcategory management (Admin only for CUD)
*   `/product` - Product management, search, filtering, details
*   `/user` - User authentication (register, login, refresh), profile management, password reset
*   `/wishlist` - User wishlist operations
*   `/cart` - Shopping cart operations
*   `/order` - Order creation and history
*   `/inventory` - Inventory management (Admin only for CUD)
*   `/collection` - Product collection management (Admin only for CUD)
*   `/voucher` - Voucher management (Admin only for CUD), applying vouchers
*   `/elitepoints` - Elite points balance, history, application
*   `/wallet` - Wallet balance, history, application

*(Suggestion: Add a link here to more detailed API documentation, perhaps generated using tools like Swagger/OpenAPI if you implement that later).*

## Authentication

This API uses JSON Web Tokens (JWT) for authentication.

1.  **Login:** Send credentials to `/user/login-user` to receive an `accessToken` and `refreshToken`.
2.  **Authenticated Requests:** Include the `accessToken` in the `Authorization` header for protected routes:
    ```
    Authorization: Bearer <accessToken>
    ```
3.  **Token Refresh:** If the `accessToken` expires, use the `refreshToken` with the `/user/refresh-token` endpoint to get a new pair of tokens.

## Error Handling

The API uses a standardized JSON format for responses and errors:

*   **Success:**
    ```json
    {
        "status": "success",
        "statusCode": 2xx,
        "message": "Descriptive message",
        "data": { ... } // Response data
    }
    ```
*   **Error:**
    ```json
    {
        "status": "error",
        "statusCode": 4xx / 5xx,
        "message": "Error description",
        "data": null // Or sometimes error details/validation errors
    }
    ```

## Contributing

Contributions are welcome! Please follow standard fork/pull request workflows. Ensure code adheres to linting/formatting rules and includes tests where applicable.

## License

ISC (or choose another license if preferred)
