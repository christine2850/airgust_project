const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Data file for storing submissions
const DATA_DIR = path.join(__dirname, 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize submissions file if it doesn't exist
if (!fs.existsSync(SUBMISSIONS_FILE)) {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify({ bookings: [], contacts: [] }, null, 2));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from AirGust Web
const staticPath = path.join(__dirname, '..', 'AirGust Web');
app.use(express.static(staticPath));

// Routes - serve HTML pages at root paths
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'LandingPage.html'));
});
app.get('/services', (req, res) => {
  res.sendFile(path.join(staticPath, 'services.html'));
});
app.get('/clients', (req, res) => {
  res.sendFile(path.join(staticPath, 'clients.html'));
});
app.get('/spif', (req, res) => {
  res.sendFile(path.join(staticPath, 'SPIF.html'));
});
app.get('/booking', (req, res) => {
  res.sendFile(path.join(staticPath, 'booking.html'));
});

// API: Submit booking (Solar Panel Installation Form and general bookings)
app.post('/api/bookings', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
    const booking = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      type: 'booking',
      ...req.body
    };
    data.bookings.push(booking);
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, message: 'Booking submitted successfully. We will contact you soon.' });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit booking.' });
  }
});

// API: Submit contact form
app.post('/api/contact', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
    const contact = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      type: 'contact',
      ...req.body
    };
    data.contacts.push(contact);
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, message: 'Message sent successfully. We will get back to you soon.' });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

// API: Get all submissions (optional - for admin use)
app.get('/api/submissions', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load submissions' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`AirGust server running at http://localhost:${PORT}`);
});
