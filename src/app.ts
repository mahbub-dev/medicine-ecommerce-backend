import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import connectDB from "./config/db";

// Import routes
import authRoutes from "./routes/authRoute";
import categoryRoutes from "./routes/categoryRoute";
import orderRoutes from "./routes/orderRoute";
import productRoutes from "./routes/productRoute";
import shippingAddressRoutes from "./routes/shippingRoute";
import userRoutes from "./routes/userRoute";
import variantRoutes from "./routes/variantRoute";
dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors({ origin: process.env.ORIGIN }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shipping-addresses", shippingAddressRoutes);
app.use("/api/orders", orderRoutes);

// Serve a specific file from the 'uploads' directory
app.get("/uploads/:filename", (req: Request, res: Response) => {
	const filename = req.params.filename;
	const filePath = path.join(__dirname, "../public/uploads", filename);

	// Send the file as a response
	res.sendFile(filePath, (err) => {
		if (err) {
			res.status(404).json({ message: "File not found" });
		}
	});
});
// Error handling for unknown routes
app.use((req, res) => {
	res.status(404).json({ message: "Route not found" });
});

export default app;
