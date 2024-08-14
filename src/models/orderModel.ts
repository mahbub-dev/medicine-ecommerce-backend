import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
	user: mongoose.Types.ObjectId;
	products: {
		product: mongoose.Types.ObjectId;
		variant: mongoose.Types.ObjectId;
		quantity: number;
	}[];
	totalPrice: number;
	totalDiscount: number;
	shipping: {
		shippingCost: number;
		shippingAddress: mongoose.Types.ObjectId;
	};
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	statusUpdates?: { status: string; updatedAt: Date }[]; // Array to track status changes
}

const orderSchema: Schema = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		totalDiscount: { type: Number, required: true, default: 0 },
		shipping: {
			shippingCost: { type: Number, required: true, default: 0 },
			shippingAddress: {
				type: mongoose.Types.ObjectId,
				required: true,
				ref: "ShippingAddress",
			},
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				variant: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Variant",
					required: false,
				},
				quantity: { type: Number, required: true },
			},
		],
		totalPrice: { type: Number, required: true },
		status: {
			type: String,
			enum: [
				"pending",
				"processing",
				"shipped",
				"delivered",
				"cancelled",
			],
			default: "pending",
		},
		statusUpdates: [
			{
				status: { type: String, default: "pending" },
				updatedAt: { type: Date, default: Date.now() },
			},
		],
	},
	{ timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
