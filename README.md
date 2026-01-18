# Bus Ticket Backend API

A comprehensive Node.js REST API for a bus ticket booking system with MongoDB, featuring authentication, user management, bus operations, station queue management, ticket purchasing, and QR code verification.

## Features

- 🔐 **Authentication**: JWT-based authentication with bcrypt password hashing
- 👥 **User Management**: Full CRUD operations with role-based access control
- 🚌 **Bus Management**: Complete bus operations with seat tracking and filtering
- 🏢 **Station Queue**: Queue management system for buses at stations
- 🎫 **Ticket Booking**: Ticket purchasing with seat validation and cancellation
- 📱 **QR Codes**: QR code generation and verification for tickets

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **QR Codes**: qrcode library
- **Validation**: express-validator

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Setup

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd /Users/kavuthao2007/Desktop/bus-ticket-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the following:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/bus-ticket-db
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   QR_CODE_EXPIRY_HOURS=24
   ```

4. **Start MongoDB** (if using local instance):
   ```bash
   mongod
   ```

5. **Run the server**:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### User Management
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
- `DELETE /api/users/profile` - Delete user account (Protected)
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `PUT /api/users/:id` - Update user by ID (Admin)
- `DELETE /api/users/:id` - Delete user by ID (Admin)

### Bus Management
- `GET /api/buses` - Get all buses (Public)
- `GET /api/buses/:id` - Get bus by ID (Public)
- `GET /api/buses/:id/seats` - Get available seats (Public)
- `POST /api/buses` - Create bus (Admin)
- `PUT /api/buses/:id` - Update bus (Admin)
- `DELETE /api/buses/:id` - Delete bus (Admin)

### Station Queue Management
- `GET /api/stations/:stationName/queue` - Get station queue (Public)
- `GET /api/stations/queue/bus/:busId` - Get queue by bus (Public)
- `POST /api/stations/queue` - Create queue entry (Admin)
- `PUT /api/stations/queue/:id` - Update queue position (Admin)
- `DELETE /api/stations/queue/:id` - Delete queue entry (Admin)

### Ticket Management
- `POST /api/tickets` - Purchase ticket (Protected)
- `GET /api/tickets/my-tickets` - Get user tickets (Protected)
- `GET /api/tickets/:id` - Get ticket by ID (Protected)
- `PUT /api/tickets/:id` - Update ticket (Protected)
- `DELETE /api/tickets/:id` - Cancel ticket (Protected)
- `GET /api/tickets` - Get all tickets (Admin)

### QR Code Management
- `POST /api/qr/generate/:ticketId` - Generate QR code (Protected)
- `POST /api/qr/verify` - Verify QR code (Protected)
- `GET /api/qr/ticket/:ticketId` - Get QR by ticket (Protected)
- `PUT /api/qr/:id/invalidate` - Invalidate QR code (Admin)
- `GET /api/qr` - Get all QR codes (Admin)

## Quick Start Examples

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create a Bus (Admin)
```bash
curl -X POST http://localhost:5000/api/buses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "busNumber": "BUS001",
    "capacity": 40,
    "type": "AC",
    "route": {
      "from": "New York",
      "to": "Boston"
    },
    "pricePerSeat": 50
  }'
```

### 4. Purchase a Ticket
```bash
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "busId": "BUS_ID_HERE",
    "seatNumber": "A1",
    "departureStation": "New York",
    "arrivalStation": "Boston",
    "departureTime": "2025-12-01T10:00:00Z",
    "price": 50
  }'
```

### 5. Generate QR Code
```bash
curl -X POST http://localhost:5000/api/qr/generate/TICKET_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
bus-ticket-backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Bus.js               # Bus model
│   │   ├── Station.js           # Station queue model
│   │   ├── Ticket.js            # Ticket model
│   │   └── QRCode.js            # QR code model
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── userController.js    # User management
│   │   ├── busController.js     # Bus operations
│   │   ├── stationController.js # Station queue
│   │   ├── ticketController.js  # Ticket booking
│   │   └── qrController.js      # QR code management
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── busRoutes.js
│   │   ├── stationRoutes.js
│   │   ├── ticketRoutes.js
│   │   └── qrRoutes.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── errorHandler.js     # Error handling
│   ├── utils/
│   │   ├── generateToken.js     # JWT token generation
│   │   └── qrGenerator.js       # QR code utilities
│   └── server.js                # Main server file
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "stack": "Stack trace (development only)"
}
```

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Role-Based Access

- **User**: Can manage their own profile, purchase tickets, generate QR codes
- **Admin**: Full access to all endpoints including user management, bus management, and system administration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For issues and questions, please open an issue in the repository.
# Easy_bus-backend
# Easy_bus_backend
