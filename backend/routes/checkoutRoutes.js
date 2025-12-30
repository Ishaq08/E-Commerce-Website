// C:\rabbit\backend\routes\checkoutRoutes.js

const express = require('express'); //
const Checkout = require('../models/Checkout'); //
const Cart = require('../models/Cart'); //
const Order = require('../models/Order'); //
const { protect } = require('../middelware/authMiddleware.js');

const router = express.Router(); //

// --- 1. CREATE CHECKOUT SESSION ---
// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post('/', protect, async (req, res) => {
  //
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body; //

  // Validation check: ensure there are items in the checkout
  if (!checkoutItems || checkoutItems.length === 0) {
    //
    return res.status(400).json({ message: 'no items in checkout' }); //
  }

  // Validation check: ensure each item has required fields
  for (let item of checkoutItems) {
    if (!item.productId || !item.name || !item.image || !item.price || item.quantity == null || item.quantity <= 0) {
      return res.status(400).json({ message: 'Invalid checkout item: missing or invalid required fields (productId, name, image, price, quantity)' });
    }
  }

  // Validation check: ensure shippingAddress has required fields
  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
    return res.status(400).json({ message: 'Invalid shipping address: missing required fields (address, city, postalCode, country)' });
  }

  try {
    // Create a new checkout session
    const newCheckout = await Checkout.create({
      //
      user: req.user._id, // Set the user ID from the authentication middleware
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: 'Pending', // Default status
      isPaid: false, // Default paid status
    });

    console.log('Checkout created for user:', req.user._id); // Example console log
    res.status(201).json(newCheckout); // Send the created checkout object
  } catch (error) {
    //
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- 2. UPDATE PAYMENT STATUS ---
// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put('/:id/pay', protect, async (req, res) => {
  //
  const { paymentStatus, paymentDetails } = req.body; //

  try {
    const checkout = await Checkout.findById(req.params.id); //

    if (!checkout) {
      //
      return res.status(404).json({ message: 'Checkout not found' }); //
    }

    if (paymentStatus === 'paid') {
      // Check if the status from the payment processor is 'paid'
      checkout.isPaid = true; // Mark as paid
      checkout.paymentStatus = paymentStatus; // Update status
      checkout.paymentDetails = paymentDetails; // Store payment details (e.g., transaction ID)
      checkout.paidAt = Date.now(); // Set payment timestamp

      await checkout.save(); // Save changes
      res.status(200).json(checkout); // Return the updated checkout
    } else {
      res.status(400).json({ message: 'Invalid Payment Status' }); // Handle non-paid status
    }
  } catch (error) {
    //
    console.error(error); //
    res.status(500).json({ message: 'Server Error' }); //
  }
});

// --- 3. FINALIZE CHECKOUT AND CREATE ORDER ---
// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an Order after payment confirmation
// @access Private
router.post('/:id/finalize', protect, async (req, res) => {
  //
  try {
    const checkout = await Checkout.findById(req.params.id); //

    if (!checkout) {
      //
      return res.status(404).json({ message: 'Checkout not found' }); //
    }

    // Check if the checkout is paid and not already finalized
    if (checkout.isPaid && !checkout.isFinalized) {
      //

      // 1. Create Final Order Document
      const finalOrder = await Order.create({
        //
        user: checkout.user, //
        orderItems: checkout.checkoutItems, // Note: Assuming the structure matches OrderSchema's orderItems
        shippingAddress: checkout.shippingAddress, //
        paymentMethod: checkout.paymentMethod, //
        totalPrice: checkout.totalPrice, //
        isPaid: true, // Inherited from checkout
        paidAt: checkout.paidAt, // Inherited from checkout
        isDelivered: false, // Default delivery status
        paymentStatus: 'paid', // Confirmed payment status
        paymentDetails: checkout.paymentDetails, //
      });

      // 2. Mark the Checkout as Finalized
      checkout.isFinalized = true; //
      checkout.finalizedAt = Date.now(); //
      await checkout.save(); //

      // 3. Delete the associated Cart
      await Cart.findOneAndDelete({ user: checkout.user }); // Clean up the user's cart

      res.status(201).json(finalOrder); // Return the newly created Order
    } else if (checkout.isFinalized) {
      //
      res.status(400).json({ message: 'Checkout already finalized' }); //
    } else {
      res.status(400).json({ message: 'Checkout is not paid' }); //
    }
  } catch (error) {
    //
    console.error(error); //
    res.status(500).json({ message: 'Server Error' }); //
  }
});

module.exports = router; //
