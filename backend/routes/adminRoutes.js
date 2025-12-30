const express = require('express');
const User = require('../models/User'); // Assuming path
const { protect, admin } = require('../middelware/authMiddleware'); // Assuming path and middleware functions

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    // Fetches all user documents from the database
    const users = await User.find({});

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/admin/users
// @desc    Add a new user (admin only)
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  // Destructure name, email, password, and role from the request body
  const { name, email, password, role } = req.body;

  try {
    // Check if a user with that email already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    // Create the new user object
    user = new User({
      name,
      email,
      password, // Note: Password should be hashed in the User model pre-save hook
      role: role || "user", // Default role to "user" if not provided
    });

    await user.save();

    res.status(201).json({ 
        message: "User created successfully", 
        user: { 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            role: user.role 
            // Note: Password and sensitive info should be excluded from the response
        } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user info (admin only) - Name, email and role
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    // Find the user by ID from the URL parameters
    const user = await User.findById(req.params.id);
    
    // Check if user exists and update fields if provided in the request body
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;

      // Save the updated user object
      const updatedUser = await user.save();
      
      // Respond with success message and the updated user data
      res.json({ message: "User updated successfully", user: updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE /api/admin/users/:id
// @desc Delete a user
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;

module.exports = router;
