# Generate API Documentation

You are tasked with generating comprehensive API documentation for this project's API endpoints.

## Documentation Objectives

Create clear, complete, and developer-friendly API documentation that includes:
- Authentication requirements
- All available endpoints
- Request/response formats
- Error handling
- Code examples
- Rate limiting information

## Documentation Structure

### 1. API Overview

```markdown
# API Documentation

## Overview

[Project Name] API allows developers to [primary use cases].

**Base URL:** `https://api.example.com/v1`

**API Version:** v1

**Response Format:** JSON

**Authentication:** Bearer Token (JWT)

**Rate Limiting:** 100 requests per minute per API key

## Quick Start

```bash
# Example API call
curl -X GET https://api.example.com/v1/users \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```
```

### 2. Authentication

```markdown
## Authentication

All API requests require authentication using a Bearer token.

### Getting an API Key

1. Log in to your account
2. Navigate to Settings → API Keys
3. Click "Generate New Key"
4. Copy and securely store your key

### Using Your API Key

Include your API key in the Authorization header:

```bash
Authorization: Bearer YOUR_API_KEY
```

### Example Request

```bash
curl -X GET https://api.example.com/v1/users \
  -H "Authorization: Bearer abc123xyz789"
```

### Authentication Errors

| Status | Code | Description |
|--------|------|-------------|
| 401 | `UNAUTHORIZED` | Missing or invalid API key |
| 401 | `TOKEN_EXPIRED` | API key has expired |
| 403 | `FORBIDDEN` | Insufficient permissions |
```

### 3. Rate Limiting

```markdown
## Rate Limiting

API requests are limited to prevent abuse.

**Limits:**
- Standard: 100 requests per minute
- Premium: 1,000 requests per minute
- Enterprise: 10,000 requests per minute

**Headers:**

Each response includes rate limit headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

**Rate Limit Exceeded:**

Status: `429 Too Many Requests`

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Retry after 60 seconds.",
    "retryAfter": 60
  }
}
```
```

### 4. Common Response Formats

```markdown
## Response Formats

### Success Response

```json
{
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": "2024-01-01T12:00:00Z",
    "version": "1.0"
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    },
    "timestamp": "2024-01-01T12:00:00Z",
    "requestId": "req_abc123"
  }
}
```

### Paginated Response

```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "perPage": 10,
    "totalPages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```
```

### 5. Error Codes

```markdown
## Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | `INVALID_REQUEST` | Request validation failed |
| 400 | `INVALID_INPUT` | Input data is invalid |
| 401 | `UNAUTHORIZED` | Authentication required |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource already exists |
| 422 | `UNPROCESSABLE_ENTITY` | Business logic error |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |
| 503 | `SERVICE_UNAVAILABLE` | Temporary service outage |
```

### 6. Endpoint Documentation Template

For each endpoint, document:

```markdown
## [Endpoint Name]

`HTTP_METHOD /path/to/endpoint`

Brief description of what this endpoint does.

### Request

**Method:** `GET | POST | PUT | PATCH | DELETE`

**URL:** `/api/v1/resource/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Unique resource identifier |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 10 | Items per page (max: 100) |
| sort | string | No | createdAt | Sort field |
| order | string | No | desc | Sort order (asc, desc) |

**Request Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token |
| Content-Type | Yes | application/json |

**Request Body:**

```json
{
  "name": "string (required, 1-100 chars)",
  "email": "string (required, valid email)",
  "age": "integer (optional, 0-150)"
}
```

### Response

**Success Response:**

Status: `200 OK`

```json
{
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Error Responses:**

Status: `400 Bad Request`
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": { "field": "email" }
  }
}
```

Status: `404 Not Found`
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}
```

### Examples

**cURL:**

```bash
curl -X POST https://api.example.com/v1/users \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }'
```

**JavaScript:**

```javascript
const response = await fetch('https://api.example.com/v1/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  })
});

const user = await response.json();
console.log(user.data);
```

**Python:**

```python
import requests

response = requests.post(
    'https://api.example.com/v1/users',
    headers={
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    },
    json={
        'name': 'John Doe',
        'email': 'john@example.com',
        'age': 30
    }
)

user = response.json()['data']
print(user)
```
```

### 7. Resource Schemas

```markdown
## Resource Schemas

### User

```typescript
interface User {
  id: string;              // Unique identifier (UUID)
  name: string;            // Full name (1-100 characters)
  email: string;           // Email address (valid format)
  age?: number;            // Optional age (0-150)
  role: 'admin' | 'user';  // User role
  isActive: boolean;       // Account active status
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

**Field Validation:**

| Field | Type | Constraints |
|-------|------|-------------|
| name | string | Required, 1-100 chars |
| email | string | Required, valid email format |
| age | integer | Optional, 0-150 |
| role | enum | One of: admin, user |
```

### 8. Pagination

```markdown
## Pagination

All list endpoints support pagination.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Example Request:**

```bash
GET /api/v1/users?page=2&limit=20
```

**Response:**

```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 2,
    "perPage": 20,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  },
  "links": {
    "first": "/api/v1/users?page=1&limit=20",
    "prev": "/api/v1/users?page=1&limit=20",
    "next": "/api/v1/users?page=3&limit=20",
    "last": "/api/v1/users?page=8&limit=20"
  }
}
```
```

### 9. Filtering and Sorting

```markdown
## Filtering and Sorting

### Filtering

Use query parameters to filter results:

```bash
# Single filter
GET /api/v1/users?role=admin

# Multiple filters
GET /api/v1/users?role=admin&isActive=true

# Advanced filters
GET /api/v1/users?createdAt[gte]=2024-01-01&createdAt[lte]=2024-12-31
```

**Filter Operators:**

- `eq` - Equal (default)
- `ne` - Not equal
- `gt` - Greater than
- `gte` - Greater than or equal
- `lt` - Less than
- `lte` - Less than or equal
- `in` - In array
- `contains` - String contains

### Sorting

Sort results using the `sort` parameter:

```bash
# Ascending
GET /api/v1/users?sort=name

# Descending
GET /api/v1/users?sort=-name

# Multiple fields
GET /api/v1/users?sort=role,-createdAt
```
```

### 10. Webhooks (if applicable)

```markdown
## Webhooks

Subscribe to events via webhooks.

### Configuring Webhooks

```bash
POST /api/v1/webhooks
{
  "url": "https://your-app.com/webhook",
  "events": ["user.created", "user.updated"],
  "secret": "your_secret_key"
}
```

### Webhook Payload

```json
{
  "id": "evt_123",
  "type": "user.created",
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Verifying Webhooks

Verify webhook signatures using HMAC SHA256:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return signature === digest;
}
```
```

## Documentation Generation Process

1. **Analyze the codebase:**
   - Find all API routes/endpoints
   - Identify request/response schemas
   - Note authentication requirements
   - Document error responses

2. **Generate endpoint documentation:**
   - One section per endpoint
   - Include all HTTP methods
   - Document all parameters
   - Provide working examples

3. **Create schemas:**
   - Define data models
   - Include validation rules
   - Show relationships

4. **Add examples:**
   - cURL commands
   - JavaScript/TypeScript
   - Python
   - Other relevant languages

5. **Test all examples:**
   - Ensure examples are accurate
   - Verify responses match documentation
   - Test error cases

6. **Generate OpenAPI/Swagger spec** (if applicable):
   - Create openapi.yaml or swagger.json
   - Include all endpoints and schemas
   - Add examples and descriptions

Begin by analyzing the API routes and generating comprehensive documentation following this structure.
