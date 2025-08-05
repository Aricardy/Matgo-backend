import express from 'express';
import Booking from '../models/Booking.js';
import auth from '../middleware/auth.js';
const router = express.Router();

// Get all bookings for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { passengerId: req.user.id }
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Book a trip
router.post('/', auth, async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      passengerId: req.user.id,
      status: 'confirmed'
    };
    const booking = await Booking.create(bookingData);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking', details: error.message });
  }
});

// Get seat availability for a specific trip
router.get('/seats/:routeId/:date/:time', auth, async (req, res) => {
  try {
    const { routeId, date, time } = req.params;
    
    // Get all bookings for this route, date, and time
    const existingBookings = await Booking.findAll({
      where: {
        route: routeId,
        date: date,
        time: time,
        status: 'confirmed'
      }
    });
    
    // Extract booked seats
    const bookedSeats = [];
    existingBookings.forEach(booking => {
      if (booking.seats && Array.isArray(booking.seats)) {
        bookedSeats.push(...booking.seats);
      }
    });
    
    // Generate all possible seats (12 rows x 4 seats + 5 back seats = 53 total)
    const allSeats = [];
    
    // Regular seats (1A-12D)
    for (let row = 1; row <= 12; row++) {
      for (let seat of ['A', 'B', 'C', 'D']) {
        allSeats.push({
          seatId: `${row}${seat}`,
          isBooked: bookedSeats.includes(`${row}${seat}`),
          status: bookedSeats.includes(`${row}${seat}`) ? 'booked' : 'available'
        });
      }
    }
    
    // Back row seats (E1-E5)
    for (let i = 1; i <= 5; i++) {
      allSeats.push({
        seatId: `E${i}`,
        isBooked: bookedSeats.includes(`E${i}`),
        status: bookedSeats.includes(`E${i}`) ? 'booked' : 'available'
      });
    }
    
    res.json(allSeats);
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({ error: 'Failed to fetch seat data' });
  }
});

export default router;
