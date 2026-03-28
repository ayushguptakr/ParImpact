# Golf Charity Subscription Platform

Production-grade monorepo for a full-stack web application.

## Stack

- Frontend: React (Vite), Tailwind CSS
- Backend: Node.js, Express.js, MongoDB (Mongoose)
- Auth: JWT

## Project Structure

```text
client/
  src/
    components/
      common/
      layout/
    features/
    hooks/
    pages/
    services/
    styles/
    utils/
server/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    scripts/
    services/
    utils/
    validators/
```


## Local Development

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

Health endpoint: `GET http://localhost:5000/api/health`
