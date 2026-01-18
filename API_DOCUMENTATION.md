# API Documentation

Complete API reference for the Bus Ticket Booking System.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

### Login

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### Get Current User

**GET** `/auth/me`

Get authenticated user's information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "user"
  }
}
```

---

## User Management Endpoints

### Get User Profile

**GET** `/users/profile`

Get current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-11-27T10:00:00.000Z",
    "updatedAt": "2025-11-27T10:00:00.000Z"
  }
}
```

### Update User Profile

**PUT** `/users/profile`

Update current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "username": "johndoe_updated",
  "email": "john.new@example.com",
  "phone": "9876543210",
  "password": "newpassword123"
}
```

### Delete User Account

**DELETE** `/users/profile`

Deactivate current user's account (soft delete).

**Headers:** `Authorization: Bearer <token>`

### Get All Users (Admin)

**GET** `/users?page=1&limit=10`

Get paginated list of all users.

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

---

## Bus Management Endpoints

### Get All Buses

**GET** `/buses?page=1&limit=10&type=AC&from=New York&to=Boston&status=active`

Get paginated list of buses with optional filters.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): Bus type (AC, Non-AC, Sleeper, Semi-Sleeper, Luxury)
- `from` (optional): Departure location
- `to` (optional): Destination
- `status` (optional): Bus status (active, inactive, maintenance)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "busNumber": "BUS001",
      "capacity": 40,
      "type": "AC",
      "route": {
        "from": "New York",
        "to": "Boston"
      },
      "pricePerSeat": 50,
      "status": "active",
      "bookedSeats": ["A1", "A2"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Get Bus by ID

**GET** `/buses/:id`

Get detailed information about a specific bus.

### Get Available Seats

**GET** `/buses/:id/seats`

Get seat availability for a specific bus.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "busId": "507f1f77bcf86cd799439011",
    "busNumber": "BUS001",
    "totalSeats": 40,
    "availableSeats": 38,
    "bookedSeats": 2,
    "seats": [
      { "seatNumber": "A1", "isBooked": true },
      { "seatNumber": "A2", "isBooked": false }
    ]
  }
}
```

### Create Bus (Admin)

**POST** `/buses`

Create a new bus.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "busNumber": "BUS001",
  "capacity": 40,
  "type": "AC",
  "amenities": ["WiFi", "AC", "Charging Port"],
  "route": {
    "from": "New York",
    "to": "Boston",
    "stops": [
      { "name": "Hartford", "arrivalTime": "12:00" }
    ]
  },
  "pricePerSeat": 50,
  "seatLayout": {
    "rows": 10,
    "seatsPerRow": 4
  }
}
```

### Update Bus (Admin)

**PUT** `/buses/:id`

Update bus information.

**Headers:** `Authorization: Bearer <admin_token>`

### Delete Bus (Admin)

**DELETE** `/buses/:id`

Delete a bus.

**Headers:** `Authorization: Bearer <admin_token>`

---

## Station Queue Management Endpoints

### Get Station Queue

**GET** `/stations/:stationName/queue?status=waiting`

Get queue of buses at a specific station.

**Query Parameters:**
- `status` (optional): Filter by status (waiting, boarding, departed, cancelled)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "stationName": "Grand Central",
      "busId": {
        "busNumber": "BUS001",
        "type": "AC"
      },
      "queuePosition": 1,
      "estimatedArrival": "2025-12-01T10:00:00.000Z",
      "status": "waiting"
    }
  ],
  "count": 5
}
```

### Get Queue by Bus

**GET** `/stations/queue/bus/:busId`

Get all queue entries for a specific bus.

### Create Queue Entry (Admin)

**POST** `/stations/queue`

