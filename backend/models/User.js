const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // Validator using a simple RegExp for email format
      validate: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre('save', async function () {
  // <-- REMOVED 'next' argument
  if (!this.isModified('password')) {
    return; // <-- Changed 'return next()' to a simple 'return'
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // <-- REMOVED the final 'next()' call
});

// --- END OF FIX ---

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
