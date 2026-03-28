# Seed + API Testing

## 1) Seed sample data

From `server/`:

```bash
npm run seed
```

This creates/updates:
- 1 admin user
- 2 sample users
- 3 sample charities
- active subscriptions
- sample score history (last 5 scores each)

Default seeded password for all seeded users:
- `Pass@123`

Admin login:
- `admin@golfcharity.local`

## 2) Postman collection

Import this file in Postman:

- `postman/golf-charity-platform.postman_collection.json`

Set collection variable:
- `baseUrl` = `http://localhost:5000/api`

Recommended run order:
1. `Charity -> List Charities` (fills `charityId`)
2. `Auth -> Login User` (fills `token`)
3. `Auth -> Login Admin` (fills `adminToken`)
4. Run remaining requests by folder.

Notes:
- `Publish Draw (Admin)` stores `drawId` and first `winnerId` (if any winner exists) for admin winner actions.
- If a request depends on no existing record (e.g. no latest draw), run draw publish first.
