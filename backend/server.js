// server.js
const express = require('express');
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const userRoutes =  require("./routes/userRoutes.js")
const productRoutes =  require("./routes/productRoutes.js")
const cartRoutes = require('./routes/cartRoutes.js');
const checkoutRoutes = require('./routes/checkoutRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const subRoutes = require('./routes/subRoute.js');
const adminRoute = require('./routes/adminRoutes.js');
const productAdminRoute = require('./routes/productAdmainRoutes.js');
const orderAdminRoute = require('./routes/orderAdminRoute.js');
const dotenv = require("dotenv");
const connectDB = require("./config/db");


// 2. Initialize the Express application


// 3. Use middleware
// Allows the app to parse JSON bodies in requests


// app.use(cors());
app.use(
  cors({
    origin: 'https://e-commerce-website-gz4b.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.options('*', cors());


dotenv.config();

// 4. Define the server port
const PORT = process.env.PORT || 9000;

connectDB()
// 5. Define a basic route (GET request to the root URL "/")
app.get("/", (req, res) => {
    // Send a simple text response
    res.send("WELCOME TO Peridot API!");
});

app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/checkout", checkoutRoutes)
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/subscribe', subRoutes);
app.use('/api/admin/users', adminRoute);
app.use('/api/admin/products', productAdminRoute);
app.use('/api/admin/order', orderAdminRoute);

// 6. Start the server
// app.listen(PORT, () => {
//     // Log a message to the console when the server starts
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

module.exports = app;
