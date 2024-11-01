
# Zelova - Eco-Friendly Food Delivery Application

Zelova is a food delivery application designed to support both users and vendors in a sustainable way. With unique features such as eco-delivery options, sharable wallets, and community-driven supply sharing, Zelova strives to deliver food while prioritizing the environment and community connections.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
  - [User Flow](#user-flow)
  - [Vendor Flow](#vendor-flow)
  - [Admin Dashboard](#admin-dashboard)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Zelova is an eco-friendly food delivery app where users can order food, manage digital wallets, and become vendors. The app also promotes community sharing and eco-conscious choices through features like sharable coins, electric and cycle-based deliveries, and a platform for sharing supplies with nearby users. Zelova aims to make food delivery more sustainable and community-oriented.

## Key Features

- **User Registration & Vendor Onboarding:** Users can register, become vendors, and list their items on the platform.
- **Eco-Friendly Delivery:** Option for eco-delivery through electric vehicles or cycles, minimizing the carbon footprint of each order.
- **Shareable Wallets:** Users earn coins on every order, which can be shared with others via user ID or QR code.
- **Supply Sharing:** Users can share leftover supplies with nearby people, fostering a sense of community and reducing waste.
- **Admin Dashboard:** A robust dashboard for admins to manage users, vendors, and orders.
- **Vendor Dashboard:** Vendors can view and manage orders, update menu items, and track order statuses.

## Technologies Used

- **Frontend:** React, Tailwind CSS, Framer Motion (for animations)
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT, Firebase Authentication (for user authentication)
- **State Management:** Redux Toolkit
- **API Documentation:** Swagger

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/zelova.git
   cd zelova
   ```

2. **Install dependencies** for both client and server:
   ```bash
   # In the project root, install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**:
   - Create `.env` files in both the `server` and `client` directories.
   - Configure variables for JWT secrets, Firebase config, MongoDB URI, and any other required API keys.

4. **Run the application**:
   - **Server**: Start the backend server in `server` directory.
     ```bash
     npm run dev
     ```
   - **Client**: Start the frontend development server in `client` directory.
     ```bash
     npm run dev
     ```

5. **Access the app**:
   - Open `http://localhost:5173` to view the frontend.
   - Access `http://localhost:5000/api` for backend routes (API documentation available through Swagger).

## Project Structure

```
zelova/
├── client/                     # Frontend application
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # App pages
│   │   ├── redux/               # Redux Toolkit slices
│   │   └── utils/               # Utility functions
└── server/                     # Backend application
    ├── controllers/             # Route handlers
    ├── models/                  # Database models
    ├── routes/                  # API routes
    ├── middleware/              # Middleware
    └── utils/                   # Utility functions
```

## Usage

### User Flow

1. **Sign up and Browse**: Users sign up and browse available vendors and items.
2. **Order Food with Eco-Delivery**: Select eco-friendly delivery if available.
3. **Wallet and Coin Sharing**: Use coins from previous orders or share with others.
4. **Supply Sharing**: Share extra supplies with people nearby.

### Vendor Flow

1. **Onboarding**: Register as a vendor and list items for sale.
2. **Order Management**: View and manage incoming orders through the vendor dashboard.
3. **Inventory Updates**: Regularly update item availability and prices.

### Admin Dashboard

- **User & Vendor Management**: Manage user and vendor accounts, approve or reject vendor applications.
- **Order Monitoring**: View and track orders, manage platform transactions.
- **Analytics**: View analytics for orders, user engagement, and eco-delivery usage.

## Contributing

We welcome contributions! Please fork the repository and create a new branch for each feature or bug fix. Before submitting a pull request, make sure to:

1. Write clear, concise commit messages.
2. Update relevant documentation.

## License

Distributed under the MIT License. See `LICENSE` for more information.
