const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const verifyToken = require('../middleware/auth');

// GET /api/events — all events sorted by date, any logged in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    const eventsWithCount = await Promise.all(
      events.map(async (event) => {
        const registrationCount = await Registration.countDocuments({ event: event._id });
        return {
          _id: event._id,
          name: event.name,
          date: event.date,
          venue: event.venue,
          capacity: event.capacity,
          registrationCount
        };
      })
    );

    res.json(eventsWithCount);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/events — admin only, create new event
router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admins only' });
  }

  const { name, date, venue, capacity } = req.body;

  try {
    const event = await Event.create({
      name,
      date,
      venue,
      capacity,
      createdBy: req.user.id
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/events/:id/registrations — admin only
router.get('/:id/registrations', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admins only' });
  }

  try {
    const registrations = await Registration.find({ event: req.params.id })
      .populate('student', 'name username');

    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;