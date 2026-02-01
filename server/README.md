# AirGust Backend

Node.js/Express backend for the AirGust HVAC website.

## Setup

```bash
cd server
npm install
npm start
```

The server runs at **http://localhost:3000**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Submit a booking (solar form or general booking) |
| POST | `/api/contact` | Submit a contact form |
| GET | `/api/submissions` | Retrieve all submissions (bookings + contacts) |

## Data Storage

Submissions are stored in `server/data/submissions.json`. The file is created automatically on first submission.

## Pages

- `/` - Home (LandingPage)
- `/services` - Services
- `/clients` - Clients
- `/booking` - Simple booking form
- `/spif` - Solar Panel Installation Form
