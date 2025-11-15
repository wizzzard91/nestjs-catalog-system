# NestJS Catalog System

Backend API for managing catalog items with automatic quality scoring and AI suggestions.

## What it does

- Create catalog items (title, description, category, tags)
- Auto-calculate quality score (0-100) based on completeness
- Get AI-powered improvement suggestions for titles/descriptions
- Admin approval workflow (only items with 70+ score can be approved)

You would need to get API key for Claude API (https://docs.claude.com/en/docs/get-started)

## Scoring

Items start with 40 points and earn more based on:
- Title length 12-50 chars: +20
- Description 60+ chars: +15
- Has category: +10
- Has 1-3 tags: +10, or 4+ tags: +20
- Unique title: +5

## Stack

NestJS + DynamoDB + Anthropic Claude API

## Setup
```bash
npm install
cp .env.example .env
# add your ANTHROPIC_API_KEY to .env
```

## Running DynamoDB Locally
```bash
# Start DynamoDB
npm run db:up

# Create table (one time)
npm run db:setup

# Stop DynamoDB (when done)
npm run db:down
```

## Running the Application
```bash
npm run start:dev
```

Server runs on `http://localhost:3000`

## API Endpoints

### POST /catalog
Create a new catalog item

**Request:**
```
{
  "title": "string (required)",
  "description": "string (required)",
  "category": "string (optional)",
  "tags": ["string"] (optional)
}
```

**Response:**
```
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "category": "string",
  "tags": ["string"],
  "score": 0-100,
  "status": "pending",
  "createdAt": "ISO 8601 datetime"
}
```

---

### GET /catalog/:id
Get item by ID

**Response:**
```
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "category": "string",
  "tags": ["string"],
  "score": 0-100,
  "status": "pending" | "approved" | "rejected",
  "createdAt": "ISO 8601 datetime"
}
```

---

### GET /catalog/:id/suggestions
Get AI-powered improvement suggestions

**Response:**
```
{
  "suggestedTitle": "string",
  "suggestedDescription": "string"
}
```

---

### POST /catalog/:id/approve
Approve item (requires score >= 70)

**Response:**
```
{
  "message": "Item approved successfully"
}
```

**Error (score < 70):**
```
{
  "message": "Item score must be 70 or higher (current: 45)",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### POST /catalog/:id/reject
Reject item

**Response:**
```
{
  "message": "Item rejected successfully"
}
```

## Testing with curl

### 1. Create high-score item
```bash
curl -X POST http://localhost:3000/catalog \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Amazing Product Title",
    "description": "This is a very detailed and comprehensive product description that exceeds the minimum sixty character requirement easily",
    "category": "Electronics",
    "tags": ["new", "sale", "featured", "hot"]
  }'
```

### 2. Create low-score item
```bash
curl -X POST http://localhost:3000/catalog \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Product",
    "description": "Short"
  }'
```

### 3. Get item by ID
```bash
curl http://localhost:3000/catalog/{id}
```

### 4. Get AI suggestions
```bash
curl http://localhost:3000/catalog/{id}/suggestions
```

### 5. Approve item (requires score >= 70)
```bash
curl -X POST http://localhost:3000/catalog/{id}/approve
```

### 6. Reject item
```bash
curl -X POST http://localhost:3000/catalog/{id}/reject
```

Replace `{id}` with actual item ID from create response.