Add a bus to a station queue.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "stationName": "Grand Central",
  "location": {
    "address": "123 Main St",
    "city": "New York",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  "busId": "507f1f77bcf86cd799439011",
  "queuePosition": 1,
  "estimatedArrival": "2025-12-01T10:00:00.000Z",
  "estimatedDeparture": "2025-12-01T10:30:00.000Z"
}
```

### Update Queue Position (Admin)

**PUT** `/stations/queue/:id`

Update queue entry information.

**Headers:** `Authorization: Bearer <admin_token>`

### Delete Queue Entry (Admin)

**DELETE** `/stations/queue/:id`

Remove a bus from the queue.

**Headers:** `Authorization: Bearer <admin_token>`

---

## Ticket Management Endpoints

### Purchase Ticket

**POST** `/tickets`

Purchase a bus ticket.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "busId": "507f1f77bcf86cd799439011",
  "seatNumber": "A1",
  "departureStation": "New York",
  "arrivalStation": "Boston",
  "departureTime": "2025-12-01T10:00:00.000Z",
  "arrivalTime": "2025-12-01T14:00:00.000Z",
  "price": 50,
  "passengerDetails": {
    "name": "John Doe",
    "age": 30,
    "gender": "male"
  },
  "paymentMethod": "card"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": {
      "username": "johndoe",
      "email": "john@example.com"
    },
    "busId": {
      "busNumber": "BUS001",
      "type": "AC"
    },
    "seatNumber": "A1",
    "status": "booked",
    "price": 50
  },
  "message": "Ticket purchased successfully"
}
```

### Get User Tickets

**GET** `/tickets/my-tickets?page=1&limit=10&status=booked`

Get current user's tickets.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status (booked, cancelled, completed, expired)

### Get Ticket by ID

**GET** `/tickets/:id`

Get specific ticket details.

**Headers:** `Authorization: Bearer <token>`

### Update Ticket

**PUT** `/tickets/:id`

Update ticket information.

**Headers:** `Authorization: Bearer <token>`

### Cancel Ticket

**DELETE** `/tickets/:id`

Cancel a ticket and free up the seat.

**Headers:** `Authorization: Bearer <token>`

### Get All Tickets (Admin)

**GET** `/tickets?page=1&limit=10&status=booked&busId=507f1f77bcf86cd799439011`

Get all tickets in the system.

**Headers:** `Authorization: Bearer <admin_token>`

---

## QR Code Management Endpoints

### Generate QR Code

**POST** `/qr/generate/:ticketId`

Generate QR code for a ticket.

**Headers:** `Authorization: Bearer <token>`

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "ticketId": "507f1f77bcf86cd799439012",
    "qrData": "{\"ticketId\":\"...\",\"hash\":\"...\"}",
    "qrImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "isValid": true,
    "expiresAt": "2025-12-01T10:00:00.000Z",
    "status": "active"
  },
  "message": "QR code generated successfully"
}
```

### Verify QR Code

**POST** `/qr/verify`

Verify and validate a QR code.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "qrData": "{\"ticketId\":\"...\",\"hash\":\"...\"}"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "qrCode": {
      "_id": "507f1f77bcf86cd799439011",
      "isValid": true,
      "verificationCount": 1
    },
    "ticket": {
      "seatNumber": "A1",
      "departureStation": "New York",
      "arrivalStation": "Boston"
    }
  },
  "message": "QR code verified successfully"
}
```

### Get QR by Ticket

**GET** `/qr/ticket/:ticketId`

Get QR code for a specific ticket.

**Headers:** `Authorization: Bearer <token>`

### Invalidate QR Code (Admin)

**PUT** `/qr/:id/invalidate`

Mark a QR code as invalid.

**Headers:** `Authorization: Bearer <admin_token>`

### Get All QR Codes (Admin)

**GET** `/qr?page=1&limit=10&status=active&isValid=true`

Get all QR codes in the system.

**Headers:** `Authorization: Bearer <admin_token>`

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "stack": "Stack trace (development only)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently, there are no rate limits implemented. Consider adding rate limiting for production use.

## Pagination

Endpoints that return lists support pagination with the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Pagination response format:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```
