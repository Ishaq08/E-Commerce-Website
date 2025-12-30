const express = require("express"); //.jpg
const Cart = require("../models/Cart"); //.jpg
const Product = require("../models/Product");
const { protect } = require('../middelware/authMiddleware.js');


const router = express.Router(); //.jpg

// --- Helper function to get a cart by User ID or Guest ID ---
//
const getCart = async (userId, guestId) => {
    if (userId) { //
        return await Cart.findOne({ user: userId }); // Find cart associated with logged-in user
    } else if (guestId) { //
        return await Cart.findOne({ guestId: guestId }); // Find cart associated with guest ID
    }
    return null; // Return null if neither ID is provided
};

// @route POST /api/cart
// @desc Add a product to the cart for a guest or logged-in user.jpg
// @access Public (authentication status handled internally).jpg
router.post("/", async (req, res) => { //.jpg
    try {
        // Destructure necessary data from the request body
        const {
            productId,
            quantity,
            size,
            color,
            userId, // ID of a logged-in user
            guestId, // ID of a guest
        } = req.body; //.jpg

        // 1. Verify Product Existence and Fetch Details
        const product = await Product.findById(productId); //.jpg
        if (!product) { //.jpg
            return res.status(404).json({ message: "Product not found" }); //.jpg
        }

        // 2. Determine User Status and Fetch Existing Cart
        // Fetch the cart using the helper function
        let cart = await getCart(userId, guestId); //.jpg)

        // 3. Handle Existing Cart
        if (cart) { //.jpg)
            // Check if the exact product variant (ID, size, color) already exists in the cart
            const productIndex = cart.products.findIndex(
                (p) => //.jpg)
                    p.productId.toString() === productId && // Compare string ID.jpg)
                    p.size === size && // Match size.jpg)
                    p.color === color // Match color.jpg)
            ); //.jpg)

            if (productIndex > -1) { // If the product already exists.jpg)
                // Update the quantity.jpg)
                cart.products[productIndex].quantity = quantity; //.jpg)
            } else {
                // Add new product variant to the cart.jpg)
                cart.products.push({ //.jpg)
                    productId, //.jpg)
                    name: product.name, //.jpg)
                    image: product.images[0].url, // Assuming images is an array with a url field.jpg)
                    price: product.price, //.jpg)
                    size, //.jpg)
                    color, //.jpg)
                    quantity, //.jpg)
                });
            }

            // Recalculate the total price of the cart
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity, //.jpg)
                0 // Initial value.jpg)
            );

            // Save the updated cart and send response
            await cart.save(); //.jpg)
            return res.status(200).json(cart); //.jpg)

        } else {
            // 4. Handle New Cart Creation
            
            // Create a new cart document
            const newCart = await Cart.create({ //.jpg)
                // Assign userId if logged in, otherwise undefined
                user: userId ? userId : undefined, //.jpg)
                // Assign guestId or generate a new one
                guestId: guestId ? guestId : `guest_${new Date().getTime()}`, //.jpg)
                
                // Add the first product
                products: [{ //.jpg)
                    productId, //.jpg)
                    name: product.name, //.jpg)
                    image: product.images[0].url, //.jpg)
                    price: product.price, //.jpg)
                    size, //.jpg)
                    color, //.jpg)
                    quantity, //.jpg)
                }], //.jpg)
                
                // Set initial total price
                totalPrice: product.price * quantity, //.jpg)
            });

            // Send success response
            return res.status(201).json(newCart); //.jpg)
        }
    } catch (error) { //.jpg)
        console.error(error); //.jpg)
        return res.status(500).json({ message: "Server Error" }); // Send error response.jpg]
    }
});

// @route PUT /api/cart
// @desc Update product quantity in the cart or remove product if quantity is 0
// @access Public (authentication status handled internally)
router.put("/", async (req, res) => {
  //
  const {
    //
    productId, //
    quantity, //
    size, //
    color, //
    userId, //
    guestId, //
  } = req.body; //
  try {
    let cart = await getCart(userId, guestId); //

    if (!cart) {
      //
      return res.status(404).json({ message: 'Cart not found' }); //
    }

    // Find the index of the product variant in the cart's products array
    const productIndex = cart.products.findIndex(
      //
      (
        p //
      ) =>
        p.productId.toString() === productId && //
        p.size === size && //
        p.color === color //
    );

    if (productIndex > -1) {
     
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity; //
      } else {
        cart.products.splice(productIndex, 1); // Remove 1 item at productIndex
      }

      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        //
        (acc, item) => acc + item.price * item.quantity, //
        0 //
      );

      // Save the updated cart and send response
      await cart.save(); //
      return res.status(200).json(cart); //
    } else {
      // Product not found in cart
      return res.status(404).json({ message: 'Product not found in cart' }); //
    }
  } catch (error) {
    //
    console.error(error); //
    // Send error response
    return res.status(500).json({ message: 'Server Error' }); //
  }
});

