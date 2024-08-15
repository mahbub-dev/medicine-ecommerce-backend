import mongoose, { Document, Schema } from "mongoose";

export interface IShippingAddress extends Document {
	user: mongoose.Types.ObjectId;
	division: string;
	district: string;
	subDistrict: string;
	address: string;
	name: string;
	phone: string;
	status?: "active" | "deleted";
}

const shippingAddressSchema: Schema = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		division: { type: String, required: true },
		district: { type: String, required: true },
		subDistrict: { type: String, required: true },
		address: { type: String, required: true },
		name: { type: String, required: true },
		phone: { type: String, required: true },
		status:{type:String,enum:['active','deleted'],default:'active'}
	},
	{ timestamps: true }
);

const ShippingAddress = mongoose.model<IShippingAddress>(
	"ShippingAddress",
	shippingAddressSchema
);
export default ShippingAddress;
