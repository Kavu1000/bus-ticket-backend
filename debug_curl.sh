#!/bin/bash
echo "Testing POST /api/auth/register..."
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123", "phone": "1234567890"}' \
  -v
