const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const verifyToken = require('../middleware/auth');

// POST /api/registrations — student registers for an event
router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Students only' });
  }

  const { eventId } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registrationCount = await Registration.countDocuments({ event: eventId });

    if (registrationCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const registration = await Registration.create({
      student: req.user.id,
      event: eventId
    });

    res.status(201).json(registration);

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/registrations/mine — student sees their own registrations
router.get('/mine', verifyToken, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Students only' });
  }

  try {
    const registrations = await Registration.find({ student: req.user.id })
      .populate('event', 'name date venue capacity');

    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;