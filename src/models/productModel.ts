import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
	name: string;
	slug: string;
	photos: string[];
	description: string;
	metaKey: string;
	discount?: number;
	inStock: number;
	status: "active" | "inactive";
	categories: mongoose.Types.ObjectId[];
	variants?: mongoose.Types.ObjectId[]; // Optional array of variant IDs
}

const productSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		photos: [{ type: String, required: true }],
		description: { type: String, required: true },
		metaKey: { type: String, required: true },
		discount: { type: Number, required: false },
		inStock: { type: Number, required: true }, // Changed to Number
		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "active",
		},
		categories: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Category",
				required: true,
			},
		],
		variants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Variant", // Assuming you have a Variant model
				required: false, // Not required when creating a product
			},
		],
	},
	{ timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
