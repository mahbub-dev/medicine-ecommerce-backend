import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import { default as authRoutes, default as categoryRoutes } from "./routes/authRoute";
import orderRoutes from "./routes/orderRoute";
import productRoutes from "./routes/productRoute";
import shippingAddressRoutes from "./routes/shippingRoute";
// import userRoutes from './routes/';
import variantRoutes from "./routes/variantRoute";

dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shipping-addresses", shippingAddressRoutes);
app.use("/api/orders", orderRoutes);

// Error handling for unknown routes
app.use((req, res) => {
	res.status(404).json({ message: "Route not found" });
});

export default app;
