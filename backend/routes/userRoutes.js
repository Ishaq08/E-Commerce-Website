const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Necessary for JWT generation
const { protect } = require('../middelware/authMiddleware');
// Make sure to load environment variables (like JWT_SECRET)
// using a package like dotenv in your main server file.

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user and return a JWT
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create and Save New User (Mongoose pre-save hook handles password hashing)
    user = new User({ name, email, password, role: 'user' });
    await user.save();

    // 3. Prepare JWT Payload
    // This payload is stored inside the token and identifies the user.
    const payload = {
      user: {
        id: user._id, // Renamed from _id to id for consistency in the payload
        role: user.role,
      },
    };

    // 4. Sign and Return the Token
    // This is the core logic from the screenshot (lines 26-32)
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Make sure JWT_SECRET is set in your environment variables
      { expiresIn: '30d' }, // Token expiration time (changed to 30d for better practice)
      (err, token) => {
        if (err) throw err;

        // 5. Send the user data and token in response (lines 34-43)
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token, // Include the generated token
        });
      }
    );
  } catch (error) {
    // This will catch Mongoose validation errors or the thrown JWT error
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Destructure email and password

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Use your secret key
      { expiresIn: "30d" }, // Token expiration time
      (err, token) => {
        if (err) throw err;

        // 5. Send the user data and token in response (Screenshot 299)
        res.json({ // Use status 200 for successful login
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token, // Include the generated token
        });
      }
    );

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//GET /api/users/profile
//get logged in user profile

router.get("/profile", protect, async (req, res) => {
  res.json(req.user)
}) 

module.exports = router;
