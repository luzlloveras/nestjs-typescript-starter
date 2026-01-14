# NestJS TypeScript Starter

Simple NestJS API with MongoDB. Includes products CRUD, Swagger docs, and basic error handling.

## Quick Start

```bash
npm install
npm run start:dev
```

You'll need MongoDB. Options:
- **MongoDB Atlas (recommended)**: Free cloud database, no installation needed. See `SETUP_ATLAS.md`
- **Local MongoDB**: Install and run locally (requires ~500MB disk space)

## Environment Variables

Create a `.env` file in the root:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/products
SWAGGER_ENABLED=true
CORS_ORIGIN=http://localhost:3000
```

## Running

```bash
npm run start:dev    # development with hot reload
npm run build        # build for production
npm run start:prod   # run production build
```

Or with Docker:
```bash
docker-compose up -d
```

## API

Swagger docs available at http://localhost:3000/api/docs

Main endpoints:
- `GET /api/products` - list all
- `GET /api/products/:id` - get one
- `POST /api/products` - create
- `PUT /api/products/:id` - update
- `DELETE /api/products/:id` - delete

## Tests

```bash
npm run test
npm run test:e2e
```
