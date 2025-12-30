const express = require('express');
const Subscriber = require('../models/Subscriber'); // Assuming path

const router = express.Router();

// @route   POST /api/subscribe
// @desc    Handle newsletter subscription
// @access  Public
router.post('/', async (req, res) => {
  // Assuming the request body is { email: "user@example.com" }
  const { email } = req.body;

  // Initial validation: Check if email is provided
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if the email is already subscribed
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ message: 'email is already subscribed' });
    }

    // Create a new Subscriber
    subscriber = new Subscriber({ email });
    await subscriber.save();

    // Respond with success status (201 Created)
    res
      .status(201)
      .json({ message: 'Successfully subscribed to the newsletter!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