// @route DELETE /api/cart
// @desc Remove a product from the cart
// @access Public
router.delete("/", async (req, res) => { //
    // Destructure required identifying fields from the request body
    const { productId, size, color, guestId, userId } = req.body; //
    
    try {
         // 1. Find the cart
        let cart = await getCart(userId, guestId); //

        if (!cart) { //
            return res.status(404).json({ message: "Cart not found" }); //
        }

        // 2. Find the index of the specific product variant to remove
        const productIndex = cart.products.findIndex( //
            (p) => //
                p.productId.toString() === productId && // Match product ID
                p.size === size && // Match size
                p.color === color // Match color
        );

        if (productIndex > -1) { // If the product is found
            // 3. Remove the product using splice
            cart.products.splice(productIndex, 1); // Remove 1 item at the found index

            // 4. Recalculate total price
            cart.totalPrice = cart.products.reduce( //
                (acc, item) => acc + item.price * item.quantity, //
                0 
            );

            // 5. Save the updated cart and send response
            await cart.save(); //
            return res.status(200).json(cart); //

        } else {
            // Product not found in cart
            return res.status(404).json({ message: "Product not found in cart" }); //
        }

    } catch (error) { //
        console.error(error); //
        // Send error response
        return res.status(500).json({ message: "Server Error" }); //
    }
});

// @route GET /api/cart.jpg]
// @desc Get logged-in user's or guest user's cart // card details
// @access Public
router.get("/", async (req, res) => { //
    // Destructure identifiers from query parameters (e.g., /api/cart?userId=...)
    const { userId, guestId } = req.query; //
    
    try {
        // Find the cart using the existing helper function
        const cart = await getCart(userId, guestId); //

        if (cart) { //
            // If cart is found, return it
            res.json(cart); //
        } else {
            // If cart is not found, return a 404 status
            res.status(404).json({ message: "Cart not found" }); //
        }
    } catch (error) { //
        console.error(error); //
        res.status(500).json({ message: "Server error" }); //
    }
});


// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private (requires authentication via 'protect')
router.post("/merge", protect, async (req, res) => { //
    // Get the guest ID from the request body
    const { guestId } = req.body; //
    
    // Get the logged-in user ID from the protect middleware
    const userId = req.user._id;

    try {
        // 1. Find the guest cart and the user cart
        const guestCart = await Cart.findOne({ guestId }); //
        const userCart = await Cart.findOne({ user: userId }); //

        // --- Handle Guest Cart Validation ---
        
        if (!guestCart) {
            // If the user somehow has a guestId but no guest cart, and they have a user cart, return the user cart.
            if (userCart) { 
                 return res.status(200).json(userCart); //
            }
            // Otherwise, indicate the guest cart was not found
            return res.status(404).json({ message: "Guest cart not found" }); //
        }
        
        if (guestCart.products.length === 0) { //
            return res.status(400).json({ message: "Guest cart is empty" }); //
        }

        // --- Core Merging Logic ---
        
        if (userCart) { //
            // Case 1: User already has a cart, so merge the guest cart into the user cart
            
            // Iterate over each item in the guest cart
            guestCart.products.forEach((guestItem) => { //
                
                // Find if the exact item variant already exists in the user cart
                const productIndex = userCart.products.findIndex( //
                    (item) =>
                        item.productId.toString() === guestItem.productId.toString() && // Match ID
                        item.size === guestItem.size && // Match size
                        item.color === guestItem.color // Match color
                );

                if (productIndex > -1) { //
                    // If the item exists in the user cart, update the quantity
                    userCart.products[productIndex].quantity += guestItem.quantity; //
                } else {
                    // Otherwise, add the guest item as a new entry to the user cart
                    userCart.products.push(guestItem); //
                }
            });

            // Recalculate the total price for the user cart
            userCart.totalPrice = userCart.products.reduce( //
                (acc, item) => acc + item.price * item.quantity, //
                0 //
            );

            // Save the updated user cart
            await userCart.save(); //

            // --- Cleanup: Delete Guest Cart ---
            try {
                await Cart.findOneAndDelete({ guestId }); // Remove the guest cart after merging
            } catch (error) {
                console.error("Error deleting guest cart:", error); // Log deletion error
            }
            
            // Return the merged user cart
            return res.status(200).json(userCart); //

        } else {
            // Case 2: User has NO existing cart, so assign the guest cart to the user
            
            // Update the guest cart ownership fields
            guestCart.user = userId; // Assign the logged-in user ID
            guestCart.guestId = undefined; // Remove the guest identifier
            
            // Save the now-assigned cart
            await guestCart.save(); //

            // Return the newly assigned user cart
            return res.status(200).json(guestCart); //
        }
    } catch (error) { //
        console.error(error); //
        res.status(500).json({ message: "Server Error" }); //
    }
});

module.exports = router;

// ... (module.exports = router;)
module.exports = router;