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

## Running DynamoDB Locally
```bash
# Start DynamoDB
npm run db:up

# Initial DB setup
npm run db:setup

# Stop DynamoDB (when done)
npm run db:down
```

# Create table
node scripts/create-table.js

# Start server
npm run start:dev
```

## Endpoints

**POST /catalog** - Create item  
**GET /catalog/:id/suggestions** - Get AI suggestions  
**POST /catalog/:id/approve** - Approve (requires score >= 70)  
**POST /catalog/:id/reject** - Reject item